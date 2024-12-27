import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Briefcase, Calendar, Star, LogOut } from "lucide-react";
import type { ContractorType } from "@/types/contractor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContractorDashboard() {
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [contractor, setContractor] = useState<ContractorType | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth?type=contractor');
        return;
      }

      const { data: contractorData, error } = await supabase
        .from('contractors')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching contractor:', error);
        setRegistering(true);
      } else if (contractorData) {
        setContractor(contractorData);
      } else {
        setRegistering(true);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      toast({
        title: "Error",
        description: "Failed to load contractor profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth?type=contractor');
  };

  const handleRegistration = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const formData = new FormData(event.currentTarget);
      const contractorData = {
        user_id: user.id,
        business_name: formData.get('businessName') as string,
        contact_email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        license_number: formData.get('license') as string,
      };

      const { data, error } = await supabase
        .from('contractors')
        .insert([contractorData])
        .select()
        .single();

      if (error) throw error;

      setContractor(data);
      setRegistering(false);
      toast({
        title: "Success",
        description: "Contractor profile created successfully",
      });
    } catch (error) {
      console.error('Error registering contractor:', error);
      toast({
        title: "Error",
        description: "Failed to create contractor profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (registering) {
    return (
      <div className="container max-w-lg mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Contractor Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegistration} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" name="businessName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">License Number</Label>
                <Input id="license" name="license" required />
              </div>
              <Button type="submit" className="w-full">
                Complete Registration
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Welcome, {contractor.business_name}!</h1>
        <Button variant="ghost" onClick={handleSignOut} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Portfolio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Showcase your best work and completed projects.
            </p>
            <Button>Manage Portfolio</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Set your working hours and manage appointments.
            </p>
            <Button>Set Availability</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              References
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Add client references and testimonials.
            </p>
            <Button>Add References</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}