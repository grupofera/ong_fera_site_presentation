import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AdoptionForm } from "@/components/AdoptionForm";
import { Plus, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Adocoes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch animals for the form
  const animalsQuery = trpc.animals.list.useQuery({ limit: 100, offset: 0 });
  const adoptionsQuery = trpc.adoptions.list.useQuery({ limit: 50, offset: 0 });

  const animals = animalsQuery.data?.animals || [];
  const adoptions = adoptionsQuery.data?.adoptions || [];

  const filteredAdoptions = adoptions.filter((adoption: any) =>
    adoption.animal_nome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    adoption.adotante_nome?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Adoções</h1>
          <p className="text-muted-foreground mt-2">
            Registre e acompanhe as adoções de animais
          </p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Adoção
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Nova Adoção</DialogTitle>
              <DialogDescription>
                Preencha os dados abaixo para registrar uma nova adoção
              </DialogDescription>
            </DialogHeader>
            <AdoptionForm
              animals={animals}
              onSuccess={() => {
                setOpenDialog(false);
                adoptionsQuery.refetch();
              }}
              isLoading={animalsQuery.isLoading}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total de Adoções</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">--</p>
            <p className="text-xs text-muted-foreground mt-1">Aguardando dados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Adoções este Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">--</p>
            <p className="text-xs text-muted-foreground mt-1">Aguardando dados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total de Adotantes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">--</p>
            <p className="text-xs text-muted-foreground mt-1">Aguardando dados</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and List */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Adoções</CardTitle>
          <CardDescription>
            Lista de todas as adoções registradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por animal ou adotante..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Adoptions List */}
          {adoptionsQuery.isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Carregando adoções...</p>
            </div>
          ) : filteredAdoptions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchQuery ? "Nenhuma adoção encontrada" : "Nenhuma adoção registrada ainda"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Animal</th>
                    <th className="text-left py-3 px-4 font-semibold">Adotante</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Telefone</th>
                    <th className="text-left py-3 px-4 font-semibold">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdoptions.map((adoption: any) => (
                    <tr key={adoption.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{adoption.animal_nome}</p>
                          <p className="text-xs text-muted-foreground">
                            {adoption.especie}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">{adoption.adotante_nome}</td>
                      <td className="py-3 px-4 text-xs">{adoption.adotante_email}</td>
                      <td className="py-3 px-4 text-xs">{adoption.adotante_telefone}</td>
                      <td className="py-3 px-4 text-xs">
                        {adoption.data_adocao
                          ? new Date(adoption.data_adocao).toLocaleDateString("pt-BR")
                          : "--"}
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
  );
}
