import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"

interface Listing {
  id: string
  title: string
  price: number
  acres: number
  address: string
  realtor_url: string
  image_url: string
  price_per_acre: number
  avg_area_price_per_acre: number
  is_vetted: boolean
  qr_code_url: string
}

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {listing.image_url && (
          <img
            src={listing.image_url}
            alt={listing.title}
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
            <span>{formatPrice(listing.price)}</span>
          </div>
          <div className="flex justify-between">
            <span>Acres:</span>
            <span>{listing.acres}</span>
          </div>
          <div className="flex justify-between">
            <span>Price per acre:</span>
            <span>{formatPrice(listing.price_per_acre)}</span>
          </div>
          <div className="flex justify-between">
            <span>Area avg price/acre:</span>
            <span>{formatPrice(listing.avg_area_price_per_acre)}</span>
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