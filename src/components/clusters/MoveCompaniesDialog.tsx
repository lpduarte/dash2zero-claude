import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { ClusterDefinition } from "@/types/clusterNew";
import { SupplierAny } from "@/types/supplierNew";
import { getIconByName } from "@/config/clusters";

interface MoveCompaniesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companies: SupplierAny[];
  currentClusterId: string | null;
  clusters: ClusterDefinition[];
  onMove: (companyIds: string[], targetClusterId: string) => void;
}

export function MoveCompaniesDialog({
  open,
  onOpenChange,
  companies,
  currentClusterId,
  clusters,
  onMove,
}: MoveCompaniesDialogProps) {
  const [targetClusterId, setTargetClusterId] = useState<string>("");

  // Filter out the current cluster from available options
  const availableClusters = useMemo(() => {
    return clusters.filter(c => c.id !== currentClusterId);
  }, [clusters, currentClusterId]);

  const isSingleCompany = companies.length === 1;
  const companyName = isSingleCompany ? companies[0].name : "";

  const handleMove = () => {
    if (!targetClusterId) return;

    const companyIds = companies.map(c => c.id);
    onMove(companyIds, targetClusterId);

    // Reset state and close
    setTargetClusterId("");
    onOpenChange(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setTargetClusterId("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isSingleCompany ? "Mover empresa" : `Mover ${companies.length} empresas`}
          </DialogTitle>
          <DialogDescription>
            {isSingleCompany
              ? `Escolha o cluster de destino para "${companyName}".`
              : `Escolha o cluster de destino para as ${companies.length} empresas seleccionadas.`}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <label className="text-sm font-bold mb-2 block">
            Cluster de destino
          </label>
          <Select value={targetClusterId} onValueChange={setTargetClusterId}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione um cluster..." />
            </SelectTrigger>
            <SelectContent>
              {availableClusters.map(cluster => {
                const Icon = getIconByName(cluster.icon);
                return (
                  <SelectItem key={cluster.id} value={cluster.id}>
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {cluster.name}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {availableClusters.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Não existem outros clusters disponíveis.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleMove}
            disabled={!targetClusterId || availableClusters.length === 0}
          >
            {isSingleCompany ? "Mover" : `Mover ${companies.length} empresas`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
