import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Search, Paperclip } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ProjectThreads } from "./ProjectThreads";
import { FileUpload } from "./FileUpload";

interface Message {
  id: string;
  message: string;
  sender_id: string;
  recipient_id: string | null;
  created_at: string;
  read: boolean;
  project_id: string;
  attachment_url?: string | null;
}

interface MessagingInterfaceProps {
  contractorId: string;
}

export function MessagingInterface({ contractorId }: MessagingInterfaceProps) {
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const { toast } = useToast();
  
  const { data: messages, isLoading, refetch } = useQuery({
    queryKey: ['messages', contractorId, selectedProject, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('project_messages')
        .select('*')
        .or(`sender_id.eq.${contractorId},recipient_id.eq.${contractorId}`)
        .order('created_at', { ascending: false });

      if (selectedProject) {
        query = query.eq('project_id', selectedProject);
      }

      if (searchQuery) {
        query = query.ilike('message', `%${searchQuery}%`);
      }

      const { data, error } = await query;

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

  const sendMessage = async (attachmentUrl?: string | null) => {
    if (!newMessage.trim() && !attachmentUrl) return;

    try {
      const { error } = await supabase
        .from('project_messages')
        .insert({
          message: newMessage,
          sender_id: contractorId,
          project_id: selectedProject || "default",
          attachment_url: attachmentUrl
        });

      if (error) throw error;

      setNewMessage("");
      setShowFileUpload(false);
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
      <div className="flex items-center gap-2 p-4 border-b">
        <Input
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
          prefix={<Search className="h-4 w-4 text-muted-foreground" />}
        />
        <ProjectThreads
          contractorId={contractorId}
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
        />
      </div>

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
              {message.attachment_url && (
                <a 
                  href={message.attachment_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm underline block mb-2"
                >
                  View Attachment
                </a>
              )}
              <p>{message.message}</p>
              <span className="text-xs opacity-70">
                {new Date(message.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        {showFileUpload ? (
          <FileUpload
            onUploadComplete={(url) => {
              sendMessage(url);
            }}
            onCancel={() => setShowFileUpload(false)}
          />
        ) : (
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={() => setShowFileUpload(true)}>
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button onClick={() => sendMessage()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}