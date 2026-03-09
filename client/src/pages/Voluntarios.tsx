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
import { Plus, Search, Clock, Award } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const volunteerSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  horas_mes: z.coerce.number().min(0, "Horas não pode ser negativo"),
  atividades: z.string().min(10, "Descrição de atividades é obrigatória"),
});

type VolunteerFormValues = z.infer<typeof volunteerSchema>;

interface VolunteerFormProps {
  onSuccess: () => void;
  isLoading?: boolean;
}

function VolunteerForm({ onSuccess, isLoading }: VolunteerFormProps) {
  const form = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerSchema) as any,
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      horas_mes: 0,
      atividades: "",
    },
  });

  const createVolunteer = trpc.volunteers.create.useMutation({
    onSuccess: () => {
      form.reset();
      onSuccess();
    },
  });

  async function onSubmit(values: VolunteerFormValues) {
    await createVolunteer.mutateAsync(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="João Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="joao@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telefone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="(11) 99999-9999" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="horas_mes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horas por Mês</FormLabel>
              <FormControl>
                <Input type="number" placeholder="10" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="atividades"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Atividades</FormLabel>
              <FormControl>
                <textarea
                  placeholder="Descreva as atividades que você realiza..."
                  className="w-full px-3 py-2 border border-input rounded-md text-sm"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={createVolunteer.isPending || isLoading}
        >
          {createVolunteer.isPending ? "Registrando..." : "Registrar Voluntário"}
        </Button>
      </form>
    </Form>
  );
}

export default function Voluntarios() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const volunteersQuery = trpc.volunteers.list.useQuery({ limit: 50, offset: 0 });

  const volunteers = volunteersQuery.data?.volunteers || [];

  const filteredVolunteers = volunteers.filter((volunteer: any) =>
    volunteer.nome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    volunteer.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const totalVolunteers = volunteers.length;
  const totalHoras = volunteers.reduce((sum: number, v: any) => sum + (v.horas_mes || 0), 0);
  const mediaHoras = totalVolunteers > 0 ? (totalHoras / totalVolunteers).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Voluntários</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie voluntários e rastreie horas de trabalho
          </p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Voluntário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Novo Voluntário</DialogTitle>
              <DialogDescription>
                Preencha os dados abaixo para registrar um novo voluntário
              </DialogDescription>
            </DialogHeader>
            <VolunteerForm
              onSuccess={() => {
                setOpenDialog(false);
                volunteersQuery.refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total de Voluntários</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalVolunteers}</p>
            <p className="text-xs text-muted-foreground mt-1">Voluntários ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Total de Horas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalHoras}</p>
            <p className="text-xs text-muted-foreground mt-1">Horas por mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4" />
              Média de Horas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{mediaHoras}h</p>
            <p className="text-xs text-muted-foreground mt-1">Por voluntário</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and List */}
      <Card>
        <CardHeader>
          <CardTitle>Voluntários Registrados</CardTitle>
          <CardDescription>
            Lista de todos os voluntários do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Volunteers List */}
          {volunteersQuery.isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Carregando voluntários...</p>
            </div>
          ) : filteredVolunteers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchQuery ? "Nenhum voluntário encontrado" : "Nenhum voluntário registrado ainda"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVolunteers.map((volunteer: any) => (
                <div
                  key={volunteer.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {volunteer.nome?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{volunteer.nome}</p>
                      <p className="text-sm text-muted-foreground">{volunteer.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {volunteer.atividades}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-primary">
                        {volunteer.horas_mes}h/mês
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{volunteer.telefone}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
