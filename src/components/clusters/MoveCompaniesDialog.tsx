import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  onMove: (companyIds: string[], targetClusterId: string, keepCopy: boolean) => void;
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
  const [keepCopy, setKeepCopy] = useState(false);

  // Filter out the current cluster from available options
  const availableClusters = useMemo(() => {
    return clusters.filter(c => c.id !== currentClusterId);
  }, [clusters, currentClusterId]);

  const isSingleCompany = companies.length === 1;
  const companyName = isSingleCompany ? companies[0].name : "";

  const handleMove = () => {
    if (!targetClusterId) return;

    const companyIds = companies.map(c => c.id);
    onMove(companyIds, targetClusterId, keepCopy);

    // Reset state and close
    setTargetClusterId("");
    setKeepCopy(false);
    onOpenChange(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setTargetClusterId("");
      setKeepCopy(false);
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

          <div className="flex items-start gap-2 mt-4">
            <Checkbox
              id="keepCopy"
              checked={keepCopy}
              onCheckedChange={(checked) => setKeepCopy(checked === true)}
            />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="keepCopy" className="text-sm font-normal cursor-pointer">
                Manter cópia no cluster actual
              </label>
              <p className="text-xs text-muted-foreground">
                A empresa continuará a contar como uma só para efeitos de envio de emails,
                cálculo de pegada e outras funcionalidades.
              </p>
            </div>
          </div>
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
