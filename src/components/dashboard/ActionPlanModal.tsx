import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Supplier } from "@/types/supplier";
import { sectorLabels } from "./SupplierLabel";
import { 
  FileText, 
  ArrowRight, 
  TrendingDown, 
  Euro, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Building2,
  Leaf
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ActionPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suppliers: Supplier[];
}

interface SubstitutionPlan {
  critical: Supplier;
  alternative: Supplier | null;
  emissionsSavings: number;
  savingsPercentage: number;
  costDifference: number;
}

export const ActionPlanModal = ({ open, onOpenChange, suppliers }: ActionPlanModalProps) => {
  // Calculate average emissions
  const avgEmissions = suppliers.reduce((sum, s) => sum + s.totalEmissions, 0) / suppliers.length;
  
  // Get all critical suppliers
  const criticalSuppliers = suppliers
    .filter(s => s.totalEmissions > avgEmissions * 1.2)
    .sort((a, b) => b.totalEmissions - a.totalEmissions);

  // Find best alternative for each critical supplier
  const findBestAlternative = (criticalSupplier: Supplier): Supplier | null => {
    if (criticalSupplier.subsector) {
      const subsectorAlternatives = suppliers
        .filter(s => s.subsector === criticalSupplier.subsector && s.id !== criticalSupplier.id && s.totalEmissions < criticalSupplier.totalEmissions)
        .sort((a, b) => a.totalEmissions - b.totalEmissions);
      if (subsectorAlternatives.length > 0) return subsectorAlternatives[0];
    }
    const sectorAlternatives = suppliers
      .filter(s => s.sector === criticalSupplier.sector && s.id !== criticalSupplier.id && s.totalEmissions < criticalSupplier.totalEmissions)
      .sort((a, b) => a.totalEmissions - b.totalEmissions);
    return sectorAlternatives[0] || null;
  };

  // Build substitution plans
  const substitutionPlans: SubstitutionPlan[] = criticalSuppliers.map(critical => {
    const alternative = findBestAlternative(critical);
    const emissionsSavings = alternative ? critical.totalEmissions - alternative.totalEmissions : 0;
    const savingsPercentage = alternative ? (emissionsSavings / critical.totalEmissions) * 100 : 0;
    const costDifference = alternative ? (alternative.revenue - critical.revenue) : 0;
    return { critical, alternative, emissionsSavings, savingsPercentage, costDifference };
  });

  // Calculate global metrics
  const totalCurrentEmissions = criticalSuppliers.reduce((sum, s) => sum + s.totalEmissions, 0);
  const totalPotentialSavings = substitutionPlans.reduce((sum, p) => sum + p.emissionsSavings, 0);
  const substitutionsWithAlternative = substitutionPlans.filter(p => p.alternative !== null);
  const totalCostImpact = substitutionPlans.reduce((sum, p) => sum + p.costDifference, 0);
  const globalSavingsPercentage = totalCurrentEmissions > 0 ? (totalPotentialSavings / totalCurrentEmissions) * 100 : 0;

  // Implementation steps
  const implementationSteps = [
    {
      phase: "Fase 1 - Análise",
      duration: "1-2 semanas",
      tasks: [
        "Validar dados de emissões dos fornecedores críticos",
        "Contactar alternativas identificadas para confirmar disponibilidade",
        "Analisar impacto operacional de cada substituição"
      ]
    },
    {
      phase: "Fase 2 - Negociação",
      duration: "2-4 semanas",
      tasks: [
        "Solicitar propostas comerciais às alternativas",
        "Negociar condições contratuais",
        "Avaliar capacidade de fornecimento"
      ]
    },
    {
      phase: "Fase 3 - Transição",
      duration: "4-8 semanas",
      tasks: [
        "Comunicar decisão aos fornecedores atuais",
        "Estabelecer período de transição gradual",
        "Monitorizar qualidade e prazos durante transição"
      ]
    },
    {
      phase: "Fase 4 - Consolidação",
      duration: "2-4 semanas",
      tasks: [
        "Verificar cumprimento dos novos acordos",
        "Atualizar registos de pegada carbónica",
        "Documentar lições aprendidas"
      ]
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between pr-12">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-primary" />
              Plano de Ação - Substituição de Fornecedores
            </DialogTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar PDF
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-100px)]">
          <div className="p-6 space-y-6">
            {/* Global Metrics Summary */}
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-danger/10 border border-danger/30">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-danger" />
                  <span className="text-xs text-muted-foreground">Fornecedores críticos</span>
                </div>
                <p className="text-2xl font-bold text-danger">{criticalSuppliers.length}</p>
              </div>

              <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-xs text-muted-foreground">Com alternativa</span>
                </div>
                <p className="text-2xl font-bold text-success">{substitutionsWithAlternative.length}</p>
              </div>

              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Poupança potencial</span>
                </div>
                <p className="text-2xl font-bold text-primary">{totalPotentialSavings.toFixed(0)} <span className="text-sm font-normal">t CO₂e</span></p>
                <p className="text-xs text-muted-foreground">-{globalSavingsPercentage.toFixed(0)}% das emissões críticas</p>
              </div>

              <div className="p-4 rounded-lg bg-muted border">
                <div className="flex items-center gap-2 mb-2">
                  <Euro className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Impacto financeiro</span>
                </div>
                <p className={`text-2xl font-bold ${totalCostImpact >= 0 ? 'text-success' : 'text-warning'}`}>
                  {totalCostImpact >= 0 ? '+' : ''}{(totalCostImpact / 1000000).toFixed(1)}M€
                </p>
                <p className="text-xs text-muted-foreground">em volume de negócios</p>
              </div>
            </div>

            <Separator />

            {/* Substitution List */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Lista de Substituições Recomendadas
              </h3>
              
              <div className="space-y-3">
                {substitutionPlans.map((plan, index) => (
                  <div 
                    key={plan.critical.id} 
                    className={`p-4 rounded-lg border ${plan.alternative ? 'bg-card' : 'bg-muted/30 border-dashed'}`}
                  >
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="w-8 h-8 flex items-center justify-center shrink-0">
                        {index + 1}
                      </Badge>

                      {/* Current supplier */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{plan.critical.name}</p>
                        <p className="text-xs text-muted-foreground">{sectorLabels[plan.critical.sector] || plan.critical.sector}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="destructive" className="text-xs">
                            {plan.critical.totalEmissions.toFixed(0)} t CO₂e
                          </Badge>
                        </div>
                      </div>

                      <ArrowRight className={`h-5 w-5 shrink-0 ${plan.alternative ? 'text-success' : 'text-muted-foreground/30'}`} />

                      {/* Alternative supplier */}
                      {plan.alternative ? (
                        <div className="flex-1 min-w-0 bg-success/10 rounded-lg p-3">
                          <p className="font-medium text-sm truncate text-success">{plan.alternative.name}</p>
                          <p className="text-xs text-muted-foreground">{sectorLabels[plan.alternative.sector] || plan.alternative.sector}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-success text-xs">
                              {plan.alternative.totalEmissions.toFixed(0)} t CO₂e
                            </Badge>
                            <Badge variant="outline" className="text-xs border-success text-success">
                              -{plan.savingsPercentage.toFixed(0)}%
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 min-w-0 p-3 text-center">
                          <p className="text-xs text-muted-foreground">Sem alternativa disponível</p>
                          <p className="text-xs text-muted-foreground/70 mt-1">Trabalhar diretamente com fornecedor</p>
                        </div>
                      )}

                      {/* Savings column */}
                      <div className="text-right shrink-0 w-24">
                        {plan.alternative && (
                          <>
                            <p className="text-sm font-bold text-success">-{plan.emissionsSavings.toFixed(0)}</p>
                            <p className="text-xs text-muted-foreground">t CO₂e/ano</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Implementation Steps */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Passos de Implementação
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {implementationSteps.map((step, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-sm">{step.phase}</h4>
                      <Badge variant="outline" className="text-xs">{step.duration}</Badge>
                    </div>
                    <ul className="space-y-2">
                      {step.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Financial Impact Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Euro className="h-5 w-5" />
                Análise de Impacto Financeiro
              </h3>

              <div className="p-4 rounded-lg border bg-card">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Volume atual (críticos)</p>
                    <p className="text-lg font-bold">
                      {(criticalSuppliers.reduce((sum, s) => sum + s.revenue, 0) / 1000000).toFixed(1)}M€
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Volume com alternativas</p>
                    <p className="text-lg font-bold">
                      {(substitutionPlans.reduce((sum, p) => sum + (p.alternative?.revenue || p.critical.revenue), 0) / 1000000).toFixed(1)}M€
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Diferença</p>
                    <p className={`text-lg font-bold ${totalCostImpact >= 0 ? 'text-success' : 'text-warning'}`}>
                      {totalCostImpact >= 0 ? '+' : ''}{(totalCostImpact / 1000000).toFixed(1)}M€
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded bg-muted/50 text-xs text-muted-foreground">
                  <strong>Nota:</strong> Os valores financeiros são baseados no volume de negócios atual de cada fornecedor. 
                  Podem existir variações dependendo das condições comerciais negociadas.
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
