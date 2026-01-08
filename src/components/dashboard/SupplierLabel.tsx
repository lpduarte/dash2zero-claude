import { sectorLabels } from "@/data/sectors";
import { useUser } from "@/contexts/UserContext";
import { getClusterInfo } from "@/config/clusters";
import type { ClusterType } from "@/config/clusters";

// Re-export for backward compatibility
export { sectorLabels };

// Legacy export for backward compatibility
export const clusterLabels: Record<string, string> = {
  fornecedor: "Fornecedores",
  cliente: "Clientes",
  parceiro: "Parceiros"
};

interface SupplierLabelProps {
  sector: string;
  cluster: string;
}

export const SupplierLabel = ({ sector, cluster }: SupplierLabelProps) => {
  const { userType } = useUser();
  const clusterInfo = getClusterInfo(userType, cluster as ClusterType);
  const ClusterIcon = clusterInfo?.icon;
  
  return (
    <p className="text-xs text-muted-foreground flex items-center gap-1">
      {sectorLabels[sector] || sector} • 
      {ClusterIcon && <ClusterIcon className="h-3 w-3" />}
      {clusterInfo?.label || cluster}
    </p>
  );
};

