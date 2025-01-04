import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { ListingsSection } from "@/components/listings/ListingsSection";
import { ContractorProfileList } from "@/components/contractor/profile/ContractorProfileList";
import ListingsModal from "@/components/ListingsModal";
import { ProjectManagementSection } from "@/components/projects/ProjectManagementSection";

export default function Index() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="container mx-auto py-8">
      {session && <ProjectManagementSection />}
      
      <ListingsSection session={session} />

      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">Our Trusted Contractors</h2>
        <ContractorProfileList />
      </div>

      <ListingsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}