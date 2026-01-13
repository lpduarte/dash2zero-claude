import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Supplier } from "@/types/supplier";
import { 
  Factory, Users, Maximize2, Euro, TrendingDown, Info, Calculator, Database, 
  Leaf, FileText, Mail, ChevronDown, BookOpen, ArrowRight, Layers, BarChart3, Target
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { IncentiveEmailDialog } from "./IncentiveEmailDialog";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";

interface MetricsOverviewProps {
  suppliers: Supplier[];
  totalCompanies?: number;
}

const getPercentageColor = (percentage: number) => {
  if (percentage >= 75) return { text: "text-green-600", bg: "bg-green-500", bgLight: "bg-green-100", border: "border-green-200" };
  if (percentage >= 50) return { text: "text-lime-600", bg: "bg-lime-500", bgLight: "bg-lime-100", border: "border-lime-200" };
  if (percentage >= 25) return { text: "text-amber-600", bg: "bg-amber-500", bgLight: "bg-amber-100", border: "border-amber-200" };
  return { text: "text-red-600", bg: "bg-red-500", bgLight: "bg-red-100", border: "border-red-200" };
};

export const MetricsOverview = ({ suppliers, totalCompanies }: MetricsOverviewProps) => {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);
  const [isEmissionsExpanded, setIsEmissionsExpanded] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    origem: false,
    ambitos: false,
    metricas: false,
    risco: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

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

  // Cálculos para Pegadas calculadas e Origem dos dados
  const companiesCalculated = suppliers.length;
  const total = totalCompanies || companiesCalculated;
  const percentageCalculated = total > 0 ? Math.round((companiesCalculated / total) * 100) : 0;
  const percentageColors = getPercentageColor(percentageCalculated);
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
      <Card className="p-6 shadow-md">
        <SectionHeader
          icon={BarChart3}
          title="Emissões das empresas do município"
          collapsible
          expanded={isEmissionsExpanded}
          onToggle={() => setIsEmissionsExpanded(!isEmissionsExpanded)}
          actions={
            <button
              type="button"
              onClick={() => setShowMethodologyModal(true)}
              className="p-1.5 bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
              title="Guia metodológico"
            >
              <Info className="h-4 w-4" />
            </button>
          }
        />

        {/* Conteúdo colapsável */}
        <div className={cn(
          "overflow-hidden transition-all duration-200",
          isEmissionsExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="space-y-4">
            {/* Linha 1: 5 KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {metrics.map((metric) => (
                <div key={metric.title} className="p-4 border rounded-lg shadow-sm relative">
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
                </div>
              ))}
            </div>

            {/* Linha 2: Pegadas calculadas + Origem dos dados */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pegadas calculadas */}
              <div className={`p-4 border-2 rounded-lg shadow-sm ${percentageColors.bgLight} ${percentageColors.border}`}>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-medium ${percentageColors.text}`}>Pegadas calculadas</p>
                    <div className={`${percentageColors.bg} text-white p-1.5 rounded`}>
                      <Calculator className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-2xl font-bold ${percentageColors.text}`}>{companiesCalculated} de {total}</p>
                      <p className={`text-xs ${percentageColors.text} mt-1 font-medium`}>{percentageCalculated}% do cluster</p>
                    </div>
                    {companiesMissing > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`${percentageColors.text} border-current hover:bg-white/50 text-xs`}
                        onClick={() => setEmailDialogOpen(true)}
                      >
                        <Mail className="h-3 w-3 mr-1.5" />
                        Incentivar cálculo
                      </Button>
                    )}
                  </div>
                  <div className="mt-1">
                    <Progress 
                      value={percentageCalculated} 
                      className="h-2 bg-white/50"
                      indicatorClassName={percentageColors.bg}
                    />
                  </div>
                </div>
              </div>

              {/* Origem dos dados */}
              <div className="p-4 border rounded-lg shadow-sm">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">Origem dos dados</p>
                    <div className="bg-primary/10 text-primary p-1.5 rounded">
                      <Database className="h-4 w-4" />
                    </div>
                  </div>
                  
                  {/* Barra horizontal combinada */}
                  <div className="flex h-8 rounded-md overflow-hidden mt-2">
                    <div 
                      className="bg-primary flex items-center justify-center text-white text-xs font-medium transition-all"
                      style={{ width: `${get2zeroPercentage}%` }}
                    >
                      {get2zeroPercentage > 15 && `${get2zeroPercentage}%`}
                    </div>
                    <div 
                      className="bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-medium transition-all"
                      style={{ width: `${formularioPercentage}%` }}
                    >
                      {formularioPercentage > 15 && `${formularioPercentage}%`}
                    </div>
                  </div>

                  {/* Legenda */}
                  <div className="flex justify-between text-xs mt-1">
                    <div className="flex items-center gap-1.5">
                      <Leaf className="h-3.5 w-3.5 text-primary" />
                      <span className="text-muted-foreground">Get2Zero Simple</span>
                      <span className="font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">{get2zeroCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{formularioCount}</span>
                      <span className="text-muted-foreground">Formulário</span>
                      <FileText className="h-3.5 w-3.5 text-slate-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Modal Metodológico */}
      <Dialog open={showMethodologyModal} onOpenChange={setShowMethodologyModal}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <DialogTitle>Como funcionam estes dados?</DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* FLUXO VISUAL - Cards em linha */}
            <div className="flex items-center justify-between gap-2">
              {/* Card 1: Recolha */}
              <div className="flex-1 p-4 border rounded-lg text-center bg-muted/30">
                <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <p className="font-medium text-sm">1. Recolha</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Dados das empresas do concelho
                </p>
              </div>
              
              {/* Seta */}
              <div className="flex-shrink-0 text-muted-foreground">
                <ArrowRight className="h-5 w-5" />
              </div>
              
              {/* Card 2: Cálculo */}
              <div className="flex-1 p-4 border rounded-lg text-center bg-muted/30">
                <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Calculator className="h-5 w-5 text-primary" />
                </div>
                <p className="font-medium text-sm">2. Cálculo</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Protocolo GHG (Âmbitos 1, 2, 3)
                </p>
              </div>
              
              {/* Seta */}
              <div className="flex-shrink-0 text-muted-foreground">
                <ArrowRight className="h-5 w-5" />
              </div>
              
              {/* Card 3: Análise */}
              <div className="flex-1 p-4 border rounded-lg text-center bg-muted/30">
                <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <p className="font-medium text-sm">3. Análise</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Comparação com média do setor
                </p>
              </div>
            </div>
            
            {/* SECÇÕES EXPANDÍVEIS */}
            <div className="space-y-2">
              {/* Secção: Origem dos dados */}
              <Collapsible open={expandedSections.origem} onOpenChange={() => toggleSection('origem')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">De onde vêm os dados?</span>
                  </div>
                  <ChevronDown className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    expandedSections.origem && "rotate-180"
                  )} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 border border-t-0 rounded-b-lg space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Leaf className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Get2Zero Simple</p>
                        <p className="text-xs text-muted-foreground">
                          Ferramenta online de cálculo simplificado de pegada de carbono, preenchida pelas empresas.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-100">
                        <FileText className="h-4 w-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Formulário</p>
                        <p className="text-xs text-muted-foreground">
                          Dados recolhidos directamente junto das empresas através de questionário estruturado.
                        </p>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              {/* Secção: Âmbitos de emissões */}
              <Collapsible open={expandedSections.ambitos} onOpenChange={() => toggleSection('ambitos')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Como são calculadas as emissões?</span>
                  </div>
                  <ChevronDown className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    expandedSections.ambitos && "rotate-180"
                  )} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 border border-t-0 rounded-b-lg space-y-4">
                    <p className="text-sm text-muted-foreground">
                      As emissões são calculadas segundo o Protocolo GHG (Greenhouse Gas Protocol), 
                      o padrão internacional mais utilizado para contabilização de gases de efeito estufa.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium flex-shrink-0">
                          1
                        </div>
                        <div>
                          <p className="font-medium text-sm">Âmbito 1 — Emissões directas</p>
                          <p className="text-xs text-muted-foreground">
                            Combustíveis, frota própria, processos industriais
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium flex-shrink-0">
                          2
                        </div>
                        <div>
                          <p className="font-medium text-sm">Âmbito 2 — Energia</p>
                          <p className="text-xs text-muted-foreground">
                            Electricidade e calor adquiridos
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium flex-shrink-0">
                          3
                        </div>
                        <div>
                          <p className="font-medium text-sm">Âmbito 3 — Cadeia de valor</p>
                          <p className="text-xs text-muted-foreground">
                            Deslocações, fornecedores, resíduos, logística
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              {/* Secção: Métricas */}
              <Collapsible open={expandedSections.metricas} onOpenChange={() => toggleSection('metricas')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">O que significa cada métrica?</span>
                  </div>
                  <ChevronDown className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    expandedSections.metricas && "rotate-180"
                  )} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 border border-t-0 rounded-b-lg space-y-3">
                    <div className="flex items-start gap-3">
                      <Factory className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Emissões totais</p>
                        <p className="text-xs text-muted-foreground">
                          Soma de todas as emissões das empresas do concelho, em toneladas de CO₂ equivalente.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingDown className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Potencial de melhoria</p>
                        <p className="text-xs text-muted-foreground">
                          Percentagem de empresas com intensidade acima da média do setor — quanto maior, mais oportunidades de intervenção.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Euro className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Média por faturação</p>
                        <p className="text-xs text-muted-foreground">
                          Emissões por euro de faturação. Permite comparar empresas de diferentes dimensões.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Média por colaborador</p>
                        <p className="text-xs text-muted-foreground">
                          Emissões por colaborador. Útil para setores intensivos em mão-de-obra.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Maximize2 className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Média por área</p>
                        <p className="text-xs text-muted-foreground">
                          Emissões por metro quadrado de instalações. Relevante para comércio e serviços.
                        </p>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              {/* Secção: Análise de risco */}
              <Collapsible open={expandedSections.risco} onOpenChange={() => toggleSection('risco')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Como funciona a análise de risco?</span>
                  </div>
                  <ChevronDown className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    expandedSections.risco && "rotate-180"
                  )} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 border border-t-0 rounded-b-lg space-y-4">
                    <p className="text-sm text-muted-foreground">
                      O risco é calculado comparando a intensidade de carbono de cada empresa com a média do seu setor de atividade.
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="text-center p-2 rounded-lg bg-green-100 border border-green-200">
                        <div className="w-3 h-3 rounded-full bg-green-500 mx-auto mb-1" />
                        <p className="text-xs font-medium text-green-700">Baixo</p>
                        <p className="text-[10px] text-green-600">Abaixo da média</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-amber-100 border border-amber-200">
                        <div className="w-3 h-3 rounded-full bg-amber-500 mx-auto mb-1" />
                        <p className="text-xs font-medium text-amber-700">Médio</p>
                        <p className="text-[10px] text-amber-600">1-50% acima</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-orange-100 border border-orange-200">
                        <div className="w-3 h-3 rounded-full bg-orange-500 mx-auto mb-1" />
                        <p className="text-xs font-medium text-orange-700">Alto</p>
                        <p className="text-[10px] text-orange-600">50-100% acima</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-red-100 border border-red-200">
                        <div className="w-3 h-3 rounded-full bg-red-500 mx-auto mb-1" />
                        <p className="text-xs font-medium text-red-700">Crítico</p>
                        <p className="text-[10px] text-red-600">+100% acima</p>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowMethodologyModal(false)}>
              Entendido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <IncentiveEmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        companiesMissing={companiesMissing}
      />
    </TooltipProvider>
  );
};