import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewForm } from "./ReviewForm";
import { ReviewsList } from "./ReviewsList";

interface ReviewsSectionProps {
  contractorId: string;
}

export function ReviewsSection({ contractorId }: ReviewsSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Reviews & Ratings</CardTitle>
        <Button
          variant="outline"
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          {showReviewForm ? "Cancel Review" : "Write Review"}
        </Button>
      </CardHeader>
      <CardContent>
        {showReviewForm ? (
          <ReviewForm
            contractorId={contractorId}
            onReviewSubmitted={() => setShowReviewForm(false)}
          />
        ) : (
          <ReviewsList contractorId={contractorId} />
        )}
      </CardContent>
    </Card>
  );
}