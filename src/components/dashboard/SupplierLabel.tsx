import { Building2, Users, Handshake } from "lucide-react";
import { sectorLabels } from "@/data/sectors";

// Re-export for backward compatibility
export { sectorLabels };

export const clusterLabels: Record<string, string> = {
  fornecedor: "Fornecedores",
  cliente: "Clientes",
  parceiro: "Parceiros"
};

const ClusterIcon = ({ cluster }: { cluster: string }) => {
  switch (cluster) {
    case 'fornecedor':
      return <Building2 className="h-3 w-3" />;
    case 'cliente':
      return <Users className="h-3 w-3" />;
    case 'parceiro':
      return <Handshake className="h-3 w-3" />;
    default:
      return null;
  }
};

interface SupplierLabelProps {
  sector: string;
  cluster: string;
}

export const SupplierLabel = ({ sector, cluster }: SupplierLabelProps) => {
  return (
    <p className="text-xs text-muted-foreground flex items-center gap-1">
      {sectorLabels[sector] || sector} • <ClusterIcon cluster={cluster} /> {clusterLabels[cluster] || cluster}
    </p>
  );
};
