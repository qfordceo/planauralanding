import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MessageSquare, Search, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface CommunicationHubProps {
  projectId: string;
}

export function CommunicationHub({ projectId }: CommunicationHubProps) {
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['project-messages', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_messages')
        .select(`
          *,
          sender:sender_id(email),
          recipient:recipient_id(email)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('project-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'project_messages',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['project-messages', projectId] });
          console.log('New message received:', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, queryClient]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const { error } = await supabase
        .from('project_messages')
        .insert({
          project_id: projectId,
          message: message.trim(),
          sender_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      setMessage("");
      toast({
        title: "Success",
        description: "Message sent successfully",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const filteredMessages = messages?.filter(msg => 
    msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.sender?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Communication</CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex gap-4">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} className="flex-shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {filteredMessages?.map((msg) => (
              <div
                key={msg.id}
                className="flex items-start gap-3 p-4 border rounded-lg"
              >
                <MessageSquare className="h-5 w-5 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {msg.sender?.email || 'Unknown User'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}