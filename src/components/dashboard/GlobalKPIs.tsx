import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Supplier } from "@/types/supplier";
import { TrendingDown, Factory, Award, Users, DollarSign, Zap } from "lucide-react";
import { formatNumber, formatPercentage } from "@/lib/formatters";

interface GlobalKPIsProps {
  suppliers: Supplier[];
}

export const GlobalKPIs = ({ suppliers }: GlobalKPIsProps) => {
  const totalEmissions = suppliers.reduce((sum, s) => sum + s.totalEmissions, 0);
  const avgEmissionsPerEmployee = suppliers.length > 0 
    ? suppliers.reduce((sum, s) => sum + s.emissionsPerEmployee, 0) / suppliers.length 
    : 0;
  const totalEmployees = suppliers.reduce((sum, s) => sum + s.employees, 0);
  const totalRevenue = suppliers.reduce((sum, s) => sum + s.revenue, 0);
  const companiesWithSBTi = suppliers.filter(s => s.hasSBTi).length;
  const totalCertifications = suppliers.reduce((sum, s) => sum + s.certifications.length, 0);

  const kpis = [
    {
      icon: TrendingDown,
      label: "Emissões Totais do Grupo",
      value: formatNumber(totalEmissions, 0),
      unit: "t CO₂e",
      color: "primary",
      trend: `-${formatNumber((1 - totalEmissions / (totalEmissions * 1.15)) * 100, 1)}% vs 2022`,
    },
    {
      icon: Zap,
      label: "Emissões Médias por Funcionário",
      value: formatNumber(avgEmissionsPerEmployee, 2),
      unit: "t CO₂e/func",
      color: "warning",
      trend: "Média do grupo",
    },
    {
      icon: Users,
      label: "Total de Funcionários",
      value: totalEmployees.toLocaleString('pt-PT'),
      unit: "colaboradores",
      color: "primary",
      trend: `${suppliers.length} empresas`,
    },
    {
      icon: DollarSign,
      label: "Volume de Negócios Total",
      value: formatNumber(totalRevenue, 1),
      unit: "M€",
      color: "warning",
      trend: "Grupo consolidado",
    },
    {
      icon: Award,
      label: "Certificações Totais",
      value: totalCertifications.toString(),
      unit: "certificações",
      color: "success",
      trend: `${companiesWithSBTi} com SBTi`,
    },
    {
      icon: Factory,
      label: "Taxa de Compliance",
      value: formatNumber((companiesWithSBTi / suppliers.length) * 100, 0),
      unit: "%",
      color: "accent",
      progress: (companiesWithSBTi / suppliers.length) * 100,
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-success/10 border-primary/30">
      <CardHeader>
        <CardTitle className="text-2xl">KPIs Globais do Banco Montepio/Município</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            const colorClasses = {
              primary: {
                bg: 'bg-primary/10',
                icon: 'text-primary',
                border: 'border-primary/20',
              },
              success: {
                bg: 'bg-success/10',
                icon: 'text-success',
                border: 'border-success/20',
              },
              warning: {
                bg: 'bg-warning/10',
                icon: 'text-warning',
                border: 'border-warning/20',
              },
              accent: {
                bg: 'bg-accent/10',
                icon: 'text-accent',
                border: 'border-accent/20',
              },
            };

            const colors = colorClasses[kpi.color as keyof typeof colorClasses];

            return (
              <Card key={index} className={`border ${colors.border} bg-card hover:shadow-lg transition-all`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`${colors.bg} p-3 rounded-lg`}>
                      <Icon className={`h-5 w-5 ${colors.icon}`} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-normal">
                      {kpi.label}
                    </p>
                    
                    <div className="flex items-baseline gap-2">
                      <span className={`text-4xl font-bold ${colors.icon}`}>
                        {kpi.value}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {kpi.unit}
                      </span>
                    </div>

                    {kpi.progress !== undefined && (
                      <div className="pt-2">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              kpi.color === 'primary' ? 'bg-primary' :
                              kpi.color === 'success' ? 'bg-success' :
                              kpi.color === 'warning' ? 'bg-warning' :
                              'bg-accent'
                            }`}
                            style={{ width: `${Math.min(kpi.progress, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {kpi.trend && (
                      <p className="text-xs text-muted-foreground pt-1">
                        {kpi.trend}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
