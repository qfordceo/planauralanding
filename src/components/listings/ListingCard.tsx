import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { LandListing } from "@/integrations/supabase/types/land-listings"

interface ListingCardProps {
  listing: LandListing;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {listing.image_url && (
          <img
            src={listing.image_url}
            alt={listing.title || 'Land listing'}
            className="w-full h-48 object-cover"
          />
        )}
        {listing.is_vetted && (
          <Badge 
            className="absolute top-2 left-2"
            variant="secondary"
          >
            Vetted
          </Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{listing.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Price:</span>
            <span>{listing.price ? formatPrice(listing.price) : 'Contact for price'}</span>
          </div>
          <div className="flex justify-between">
            <span>Acres:</span>
            <span>{listing.acres || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span>Price per acre:</span>
            <span>{listing.price_per_acre ? formatPrice(listing.price_per_acre) : 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span>Area avg price/acre:</span>
            <span>{listing.avg_area_price_per_acre ? formatPrice(listing.avg_area_price_per_acre) : 'N/A'}</span>
          </div>
          {listing.qr_code_url && (
            <div className="mt-4">
              <img
                src={listing.qr_code_url}
                alt="Property QR Code"
                className="w-24 h-24 mx-auto"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}