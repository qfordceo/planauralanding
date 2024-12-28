import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Trash } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  opt_in_marketing: boolean;
}

export function ClientManager({ contractorId }: { contractorId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    opt_in_marketing: false,
  });

  const { data: clients, isLoading } = useQuery({
    queryKey: ["contractor-clients", contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contractor_clients")
        .select("*")
        .eq("contractor_id", contractorId);

      if (error) throw error;
      return data as Client[];
    },
  });

  const addClient = useMutation({
    mutationFn: async (clientData: Omit<Client, "id">) => {
      const { error } = await supabase
        .from("contractor_clients")
        .insert([{ ...clientData, contractor_id: contractorId }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contractor-clients"] });
      setIsAdding(false);
      setNewClient({
        name: "",
        email: "",
        phone: "",
        address: "",
        notes: "",
        opt_in_marketing: false,
      });
      toast({
        title: "Success",
        description: "Client added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add client",
        variant: "destructive",
      });
      console.error("Error adding client:", error);
    },
  });

  const deleteClient = useMutation({
    mutationFn: async (clientId: string) => {
      const { error } = await supabase
        .from("contractor_clients")
        .delete()
        .eq("id", clientId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contractor-clients"] });
      toast({
        title: "Success",
        description: "Client deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive",
      });
      console.error("Error deleting client:", error);
    },
  });

  if (isLoading) {
    return <Loader2 className="h-8 w-8 animate-spin" />;
  }

  return (
    <div className="space-y-4">
      {!isAdding && (
        <Button onClick={() => setIsAdding(true)} className="mb-4">
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      )}

      {isAdding && (
        <div className="space-y-4 p-4 border rounded-lg">
          <Input
            placeholder="Name"
            value={newClient.name}
            onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
          />
          <Input
            placeholder="Email"
            type="email"
            value={newClient.email}
            onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
          />
          <Input
            placeholder="Phone"
            type="tel"
            value={newClient.phone}
            onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
          />
          <Input
            placeholder="Address"
            value={newClient.address}
            onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
          />
          <Textarea
            placeholder="Notes"
            value={newClient.notes}
            onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button onClick={() => addClient.mutate(newClient)}>
              Add Client
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {clients?.map((client) => (
          <div
            key={client.id}
            className="p-4 border rounded-lg flex justify-between items-start"
          >
            <div>
              <h3 className="font-semibold">{client.name}</h3>
              <p className="text-sm text-muted-foreground">{client.email}</p>
              <p className="text-sm text-muted-foreground">{client.phone}</p>
              <p className="text-sm text-muted-foreground">{client.address}</p>
              {client.notes && (
                <p className="text-sm text-muted-foreground mt-2">{client.notes}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteClient.mutate(client.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}