import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash } from "lucide-react";
import type { PortfolioItem } from "./types";

interface PortfolioGridProps {
  items: PortfolioItem[];
  onDelete: (id: string) => void;
}

export function PortfolioGrid({ items, onDelete }: PortfolioGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items?.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {item.title}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(item.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {item.image_url && (
              <div className="relative aspect-video">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="rounded-md object-cover w-full h-full"
                />
              </div>
            )}
            <p className="text-sm text-muted-foreground">{item.description}</p>
            <p className="text-sm text-muted-foreground">
              Completed: {new Date(item.completed_date).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}