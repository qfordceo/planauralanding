import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@supabase/supabase-js";

interface UserAvatarProps {
  user: {
    user_id: string;
    last_seen?: string;
  };
  className?: string;
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarImage src={`https://avatar.vercel.sh/${user.user_id}`} alt="User avatar" />
      <AvatarFallback>U</AvatarFallback>
    </Avatar>
  );
}