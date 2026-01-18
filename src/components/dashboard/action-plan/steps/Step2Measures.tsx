import { Check, TrendingDown, Clock, Sparkles, RotateCcw, CheckCircle, Target, Euro } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Step2Props } from '../types';
import type { Measure, Scope } from '@/types/actionPlan';
import { getApplicableMeasures, isMeasureRecommended } from '@/data/mockMeasures';
import { cascaisInfrastructure } from '@/data/mockInfrastructure';
import { mockFunding, getFundingByCategory } from '@/data/mockFunding';
import { formatNumber, formatPercentage } from '@/lib/formatters';

export const Step2Measures = ({
  supplier,
  selectedMeasures,
  onMeasuresChange,
  recommendedApplied,
  onRecommendedAppliedChange,
  avgSectorIntensity,
}: Step2Props) => {
  // Obter medidas aplicáveis
  const applicableMeasures = getApplicableMeasures({
    sector: supplier.sector,
    companySize: supplier.companySize,
    totalEmissions: supplier.totalEmissions
  });

  // Calcular percentagens dos âmbitos
  const scope1Pct = supplier.totalEmissions > 0 ? supplier.scope1 / supplier.totalEmissions * 100 : 0;
  const scope2Pct = supplier.totalEmissions > 0 ? supplier.scope2 / supplier.totalEmissions * 100 : 0;
  const scope3Pct = supplier.totalEmissions > 0 ? supplier.scope3 / supplier.totalEmissions * 100 : 0;

  // Agrupar medidas por âmbito
  const measuresByScope = {
    1: applicableMeasures.filter(m => m.scope === 1),
    2: applicableMeasures.filter(m => m.scope === 2),
    3: applicableMeasures.filter(m => m.scope === 3)
  };

  // Preparar dados de fundos para validação
  const fundingByCategory = getFundingByCategory();

  // Calcular impacto das medidas selecionadas
  const selectedMeasuresData = applicableMeasures.filter(m => selectedMeasures.includes(m.id));
  const totalReduction = selectedMeasuresData.reduce((sum, m) => sum + m.emissionReduction, 0);
  const totalInvestment = selectedMeasuresData.reduce((sum, m) => sum + m.investment, 0);
  const reductionPct = supplier.totalEmissions > 0 ? totalReduction / supplier.totalEmissions * 100 : 0;

  // Calcular intensidades
  const currentIntensity = supplier.emissionsPerRevenue || 0;
  const reductionRatio = supplier.totalEmissions > 0 ? totalReduction / supplier.totalEmissions : 0;
  const newIntensity = currentIntensity * (1 - reductionRatio);
  const reachedTarget = newIntensity <= avgSectorIntensity;

  // Toggle medida
  const toggleMeasure = (measureId: string) => {
    const newMeasures = selectedMeasures.includes(measureId)
      ? selectedMeasures.filter(id => id !== measureId)
      : [...selectedMeasures, measureId];
    onMeasuresChange(newMeasures);
    onRecommendedAppliedChange(false);
  };

  // Função para selecionar melhores medidas automaticamente
  const selectBestMeasures = () => {
    if (recommendedApplied) {
      onMeasuresChange([]);
      onRecommendedAppliedChange(false);
      return;
    }

    const fundingByCat = [
      { category: 'energia', available: mockFunding.filter(f => f.currentlyOpen && f.applicableTo.measureCategories?.includes('energia')).reduce((sum, f) => sum + f.remainingBudget, 0) },
      { category: 'mobilidade', available: mockFunding.filter(f => f.currentlyOpen && f.applicableTo.measureCategories?.includes('mobilidade')).reduce((sum, f) => sum + f.remainingBudget, 0) },
      { category: 'residuos', available: mockFunding.filter(f => f.currentlyOpen && f.applicableTo.measureCategories?.includes('residuos')).reduce((sum, f) => sum + f.remainingBudget, 0) },
      { category: 'agua', available: mockFunding.filter(f => f.currentlyOpen && f.applicableTo.measureCategories?.includes('agua')).reduce((sum, f) => sum + f.remainingBudget, 0) }
    ];

    const recommendedMeasures = applicableMeasures.filter(m => {
      const { recommended } = isMeasureRecommended(m, cascaisInfrastructure, fundingByCat);
      return recommended;
    });

    const sortedMeasures = [...recommendedMeasures].sort((a, b) => {
      if (a.interventionLevel !== b.interventionLevel) {
        return a.interventionLevel === 'soft' ? -1 : 1;
      }
      const roiA = a.investment > 0 ? a.emissionReduction / a.investment : 0;
      const roiB = b.investment > 0 ? b.emissionReduction / b.investment : 0;
      return roiB - roiA;
    });

    let accumulatedReduction = 0;
    const selectedIds: string[] = [];
    const currentInt = supplier.emissionsPerRevenue || 0;

    for (const measure of sortedMeasures) {
      selectedIds.push(measure.id);
      accumulatedReduction += measure.emissionReduction;
      const redRatio = supplier.totalEmissions > 0 ? accumulatedReduction / supplier.totalEmissions : 0;
      const newInt = currentInt * (1 - redRatio);
      if (newInt <= avgSectorIntensity) break;
    }

    onMeasuresChange(selectedIds);
    onRecommendedAppliedChange(true);
  };

  // Render card de medida
  const renderMeasureCard = (measure: Measure) => {
    const isSelected = selectedMeasures.includes(measure.id);
    const { recommended, reason } = isMeasureRecommended(measure, cascaisInfrastructure, fundingByCategory);

    return (
      <div
        key={measure.id}
        onClick={() => toggleMeasure(measure.id)}
        className={`
          p-4 rounded-lg border-2 cursor-pointer transition-all
          ${isSelected ? 'border-primary bg-primary/5' : recommended ? 'border-border hover:border-primary/50 bg-background' : 'border-muted bg-muted/30 opacity-60 hover:opacity-100'}
        `}
      >
        <div className="flex items-start gap-3">
          <div className={`
            w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5
            ${isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/50'}
          `}>
            {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-medium text-sm">{measure.name}</span>

              {!recommended && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-muted-foreground/30 cursor-help">
                        Não recomendado
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-xs">{reason}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <span className={`text-xs px-2 py-0.5 rounded-full ${measure.interventionLevel === 'soft' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                {measure.interventionLevel === 'soft' ? 'Soft' : 'Interventiva'}
              </span>
            </div>

            <p className="text-xs text-muted-foreground mb-2">{measure.description}</p>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-2 text-success">
                <TrendingDown className="h-3 w-3" />
                -{measure.emissionReduction}t CO₂e
              </span>
              <span className="flex items-center gap-2 text-muted-foreground">
                <Euro className="h-3 w-3" />
                {measure.investment.toLocaleString('pt-PT')}€
              </span>
              <span className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-3 w-3" />
                {measure.timeline}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render coluna de âmbito
  const renderScopeColumn = (scope: Scope) => {
    const scopeNames = { 1: 'Âmbito 1 - Diretas', 2: 'Âmbito 2 - Energia', 3: 'Âmbito 3 - Indiretas' };
    const scopePcts = { 1: scope1Pct, 2: scope2Pct, 3: scope3Pct };
    const scopeColorMap = {
      1: { headerBg: 'bg-violet-50 dark:bg-violet-950/30', text: 'text-violet-700 dark:text-violet-300', textSecondary: 'text-violet-600 dark:text-violet-400', badge: 'bg-violet-700 dark:bg-violet-600' },
      2: { headerBg: 'bg-primary/10', text: 'text-primary', textSecondary: 'text-primary/80', badge: 'bg-primary' },
      3: { headerBg: 'bg-warning/10', text: 'text-warning', textSecondary: 'text-warning/80', badge: 'bg-warning' }
    };
    const colors = scopeColorMap[scope];
    const measures = measuresByScope[scope];

    return (
      <div className="flex flex-col">
        <div className={`flex items-center justify-between p-3 rounded-lg mb-3 ${colors.headerBg}`}>
          <div className="flex items-center gap-2">
            <span className={`font-medium text-sm ${colors.text}`}>{scopeNames[scope]}</span>
            <span className={`text-sm ${colors.textSecondary}`}>({formatPercentage(scopePcts[scope], 0)})</span>
          </div>
          <span className={`w-6 h-6 rounded-full text-white text-xs font-medium flex items-center justify-center ${colors.badge}`}>
            {measures.length}
          </span>
        </div>

        <div className="space-y-2 flex-1">
          {measures.length > 0 ? measures.map(measure => renderMeasureCard(measure)) : (
            <div className="p-4 text-center text-sm text-muted-foreground border border-dashed rounded-lg">
              Nenhuma medida disponível para este âmbito
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <style>{`
        @keyframes shadow-pulse {
          0%, 100% { box-shadow: 0 0 10px 2px hsl(var(--success) / 0.3); }
          50% { box-shadow: 0 0 25px 5px hsl(var(--success) / 0.5); }
        }
        .animate-shadow-pulse {
          animation: shadow-pulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* Header do step - Fixo */}
      <div className="shrink-0 p-6 pb-4 border-b border-border/50">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-2xl mb-1">Seleção de Medidas</h3>
            <p className="text-sm text-muted-foreground">
              Selecione medidas até a intensidade ficar abaixo da média do setor.
            </p>
          </div>
          <button
            onClick={selectBestMeasures}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0
              ${recommendedApplied
                ? 'bg-white border border-border text-muted-foreground hover:bg-muted/50'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 animate-shadow-pulse'
              }
            `}
          >
            {recommendedApplied ? (
              <>
                <RotateCcw className="h-4 w-4" />
                Repor seleção
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Aplicar medidas recomendadas
              </>
            )}
          </button>
        </div>
      </div>

      {/* Colunas dos âmbitos - Scrollável */}
      <div className="flex-1 overflow-y-auto px-6 pt-4 min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
          {renderScopeColumn(1)}
          {renderScopeColumn(2)}
          {renderScopeColumn(3)}
        </div>
      </div>

      {/* Impacto/Totais - Fixo no fundo */}
      <div className="shrink-0 p-6 pt-4 border-t bg-muted/10">
        <div className="rounded-lg overflow-hidden border border-border">
          {/* ÁREA 1: Header */}
          <div className="flex border-b border-border">
            <div className="flex-1 p-5 pr-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </div>
                <h4 className="font-medium text-xl">Impacto das Medidas Selecionadas</h4>
              </div>
            </div>
            <div className="w-48 shrink-0 p-5 pl-6 border-l border-border">
              <p className="text-xs text-muted-foreground">Medidas</p>
              <p className="font-semibold text-xl">{selectedMeasures.length}</p>
            </div>
          </div>

          {/* ÁREA 2: Barras e Totais */}
          <div className="flex border-b border-border">
            <div className="flex-1 p-5 pr-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm w-32 shrink-0">Intensidade atual</span>
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-danger rounded-full w-full" />
                  </div>
                  <span className="text-sm font-semibold w-32 text-right">
                    {formatNumber(currentIntensity, 2)} kg CO₂e/€
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm w-32 shrink-0">Com medidas</span>
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    {selectedMeasures.length > 0 ? (
                      <div
                        className={`h-full rounded-full transition-all ${reachedTarget ? 'bg-success' : 'bg-warning'}`}
                        style={{ width: `${Math.max(newIntensity / currentIntensity * 100, 5)}%` }}
                      />
                    ) : (
                      <div className="h-full bg-muted-foreground/30 rounded-full w-full" />
                    )}
                  </div>
                  <span className={`text-sm w-32 text-right ${selectedMeasures.length > 0 ? reachedTarget ? 'font-semibold text-success' : 'font-semibold' : 'text-muted-foreground'}`}>
                    {selectedMeasures.length > 0 ? `${formatNumber(newIntensity, 2)} kg CO₂e/€` : 'Selecione medidas'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm w-32 shrink-0">Média do setor</span>
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: `${avgSectorIntensity / currentIntensity * 100}%` }} />
                  </div>
                  <span className="text-sm font-semibold w-32 text-right">
                    {formatNumber(avgSectorIntensity, 2)} kg CO₂e/€
                  </span>
                </div>
              </div>
            </div>

            <div className="w-48 shrink-0 p-5 pl-6 border-l border-border">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">Redução Estimada</p>
                  <p className={`font-semibold text-xl ${totalReduction > 0 ? 'text-success' : ''}`}>
                    -{totalReduction.toLocaleString('pt-PT')}t CO₂e
                    <span className="text-sm font-normal ml-1">({formatPercentage(reductionPct, 0)})</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Investimento Total</p>
                  <p className="font-semibold text-xl">{totalInvestment.toLocaleString('pt-PT')}€</p>
                </div>
              </div>
            </div>
          </div>

          {/* ÁREA 3: Rodapé */}
          <div className="flex">
            <div className="flex-1 p-4 pr-6">
              <p className="text-xs text-muted-foreground">
                Estimativas baseadas em cenários típicos. Os resultados reais podem variar conforme a implementação.
              </p>
            </div>
            <div className="w-48 shrink-0 p-4 pl-6 border-l border-border">
              <div className={`flex items-center gap-2 ${reachedTarget ? 'text-success' : 'text-muted-foreground'}`}>
                {reachedTarget ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Meta atingida!</span>
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4" />
                    <span className="text-sm">Meta não atingida</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
