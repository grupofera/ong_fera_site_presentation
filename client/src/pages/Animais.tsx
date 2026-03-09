import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, Trash2, Edit, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Animais() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch animals
  const { data: animalsData, isLoading, refetch } = trpc.animals.list.useQuery({
    limit: 50,
    offset: 0,
  });

  // Search animals
  const { data: searchResults, isLoading: isSearching } = trpc.animals.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );

  // Delete mutation
  const deleteMutation = trpc.animals.delete.useMutation({
    onSuccess: () => {
      toast.success("Animal removido com sucesso");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao remover animal: ${error.message}`);
    },
  });

  const animals = searchQuery && searchResults ? searchResults : animalsData?.animals || [];
  const total = animalsData?.total || 0;

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover este animal?")) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Animais</h1>
            <p className="text-muted-foreground mt-2">Gerenciar registros de animais atendidos pela ONG</p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Animal
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, espécie ou raça..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Animals List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Animais</CardTitle>
            <CardDescription>{total} animal(is) registrado(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : animals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum animal encontrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Nome</th>
                      <th className="text-left py-3 px-4 font-semibold">Espécie</th>
                      <th className="text-left py-3 px-4 font-semibold">Raça</th>
                      <th className="text-left py-3 px-4 font-semibold">Sexo</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Castrado</th>
                      <th className="text-right py-3 px-4 font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {animals.map((animal: any) => (
                      <tr key={animal.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{animal.nome}</td>
                        <td className="py-3 px-4">{animal.especie}</td>
                        <td className="py-3 px-4">{animal.raca}</td>
                        <td className="py-3 px-4">{animal.sexo}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                            {animal.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{animal.castrado ? "Sim" : "Não"}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingId(animal.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(animal.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Animal</DialogTitle>
            <DialogDescription>Adicione um novo animal ao registro</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Formulário em desenvolvimento...</p>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
