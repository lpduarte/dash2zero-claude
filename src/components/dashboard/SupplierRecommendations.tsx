import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Supplier } from "@/types/supplier";
import { AlertTriangle, ArrowRight, TrendingDown, DollarSign, Award, CheckCircle, Zap } from "lucide-react";
import { useState } from "react";
import { formatNumber, formatPercentage } from "@/lib/formatters";

interface SupplierRecommendationsProps {
  suppliers: Supplier[];
}

interface Recommendation {
  critical: Supplier;
  alternative: Supplier;
  emissionsSavings: number;
  emissionsSavingsPercent: number;
  costDifference: number;
  costDifferencePercent: number;
  feCurrent: number;
  feAlternative: number;
  feImprovement: number;
  reason: string;
  benefits: string[];
  risks: string[];
}

export const SupplierRecommendations = ({ suppliers }: SupplierRecommendationsProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Identify critical suppliers (high emissions, low performance)
  const avgEmissions = suppliers.reduce((sum, s) => sum + s.totalEmissions, 0) / suppliers.length;
  const criticalSuppliers = suppliers.filter(s => 
    s.totalEmissions > avgEmissions * 1.2 || 
    s.rating === 'D' || 
    s.rating === 'E' ||
    !s.hasSBTi
  );

  // Generate recommendations
  const recommendations: Recommendation[] = [];

  criticalSuppliers.forEach(critical => {
    // Find alternatives in the same sector with better performance
    const alternatives = suppliers.filter(alt => 
      alt.sector === critical.sector &&
      alt.id !== critical.id &&
      alt.totalEmissions < critical.totalEmissions &&
      (alt.rating < critical.rating || alt.hasSBTi)
    ).sort((a, b) => a.totalEmissions - b.totalEmissions);

    if (alternatives.length > 0) {
      const alternative = alternatives[0]; // Best alternative
      
      const emissionsSavings = critical.totalEmissions - alternative.totalEmissions;
      const emissionsSavingsPercent = (emissionsSavings / critical.totalEmissions) * 100;
      
      const costDifference = critical.revenue - alternative.revenue;
      const costDifferencePercent = (costDifference / critical.revenue) * 100;
      
      const feCurrent = critical.emissionsPerRevenue;
      const feAlternative = alternative.emissionsPerRevenue;
      const feImprovement = ((feCurrent - feAlternative) / feCurrent) * 100;

      let reason = "";
      if (critical.totalEmissions > avgEmissions * 1.5) {
        reason = "Fornecedor com emissões 50% acima da média do grupo";
      } else if (critical.rating === 'D' || critical.rating === 'E') {
        reason = "Rating ESG baixo, indicando riscos de sustentabilidade";
      } else if (!critical.hasSBTi && alternative.hasSBTi) {
        reason = "Alternativa possui compromisso SBTi validado";
      } else {
        reason = "Oportunidade de redução significativa de emissões";
      }

      const benefits: string[] = [];
      if (emissionsSavingsPercent > 30) {
        benefits.push(`Redução de ${formatPercentage(emissionsSavingsPercent, 0)} nas emissões`);
      }
      if (alternative.hasSBTi && !critical.hasSBTi) {
        benefits.push("Fornecedor alternativo com compromisso SBTi validado");
      }
      if (alternative.certifications.length > critical.certifications.length) {
        benefits.push(`${alternative.certifications.length - critical.certifications.length} certificações adicionais`);
      }
      if (feImprovement > 20) {
        benefits.push(`Fator de Emissão ${formatPercentage(feImprovement, 0)} mais baixo`);
      }

      const risks: string[] = [];
      if (alternative.revenue < critical.revenue * 0.5) {
        risks.push("Capacidade financeira significativamente menor");
      }
      if (alternative.employees < critical.employees * 0.5) {
        risks.push("Dimensão da equipa menor, possível impacto na capacidade");
      }

      recommendations.push({
        critical,
        alternative,
        emissionsSavings,
        emissionsSavingsPercent,
        costDifference,
        costDifferencePercent,
        feCurrent,
        feAlternative,
        feImprovement,
        reason,
        benefits,
        risks,
      });
    }
  });

  // Sort recommendations by emissions savings potential
  recommendations.sort((a, b) => b.emissionsSavings - a.emissionsSavings);

  const totalPotentialSavings = recommendations.reduce((sum, r) => sum + r.emissionsSavings, 0);
  const currentCriticalEmissions = criticalSuppliers.reduce((sum, s) => sum + s.totalEmissions, 0);
  const totalSavingsPercent = (totalPotentialSavings / currentCriticalEmissions) * 100;

  return (
    <div className="space-y-6">
      <Card className="border-warning/50 bg-gradient-to-r from-warning/10 to-danger/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-warning" />
            Cenários de Otimização de Fornecedores
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Identificámos {criticalSuppliers.length} fornecedores críticos e encontrámos {recommendations.length} oportunidades de melhoria
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-danger" />
                <span className="text-sm text-muted-foreground">Fornecedores Críticos</span>
              </div>
              <p className="text-3xl font-bold text-danger">{criticalSuppliers.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Requerem atenção</p>
            </div>

            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-5 w-5 text-success" />
                <span className="text-sm text-muted-foreground">Poupança Potencial</span>
              </div>
              <p className="text-3xl font-bold text-success">{formatNumber(totalPotentialSavings, 0)}</p>
              <p className="text-xs text-muted-foreground mt-1">t CO₂e (-{formatPercentage(totalSavingsPercent, 0)})</p>
            </div>

            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Alternativas Disponíveis</span>
              </div>
              <p className="text-3xl font-bold text-primary">{recommendations.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Substituições recomendadas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {recommendations.map((rec, index) => {
          const isExpanded = expandedId === `${rec.critical.id}-${rec.alternative.id}`;
          
          return (
            <Card key={`${rec.critical.id}-${rec.alternative.id}`} className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="h-8 w-8 flex items-center justify-center text-lg font-bold">
                        {index + 1}
                      </Badge>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-danger">Crítico</Badge>
                          <span className="font-semibold">{rec.critical.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{rec.reason}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedId(isExpanded ? null : `${rec.critical.id}-${rec.alternative.id}`)}
                    >
                      {isExpanded ? "Ver menos" : "Ver detalhes"}
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 p-4 bg-danger/5 border border-danger/30 rounded-lg">
                      <p className="text-sm font-semibold text-danger mb-2">Fornecedor Atual</p>
                      <p className="font-bold">{rec.critical.name}</p>
                      <div className="mt-2 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Emissões:</span>
                          <span className="font-semibold">{formatNumber(rec.critical.totalEmissions, 0)} ton</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">FE:</span>
                          <span className="font-semibold">{formatNumber(rec.feCurrent, 1)} kg/€</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <ArrowRight className="h-8 w-8 text-primary" />
                      <span className="text-xs font-semibold text-primary">MUDAR</span>
                    </div>

                    <div className="flex-1 p-4 bg-success/5 border border-success/30 rounded-lg">
                      <p className="text-sm font-semibold text-success mb-2">Alternativa Recomendada</p>
                      <p className="font-bold">{rec.alternative.name}</p>
                      <div className="mt-2 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Emissões:</span>
                          <span className="font-semibold">{formatNumber(rec.alternative.totalEmissions, 0)} ton</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">FE:</span>
                          <span className="font-semibold">{formatNumber(rec.feAlternative, 1)} kg/€</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3 p-4 bg-primary/5 border border-primary/30 rounded-lg">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <TrendingDown className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium">Redução de Emissões</span>
                      </div>
                      <p className="text-2xl font-bold text-success">{formatNumber(rec.emissionsSavings, 0)} ton</p>
                      <p className="text-xs text-muted-foreground">-{formatPercentage(rec.emissionsSavingsPercent, 0)}</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Melhoria do FE</span>
                      </div>
                      <p className="text-2xl font-bold text-primary">{formatPercentage(rec.feImprovement, 0)}</p>
                      <p className="text-xs text-muted-foreground">mais eficiente</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-warning" />
                        <span className="text-sm font-medium">Diferença Financeira</span>
                      </div>
                      <p className={`text-2xl font-bold ${rec.costDifference >= 0 ? 'text-success' : 'text-warning'}`}>
                        {rec.costDifference >= 0 ? '+' : ''}{formatNumber(rec.costDifference, 1)}M€
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatPercentage(Math.abs(rec.costDifferencePercent), 0)} {rec.costDifference >= 0 ? 'maior' : 'menor'}
                      </p>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="space-y-3 pt-3 border-t">
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="p-3 bg-success/5 border border-success/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-success" />
                            <span className="font-semibold text-sm">Benefícios</span>
                          </div>
                          <ul className="space-y-1">
                            {rec.benefits.map((benefit, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-success mt-0.5">•</span>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {rec.risks.length > 0 && (
                          <div className="p-3 bg-warning/5 border border-warning/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-4 w-4 text-warning" />
                              <span className="font-semibold text-sm">Pontos de Atenção</span>
                            </div>
                            <ul className="space-y-1">
                              {rec.risks.map((risk, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="text-warning mt-0.5">•</span>
                                  <span>{risk}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="p-4 bg-accent/5 border border-accent/30 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Award className="h-4 w-4 text-accent" />
                          Conclusão
                        </h4>
                        <p className="text-sm">
                          <strong>Recomendamos fortemente</strong> a mudança de <strong>{rec.critical.name}</strong> para{" "}
                          <strong>{rec.alternative.name}</strong>. Esta alteração resultará numa redução de{" "}
                          <strong className="text-success">{formatNumber(rec.emissionsSavings, 0)} toneladas de CO₂e</strong>{" "}
                          ({formatPercentage(rec.emissionsSavingsPercent, 0)}), com um Fator de Emissão{" "}
                          <strong className="text-primary">{formatPercentage(rec.feImprovement, 0)} mais baixo</strong>.
                          {rec.costDifference > 0 && (
                            <> Adicionalmente, o fornecedor alternativo tem um volume de negócios {formatPercentage(rec.costDifferencePercent, 0)} superior, 
                            indicando maior capacidade e estabilidade.</>
                          )}
                          {rec.alternative.hasSBTi && !rec.critical.hasSBTi && (
                            <> O fornecedor alternativo possui <strong>compromisso SBTi validado</strong>, garantindo metas de redução alinhadas 
                            com os Acordos de Paris.</>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {recommendations.length === 0 && (
        <Card className="border-success/30 bg-success/5">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Excelente Performance!</h3>
            <p className="text-muted-foreground">
              Não foram identificados fornecedores críticos que necessitem de substituição imediata.
              Todos os fornecedores atuais apresentam bom desempenho em sustentabilidade.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
