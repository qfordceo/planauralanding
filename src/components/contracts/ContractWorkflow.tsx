import React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ContractSignature } from "./ContractSignature"
import { ContractTerms } from "./ContractTerms"

interface ContractWorkflowProps {
  projectId: string
}

export function ContractWorkflow({ projectId }: ContractWorkflowProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: contract, isLoading } = useQuery({
    queryKey: ["project-contract", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_contracts")
        .select("*")
        .eq("project_id", projectId)
        .single()

      if (error) throw error
      return data
    },
  })

  const signContractMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("project_contracts")
        .update({
          status: "signed",
          signed_by_client_at: new Date().toISOString(),
        })
        .eq("id", contract?.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-contract"] })
      toast({
        title: "Contract signed successfully",
        description: "The project can now proceed to the next phase.",
      })
    },
  })

  if (isLoading) {
    return <div>Loading contract...</div>
  }

  return (
    <div className="space-y-8">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Project Contract
          </h3>
          <p className="text-sm text-muted-foreground">
            Review and sign the project contract
          </p>
        </div>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          {contract?.content && (
            <div className="prose max-w-none">
              {Object.entries(contract.content).map(([section, content]) => (
                <div key={section} className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">{section}</h3>
                  <p className="text-sm text-muted-foreground">{content as string}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-6">
          <ContractTerms />
          <ContractSignature onSign={() => signContractMutation.mutate()} />
        </div>
      </div>
    </div>
  )
}