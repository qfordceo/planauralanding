import { MessageSquare } from "lucide-react";

interface Message {
  id: string;
  sender?: { email: string | null };
  message: string;
  created_at: string;
}

interface MessageListProps {
  messages: Message[];
  searchTerm: string;
}

export function MessageList({ messages, searchTerm }: MessageListProps) {
  const filteredMessages = messages?.filter(msg => 
    msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.sender?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
  );
}