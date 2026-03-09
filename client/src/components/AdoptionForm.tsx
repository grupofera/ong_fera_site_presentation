import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

const adoptionSchema = z.object({
  animal_id: z.string().min(1, "Selecione um animal"),
  adotante_nome: z.string().min(1, "Nome do adotante é obrigatório"),
  adotante_email: z.string().email("Email inválido"),
  adotante_telefone: z.string().min(10, "Telefone inválido"),
  data_adocao: z.string().min(1, "Data da adoção é obrigatória"),
  observacoes: z.string().optional(),
});

export type AdoptionFormValues = z.infer<typeof adoptionSchema>;

interface AdoptionFormProps {
  animals?: any[];
  onSuccess?: () => void;
  isLoading?: boolean;
}

export function AdoptionForm({ animals = [], onSuccess, isLoading }: AdoptionFormProps) {
  const form = useForm<AdoptionFormValues>({
    resolver: zodResolver(adoptionSchema),
    defaultValues: {
      animal_id: "",
      adotante_nome: "",
      adotante_email: "",
      adotante_telefone: "",
      data_adocao: new Date().toISOString().split("T")[0],
      observacoes: "",
    },
  });

  const createMutation = trpc.adoptions.create.useMutation({
    onSuccess: () => {
      toast.success("Adoção registrada com sucesso!");
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const onSubmit: SubmitHandler<AdoptionFormValues> = (values) => {
    createMutation.mutate(values as any);
  };

  const isSubmitting = createMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Animal Selection */}
        <FormField
          control={form.control}
          name="animal_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Animal para Adoção *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um animal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {animals.map((animal) => (
                    <SelectItem key={animal.id} value={animal.id}>
                      {animal.nome} ({animal.especie})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Adopter Information */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold">Informações do Adotante</h3>

          <FormField
            control={form.control}
            name="adotante_nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: João Silva"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="adotante_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="joao@example.com"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="adotante_telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="(11) 98765-4321"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Adoption Details */}
        <FormField
          control={form.control}
          name="data_adocao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data da Adoção *</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notas sobre a adoção, acompanhamento, etc."
                  className="resize-none"
                  rows={3}
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>Informações adicionais sobre a adoção</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex gap-3 justify-end pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="min-w-32"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Registrar Adoção
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">* Campos obrigatórios</p>
      </form>
    </Form>
  );
}
