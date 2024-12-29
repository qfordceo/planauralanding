import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  message: string;
  sender_id: string;
  recipient_id: string | null;
  created_at: string;
  read: boolean;
}

interface MessagingInterfaceProps {
  contractorId: string;
}

export function MessagingInterface({ contractorId }: MessagingInterfaceProps) {
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();
  
  const { data: messages, isLoading, refetch } = useQuery({
    queryKey: ['messages', contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_messages')
        .select('*')
        .or(`sender_id.eq.${contractorId},recipient_id.eq.${contractorId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Message[];
    }
  });

  useEffect(() => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_messages',
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('project_messages')
        .insert({
          message: newMessage,
          sender_id: contractorId,
          project_id: "default", // You'll want to make this dynamic based on the active project
        });

      if (error) throw error;

      setNewMessage("");
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[400px]">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages?.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg max-w-[80%] ${
                message.sender_id === contractorId
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p>{message.message}</p>
              <span className="text-xs opacity-70">
                {new Date(message.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t flex gap-2">
        <Input
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button onClick={sendMessage}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}