import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Supplier } from "@/types/supplier";
import { Mail, ExternalLink, FileText, Building2, Users, Handshake, TrendingUp, Euro, UserRound, Maximize2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSectorName } from "@/data/sectors";
import { mockSuppliers } from "@/data/mockSuppliers";
interface SupplierCardProps {
  supplier: Supplier;
}
const getRegionLabel = (region: string) => {
  const labels: Record<string, string> = {
    north: 'Norte',
    center: 'Centro',
    south: 'Sul',
    islands: 'Ilhas'
  };
  return labels[region] || region;
};
const getClusterInfo = (cluster: string) => {
  const info: Record<string, {
    label: string;
    icon: typeof Building2;
  }> = {
    fornecedor: {
      label: 'Fornecedor',
      icon: Building2
    },
    cliente: {
      label: 'Cliente',
      icon: Users
    },
    parceiro: {
      label: 'Parceiro',
      icon: Handshake
    }
  };
  return info[cluster] || {
    label: cluster,
    icon: Building2
  };
};
export const SupplierCard = ({
  supplier
}: SupplierCardProps) => {
  const clusterInfo = getClusterInfo(supplier.cluster);
  const ClusterIcon = clusterInfo.icon;

  // Calculate sector average
  const sectorSuppliers = mockSuppliers.filter(s => s.sector === supplier.sector);
  const sectorAvgEmissions = sectorSuppliers.reduce((sum, s) => sum + s.totalEmissions, 0) / sectorSuppliers.length;
  const vsAverage = (supplier.totalEmissions - sectorAvgEmissions) / sectorAvgEmissions * 100;
  const isAboveAverage = vsAverage > 0;
  return <Card className="border border-border bg-card hover:shadow-lg transition-all">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-card-foreground">{supplier.name}</h3>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className="text-xs font-normal text-muted-foreground border-border/60">
              {getSectorName(supplier.sector)}
            </Badge>
            <Badge variant="outline" className="text-xs font-normal text-muted-foreground border-border/60">
              {getRegionLabel(supplier.region)}
            </Badge>
            <Badge variant="outline" className="text-xs font-normal text-muted-foreground border-border/60 flex items-center gap-1">
              <ClusterIcon className="h-3 w-3" />
              {clusterInfo.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Emissions KPIs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 relative">
            <div className="absolute top-3 right-3 p-1.5 rounded bg-primary/10">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">Emissões Totais</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">{supplier.totalEmissions.toLocaleString('pt-PT')}</span>
              <span className="text-sm text-muted-foreground">t CO₂e</span>
            </div>
          </div>

          <div className={`p-4 rounded-lg border relative ${isAboveAverage ? 'bg-danger/5 border-danger/20' : 'bg-success/5 border-success/20'}`}>
            <div className={`absolute top-3 right-3 p-1.5 rounded ${isAboveAverage ? 'bg-danger/10' : 'bg-success/10'}`}>
              <BarChart3 className={`h-4 w-4 ${isAboveAverage ? 'text-danger' : 'text-success'}`} />
            </div>
            <p className="text-sm text-muted-foreground mb-2">vs Média do Setor</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${isAboveAverage ? 'text-danger' : 'text-success'}`}>
                {isAboveAverage ? '+' : ''}{vsAverage.toFixed(0)}%
              </span>
              <span className="text-sm text-muted-foreground">{isAboveAverage ? 'acima' : 'abaixo'}</span>
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-lg border border-border bg-muted/30 relative">
            <div className="absolute top-2 right-2 p-1.5 rounded bg-primary/10">
              <UserRound className="h-3.5 w-3.5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mb-1">Por colaborador</p>
            <p className="text-lg font-semibold text-foreground">{supplier.emissionsPerEmployee.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">t CO₂e/colab  </p>
          </div>
          <div className="p-3 rounded-lg border border-border bg-muted/30 relative">
            <div className="absolute top-2 right-2 p-1.5 rounded bg-primary/10">
              <Maximize2 className="h-3.5 w-3.5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mb-1">Por área</p>
            <p className="text-lg font-semibold text-foreground">{supplier.emissionsPerArea.toFixed(3)}</p>
            <p className="text-xs text-muted-foreground">t CO₂e/m²</p>
          </div>
          <div className="p-3 rounded-lg border border-border bg-muted/30 relative">
            <div className="absolute top-2 right-2 p-1.5 rounded bg-primary/10">
              <Euro className="h-3.5 w-3.5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mb-1">Por faturação</p>
            <p className="text-lg font-semibold text-foreground">{supplier.emissionsPerRevenue.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">kg CO₂e/€</p>
          </div>
        </div>

        {/* Scope Breakdown */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Emissões por Âmbito</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded border border-[hsl(220_70%_55%/0.3)] bg-[hsl(220_70%_55%/0.1)]">
              <p className="text-xs text-muted-foreground mb-0.5">Âmbito 1</p>
              <p className="text-sm font-semibold text-[hsl(220_70%_55%)]">{supplier.scope1.toLocaleString('pt-PT')} t CO₂e</p>
            </div>
            <div className="p-2 rounded border border-[hsl(280_60%_60%/0.3)] bg-[hsl(280_60%_60%/0.1)]">
              <p className="text-xs text-muted-foreground mb-0.5">Âmbito 2</p>
              <p className="text-sm font-semibold text-[hsl(280_60%_60%)]">{supplier.scope2.toLocaleString('pt-PT')} t CO₂e</p>
            </div>
            <div className="p-2 rounded border border-[hsl(25_85%_55%/0.3)] bg-[hsl(25_85%_55%/0.1)]">
              <p className="text-xs text-muted-foreground mb-0.5">Âmbito 3</p>
              <p className="text-sm font-semibold text-[hsl(25_85%_55%)]">{supplier.scope3.toLocaleString('pt-PT')} t CO₂e</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="pt-3 border-t border-border">
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1.5 min-w-0">
              <FileText className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{supplier.contact.nif}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <Mail className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{supplier.contact.email}</span>
            </div>
          </div>
          {supplier.sustainabilityReport && <Button variant="outline" size="sm" className="w-full" asChild>
              <a href={supplier.sustainabilityReport} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-2" />
                Ver Relatório de Sustentabilidade
              </a>
            </Button>}
        </div>
      </CardContent>
    </Card>;
};