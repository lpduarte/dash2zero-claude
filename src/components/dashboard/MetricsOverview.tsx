import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Supplier } from "@/types/supplier";
import { 
  Factory, Users, Maximize2, Euro, TrendingDown, Info, Calculator, Database, 
  Leaf, FileText, Mail, BarChart3
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MethodologyModal } from "./methodology";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import { KPICard } from "@/components/ui/kpi-card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { useUser } from "@/contexts/UserContext";
import { getPercentageColors, elements } from "@/lib/styles";
import { formatNumber, formatPercentage } from "@/lib/formatters";

interface MetricsOverviewProps {
  suppliers: Supplier[];
  totalCompanies?: number;
}

// Usar getPercentageColors de lib/styles.ts (já importado)

export const MetricsOverview = ({ suppliers, totalCompanies }: MetricsOverviewProps) => {
  const navigate = useNavigate();
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);
  const [isEmissionsExpanded, setIsEmissionsExpanded] = useState(true);
  const { isMunicipio } = useUser();

  // Soma total das emissões de todas as empresas
  const totalEmissions = suppliers.reduce((acc, s) => acc + s.totalEmissions, 0);
  const avgEmissionsPerEmployee = suppliers.reduce((acc, s) => acc + s.emissionsPerEmployee, 0) / suppliers.length;
  const avgEmissionsPerArea = suppliers.reduce((acc, s) => acc + s.emissionsPerArea, 0) / suppliers.length;
  const avgEmissionsPerRevenue = suppliers.reduce((acc, s) => acc + s.emissionsPerRevenue, 0) / suppliers.length;

  // ============================================================
  // CÁLCULO DO POTENCIAL DE MELHORIA
  // Lógica diferenciada para Empresa vs Município
  // ============================================================

  // Calcular média de emissões por setor
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

  // EMPRESA: Potencial de substituição
  // Se trocar fornecedores com altas emissões por melhores alternativas do mesmo setor
  const calculateEmpresaPotential = () => {
    let potentialTotal = totalEmissions;

    suppliers.forEach(supplier => {
      const alternatives = suppliers.filter(s =>
        s.id !== supplier.id &&
        s.sector === supplier.sector &&
        s.totalEmissions < supplier.totalEmissions
      );

      if (alternatives.length > 0) {
        const bestAlternative = alternatives.sort((a, b) => a.totalEmissions - b.totalEmissions)[0];
        potentialTotal -= (supplier.totalEmissions - bestAlternative.totalEmissions);
      }
    });

    return potentialTotal;
  };

  // MUNICÍPIO: Potencial de melhoria
  // Se empresas acima da média setorial chegassem à média do seu setor
  const calculateMunicipioPotential = () => {
    let potentialTotal = totalEmissions;

    suppliers.forEach(supplier => {
      const sectorAvg = getSectorAverage(supplier.sector);
      if (supplier.totalEmissions > sectorAvg) {
        // Redução potencial: diferença até à média do setor
        potentialTotal -= (supplier.totalEmissions - sectorAvg);
      }
    });

    return potentialTotal;
  };

  // Selecionar cálculo baseado no tipo de utilizador
  const potentialEmissions = isMunicipio
    ? calculateMunicipioPotential()
    : calculateEmpresaPotential();

  const emissionsSavings = totalEmissions - potentialEmissions;
  const savingsPercentage = totalEmissions > 0 ? ((emissionsSavings / totalEmissions) * 100) : 0;

  // Determinar nível de potencial de melhoria baseado na % de redução possível
  const getImprovementPotential = () => {
    if (savingsPercentage > 20) return { level: "Alto", color: "text-danger", bgColor: "bg-danger/10", barColor: "bg-danger", icon: TrendingDown };
    if (savingsPercentage > 10) return { level: "Médio", color: "text-warning", bgColor: "bg-warning/10", barColor: "bg-warning", icon: TrendingDown };
    return { level: "Baixo", color: "text-success", bgColor: "bg-success/10", barColor: "bg-success", icon: TrendingDown };
  };

  const improvementPotential = getImprovementPotential();

  // Cálculos para Pegadas calculadas e Origem dos dados
  const companiesCalculated = suppliers.length;
  const total = totalCompanies || companiesCalculated;
  const percentageCalculated = total > 0 ? Math.round((companiesCalculated / total) * 100) : 0;
  const percentageColors = getPercentageColors(percentageCalculated);
  const companiesMissing = total - companiesCalculated;

  const formularioCount = suppliers.filter(s => s.dataSource === "formulario").length;
  const get2zeroCount = suppliers.filter(s => s.dataSource === "get2zero").length;
  const formularioPercentage = companiesCalculated > 0 ? Math.round((formularioCount / companiesCalculated) * 100) : 0;
  const get2zeroPercentage = companiesCalculated > 0 ? Math.round((get2zeroCount / companiesCalculated) * 100) : 0;

  const metrics = [
    {
      title: "Emissões totais",
      value: Math.round(totalEmissions).toLocaleString('pt-PT'),
      unit: "t CO₂e",
      icon: Factory,
      iconColor: "text-primary",
      iconBgColor: "bg-primary/10",
    },
    {
      title: "Potencial de melhoria",
      value: improvementPotential.level,
      unit: `redução potencial de ${formatPercentage(savingsPercentage, 0)}`,
      icon: improvementPotential.icon,
      iconColor: improvementPotential.color,
      iconBgColor: improvementPotential.bgColor,
      valueColor: improvementPotential.color,
      isImprovement: true,
    },
    {
      title: "Média por faturação",
      value: formatNumber(avgEmissionsPerRevenue, 1),
      unit: "t CO₂e/€",
      icon: Euro,
      iconColor: "text-primary",
      iconBgColor: "bg-primary/10",
    },
    {
      title: "Média por colaborador",
      value: formatNumber(avgEmissionsPerEmployee, 2),
      unit: "t CO₂e/colab",
      icon: Users,
      iconColor: "text-primary",
      iconBgColor: "bg-primary/10",
    },
    {
      title: "Média por área",
      value: formatNumber(avgEmissionsPerArea, 3),
      unit: "t CO₂e/m²",
      icon: Maximize2,
      iconColor: "text-primary",
      iconBgColor: "bg-primary/10",
    },
  ];

  return (
    <TooltipProvider delayDuration={100}>
      <Collapsible open={isEmissionsExpanded} onOpenChange={setIsEmissionsExpanded}>
        <Card data-tour="metrics-overview" className="shadow-md">
          <CardHeader className={cn("transition-all duration-[400ms]", isEmissionsExpanded ? "pb-3" : "pb-6")}>
            <SectionHeader
              icon={BarChart3}
              title={isMunicipio ? "Emissões das empresas do município" : "Emissões das empresas"}
              collapsible
              expanded={isEmissionsExpanded}
              onToggle={() => setIsEmissionsExpanded(!isEmissionsExpanded)}
              actions={
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => setShowMethodologyModal(true)}
                >
                  <Info className="h-3 w-3" />
                  Como funcionam estes dados?
                </Button>
              }
            />
          </CardHeader>

          <CollapsibleContent>
            <CardContent>
              <div className="space-y-4">
                {/* Linha 1: 5 KPIs usando KPICard */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {metrics.map((metric) => (
                <KPICard
                  key={metric.title}
                  title={metric.title}
                  value={metric.value}
                  unit={metric.unit}
                  icon={metric.icon}
                  iconColor={metric.iconColor}
                  iconBgColor={metric.iconBgColor}
                  valueColor={metric.valueColor}
                  extra={metric.isImprovement ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute bottom-3 right-3 h-auto p-1.5"
                        >
                          <Info className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="p-0 w-72">
                        <div className="p-3 space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs ${improvementPotential.color}`}>Atual</span>
                              <span className={`text-sm font-bold ${improvementPotential.color}`}>{Math.round(totalEmissions).toLocaleString('pt-PT')} t CO₂e</span>
                            </div>

                            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`absolute inset-y-0 left-0 ${improvementPotential.barColor} rounded-full`}
                                style={{ width: '100%' }}
                              />
                              <div
                                className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all"
                                style={{ width: `${100 - savingsPercentage}%` }}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-xs text-primary">Potencial</span>
                              <span className="text-sm font-bold text-primary">
                                {Math.round(potentialEmissions).toLocaleString('pt-PT')} t CO₂e
                                <span className="text-xs font-normal text-primary ml-1">(-{formatPercentage(savingsPercentage, 1)})</span>
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {isMunicipio
                              ? "Potencial calculado se as empresas acima da média setorial implementassem medidas para atingir essa média."
                              : "Potencial calculado se substituísse fornecedores por alternativas com menor pegada no mesmo setor."
                            }
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ) : undefined}
                />
              ))}
            </div>

            {/* Linha 2: Pegadas calculadas + Origem dos dados */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pegadas calculadas */}
              <div className={`p-4 border-2 rounded-lg shadow-md ${percentageColors.bgLight} ${percentageColors.border}`}>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-normal ${percentageColors.text}`}>Pegadas calculadas</p>
                    <div className={`${percentageColors.bg} text-white p-1.5 rounded`}>
                      <Calculator className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-2xl font-bold ${percentageColors.text}`}>{companiesCalculated} de {total}</p>
                      <p className={`text-xs ${percentageColors.text} mt-1 font-normal`}>{percentageCalculated}% do cluster</p>
                    </div>
                    {companiesMissing > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${percentageColors.text} border-current ${percentageColors.hoverBg} text-xs`}
                        onClick={() => navigate('/incentivo')}
                      >
                        <Mail className="h-3 w-3 mr-1.5" />
                        Incentivar cálculo
                      </Button>
                    )}
                  </div>
                  <div className="mt-1">
                    <Progress
                      value={percentageCalculated}
                      className={`h-2 ${percentageColors.bg}/25`}
                      indicatorClassName={percentageColors.bg}
                    />
                  </div>
                </div>
              </div>

              {/* Origem dos dados */}
              <div className={elements.kpiCard}>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-normal text-muted-foreground">Origem dos dados</p>
                    <div className="bg-primary/10 text-primary p-1.5 rounded">
                      <Database className="h-4 w-4" />
                    </div>
                  </div>
                  
                  {/* Barra horizontal combinada */}
                  <div className="flex h-8 rounded-md overflow-hidden mt-2">
                    <div 
                      className="bg-primary flex items-center justify-center text-white text-xs font-normal transition-all"
                      style={{ width: `${get2zeroPercentage}%` }}
                    >
                      {get2zeroPercentage > 15 && `${get2zeroPercentage}%`}
                    </div>
                    <div 
                      className="bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-normal transition-all"
                      style={{ width: `${formularioPercentage}%` }}
                    >
                      {formularioPercentage > 15 && `${formularioPercentage}%`}
                    </div>
                  </div>

                  {/* Legenda */}
                  <div className="flex justify-between text-xs mt-1">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-3.5 w-3.5 text-primary" />
                      <span className="text-muted-foreground">Get2Zero Simple</span>
                      <span className="font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">{get2zeroCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{formularioCount}</span>
                      <span className="text-muted-foreground">Formulário</span>
                      <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Modal Metodológico - Componente separado */}
      <MethodologyModal 
        open={showMethodologyModal} 
        onOpenChange={setShowMethodologyModal} 
      />

    </TooltipProvider>
  );
};
