import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  ChevronLeft,
  ChevronsUpDown,
  ChevronsDownUp,
  ListChecks,
  Clock,
  AlertTriangle,
  Target,
  Building2,
  Euro,
  Zap,
  FileText,
  Mail,
  Download,
  CheckCircle,
  MapPin,
  Bike,
  Sun,
  Recycle
} from 'lucide-react';
import type { Step4Props } from '../types';
import { CollapsibleSection } from '../shared';
import { mockMeasures } from '@/data/mockMeasures';
import { mockFunding } from '@/data/mockFunding';
import { cascaisInfrastructure } from '@/data/mockInfrastructure';
import { elements, riskColors, scopeColors } from '@/lib/styles';

export const Step4Summary = ({
  supplier,
  selectedMeasures,
  selectedFunding,
  municipalityNotes,
  onNotesChange,
  emailSent,
  onSendEmail,
  expandedSections,
  onToggleSection,
  onToggleAllSections,
  allExpanded,
  avgSectorIntensity,
  riskLevel,
  onClose,
  onPrevious,
  storageKey,
}: Step4Props) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Dados calculados dos steps anteriores
  const selectedMeasuresData = mockMeasures.filter(m => selectedMeasures.includes(m.id));
  const selectedFundingData = mockFunding.filter(f => selectedFunding.includes(f.id));

  // Cálculos de impacto
  const totalReduction = selectedMeasuresData.reduce((sum, m) => sum + m.emissionReduction, 0);
  const totalInvestment = selectedMeasuresData.reduce((sum, m) => sum + m.investment, 0);
  const reductionPercent = supplier.totalEmissions > 0
    ? (totalReduction / supplier.totalEmissions) * 100
    : 0;

  const rawCoverage = selectedFundingData.reduce((sum, fund) => {
    if (fund.percentage) {
      const maxFromPercentage = totalInvestment * (fund.percentage / 100);
      return sum + Math.min(fund.maxAmount, maxFromPercentage);
    }
    return sum + fund.maxAmount;
  }, 0);
  const totalCoverage = Math.min(rawCoverage, totalInvestment);
  const coveragePercent = totalInvestment > 0 ? (totalCoverage / totalInvestment) * 100 : 0;
  const remaining = Math.max(0, totalInvestment - totalCoverage);

  // Nova intensidade
  const currentIntensity = supplier.emissionsPerRevenue || 0;
  const reductionRatio = supplier.totalEmissions > 0 ? totalReduction / supplier.totalEmissions : 0;
  const newIntensity = currentIntensity * (1 - reductionRatio);
  const reachedTarget = newIntensity <= avgSectorIntensity;

  // Próximos prazos de fundos
  const upcomingDeadlines = selectedFundingData
    .filter(f => f.deadline && f.deadline !== 'Contínuo')
    .map(f => ({
      name: f.name,
      deadline: new Date(f.deadline!),
      daysRemaining: Math.ceil((new Date(f.deadline!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    }))
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime());

  const handleSendEmail = () => {
    onSendEmail();
    // Actualizar localStorage
    if (storageKey) {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        data.emailSent = true;
        data.emailSentAt = new Date().toISOString();
        localStorage.setItem(storageKey, JSON.stringify(data));
      }
    }
  };

  // Helper para estilos de deadline
  const getDeadlineStyles = (daysRemaining: number) => {
    if (daysRemaining <= 30) {
      return {
        container: `${riskColors.alto.bg} ${riskColors.alto.bgDark} border ${riskColors.alto.border}`,
        text: 'text-danger'
      };
    }
    if (daysRemaining <= 60) {
      return {
        container: `${riskColors.medio.bg} ${riskColors.medio.bgDark} border ${riskColors.medio.border}`,
        text: 'text-warning'
      };
    }
    return {
      container: 'bg-muted/50',
      text: 'text-muted-foreground'
    };
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header do step - Fixo */}
      <div className="shrink-0 p-6 pb-4 border-b border-border/50">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-2xl mb-1">Resumo do Plano de Ação</h3>
            <p className="text-sm text-muted-foreground">
              Reveja o plano antes de exportar ou enviar à empresa.
              <span className="text-muted-foreground/70 ml-1">
                • Gerado em {new Date().toLocaleDateString('pt-PT')}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onToggleAllSections}
            className={elements.outlineButton}
          >
            {allExpanded ? (
              <>
                <ChevronsDownUp className="h-4 w-4" />
                Colapsar todas
              </>
            ) : (
              <>
                <ChevronsUpDown className="h-4 w-4" />
                Expandir todas
              </>
            )}
          </button>
        </div>
      </div>

      {/* Conteúdo - Scrollável */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* SECÇÃO: Próximos Passos */}
        <CollapsibleSection
          id="proximosPassos"
          title="Próximos Passos"
          icon={ListChecks}
          highlighted
          isExpanded={expandedSections.proximosPassos}
          onToggle={onToggleSection}
        >
          {upcomingDeadlines.length > 0 && (
            <div className="mb-4">
              <h5 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Prazos de Candidatura
              </h5>
              <div className="space-y-2">
                {upcomingDeadlines.map((item, idx) => {
                  const styles = getDeadlineStyles(item.daysRemaining);
                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-lg ${styles.container}`}
                    >
                      <span className="text-sm">{item.name}</span>
                      <span className={`text-sm font-medium ${styles.text}`}>
                        {item.daysRemaining <= 30 && <AlertTriangle className="h-4 w-4 inline mr-1" />}
                        {item.daysRemaining} dias ({item.deadline.toLocaleDateString('pt-PT')})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-medium flex items-center justify-center">1</div>
              <span className="text-sm">Apresentar plano à empresa e validar interesse</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-medium flex items-center justify-center">2</div>
              <span className="text-sm">Apoiar na submissão de candidaturas a financiamento</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-medium flex items-center justify-center">3</div>
              <span className="text-sm">Acompanhar implementação das medidas</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-medium flex items-center justify-center">4</div>
              <span className="text-sm">Monitorizar progresso e ajustar plano se necessário</span>
            </div>
          </div>
        </CollapsibleSection>

        {/* SECÇÃO: Diagnóstico e Impacto */}
        <CollapsibleSection
          id="diagnosticoImpacto"
          title="Diagnóstico e Impacto"
          icon={Target}
          isExpanded={expandedSections.diagnosticoImpacto}
          onToggle={onToggleSection}
        >
          <div className="space-y-4">
            {/* Dados Base */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted border border-border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Faturação Anual</p>
                <p className="font-semibold text-xl">{(supplier.revenue || 0).toLocaleString('pt-PT')}€</p>
              </div>
              <div className="p-4 bg-muted border border-border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Emissões Totais</p>
                <p className="font-semibold text-xl">{supplier.totalEmissions.toLocaleString('pt-PT')} t CO₂e</p>
              </div>
            </div>

            {/* Emissões por Âmbito */}
            <div>
              <h5 className="text-sm font-medium text-muted-foreground mb-3">Emissões por Âmbito</h5>
              <div className="grid grid-cols-3 gap-4">
                <div className={`p-3 ${scopeColors[1].bgLight} border ${scopeColors[1].border} rounded-lg text-center`}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${scopeColors[1].bg}`} />
                    <p className={`text-xs ${scopeColors[1].textLight}`}>Âmbito 1 - Diretas</p>
                  </div>
                  <p className={`font-semibold text-lg ${scopeColors[1].text}`}>
                    {(supplier.scope1 || 0).toLocaleString('pt-PT')} t CO₂e
                  </p>
                  <p className={`text-xs ${scopeColors[1].textLight}`}>
                    {supplier.totalEmissions > 0
                      ? `${((supplier.scope1 || 0) / supplier.totalEmissions * 100).toFixed(0)}%`
                      : '0%'
                    }
                  </p>
                </div>
                <div className={`p-3 ${scopeColors[2].bgLight} border ${scopeColors[2].border} rounded-lg text-center`}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${scopeColors[2].bg}`} />
                    <p className={`text-xs ${scopeColors[2].textLight}`}>Âmbito 2 - Energia</p>
                  </div>
                  <p className={`font-semibold text-lg ${scopeColors[2].text}`}>
                    {(supplier.scope2 || 0).toLocaleString('pt-PT')} t CO₂e
                  </p>
                  <p className={`text-xs ${scopeColors[2].textLight}`}>
                    {supplier.totalEmissions > 0
                      ? `${((supplier.scope2 || 0) / supplier.totalEmissions * 100).toFixed(0)}%`
                      : '0%'
                    }
                  </p>
                </div>
                <div className={`p-3 ${scopeColors[3].bgLight} border ${scopeColors[3].border} rounded-lg text-center`}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${scopeColors[3].bg}`} />
                    <p className={`text-xs ${scopeColors[3].textLight}`}>Âmbito 3 - Indiretas</p>
                  </div>
                  <p className={`font-semibold text-lg ${scopeColors[3].text}`}>
                    {(supplier.scope3 || 0).toLocaleString('pt-PT')} t CO₂e
                  </p>
                  <p className={`text-xs ${scopeColors[3].textLight}`}>
                    {supplier.totalEmissions > 0
                      ? `${((supplier.scope3 || 0) / supplier.totalEmissions * 100).toFixed(0)}%`
                      : '0%'
                    }
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Intensidades */}
            <div>
              <h5 className="text-sm font-medium text-muted-foreground mb-3">Intensidade de Carbono</h5>
              <div className="grid grid-cols-3 gap-4">
                <div className={`p-4 ${riskColors.alto.bg} ${riskColors.alto.bgDark} border ${riskColors.alto.border} rounded-lg text-center`}>
                  <p className="text-xs text-danger mb-1">Intensidade Actual</p>
                  <p className="font-semibold text-xl text-danger">{currentIntensity.toFixed(2)}</p>
                  <p className="text-xs text-danger">kg CO₂e/€</p>
                </div>
                <div className={`p-4 rounded-lg text-center border ${reachedTarget 
                  ? `${riskColors.baixo.bg} ${riskColors.baixo.bgDark} ${riskColors.baixo.border}` 
                  : `${riskColors.medio.bg} ${riskColors.medio.bgDark} ${riskColors.medio.border}`}`}>
                  <p className={`text-xs mb-1 ${reachedTarget ? 'text-success' : 'text-warning'}`}>Nova Intensidade</p>
                  <p className={`font-semibold text-xl ${reachedTarget ? 'text-success' : 'text-warning'}`}>{newIntensity.toFixed(2)}</p>
                  <p className={`text-xs ${reachedTarget ? 'text-success' : 'text-warning'}`}>kg CO₂e/€</p>
                </div>
                <div className="p-4 bg-muted border border-border rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Média do Setor</p>
                  <p className="font-semibold text-xl">{avgSectorIntensity.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">kg CO₂e/€</p>
                </div>
              </div>
            </div>

            {/* Estado da Meta */}
            <div className={`flex items-center gap-2 p-3 rounded-lg border ${reachedTarget 
              ? `${riskColors.baixo.bg} ${riskColors.baixo.bgDark} text-success ${riskColors.baixo.border}` 
              : `${riskColors.medio.bg} ${riskColors.medio.bgDark} text-warning ${riskColors.medio.border}`}`}>
              {reachedTarget ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Meta atingida! A empresa passará a estar abaixo da média do setor.</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">Meta não atingida. Considere adicionar mais medidas.</span>
                </>
              )}
            </div>

            <Separator />

            {/* Impacto Total */}
            <div>
              <h5 className="text-sm font-medium text-muted-foreground mb-3">Impacto das Medidas</h5>
              <div className="grid grid-cols-4 gap-4">
                <div className={`p-4 ${riskColors.baixo.bg} ${riskColors.baixo.bgDark} border ${riskColors.baixo.border} rounded-lg text-center`}>
                  <p className="text-xs text-success mb-1">Redução</p>
                  <p className="font-semibold text-xl text-success">-{totalReduction.toLocaleString('pt-PT')}t</p>
                  <p className="text-xs text-success">CO₂e ({reductionPercent.toFixed(0)}%)</p>
                </div>
                <div className="p-4 bg-muted border border-border rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Investimento</p>
                  <p className="font-semibold text-xl">{totalInvestment.toLocaleString('pt-PT')}€</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div className={`p-4 ${scopeColors[2].bgLight} border ${scopeColors[2].border} rounded-lg text-center`}>
                  <p className={`text-xs ${scopeColors[2].textLight} mb-1`}>Comparticipação</p>
                  <p className={`font-semibold text-xl ${scopeColors[2].text}`}>{totalCoverage.toLocaleString('pt-PT')}€</p>
                  <p className={`text-xs ${scopeColors[2].textLight}`}>Até {coveragePercent.toFixed(0)}%</p>
                </div>
                <div className={`p-4 rounded-lg text-center border ${remaining === 0 
                  ? `${riskColors.baixo.bg} ${riskColors.baixo.bgDark} ${riskColors.baixo.border}` 
                  : `${riskColors.medio.bg} ${riskColors.medio.bgDark} ${riskColors.medio.border}`}`}>
                  <p className={`text-xs mb-1 ${remaining === 0 ? 'text-success' : 'text-warning'}`}>A cargo da empresa</p>
                  <p className={`font-semibold text-xl ${remaining === 0 ? 'text-success' : 'text-warning'}`}>{remaining.toLocaleString('pt-PT')}€</p>
                  <p className={`text-xs ${remaining === 0 ? 'text-success' : 'text-warning'}`}>{(100 - coveragePercent).toFixed(0)}%</p>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* SECÇÃO: Medidas Selecionadas */}
        <CollapsibleSection
          id="medidas"
          title="Medidas Selecionadas"
          icon={Zap}
          badge={selectedMeasuresData.length}
          isExpanded={expandedSections.medidas}
          onToggle={onToggleSection}
        >
          {selectedMeasuresData.length > 0 ? (
            <div className="space-y-2">
              {selectedMeasuresData.map(measure => (
                <div key={measure.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${scopeColors[measure.scope as 1 | 2 | 3].bg}`} />
                    <div>
                      <p className="text-sm font-medium">{measure.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Âmbito {measure.scope} • {measure.interventionLevel === 'soft' ? 'Soft' : 'Interventiva'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-success">-{measure.emissionReduction}t CO₂e</p>
                    <p className="text-xs text-muted-foreground">{measure.investment.toLocaleString('pt-PT')}€</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhuma medida selecionada</p>
          )}
        </CollapsibleSection>

        {/* SECÇÃO: Financiamento */}
        <CollapsibleSection
          id="financiamento"
          title="Financiamento"
          icon={Euro}
          badge={selectedFundingData.length}
          isExpanded={expandedSections.financiamento}
          onToggle={onToggleSection}
        >
          {selectedFundingData.length > 0 ? (
            <div className="space-y-2">
              {selectedFundingData.map(fund => (
                <div key={fund.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{fund.name}</p>
                    <p className="text-xs text-muted-foreground">{fund.provider}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      Até {fund.maxAmount.toLocaleString('pt-PT')}€
                      {fund.percentage && ` (${fund.percentage}%)`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {fund.deadline === 'Contínuo' ? 'Candidatura contínua' : `Prazo: ${new Date(fund.deadline!).toLocaleDateString('pt-PT')}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum fundo selecionado</p>
          )}
        </CollapsibleSection>

        {/* SECÇÃO: Contexto do Município */}
        <CollapsibleSection
          id="contexto"
          title="Infraestrutura Municipal de Suporte"
          icon={MapPin}
          isExpanded={expandedSections.contexto}
          onToggle={onToggleSection}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Zap className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{cascaisInfrastructure.chargingStations} postos de carregamento</p>
                <p className="text-xs text-muted-foreground">Mobilidade elétrica</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Bike className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{cascaisInfrastructure.cyclingNetworkKm} km de ciclovias</p>
                <p className="text-xs text-muted-foreground">Rede ciclável</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Sun className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{cascaisInfrastructure.solarPotentialZones} zonas de potencial solar</p>
                <p className="text-xs text-muted-foreground">Energia renovável</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Recycle className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{cascaisInfrastructure.recyclingCenters} centros de reciclagem</p>
                <p className="text-xs text-muted-foreground">Gestão de resíduos</p>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* SECÇÃO: Notas do Município */}
        <CollapsibleSection
          id="notas"
          title="Notas do Município"
          icon={FileText}
          isExpanded={expandedSections.notas}
          onToggle={onToggleSection}
        >
          <Textarea
            value={municipalityNotes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Adicione observações, recomendações adicionais, informações sobre outros fundos disponíveis, ou notas para seguimento interno..."
            className="w-full h-32 resize-none"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Estas notas serão incluídas no documento exportado e no email enviado à empresa.
          </p>
        </CollapsibleSection>
      </div>

      {/* Footer - Fixo */}
      <div className="shrink-0 p-4 border-t bg-background">
        <div className="relative flex items-center justify-between">
          <Button variant="outline" onClick={onPrevious} className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            Passo 4 de 4
          </span>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>Fechar</Button>
            <Button
              variant="outline"
              onClick={handleSendEmail}
              className="gap-2"
              disabled={emailSent}
            >
              <Mail className="h-4 w-4" />
              {emailSent ? 'Email Enviado' : 'Enviar Email'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {/* TODO: Implementar exportação PDF */}}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};