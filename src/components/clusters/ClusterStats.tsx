import { useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SupplierAny, hasFootprint } from "@/types/supplierNew";

interface ClusterStatsProps {
  selectedCluster?: string;
  companies?: SupplierAny[];
  incontactaveis?: number;  // Empresas com problemas de entrega (bounce/spam/opt-out)
}

export function ClusterStats({ selectedCluster, companies, incontactaveis = 0 }: ClusterStatsProps) {

  // Normalizar empresas para formato comum (com onboardingStatus e completedVia)
  const normalizedCompanies = useMemo(() => {
    if (!companies) return [];
    return companies.map(company => {
      if (hasFootprint(company)) {
        // Empresas com pegada são "completo"
        return {
          clusterIds: company.clusterIds,
          onboardingStatus: 'completo' as const,
          completedVia: (company.dataSource === 'get2zero' ? 'simple' : 'formulario') as const,
        };
      }
      // Empresas sem pegada já têm os campos necessários
      return {
        clusterIds: company.clusterIds,
        onboardingStatus: company.onboardingStatus,
        completedVia: company.completedVia,
      };
    });
  }, [companies]);

  // Calculate funnel metrics (same logic as Incentive page)
  const funnelMetrics = useMemo(() => {
    const allCompanies = normalizedCompanies;
    const total = allCompanies.length;

    const statusCounts = allCompanies.reduce((acc, c) => {
      acc[c.onboardingStatus] = (acc[c.onboardingStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const porContactar = statusCounts['por_contactar'] || 0;
    const semInteracao = statusCounts['sem_interacao'] || 0;
    const interessada = statusCounts['interessada'] || 0;

    // Contagem de completos por caminho (baseado em completedVia)
    const completedCompanies = allCompanies.filter(c => c.onboardingStatus === 'completo');
    const completoSimple = completedCompanies.filter(c => c.completedVia === 'simple').length;
    const completoFormulario = completedCompanies.filter(c => c.completedVia === 'formulario').length;

    // Dados para o funil com ramificação
    const simpleRegistered = statusCounts['registada_simple'] || 0;
    const simpleProgress = statusCounts['em_progresso_simple'] || 0;
    const formularioProgress = statusCounts['em_progresso_formulario'] || 0;

    return {
      total,
      incontactaveis,
      porContactar,
      semInteracao,
      interessada,
      simple: {
        registered: simpleRegistered,
        progress: simpleProgress,
        complete: completoSimple,
      },
      formulario: {
        progress: formularioProgress,
        complete: completoFormulario,
      },
    };
  }, [normalizedCompanies, incontactaveis]);

  const showOnboardingSection = normalizedCompanies.length > 0 && selectedCluster;

  // Empty state: render nothing when no companies
  if (normalizedCompanies.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Onboarding Funnel */}
      {showOnboardingSection && (() => {
        const preTotal = funnelMetrics.incontactaveis + funnelMetrics.porContactar + funnelMetrics.semInteracao + funnelMetrics.interessada;
        const simpleTotal = funnelMetrics.simple.registered + funnelMetrics.simple.progress + funnelMetrics.simple.complete;
        const formularioTotal = funnelMetrics.formulario.progress + funnelMetrics.formulario.complete;
        const postTotal = simpleTotal + formularioTotal;
        const grandTotal = preTotal + postTotal;

        const leftPercent = postTotal === 0 ? 100 : preTotal === 0 ? 0 : (preTotal / grandTotal) * 100;
        const rightPercent = preTotal === 0 ? 100 : postTotal === 0 ? 0 : (postTotal / grandTotal) * 100;

        const legendItems = [
          { label: 'Incontactáveis', value: funnelMetrics.incontactaveis, color: 'bg-foreground', borderColor: 'border-foreground', tooltip: 'Email com problemas de entrega (bounce/spam/opt-out)' },
          { label: 'Por contactar', value: funnelMetrics.porContactar, color: 'bg-status-pending', borderColor: 'border-status-pending', tooltip: 'Ainda não recebeu nenhum email' },
          { label: 'Sem interação', value: funnelMetrics.semInteracao, color: 'bg-status-contacted', borderColor: 'border-status-contacted', tooltip: 'Recebeu email mas não clicou no link' },
          { label: 'Interessada', value: funnelMetrics.interessada, color: 'bg-status-interested', borderColor: 'border-status-interested', tooltip: 'Clicou no link do email' },
          { label: 'Registada', value: funnelMetrics.simple.registered, color: 'bg-status-registered', borderColor: 'border-status-registered', tooltip: 'Criou conta no Simple' },
          { label: 'Em progresso', value: funnelMetrics.simple.progress + funnelMetrics.formulario.progress, color: 'bg-status-progress', borderColor: 'border-status-progress', tooltip: 'Iniciou o cálculo da pegada' },
          { label: 'Completo', value: funnelMetrics.simple.complete + funnelMetrics.formulario.complete, color: 'bg-status-complete', borderColor: 'border-status-complete', tooltip: 'Pegada calculada com sucesso' },
        ];

        return (
          <div className="border rounded-lg p-4 bg-card shadow-md">
            <p className="text-xs font-normal text-muted-foreground mb-4">Progresso de onboarding</p>
            <div className="flex items-center gap-2">
              {/* Fase pré-decisão */}
              {preTotal > 0 && (() => {
                const preSegments = [
                  { key: 'incontactaveis', value: funnelMetrics.incontactaveis, color: 'bg-foreground', label: 'Incontactáveis' },
                  { key: 'pending', value: funnelMetrics.porContactar, color: 'bg-status-pending', label: 'Por contactar' },
                  { key: 'contacted', value: funnelMetrics.semInteracao, color: 'bg-status-contacted', label: 'Sem interação' },
                  { key: 'interested', value: funnelMetrics.interessada, color: 'bg-status-interested', label: 'Interessada' },
                ].filter(s => s.value > 0);

                return (
                  <>
                    <div style={{ width: `${leftPercent}%` }}>
                      <div className="h-4 flex gap-px">
                        {preSegments.map((segment, index) => (
                          <div
                            key={segment.key}
                            className={cn(
                              segment.color,
                              "h-full",
                              index === 0 && "rounded-l-md",
                              index === preSegments.length - 1 && "rounded-r-md"
                            )}
                            style={{ width: `${(segment.value / preTotal) * 100}%` }}
                            title={`${segment.label}: ${segment.value}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Conector visual */}
                    {postTotal > 0 && (
                      <div className="flex flex-col items-center gap-1 text-muted-foreground/50 shrink-0">
                        <div className="w-px h-4 bg-current" />
                        <ChevronRight className="h-4 w-4" />
                        <div className="w-px h-4 bg-current" />
                      </div>
                    )}
                  </>
                );
              })()}

              {/* Fase pós-decisão */}
              {postTotal > 0 && (
                <div style={{ width: `${rightPercent}%` }} className="space-y-1">
                  {/* Ramo Simple */}
                  {(() => {
                    // Calcular largura proporcional para cada ramo
                    const maxBranchTotal = Math.max(simpleTotal, formularioTotal);
                    const simpleWidthPercent = maxBranchTotal > 0 ? (simpleTotal / maxBranchTotal) * 100 : 0;
                    const formularioWidthPercent = maxBranchTotal > 0 ? (formularioTotal / maxBranchTotal) * 100 : 0;

                    const simpleSegments = [
                      { key: 'registered', value: funnelMetrics.simple.registered, color: 'bg-status-registered', label: 'Registada' },
                      { key: 'progress', value: funnelMetrics.simple.progress, color: 'bg-status-progress', label: 'Em progresso' },
                      { key: 'complete', value: funnelMetrics.simple.complete, color: 'bg-status-complete', label: 'Completo' },
                    ].filter(s => s.value > 0);

                    const formularioSegments = [
                      { key: 'progress', value: funnelMetrics.formulario.progress, color: 'bg-status-progress', label: 'Em progresso' },
                      { key: 'complete', value: funnelMetrics.formulario.complete, color: 'bg-status-complete', label: 'Completo' },
                    ].filter(s => s.value > 0);

                    const hasBothBranches = simpleTotal > 0 && formularioTotal > 0;

                    return (
                      <>
                        {/* Ramo Simple */}
                        {simpleTotal > 0 && (
                          <div className={cn("space-y-1", !hasBothBranches && "pb-[28px]")}>
                            <p className="text-xs font-bold">Simple <span className="font-normal text-muted-foreground">({simpleTotal})</span></p>
                            <div className="h-4 flex gap-px" style={{ width: hasBothBranches ? `${simpleWidthPercent}%` : '100%' }}>
                              {simpleSegments.map((segment, index) => (
                                <div
                                  key={segment.key}
                                  className={cn(
                                    segment.color,
                                    "h-full",
                                    index === 0 && "rounded-l-md",
                                    index === simpleSegments.length - 1 && "rounded-r-md"
                                  )}
                                  style={{ width: `${(segment.value / simpleTotal) * 100}%` }}
                                  title={`${segment.label}: ${segment.value}`}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Ramo Formulário */}
                        {formularioTotal > 0 && (
                          <div className={cn("space-y-1", !hasBothBranches && "pt-[20px]")}>
                            <div className="h-4 flex gap-px" style={{ width: hasBothBranches ? `${formularioWidthPercent}%` : '100%' }}>
                              {formularioSegments.map((segment, index) => (
                                <div
                                  key={segment.key}
                                  className={cn(
                                    segment.color,
                                    "h-full",
                                    index === 0 && "rounded-l-md",
                                    index === formularioSegments.length - 1 && "rounded-r-md"
                                  )}
                                  style={{ width: `${(segment.value / formularioTotal) * 100}%` }}
                                  title={`${segment.label}: ${segment.value}`}
                                />
                              ))}
                            </div>
                            <p className="text-xs font-bold">Formulário <span className="font-normal text-muted-foreground">({formularioTotal})</span></p>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Separador */}
            <Separator className="my-4" />

            {/* Legenda com contagens e tooltips */}
            <div className="flex flex-wrap justify-center gap-4">
              {legendItems.map((item) => (
                <TooltipProvider key={item.label} delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5 text-xs cursor-help">
                        <div className={cn("h-2.5 w-2.5 rounded-full", item.color)} />
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-normal">{item.value}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className={cn("border", item.borderColor)}>
                      <p>{item.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
