import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface ContractSignatureProps {
  onSign: () => void;
  isLoading?: boolean;
  contractId: string;
}

export function ContractSignature({ onSign, isLoading, contractId }: ContractSignatureProps) {
  const [agreed, setAgreed] = useState(false)
  const { toast } = useToast()

  const handleSign = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to sign the contract",
          variant: "destructive",
        })
        return
      }

      const timestamp = new Date().toISOString()
      const signatureData = {
        userId: user.id,
        timestamp,
        ipAddress: await fetch('https://api.ipify.org?format=json')
          .then(res => res.json())
          .then(data => data.ip)
          .catch(() => 'unknown'),
        userAgent: navigator.userAgent
      }

      // Update contract with signature
      const { error: updateError } = await supabase
        .from('project_contracts')
        .update({
          signing_status: 'client_signed',
          signing_history: `[${JSON.stringify(signatureData)}]`,
          last_action_at: timestamp
        })
        .eq('id', contractId)

      if (updateError) throw updateError

      // Send notification
      await supabase.functions.invoke('send-contract-email', {
        body: {
          contractId,
          recipientId: user.id,
          notificationType: 'signed'
        }
      })

      toast({
        title: "Contract Signed",
        description: "The contract has been successfully signed",
      })

      onSign()
    } catch (error) {
      console.error('Error signing contract:', error)
      toast({
        title: "Error",
        description: "Failed to sign the contract. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={agreed}
          onCheckedChange={(checked) => setAgreed(checked as boolean)}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I have read and agree to the terms of this contract
        </label>
      </div>
      <Button 
        onClick={handleSign} 
        disabled={!agreed || isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign Contract
      </Button>
    </div>
  )
}