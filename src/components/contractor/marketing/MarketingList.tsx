import { Button } from "@/components/ui/button";
import { Calendar, Trash } from "lucide-react";
import type { MarketingContent } from "./types";
import { formatInTimeZone } from "date-fns-tz";

interface MarketingListProps {
  content: MarketingContent[];
  onDelete: (id: string) => void;
}

export function MarketingList({ content, onDelete }: MarketingListProps) {
  const formatScheduledDate = (dateString: string) => {
    if (!dateString) return "";
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return formatInTimeZone(new Date(dateString), userTimeZone, "PPpp");
  };

  return (
    <div className="grid gap-4">
      {content?.map((item) => (
        <div
          key={item.id}
          className="p-4 border rounded-lg flex justify-between items-start"
        >
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{item.title}</h3>
              <span className="text-sm px-2 py-1 bg-secondary rounded-full">
                {item.type}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{item.content}</p>
            {item.platform && (
              <p className="text-sm text-muted-foreground">
                Platform: {item.platform}
              </p>
            )}
            {item.scheduled_date && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatScheduledDate(item.scheduled_date)}
              </p>
            )}
            {item.metrics && (
              <div className="text-sm text-muted-foreground mt-2">
                <p>Views: {item.metrics.views || 0}</p>
                <p>Clicks: {item.metrics.clicks || 0}</p>
                <p>Conversions: {item.metrics.conversions || 0}</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(item.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}