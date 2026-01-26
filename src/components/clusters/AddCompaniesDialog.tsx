import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, ClipboardPaste, FileSpreadsheet, CircleDot } from "lucide-react";
import { ManualEntryTab, NewCompanyData } from "./tabs/ManualEntryTab";
import { PasteDataTab } from "./tabs/PasteDataTab";
import { FileImportTab } from "./tabs/FileImportTab";
import { ClusterDefinition } from "@/types/clusterNew";

interface AddCompaniesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clusterId: string;
  onClusterChange: (clusterId: string) => void;
  clusters: ClusterDefinition[];
  onAddCompanies: (companies: NewCompanyData[]) => void;
}

export function AddCompaniesDialog({
  open,
  onOpenChange,
  clusterId,
  onClusterChange,
  clusters,
  onAddCompanies,
}: AddCompaniesDialogProps) {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar empresas</DialogTitle>
          <div className="flex items-center gap-2 pt-2">
            <span className="text-sm text-muted-foreground">Cluster:</span>
            <Select value={clusterId} onValueChange={onClusterChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Selecione um cluster" />
              </SelectTrigger>
              <SelectContent>
                {clusters.map(cluster => (
                  <SelectItem key={cluster.id} value={cluster.id}>
                    {cluster.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>

        {!clusterId ? (
          <div className="py-8 text-center">
            <CircleDot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Selecione um cluster para adicionar empresas.
            </p>
          </div>
        ) : (
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="manual" className="gap-2">
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Manual</span>
              </TabsTrigger>
              <TabsTrigger value="paste" className="gap-2">
                <ClipboardPaste className="h-4 w-4" />
                <span className="hidden sm:inline">Colar dados</span>
              </TabsTrigger>
              <TabsTrigger value="file" className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                <span className="hidden sm:inline">Importar ficheiro</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual">
              <ManualEntryTab
                onAddCompanies={onAddCompanies}
                onClose={handleClose}
              />
            </TabsContent>

            <TabsContent value="paste">
              <PasteDataTab
                onAddCompanies={onAddCompanies}
                onClose={handleClose}
              />
            </TabsContent>

            <TabsContent value="file">
              <FileImportTab
                onAddCompanies={onAddCompanies}
                onClose={handleClose}
              />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}

export type { NewCompanyData };
