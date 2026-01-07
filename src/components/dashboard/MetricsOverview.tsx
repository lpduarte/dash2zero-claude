import { Card } from "@/components/ui/card";
import { Supplier } from "@/types/supplier";
import { Factory, Users, Maximize2, Euro, TrendingUp, TrendingDown, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricsOverviewProps {
  suppliers: Supplier[];
}

export const MetricsOverview = ({ suppliers }: MetricsOverviewProps) => {
  // Soma total das emissões de todas as empresas
  const totalEmissions = suppliers.reduce((acc, s) => acc + s.totalEmissions, 0);
  const avgEmissionsPerEmployee = suppliers.reduce((acc, s) => acc + s.emissionsPerEmployee, 0) / suppliers.length;
  const avgEmissionsPerArea = suppliers.reduce((acc, s) => acc + s.emissionsPerArea, 0) / suppliers.length;
  const avgEmissionsPerRevenue = suppliers.reduce((acc, s) => acc + s.emissionsPerRevenue, 0) / suppliers.length;

  // Cálculo do potencial de melhoria baseado apenas em emissões acima da média
  const avgEmissions = totalEmissions / suppliers.length;
  const criticalSuppliers = suppliers.filter(s => 
    s.totalEmissions > avgEmissions * 1.2
  );
  const percentageCritical = (criticalSuppliers.length / suppliers.length) * 100;

  // Calcular emissões potenciais se trocar para alternativas
  const calculatePotentialEmissions = () => {
    let potentialTotal = totalEmissions;
    
    criticalSuppliers.forEach(critical => {
      // Encontrar a melhor alternativa no mesmo setor (ou subsector)
      const alternatives = suppliers.filter(s => 
        s.id !== critical.id && 
        s.sector === critical.sector &&
        s.totalEmissions < critical.totalEmissions
      );
      
      if (alternatives.length > 0) {
        // Ordenar por menores emissões
        const bestAlternative = alternatives.sort((a, b) => a.totalEmissions - b.totalEmissions)[0];
        // Subtrair a diferença
        potentialTotal -= (critical.totalEmissions - bestAlternative.totalEmissions);
      }
    });
    
    return potentialTotal;
  };

  const potentialEmissions = calculatePotentialEmissions();
  const emissionsSavings = totalEmissions - potentialEmissions;
  const savingsPercentage = totalEmissions > 0 ? ((emissionsSavings / totalEmissions) * 100) : 0;
  
  // Determinar nível de potencial de melhoria
  const getImprovementPotential = () => {
    if (percentageCritical > 30) return { level: "Alto", color: "text-danger", bgColor: "bg-danger/10", icon: TrendingDown };
    if (percentageCritical > 15) return { level: "Médio", color: "text-warning", bgColor: "bg-warning/10", icon: TrendingDown };
    return { level: "Baixo", color: "text-success", bgColor: "bg-success/10", icon: TrendingDown };
  };
  
  const improvementPotential = getImprovementPotential();

  const metrics = [
    {
      title: "Emissões totais",
      value: Math.round(totalEmissions).toLocaleString('pt-PT'),
      unit: "t CO₂e",
      icon: Factory,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Potencial de melhoria",
      value: improvementPotential.level,
      unit: `${percentageCritical.toFixed(0)}% das empresas`,
      icon: improvementPotential.icon,
      color: improvementPotential.color,
      bgColor: improvementPotential.bgColor,
      isImprovement: true,
    },
    {
      title: "Média por faturação",
      value: avgEmissionsPerRevenue.toFixed(1),
      unit: "t CO₂e/€",
      icon: Euro,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Média por colaborador",
      value: avgEmissionsPerEmployee.toFixed(2),
      unit: "t CO₂e/colab",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Média por área",
      value: avgEmissionsPerArea.toFixed(3),
      unit: "t CO₂e/m²",
      icon: Maximize2,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <TooltipProvider delayDuration={100}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="p-4 shadow-md hover:shadow-lg transition-shadow relative">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">{metric.title}</p>
                <div className={`${metric.bgColor} ${metric.color} p-1.5 rounded`}>
                  <metric.icon className="h-4 w-4" />
                </div>
              </div>
              <div>
                <p className={`text-2xl font-bold ${metric.isImprovement ? metric.color : 'text-card-foreground'}`}>
                  {metric.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{metric.unit}</p>
              </div>
            </div>
            {metric.isImprovement && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="absolute bottom-4 right-4 bg-muted text-muted-foreground p-1.5 rounded transition-opacity hover:opacity-80">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="p-0 w-56">
                  <div className="p-3 space-y-3">
                    <p className="text-xs font-medium text-muted-foreground">Cenário de substituição</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Atual</span>
                        <span className="text-sm font-semibold">{Math.round(totalEmissions).toLocaleString('pt-PT')} t CO₂e</span>
                      </div>
                      
                      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-primary/30 rounded-full"
                          style={{ width: '100%' }}
                        />
                        <div 
                          className="absolute inset-y-0 left-0 bg-success rounded-full transition-all"
                          style={{ width: `${100 - savingsPercentage}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Potencial</span>
                        <span className="text-sm font-semibold text-success">{Math.round(potentialEmissions).toLocaleString('pt-PT')} t CO₂e</span>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">Redução</span>
                        <span className="text-sm font-bold text-success">-{savingsPercentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
};