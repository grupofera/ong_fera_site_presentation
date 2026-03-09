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
import { Loader2, Upload, X } from "lucide-react";
import { useState } from "react";

// Validation schema
const animalFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").min(2, "Mínimo 2 caracteres"),
  especie: z.string().min(1, "Espécie é obrigatória"),
  raca: z.string().min(1, "Raça é obrigatória"),
  sexo: z.enum(["Macho", "Fêmea", "Desconhecido"]) as any,
  castrado: z.boolean().default(false),
  status: z.string().min(1, "Status é obrigatório"),
  descricao: z.string().optional(),
  data_nascimento: z.string().optional(),
  projeto: z.string().nullable().optional(),
});

export type AnimalFormValues = z.infer<typeof animalFormSchema>;

interface AnimalFormProps {
  initialData?: any;
  onSuccess?: () => void;
  isLoading?: boolean;
  defaultProjeto?: string | null;
}

export function AnimalForm({ initialData, onSuccess, isLoading, defaultProjeto }: AnimalFormProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initialData?.foto_url || null
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const form = useForm<AnimalFormValues>({
    resolver: zodResolver(animalFormSchema) as any,
    defaultValues: initialData || {
      nome: "",
      especie: "",
      raca: "",
      sexo: "Macho",
      castrado: false,
      status: "Animal Doméstico",
      descricao: "",
      data_nascimento: "",
      projeto: defaultProjeto || null,
    },
  });

  const createMutation = trpc.animals.create.useMutation({
    onSuccess: () => {
      toast.success("Animal cadastrado com sucesso!");
      form.reset();
      setPhotoPreview(null);
      setPhotoFile(null);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const updateMutation = trpc.animals.update.useMutation({
    onSuccess: () => {
      toast.success("Animal atualizado com sucesso!");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const onSubmit: SubmitHandler<AnimalFormValues> = (values) => {
    if (initialData?.id) {
      updateMutation.mutate({ id: initialData.id, ...values });
    } else {
      createMutation.mutate(values);
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Foto deve ter menos de 5MB");
        return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Photo Upload Section */}
        <div className="space-y-4">
          <FormLabel>Foto do Animal</FormLabel>
          <div className="flex gap-4">
            {photoPreview && (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPhotoPreview(null);
                    setPhotoFile(null);
                  }}
                  className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 hover:bg-destructive/90"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition">
              <Upload className="h-6 w-6 text-muted-foreground" />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>
          <FormDescription>
            Máximo 5MB. Formatos: JPG, PNG, GIF
          </FormDescription>
        </div>

        {/* Project Selection */}
        <FormField
          control={form.control}
          name="projeto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Projeto</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === "null" ? null : value)}
                defaultValue={field.value === null ? "null" : field.value || "null"}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o projeto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="null">ONG FERA</SelectItem>
                  <SelectItem value="Animais Iluminados">🌟 Animais Iluminados</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Selecione o projeto ao qual este animal pertence
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Animal *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Bolinha, Rex, Mimi"
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
            name="especie"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Espécie *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a espécie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Cão">Cão</SelectItem>
                    <SelectItem value="Gato">Gato</SelectItem>
                    <SelectItem value="Coelho">Coelho</SelectItem>
                    <SelectItem value="Pássaro">Pássaro</SelectItem>
                    <SelectItem value="Roedor">Roedor</SelectItem>
                    <SelectItem value="Réptil">Réptil</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="raca"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Raça *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Vira-lata, Siamês, Poodle"
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
            name="sexo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo *</FormLabel>
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
                    <SelectItem value="Macho">Macho</SelectItem>
                    <SelectItem value="Fêmea">Fêmea</SelectItem>
                    <SelectItem value="Desconhecido">Desconhecido</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="data_nascimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Nascimento</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>Deixe em branco se desconhecida</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status *</FormLabel>
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
                    <SelectItem value="Animal Doméstico">Animal Doméstico</SelectItem>
                    <SelectItem value="Resgatado">Resgatado</SelectItem>
                    <SelectItem value="Em Tratamento">Em Tratamento</SelectItem>
                    <SelectItem value="Disponível para Adoção">
                      Disponível para Adoção
                    </SelectItem>
                    <SelectItem value="Adotado">Adotado</SelectItem>
                    <SelectItem value="Falecido">Falecido</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Castration Checkbox */}
        <FormField
          control={form.control}
          name="castrado"
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
                <FormLabel className="cursor-pointer">Animal Castrado/Esterilizado</FormLabel>
                <FormDescription>
                  Marque se o animal foi castrado ou esterilizado
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva características, comportamento, histórico médico, etc."
                  className="resize-none"
                  rows={4}
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>Máximo 500 caracteres</FormDescription>
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
            {initialData ? "Atualizar Animal" : "Cadastrar Animal"}
          </Button>
        </div>

        {/* Required fields note */}
        <p className="text-xs text-muted-foreground">* Campos obrigatórios</p>
      </form>
    </Form>
  );
}
