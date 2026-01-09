import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Supplier } from "@/types/supplier";
import { Award, Trophy, TrendingDown, Euro, BarChart3, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SupplierLabel, sectorLabels } from "./SupplierLabel";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface TopSuppliersHighlightProps {
  suppliers: Supplier[];
}

const getMedalColor = (index: number) => {
  switch (index) {
    case 0:
      return "bg-[#FFD700] text-black";
    case 1:
      return "bg-[#C0C0C0] text-black";
    case 2:
      return "bg-[#CD7F32] text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getMedalBorder = (index: number) => {
  switch (index) {
    case 0:
      return "border-[#FFD700]/50 bg-[#FFD700]/5";
    case 1:
      return "border-[#C0C0C0]/50 bg-[#C0C0C0]/5";
    case 2:
      return "border-[#CD7F32]/50 bg-[#CD7F32]/5";
    default:
      return "border-border bg-card";
  }
};

export const TopSuppliersHighlight = ({
  suppliers
}: TopSuppliersHighlightProps) => {
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [isOpen, setIsOpen] = useState(true);

  // Calculate sector averages
  const sectorAverages = suppliers.reduce((acc, s) => {
    if (!acc[s.sector]) {
      acc[s.sector] = {
        total: 0,
        count: 0
      };
    }
    acc[s.sector].total += s.totalEmissions;
    acc[s.sector].count += 1;
    return acc;
  }, {} as Record<string, {
    total: number;
    count: number;
  }>);
  const getSectorAverage = (sector: string) => {
    const data = sectorAverages[sector];
    return data ? data.total / data.count : 0;
  };
  const getComparisonToAverage = (supplier: Supplier) => {
    const avg = getSectorAverage(supplier.sector);
    if (avg === 0) return {
      percentage: 0,
      isBelow: true
    };
    const diff = (supplier.totalEmissions - avg) / avg * 100;
    return {
      percentage: Math.abs(diff),
      isBelow: diff < 0
    };
  };
  const filteredSuppliers = selectedSector === "all" ? suppliers : suppliers.filter(s => s.sector === selectedSector);
  const topSuppliers = [...filteredSuppliers].sort((a, b) => a.totalEmissions - b.totalEmissions).slice(0, 3);
  const uniqueSectors = [...new Set(suppliers.map(s => s.sector))];
  const sectorCounts = suppliers.reduce((acc, s) => {
    acc[s.sector] = (acc[s.sector] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  return <Collapsible open={isOpen} onOpenChange={setIsOpen}>
    <Card className="border-success/50 bg-gradient-to-br from-success/10 via-primary/5 to-accent/10 shadow-sm">
      <CardHeader className={isOpen ? "pb-3" : "pb-6"}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Trophy className="h-5 w-5 text-success" />
            </div>
            <CardTitle className="text-lg font-semibold">
              As melhores empresas
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Filtrar por atividade" />
              </SelectTrigger>
              <SelectContent className="w-[280px]">
                <SelectItem value="all">
                  <div className="flex items-center justify-between w-[230px]">
                    <span>{sectorLabels.all}</span>
                    <span className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded-full min-w-[28px] text-center">{suppliers.length}</span>
                  </div>
                </SelectItem>
                {uniqueSectors.map(sector => <SelectItem key={sector} value={sector}>
                    <div className="flex items-center justify-between w-[230px]">
                      <span>{sectorLabels[sector] || sector}</span>
                      <span className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded-full min-w-[28px] text-center">{sectorCounts[sector]}</span>
                    </div>
                  </SelectItem>)}
              </SelectContent>
            </Select>
            <CollapsibleTrigger asChild>
              <button className="ml-2 w-9 h-9 rounded-full border border-input bg-background hover:bg-muted/50 flex items-center justify-center transition-colors shrink-0">
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? '' : 'rotate-180'}`} />
              </button>
            </CollapsibleTrigger>
          </div>
        </div>
      </CardHeader>
      <CollapsibleContent>
        <CardContent>
        <div className="grid gap-3">
          {topSuppliers.map((supplier, index) => <div key={supplier.id} className={`flex items-center gap-4 p-4 border rounded-lg transition-all hover:shadow-md ${getMedalBorder(index)}`}>
              <Badge className={`w-10 h-10 flex items-center justify-center text-lg font-bold ${getMedalColor(index)}`}>
                {index + 1}
              </Badge>

              <div className="flex-1">
                <h4 className="font-semibold mb-1">{supplier.name}</h4>
                <SupplierLabel sector={supplier.sector} cluster={supplier.cluster} />
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingDown className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Emissões</span>
                  </div>
                  <p className="text-lg font-bold text-success">{supplier.totalEmissions.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">t CO₂e</p>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Euro className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">FE</span>
                  </div>
                  <p className="text-lg font-bold text-warning">{supplier.emissionsPerRevenue.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">t CO₂e/€</p>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <BarChart3 className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">vs Setor</span>
                  </div>
                  {(() => {
                const comparison = getComparisonToAverage(supplier);
                return <>
                        <p className={`text-lg font-bold ${comparison.isBelow ? 'text-success' : 'text-destructive'}`}>
                          {comparison.isBelow ? '-' : '+'}{comparison.percentage.toFixed(0)}%
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