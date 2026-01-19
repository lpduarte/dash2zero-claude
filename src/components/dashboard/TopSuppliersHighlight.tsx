import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Supplier } from "@/types/supplier";
import { Trophy, TrendingDown, Euro, BarChart3 } from "lucide-react";
import { useState } from "react";
import { SupplierLabel } from "./SupplierLabel";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";
import { formatNumber, formatPercentage } from "@/lib/formatters";
interface TopSuppliersHighlightProps {
  suppliers: Supplier[];
}

const getMedalColor = (index: number) => {
  switch (index) {
    case 0:
      return "bg-medal-gold text-black";
    case 1:
      return "bg-medal-silver text-black";
    case 2:
      return "bg-medal-bronze text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getMedalBorder = (index: number) => {
  switch (index) {
    case 0:
      return "border-medal-gold/50 bg-medal-gold/5";
    case 1:
      return "border-medal-silver/50 bg-medal-silver/5";
    case 2:
      return "border-medal-bronze/50 bg-medal-bronze/5";
    default:
      return "border-border bg-card";
  }
};

export const TopSuppliersHighlight = ({
  suppliers
}: TopSuppliersHighlightProps) => {
  const [isOpen, setIsOpen] = useState(true);

  // Calculate sector averages
  const sectorAverages = suppliers.reduce((acc, s) => {
    if (!acc[s.sector]) {
      acc[s.sector] = { total: 0, count: 0 };
    }
    acc[s.sector].total += s.totalEmissions;
    acc[s.sector].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const getSectorAverage = (sector: string) => {
    const data = sectorAverages[sector];
    return data ? data.total / data.count : 0;
  };

  const getComparisonToAverage = (supplier: Supplier) => {
    const avg = getSectorAverage(supplier.sector);
    if (avg === 0) return { percentage: 0, isBelow: true };
    const diff = (supplier.totalEmissions - avg) / avg * 100;
    return { percentage: Math.abs(diff), isBelow: diff < 0 };
  };

  const topSuppliers = [...suppliers].sort((a, b) => a.totalEmissions - b.totalEmissions).slice(0, 3);
  return <Collapsible open={isOpen} onOpenChange={setIsOpen}>
    <Card className="border-success/50 bg-gradient-to-br from-success/10 via-primary/5 to-accent/10 shadow-md">
      <CardHeader className={cn("transition-all duration-[400ms]", isOpen ? "pb-3" : "pb-6")}>
        <SectionHeader
          icon={Trophy}
          title="As melhores empresas"
          collapsible
          expanded={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
        />
      </CardHeader>
      <CollapsibleContent>
        <CardContent>
        <div className="grid gap-3">
          {topSuppliers.map((supplier, index) => <div key={supplier.id} className={`flex items-center gap-4 p-4 border rounded-lg transition-all hover:shadow-md ${getMedalBorder(index)}`}>
              <Badge className={`w-10 h-10 flex items-center justify-center text-xl font-bold ${getMedalColor(index)}`}>
                {index + 1}
              </Badge>

              <div className="flex-1">
                <h4 className="font-bold mb-1">{supplier.name}</h4>
                <SupplierLabel sector={supplier.sector} cluster={supplier.clusterId || supplier.cluster} />
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                <div className="flex items-center justify-center gap-2 mb-1">
                    <TrendingDown className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Emissões</span>
                  </div>
                  <p className="text-xl font-bold text-success">{formatNumber(supplier.totalEmissions, 0)}</p>
                  <p className="text-xs text-muted-foreground">t CO₂e</p>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Euro className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">FE</span>
                  </div>
                  <p className="text-xl font-bold text-warning">{formatNumber(supplier.emissionsPerRevenue, 1)}</p>
                  <p className="text-xs text-muted-foreground">t CO₂e/€</p>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <BarChart3 className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">vs Setor</span>
                  </div>
                  {(() => {
                const comparison = getComparisonToAverage(supplier);
                return <>
                        <p className={`text-xl font-bold ${comparison.isBelow ? 'text-success' : 'text-destructive'}`}>
                          {comparison.isBelow ? '-' : '+'}{formatPercentage(comparison.percentage, 0)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {comparison.isBelow ? 'abaixo' : 'acima'}
                        </p>
                      </>;
              })()}
                </div>
              </div>
            </div>)}
          {topSuppliers.length === 0 && <p className="text-center text-muted-foreground py-4">
              Nenhuma empresa encontrada para esta atividade
            </p>}
        </div>
        </CardContent>
      </CollapsibleContent>
    </Card>
  </Collapsible>;
};