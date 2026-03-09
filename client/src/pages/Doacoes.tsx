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
import { DonationForm } from "@/components/DonationForm";
import { Plus, Search, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Doacoes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch donations
  const donationsQuery = trpc.donations.list.useQuery({ limit: 50, offset: 0 });

  const donations = donationsQuery.data?.donations || [];

  const filteredDonations = donations.filter((donation: any) =>
    donation.doador_nome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donation.doador_email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const totalDonadores = new Set(donations.map((d: any) => d.doador_email)).size;
  const doadoresRecorrentes = donations.filter((d: any) => d.recorrente).length;
  const totalValor = donations
    .filter((d: any) => d.valor)
    .reduce((sum: number, d: any) => sum + (d.valor || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Doações</h1>
          <p className="text-muted-foreground mt-2">
            Registre doações via PIX, banco ou itens
          </p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Doação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Nova Doação</DialogTitle>
              <DialogDescription>
                Preencha os dados abaixo para registrar uma nova doação
              </DialogDescription>
            </DialogHeader>
            <DonationForm
              onSuccess={() => {
                setOpenDialog(false);
                donationsQuery.refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total de Doadores</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalDonadores}</p>
            <p className="text-xs text-muted-foreground mt-1">Doadores únicos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Doadores Recorrentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{doadoresRecorrentes}</p>
            <p className="text-xs text-muted-foreground mt-1">Doações mensais</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Arrecadado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">R$ {totalValor.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">Em doações monetárias</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and List */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Doações</CardTitle>
          <CardDescription>
            Lista de todas as doações registradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por doador ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Donations List */}
          {donationsQuery.isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Carregando doações...</p>
            </div>
          ) : filteredDonations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchQuery ? "Nenhuma doação encontrada" : "Nenhuma doação registrada ainda"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Doador</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Tipo</th>
                    <th className="text-left py-3 px-4 font-semibold">Valor/Descrição</th>
                    <th className="text-left py-3 px-4 font-semibold">Recorrente</th>
                    <th className="text-left py-3 px-4 font-semibold">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonations.map((donation: any) => (
                    <tr key={donation.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{donation.doador_nome}</td>
                      <td className="py-3 px-4 text-xs">{donation.doador_email}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {donation.tipo_doacao}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {donation.tipo_doacao === "Item"
                          ? donation.descricao_item
                          : `R$ ${donation.valor?.toFixed(2) || "0.00"}`}
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {donation.recorrente ? (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <TrendingUp className="h-3 w-3" />
                            Sim
                          </span>
                        ) : (
                          "Não"
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {donation.data_doacao
                          ? new Date(donation.data_doacao).toLocaleDateString("pt-BR")
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
