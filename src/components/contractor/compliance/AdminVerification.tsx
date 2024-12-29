import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, CheckCircle, XCircle } from "lucide-react";
import type { ComplianceDocument } from "./types";

interface AdminVerificationProps {
  document: ComplianceDocument;
  onVerificationComplete: () => void;
}

export function AdminVerification({ document, onVerificationComplete }: AdminVerificationProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      status: document.verification_status,
      notes: document.verification_notes || "",
    },
  });

  const onSubmit = async (data: { status: string; notes: string }) => {
    try {
      const { error } = await supabase
        .from('contractor_compliance_documents')
        .update({
          verification_status: data.status,
          verification_notes: data.notes,
          verified_by: (await supabase.auth.getUser()).data.user?.id,
          verified_at: new Date().toISOString(),
        })
        .eq('id', document.id);

      if (error) throw error;

      toast({
        title: "Verification Updated",
        description: "Document verification status has been updated successfully.",
      });
      
      setOpen(false);
      onVerificationComplete();
    } catch (error) {
      console.error('Error updating verification:', error);
      toast({
        title: "Error",
        description: "Failed to update verification status.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Shield className="h-4 w-4 mr-2" />
          Verify
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify Compliance Document</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="verified">
                        <span className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          Verified
                        </span>
                      </SelectItem>
                      <SelectItem value="rejected">
                        <span className="flex items-center">
                          <XCircle className="h-4 w-4 mr-2 text-red-500" />
                          Rejected
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any notes about the verification..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Update Verification
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}