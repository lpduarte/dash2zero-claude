import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Supplier } from "@/types/supplier";
import { DollarSign, TrendingUp, Users, Building2, Target, Zap } from "lucide-react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getSectorName } from "@/data/sectors";

interface FinancialAnalysisProps {
  suppliers: Supplier[];
}

export const FinancialAnalysis = ({ suppliers }: FinancialAnalysisProps) => {
  const totalRevenue = suppliers.reduce((sum, s) => sum + s.revenue, 0);
  const avgRevenue = totalRevenue / suppliers.length;
  const totalEmployees = suppliers.reduce((sum, s) => sum + s.employees, 0);
  const avgRevenuePerEmployee = (totalRevenue * 1000000) / totalEmployees; // Convert to euros

  // Calculate emissions intensity (ton CO2e per million EUR)
  const emissionsIntensityData = suppliers.map(s => ({
    name: s.name,
    revenue: s.revenue,
    emissionsPerRevenue: s.emissionsPerRevenue,
    totalEmissions: s.totalEmissions,
    cluster: s.clusterIds?.[0] || s.cluster,
    sector: s.sector,
  }));

  // Financial efficiency metrics
  const financialMetrics = suppliers.map(s => ({
    name: s.name.length > 20 ? s.name.substring(0, 17) + '...' : s.name,
    fullName: s.name,
    revenue: s.revenue,
    emissionsPerRevenue: s.emissionsPerRevenue,
    revenuePerEmployee: (s.revenue * 1000000) / s.employees,
    employees: s.employees,
    cluster: s.clusterIds?.[0] || s.cluster,
  })).sort((a, b) => a.emissionsPerRevenue - b.emissionsPerRevenue);

  const bestEfficiency = financialMetrics[0];
  const worstEfficiency = financialMetrics[financialMetrics.length - 1];

  const getIntensityColor = (value: number) => {
    if (value < 30) return "hsl(var(--success))";
    if (value < 60) return "hsl(var(--primary))";
    if (value < 100) return "hsl(var(--warning))";
    return "hsl(var(--danger))";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card className="p-4 shadow-md hover:shadow-md transition-shadow">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-normal text-muted-foreground">Faturação Média</p>
              <div className="bg-primary/10 text-primary p-1.5 rounded">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{avgRevenue.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground mt-1">M€ por empresa</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-md hover:shadow-md transition-shadow">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-normal text-muted-foreground">Faturação por Colaborador</p>
              <div className="bg-primary/10 text-primary p-1.5 rounded">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{(avgRevenuePerEmployee / 1000).toFixed(0)}k</p>
              <p className="text-xs text-muted-foreground mt-1">€ média</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-md hover:shadow-md transition-shadow">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-normal text-muted-foreground">Intensidade de Carbono Média</p>
              <div className="bg-primary/10 text-primary p-1.5 rounded">
                <Target className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {(suppliers.reduce((sum, s) => sum + s.emissionsPerRevenue, 0) / suppliers.length).toFixed(0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">kg CO₂e/€</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 shadow-md">
        <CardHeader>
          <CardTitle>Intensidade de Emissões vs Volume de Negócios</CardTitle>
          <p className="text-sm text-muted-foreground">
            Relação entre emissões por euro de receita e volume total de negócios
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number" 
                dataKey="revenue" 
                name="Receita"
                unit=" M€"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                label={{ value: 'Volume de Negócios (M€)', position: 'bottom' }}
              />
              <YAxis 
                type="number" 
                dataKey="emissionsPerRevenue" 
                name="Intensidade"
                unit=" kg/€"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                label={{ value: 'Intensidade de Carbono (kg CO₂e/€)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload[0]) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                      <p className="font-bold mb-2">{data.name}</p>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-muted-foreground">Volume Negócios: </span>
                          <span className="font-bold">{data.revenue.toFixed(1)} M€</span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">Intensidade de Carbono: </span>
                          <span className="font-bold">{data.emissionsPerRevenue.toFixed(1)} kg CO₂e/€</span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">Emissões Totais: </span>
                          <span>{data.totalEmissions.toFixed(0)} t CO₂e</span>
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">{getSectorName(data.sector)}</Badge>
                          <Badge variant="outline" className="text-xs">{data.cluster}</Badge>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Scatter name="Fornecedores" data={emissionsIntensityData}>
                {emissionsIntensityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getIntensityColor(entry.emissionsPerRevenue)} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
};
