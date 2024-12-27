import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";

interface ContractorReviewsProps {
  contractorId: string;
}

export function ContractorReviews({ contractorId }: ContractorReviewsProps) {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['contractor-reviews', contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contractor_reviews')
        .select(`
          *,
          client:client_id(email)
        `)
        .eq('contractor_id', contractorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading reviews...</div>;

  return (
    <div className="space-y-4">
      {reviews?.map((review) => (
        <div key={review.id} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < (review.rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {new Date(review.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm mb-2">{review.review_text}</p>
          <p className="text-xs text-muted-foreground">
            By: {review.client?.email || 'Anonymous'}
          </p>
        </div>
      ))}
      {!reviews?.length && (
        <p className="text-center text-muted-foreground">
          No reviews yet.
        </p>
      )}
    </div>
  );
}