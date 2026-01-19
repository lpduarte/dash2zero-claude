import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, Database, Calculator, BarChart3, Target,
  FileText, ArrowRight, Layers, Leaf, Factory, TrendingDown, 
  Euro, Users, Maximize2, BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { riskColors, collapsible as collapsibleStyles } from "@/lib/styles";

interface MethodologyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MethodologyModal = ({ open, onOpenChange }: MethodologyModalProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    origem: false,
    ambitos: false,
    metricas: false,
    risco: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              <p className="font-normal text-sm">1. Recolha</p>
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
              <p className="font-normal text-sm">2. Cálculo</p>
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
              <p className="font-normal text-sm">3. Análise</p>
              <p className="text-xs text-muted-foreground mt-1">
                Comparação com média do setor
              </p>
            </div>
          </div>
          
          {/* SECÇÕES EXPANDÍVEIS */}
          <div className="space-y-2">
            {/* Secção: Origem dos dados */}
            <Collapsible open={expandedSections.origem} onOpenChange={() => toggleSection('origem')}>
              <div className="border rounded-lg overflow-hidden">
                <CollapsibleTrigger className={collapsibleStyles.triggerCompact}>
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-primary" />
                    <span className="font-normal text-sm">De onde vêm os dados?</span>
                  </div>
                  <ChevronDown className={cn(
                    collapsibleStyles.icon, "text-muted-foreground",
                    expandedSections.origem && collapsibleStyles.iconExpanded
                  )} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 border-t space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Leaf className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-normal text-sm">Get2Zero Simple</p>
                        <p className="text-xs text-muted-foreground">
                          Ferramenta online de cálculo simplificado de pegada de carbono, preenchida pelas empresas.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-normal text-sm">Formulário</p>
                        <p className="text-xs text-muted-foreground">
                          Dados recolhidos directamente junto das empresas através de questionário estruturado.
                        </p>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
            
            {/* Secção: Âmbitos de emissões */}
            <Collapsible open={expandedSections.ambitos} onOpenChange={() => toggleSection('ambitos')}>
              <div className="border rounded-lg overflow-hidden">
                <CollapsibleTrigger className={collapsibleStyles.triggerCompact}>
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    <span className="font-normal text-sm">Como são calculadas as emissões?</span>
                  </div>
                  <ChevronDown className={cn(
                    collapsibleStyles.icon, "text-muted-foreground",
                    expandedSections.ambitos && collapsibleStyles.iconExpanded
                  )} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 border-t space-y-4">
                    <p className="text-sm text-muted-foreground">
                      As emissões são calculadas segundo o Protocolo GHG (Greenhouse Gas Protocol), 
                      o padrão internacional mais utilizado para contabilização de gases de efeito estufa.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-normal flex-shrink-0">
                          1
                        </div>
                        <div>
                          <p className="font-normal text-sm">Âmbito 1 — Emissões directas</p>
                          <p className="text-xs text-muted-foreground">
                            Combustíveis, frota própria, processos industriais
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-normal flex-shrink-0">
                          2
                        </div>
                        <div>
                          <p className="font-normal text-sm">Âmbito 2 — Energia</p>
                          <p className="text-xs text-muted-foreground">
                            Electricidade e calor adquiridos
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-normal flex-shrink-0">
                          3
                        </div>
                        <div>
                          <p className="font-normal text-sm">Âmbito 3 — Cadeia de valor</p>
                          <p className="text-xs text-muted-foreground">
                            Deslocações, fornecedores, resíduos, logística
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
            
            {/* Secção: Métricas */}
            <Collapsible open={expandedSections.metricas} onOpenChange={() => toggleSection('metricas')}>
              <div className="border rounded-lg overflow-hidden">
                <CollapsibleTrigger className={collapsibleStyles.triggerCompact}>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <span className="font-normal text-sm">O que significa cada métrica?</span>
                  </div>
                  <ChevronDown className={cn(
                    collapsibleStyles.icon, "text-muted-foreground",
                    expandedSections.metricas && collapsibleStyles.iconExpanded
                  )} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 border-t space-y-3">
                    <div className="flex items-start gap-3">
                      <Factory className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="font-normal text-sm">Emissões totais</p>
                        <p className="text-xs text-muted-foreground">
                          Soma de todas as emissões das empresas do concelho, em toneladas de CO₂ equivalente.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingDown className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="font-normal text-sm">Potencial de melhoria</p>
                        <p className="text-xs text-muted-foreground">
                          Percentagem de empresas com intensidade acima da média do setor — quanto maior, mais oportunidades de intervenção.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Euro className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="font-normal text-sm">Média por faturação</p>
                        <p className="text-xs text-muted-foreground">
                          Emissões por euro de faturação. Permite comparar empresas de diferentes dimensões.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="font-normal text-sm">Média por colaborador</p>
                        <p className="text-xs text-muted-foreground">
                          Emissões por colaborador. Útil para setores intensivos em mão-de-obra.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Maximize2 className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="font-normal text-sm">Média por área</p>
                        <p className="text-xs text-muted-foreground">
                          Emissões por metro quadrado de instalações. Relevante para comércio e serviços.
                        </p>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
            
            {/* Secção: Análise de risco */}
            <Collapsible open={expandedSections.risco} onOpenChange={() => toggleSection('risco')}>
              <div className="border rounded-lg overflow-hidden">
                <CollapsibleTrigger className={collapsibleStyles.triggerCompact}>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="font-normal text-sm">Como funciona a análise de risco?</span>
                  </div>
                  <ChevronDown className={cn(
                    collapsibleStyles.icon, "text-muted-foreground",
                    expandedSections.risco && collapsibleStyles.iconExpanded
                  )} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 border-t space-y-4">
                    <p className="text-sm text-muted-foreground">
                      O risco é calculado comparando a intensidade de carbono de cada empresa com a média do seu setor de atividade.
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      <div className={`text-center p-2 rounded-lg ${riskColors.baixo.bg} border ${riskColors.baixo.border}`}>
                        <div className="w-3 h-3 rounded-full bg-success mx-auto mb-1" />
                        <p className={`text-xs font-normal ${riskColors.baixo.text}`}>Baixo</p>
                        <p className={`text-[12px] ${riskColors.baixo.text}`}>Abaixo da média</p>
                      </div>
                      <div className={`text-center p-2 rounded-lg ${riskColors.medio.bg} border ${riskColors.medio.border}`}>
                        <div className="w-3 h-3 rounded-full bg-warning mx-auto mb-1" />
                        <p className={`text-xs font-normal ${riskColors.medio.text}`}>Médio</p>
                        <p className={`text-[12px] ${riskColors.medio.text}`}>1-50% acima</p>
                      </div>
                      <div className={`text-center p-2 rounded-lg ${riskColors.alto.bg} border ${riskColors.alto.border}`}>
                        <div className="w-3 h-3 rounded-full bg-danger mx-auto mb-1" />
                        <p className={`text-xs font-normal ${riskColors.alto.text}`}>Alto</p>
                        <p className={`text-[12px] ${riskColors.alto.text}`}>≥50% acima</p>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Entendido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
