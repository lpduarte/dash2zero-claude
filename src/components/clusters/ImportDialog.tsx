import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clusterId: string;
  onImport: (file: File) => void;
}

export function ImportDialog({
  open,
  onOpenChange,
  clusterId,
  onImport,
}: ImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".xlsx") && !selectedFile.name.endsWith(".xls")) {
        toast.error("Por favor, selecione um ficheiro Excel (.xlsx ou .xls)");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleImport = () => {
    if (!file) {
      toast.error("Por favor, selecione um ficheiro");
      return;
    }

    onImport(file);
    toast.success("Fornecedores importados com sucesso!");
    onOpenChange(false);
    setFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar Fornecedores</DialogTitle>
          <DialogDescription>
            Importe fornecedores através de um ficheiro Excel
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              O ficheiro Excel deve conter as seguintes colunas obrigatórias:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Nome</strong> - Nome do fornecedor</li>
                <li><strong>NIF</strong> - Número de Identificação Fiscal</li>
                <li><strong>Email</strong> - Email de contacto</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="file">Ficheiro Excel</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {file && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileSpreadsheet className="h-4 w-4" />
                  {file.name}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center p-6 border-2 border-dashed border-border rounded-lg">
            <div className="text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Arraste um ficheiro ou clique para selecionar
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleImport} disabled={!file}>
            Importar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
