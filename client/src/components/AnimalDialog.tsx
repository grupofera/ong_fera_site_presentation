import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AnimalForm } from "./AnimalForm";

interface AnimalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
  onSuccess?: () => void;
  defaultProjeto?: string | null;
}

export function AnimalDialog({
  open,
  onOpenChange,
  initialData,
  onSuccess,
  defaultProjeto,
}: AnimalDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Animal" : "Cadastrar Novo Animal"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Atualize as informações do animal"
              : "Preencha os dados do animal para cadastrá-lo no sistema"}
          </DialogDescription>
        </DialogHeader>
        <AnimalForm
          initialData={initialData}
          defaultProjeto={defaultProjeto}
          onSuccess={() => {
            onOpenChange(false);
            onSuccess?.();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
