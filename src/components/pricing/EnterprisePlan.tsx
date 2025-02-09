
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

export function EnterprisePlan() {
  const navigate = useNavigate()
  
  return (
    <div>
      <h2 className="text-3xl font-heading font-medium text-primary mb-8">
        Enterprise Solutions
      </h2>
      <Card>
        <CardContent className="py-6">
          <p className="text-lg mb-4">
            For large-scale builders requiring high-volume inspection solutions, we offer custom enterprise plans.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/contact")}
          >
            Contact Us for Enterprise Pricing
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
