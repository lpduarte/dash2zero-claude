import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Supplier } from "@/types/supplier";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ArrowRightLeft, TrendingDown, AlertCircle, Lightbulb } from "lucide-react";
import { useState } from "react";
import { getSectorName } from "@/data/sectors";

interface PartnerComparisonProps {
  suppliers: Supplier[];
}

export const PartnerComparison = ({ suppliers }: PartnerComparisonProps) => {
  const [selectedSector, setSelectedSector] = useState<string>("all");

  const sectors = [...new Set(suppliers.map(s => s.sector))];

  const filteredSuppliers = selectedSector === "all"
    ? suppliers
    : suppliers.filter(s => s.sector === selectedSector);

  // Prepare data for stacked bar chart (A1, A2, A3)
  const comparisonData = filteredSuppliers.map(s => ({
    name: s.name.length > 15 ? s.name.substring(0, 12) + '...' : s.name,
    fullName: s.name,
    scope1: s.scope1,
    scope2: s.scope2,
    scope3: s.scope3,
    total: s.totalEmissions,
    sector: s.sector,
    revenue: s.revenue,
  })).sort((a, b) => a.total - b.total);

  // Identify best and worst
  const best = comparisonData[0];
  const worst = comparisonData[comparisonData.length - 1];

  // Calculate what-if scenario: impact of switching 100% to best
  const currentTotal = filteredSuppliers.reduce((sum, s) => sum + s.totalEmissions, 0);
  const potentialTotal = best.total * filteredSuppliers.length;
  const potentialReduction = currentTotal - potentialTotal;
  const reductionPercentage = (potentialReduction / currentTotal) * 100;

  // Pareto analysis: identify 20% causing 80% of emissions
  const sortedByEmissions = [...filteredSuppliers].sort((a, b) => b.totalEmissions - a.totalEmissions);
  const totalEmissions = sortedByEmissions.reduce((sum, s) => sum + s.totalEmissions, 0);
  let cumulative = 0;
  let paretoIndex = 0;
  
  for (let i = 0; i < sortedByEmissions.length; i++) {
    cumulative += sortedByEmissions[i].totalEmissions;
    if (cumulative >= totalEmissions * 0.8) {
      paretoIndex = i + 1;
      break;
    }
  }

  const paretoSuppliers = sortedByEmissions.slice(0, paretoIndex);
  const paretoPercentage = (paretoIndex / sortedByEmissions.length) * 100;

  // Alternative partners: those with emissions < X% below average
  const avgEmissions = filteredSuppliers.reduce((sum, s) => sum + s.totalEmissions, 0) / filteredSuppliers.length;
  const threshold = avgEmissions * 0.7; // 30% below average
  const alternatives = filteredSuppliers.filter(s => s.totalEmissions < threshold);

  return (
    <div className="space-y-6">
      <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Comparação de Parceiros por Atividade Económica
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4 flex-wrap">
            <Button
              variant={selectedSector === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSector("all")}
            >
              Todos
            </Button>
            {sectors.map(sector => (
              <Button
                key={sector}
                variant={selectedSector === sector ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSector(sector)}
              >
                {getSectorName(sector)}
              </Button>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload[0]) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                      <p className="font-bold mb-2">{data.fullName}</p>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-danger">A1 (Diretas): </span>
                          <span className="font-bold">{data.scope1.toFixed(0)} ton</span>
                        </p>
                        <p>
                          <span className="text-warning">A2 (Energia): </span>
                          <span className="font-bold">{data.scope2.toFixed(0)} ton</span>
                        </p>
                        <p>
                          <span className="text-primary">A3 (Indiretas): </span>
                          <span className="font-bold">{data.scope3.toFixed(0)} ton</span>
                        </p>
                        <p className="pt-2 border-t">
                          <span className="text-muted-foreground">Total: </span>
                          <span className="font-bold">{data.total.toFixed(0)} t CO₂e</span>
                        </p>
                      </div>
                    </div>
                  );
                }}
              />
              <Bar dataKey="scope1" stackId="a" fill="hsl(var(--danger))" name="A1 (Diretas)" />
              <Bar dataKey="scope2" stackId="a" fill="hsl(var(--warning))" name="A2 (Energia)" />
              <Bar dataKey="scope3" stackId="a" fill="hsl(var(--primary))" name="A3 (Indiretas)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-accent/30 bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Análise What-If (Cenário)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-card border border-border rounded-lg">
              <h4 className="font-bold mb-3">
                Cenário: "Se mudar 100% do negócio para o melhor parceiro"
              </h4>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Emissões Atuais</p>
                  <p className="text-2xl font-bold">{currentTotal.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">t CO₂e</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Emissões Potenciais</p>
                  <p className="text-2xl font-bold text-success">{potentialTotal.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">t CO₂e</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Redução Potencial</p>
                  <p className="text-2xl font-bold text-primary">{potentialReduction.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">t CO₂e (-{reductionPercentage.toFixed(1)}%)</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-card border border-border rounded-lg">
              <h4 className="font-bold mb-3">
                Gráfico de Pareto: Priorizar onde focar esforços
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                {paretoPercentage.toFixed(0)}% dos parceiros ({paretoIndex} de {filteredSuppliers.length}) são responsáveis por 80% das emissões
              </p>
              
              <div className="space-y-2">
                {paretoSuppliers.slice(0, 5).map((supplier, index) => (
                  <div key={supplier.id} className="flex items-center justify-between p-2 border border-border rounded">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <span className="font-normal">{supplier.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {supplier.totalEmissions.toFixed(0)} t CO₂e
                      </span>
                      <Badge className="bg-danger">
                        {((supplier.totalEmissions / totalEmissions) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
