import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Supplier } from "@/types/supplier";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Award } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface TopSuppliersByCAEProps {
  suppliers: Supplier[];
}

const sectorNames: Record<string, string> = {
  technology: "Tecnologia",
  construction: "Construção",
  manufacturing: "Indústria",
  transport: "Transporte",
  services: "Serviços"
};

export const TopSuppliersByCAE = ({ suppliers }: TopSuppliersByCAEProps) => {
  // Group suppliers by sector
  const suppliersBySector = suppliers.reduce((acc, supplier) => {
    if (!acc[supplier.sector]) {
      acc[supplier.sector] = [];
    }
    acc[supplier.sector].push(supplier);
    return acc;
  }, {} as Record<string, Supplier[]>);

  // Get available sectors
  const availableSectors = Object.keys(suppliersBySector);
  const [selectedSector, setSelectedSector] = useState<string>(availableSectors[0] || "");

  // Get top 3 for selected sector
  const getSectorData = (sector: string) => {
    const sectorSuppliers = suppliersBySector[sector] || [];
    const sorted = [...sectorSuppliers].sort((a, b) => a.totalEmissions - b.totalEmissions);
    return {
      sector,
      sectorName: sectorNames[sector] || sector,
      top3: sorted.slice(0, 3),
      totalInSector: sectorSuppliers.length
    };
  };

  const currentSectorData = selectedSector ? getSectorData(selectedSector) : null;

  return (
    <Card className="p-6 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Award className="h-6 w-6 text-success" />
            Top 3 Fornecedores por CAE
          </CardTitle>
          
          <div className="w-64">
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar CAE" />
              </SelectTrigger>
              <SelectContent>
                {availableSectors.map(sector => (
                  <SelectItem key={sector} value={sector}>
                    {sectorNames[sector] || sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {currentSectorData && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-xl">{currentSectorData.sectorName}</h3>
              <Badge variant="secondary">{currentSectorData.totalInSector} empresas</Badge>
            </div>
            
            <div className="space-y-2">
              {currentSectorData.top3.map((supplier, index) => (
                <div
                  key={supplier.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                      ${index === 0 ? 'bg-success/20 text-success' : 
                        index === 1 ? 'bg-primary/20 text-primary' : 
                        'bg-accent/20 text-accent'}
                    `}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{supplier.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Rating: <span className="font-semibold">{supplier.rating}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <TrendingDown className="h-4 w-4 text-success" />
                      <span className="font-bold text-sm">
                        {Math.round(supplier.totalEmissions).toLocaleString('pt-PT')}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">tonCO₂e</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
