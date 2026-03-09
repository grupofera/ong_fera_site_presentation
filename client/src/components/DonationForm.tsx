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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Loader2, Copy, Check } from "lucide-react";
import { useState } from "react";

const donationSchema = z.object({
  doador_nome: z.string().min(1, "Nome do doador é obrigatório"),
  doador_email: z.string().email("Email inválido"),
  doador_telefone: z.string().optional(),
  tipo_doacao: z.enum(["PIX", "Banco", "Item"]) as any,
  valor: z.number().min(1, "Valor deve ser maior que 0").optional(),
  descricao_item: z.string().optional(),
  data_doacao: z.string().optional(),
  observacoes: z.string().optional(),
  recorrente: z.boolean().default(false),
});

export type DonationFormValues = z.infer<typeof donationSchema>;

interface DonationFormProps {
  onSuccess?: () => void;
  isLoading?: boolean;
}

const PIX_CNPJ = "29.290.977/0001-72";
const BANCO_DADOS = {
  banco: "Banco do Brasil",
  agencia: "3568-8",
  conta: "33127-9",
};

export function DonationForm({ onSuccess, isLoading }: DonationFormProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema) as any,
    defaultValues: {
      doador_nome: "",
      doador_email: "",
      doador_telefone: "",
      tipo_doacao: "PIX",
      valor: undefined,
      descricao_item: "",
      data_doacao: new Date().toISOString().split("T")[0],
      observacoes: "",
      recorrente: false,
    },
  });

  const tipoDoacao = form.watch("tipo_doacao");

  const createMutation = trpc.donations.create.useMutation({
    onSuccess: () => {
      toast.success("Doação registrada com sucesso!");
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const onSubmit: SubmitHandler<DonationFormValues> = (values) => {
    createMutation.mutate(values);
  };

  const isSubmitting = createMutation.isPending;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Donor Information */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold">Informações do Doador</h3>

          <FormField
            control={form.control}
            name="doador_nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Maria Silva"
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
            name="doador_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="maria@example.com"
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
            name="doador_telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
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

        {/* Donation Type */}
        <FormField
          control={form.control}
          name="tipo_doacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Doação *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PIX">PIX</SelectItem>
                  <SelectItem value="Banco">Transferência Bancária</SelectItem>
                  <SelectItem value="Item">Item/Produto</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PIX Information */}
        {tipoDoacao === "PIX" && (
          <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-900">Dados para PIX</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-white rounded border border-green-200">
                <div>
                  <p className="text-sm text-muted-foreground">CNPJ (Chave PIX)</p>
                  <p className="font-mono font-semibold">{PIX_CNPJ}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(PIX_CNPJ, "pix")}
                >
                  {copiedField === "pix" ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <FormDescription>
              Copie a chave PIX acima para fazer a transferência
            </FormDescription>
          </div>
        )}

        {/* Bank Information */}
        {tipoDoacao === "Banco" && (
          <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900">Dados Bancários</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-white rounded border border-blue-200">
                <div>
                  <p className="text-sm text-muted-foreground">Banco</p>
                  <p className="font-semibold">{BANCO_DADOS.banco}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded border border-blue-200">
                <div>
                  <p className="text-sm text-muted-foreground">Agência</p>
                  <p className="font-mono font-semibold">{BANCO_DADOS.agencia}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(BANCO_DADOS.agencia, "agencia")}
                >
                  {copiedField === "agencia" ? (
                    <Check className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded border border-blue-200">
                <div>
                  <p className="text-sm text-muted-foreground">Conta Corrente</p>
                  <p className="font-mono font-semibold">{BANCO_DADOS.conta}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(BANCO_DADOS.conta, "conta")}
                >
                  {copiedField === "conta" ? (
                    <Check className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Amount for PIX/Banco */}
        {(tipoDoacao === "PIX" || tipoDoacao === "Banco") && (
          <FormField
            control={form.control}
            name="valor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor (R$) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="100.00"
                    step="0.01"
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Item Description */}
        {tipoDoacao === "Item" && (
          <FormField
            control={form.control}
            name="descricao_item"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição do Item *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ex: 10 kg de ração para cães, 5 coleiras, etc."
                    className="resize-none"
                    rows={3}
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Date */}
        <FormField
          control={form.control}
          name="data_doacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data da Doação</FormLabel>
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

        {/* Recurring */}
        <FormField
          control={form.control}
          name="recorrente"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border border-border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="cursor-pointer">Doação Recorrente</FormLabel>
                <FormDescription>
                  Marque se pretende fazer doações mensais
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Observations */}
        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Informações adicionais sobre a doação"
                  className="resize-none"
                  rows={3}
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
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
            Registrar Doação
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">* Campos obrigatórios</p>
      </form>
    </Form>
  );
}
