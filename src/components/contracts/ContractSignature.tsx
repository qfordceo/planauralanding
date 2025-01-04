import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"

interface ContractSignatureProps {
  onSign: () => void;
  isLoading?: boolean;
}

export function ContractSignature({ onSign, isLoading }: ContractSignatureProps) {
  const [agreed, setAgreed] = useState(false)

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
        onClick={onSign} 
        disabled={!agreed || isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign Contract
      </Button>
    </div>
  )
}