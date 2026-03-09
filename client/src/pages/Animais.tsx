import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AnimalDialog } from "@/components/AnimalDialog";
import { Plus, Search, Trash2, Edit, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Animais() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<any | null>(null);

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

  const handleEdit = (animal: any) => {
    setEditingAnimal(animal);
  };

  const handleDialogClose = () => {
    setIsCreateDialogOpen(false);
    setEditingAnimal(null);
  };

  const handleSuccess = () => {
    refetch();
    handleDialogClose();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Animais</h1>
            <p className="text-muted-foreground mt-2">
              Total de animais: <strong>{total}</strong>
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingAnimal(null);
              setIsCreateDialogOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
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
            <CardDescription>
              {searchQuery && `Resultados da busca: ${animals.length} animal(is)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading || isSearching ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : animals.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "Nenhum animal encontrado com esse critério"
                    : "Nenhum animal cadastrado ainda"}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => {
                      setEditingAnimal(null);
                      setIsCreateDialogOpen(true);
                    }}
                  >
                    Cadastrar Primeiro Animal
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-4 px-4 font-semibold">Nome</th>
                      <th className="text-left py-4 px-4 font-semibold">Espécie</th>
                      <th className="text-left py-4 px-4 font-semibold">Raça</th>
                      <th className="text-left py-4 px-4 font-semibold">Sexo</th>
                      <th className="text-left py-4 px-4 font-semibold">Status</th>
                      <th className="text-left py-4 px-4 font-semibold">Castrado</th>
                      <th className="text-right py-4 px-4 font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {animals.map((animal: any) => (
                      <tr key={animal.id} className="border-b hover:bg-muted/50 transition">
                        <td className="py-4 px-4 font-medium">{animal.nome}</td>
                        <td className="py-4 px-4">{animal.especie}</td>
                        <td className="py-4 px-4">{animal.raca}</td>
                        <td className="py-4 px-4">{animal.sexo}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                              animal.status === "Disponível para Adoção"
                                ? "bg-green-100 text-green-800"
                                : animal.status === "Adotado"
                                  ? "bg-blue-100 text-blue-800"
                                  : animal.status === "Em Tratamento"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : animal.status === "Falecido"
                                      ? "bg-gray-100 text-gray-800"
                                      : "bg-primary/10 text-primary"
                            }`}
                          >
                            {animal.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {animal.castrado ? (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                              Sim
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                              Não
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(animal)}
                            title="Editar animal"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(animal.id)}
                            disabled={deleteMutation.isPending}
                            title="Remover animal"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
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

      {/* Animal Dialog */}
      <AnimalDialog
        open={isCreateDialogOpen || editingAnimal !== null}
        onOpenChange={handleDialogClose}
        initialData={editingAnimal}
        onSuccess={handleSuccess}
      />
    </DashboardLayout>
  );
}
