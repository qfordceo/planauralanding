import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";

interface ContractorReviewsProps {
  contractorId: string;
}

interface Review {
  id: string;
  contractor_id: string;
  client_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  client?: {
    email: string | null;
  };
}

export function ContractorReviews({ contractorId }: ContractorReviewsProps) {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['contractor-reviews', contractorId],
    queryFn: async () => {
      // First fetch the reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('contractor_reviews')
        .select('*')
        .eq('contractor_id', contractorId)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      // Then fetch the client emails in a separate query
      const reviews = await Promise.all(
        (reviewsData || []).map(async (review) => {
          if (!review.client_id) return { ...review, client: { email: 'Anonymous' } };

          const { data: clientData } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', review.client_id)
            .single();

          return {
            ...review,
            client: { email: clientData?.email || 'Anonymous' }
          };
        })
      );

      return reviews as Review[];
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