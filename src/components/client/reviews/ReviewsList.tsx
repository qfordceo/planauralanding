import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";

interface ReviewsListProps {
  contractorId: string;
}

interface Review {
  id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  client: {
    email: string | null;
  };
}

export function ReviewsList({ contractorId }: ReviewsListProps) {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['contractor-reviews', contractorId],
    queryFn: async () => {
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('contractor_reviews')
        .select(`
          id,
          rating,
          review_text,
          created_at,
          client:profiles!contractor_reviews_client_id_fkey (
            email
          )
        `)
        .eq('contractor_id', contractorId)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;
      
      return reviewsData as Review[];
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