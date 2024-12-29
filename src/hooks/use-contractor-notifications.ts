import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useContractorNotifications(contractorId: string) {
  const { toast } = useToast();

  const sendNotification = async (subject: string, message: string) => {
    try {
      const { error } = await supabase.functions.invoke("send-contractor-email", {
        body: {
          contractorId,
          subject,
          html: message,
        },
      });

      if (error) throw error;

      toast({
        title: "Notification sent",
        description: "Email notification has been sent successfully",
      });
    } catch (error) {
      console.error("Failed to send notification:", error);
      toast({
        title: "Error",
        description: "Failed to send notification. Please try again.",
        variant: "destructive",
      });
    }
  };

  const notifyNewBid = async (projectTitle: string) => {
    await sendNotification(
      "New Bid Update",
      `<p>You have been outbid on project: <strong>${projectTitle}</strong></p>
      <p>Please check your dashboard for more details and consider submitting a new bid.</p>`
    );
  };

  const notifyDefectUpdate = async (defectDescription: string) => {
    await sendNotification(
      "New Inspection Defect",
      `<p>A new defect has been reported:</p>
      <p><strong>${defectDescription}</strong></p>
      <p>Please review and take necessary action.</p>`
    );
  };

  const notifyDocumentExpiration = async (documentType: string, daysUntilExpiry: number) => {
    await sendNotification(
      "Document Expiration Warning",
      `<p>Your ${documentType} is expiring in ${daysUntilExpiry} days.</p>
      <p>Please ensure to renew it before expiration to maintain compliance.</p>`
    );
  };

  return {
    sendNotification,
    notifyNewBid,
    notifyDefectUpdate,
    notifyDocumentExpiration,
  };
}