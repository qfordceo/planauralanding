import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import ListingsModal from "@/components/ListingsModal"
import { ListingCard } from "@/components/listings/ListingCard"
import { useListings } from "@/hooks/useListings"

export default function Index() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { listings, isLoading } = useListings(true)
  const { toast } = useToast()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleVetListing = async (listingId: string) => {
    const { error } = await supabase
      .from('land_listings')
      .update({ is_vetted: true })
      .eq('id', listingId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to vet listing",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Success",
      description: "Listing has been vetted",
    })
  }

  const handleGenerateQR = async (listingId: string) => {
    const { data, error } = await supabase.functions.invoke('generate-qr-code', {
      body: { listingId }
    })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Success",
      description: "QR code has been generated",
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Available Land Listings</h1>
        <div className="space-x-4">
          {session?.user && (
            <Button onClick={() => navigate("/floor-plans")}>
              Browse Floor Plans
            </Button>
          )}
          <Button onClick={() => setIsModalOpen(true)}>
            Update Listings
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center">Loading listings...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings?.map((listing) => (
            <div key={listing.id} className="relative">
              <ListingCard listing={listing} />
              {session?.user && (
                <div className="absolute top-2 right-2 space-x-2">
                  {!listing.is_vetted && (
                    <Button
                      size="sm"
                      onClick={() => handleVetListing(listing.id)}
                    >
                      Vet Listing
                    </Button>
                  )}
                  {listing.is_vetted && !listing.qr_code_generated && (
                    <Button
                      size="sm"
                      onClick={() => handleGenerateQR(listing.id)}
                    >
                      Generate QR
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ListingsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  )
}