import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { getClusterOnboardingStats, ClusterOnboardingStats as Stats } from "@/data/emailTracking";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ClusterOnboardingStatsProps {
  clusterId: string;
  companies: Array<{ onboardingStatus: string }>;
}

const statusConfig = {
  porContactar: { label: 'Por contactar', color: 'bg-status-pending' },
  semInteracao: { label: 'Sem interação', color: 'bg-status-contacted' },
  interessada: { label: 'Interessada', color: 'bg-status-interested' },
  emProgresso: { label: 'Em progresso', color: 'bg-status-progress' },
  completo: { label: 'Completo', color: 'bg-status-complete' },
};

export function ClusterOnboardingStats({ clusterId, companies }: ClusterOnboardingStatsProps) {
  const stats: Stats = useMemo(() => {
    return getClusterOnboardingStats(companies);
  }, [companies]);

  if (stats.total === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-2">
        Sem empresas neste cluster
      </div>
    );
  }

  // Build segments for the stacked bar
  const segments = [
    { key: 'porContactar', value: stats.porContactar, pct: stats.porContactarPct, ...statusConfig.porContactar },
    { key: 'semInteracao', value: stats.semInteracao, pct: stats.semInteracaoPct, ...statusConfig.semInteracao },
    { key: 'interessada', value: stats.interessada, pct: stats.interessadaPct, ...statusConfig.interessada },
    { key: 'emProgresso', value: stats.emProgresso, pct: stats.emProgressoPct, ...statusConfig.emProgresso },
    { key: 'completo', value: stats.completo, pct: stats.completoPct, ...statusConfig.completo },
  ].filter(s => s.value > 0);

  return (
    <div className="space-y-3">
      {/* Mini Funnel - horizontal stacked bar */}
      <TooltipProvider>
        <div className="flex items-center gap-0.5 h-3 rounded-full overflow-hidden">
          {segments.map((segment, index) => (
            <Tooltip key={segment.key}>
              <TooltipTrigger asChild>
                <div
                  className={`${segment.color} h-full transition-all cursor-pointer hover:opacity-80 ${
                    index === 0 ? 'rounded-l-full' : ''
                  } ${index === segments.length - 1 ? 'rounded-r-full' : ''}`}
                  style={{ width: `${segment.pct}%`, minWidth: segment.value > 0 ? '4px' : '0' }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{segment.label}</p>
                <p className="text-xs text-muted-foreground">{segment.value} empresas ({segment.pct}%)</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      {/* Stats breakdown */}
      <div className="grid grid-cols-5 gap-2 text-center">
        {segments.length > 0 && (
          <>
            <div>
              <div className="text-lg font-bold">{stats.porContactar}</div>
              <div className="text-[10px] text-muted-foreground leading-tight">Por contactar</div>
            </div>
            <div>
              <div className="text-lg font-bold">{stats.semInteracao}</div>
              <div className="text-[10px] text-muted-foreground leading-tight">Sem interação</div>
            </div>
            <div>
              <div className="text-lg font-bold">{stats.interessada}</div>
              <div className="text-[10px] text-muted-foreground leading-tight">Interessada</div>
            </div>
            <div>
              <div className="text-lg font-bold">{stats.emProgresso}</div>
              <div className="text-[10px] text-muted-foreground leading-tight">Em progresso</div>
            </div>
            <div>
              <div className="text-lg font-bold text-status-complete">{stats.completo}</div>
              <div className="text-[10px] text-muted-foreground leading-tight">Completo</div>
            </div>
          </>
        )}
      </div>

      {/* Action button */}
      <Button variant="outline" size="sm" className="w-full" asChild>
        <Link to={`/incentive?cluster=${clusterId}`}>
          Gerir Convites
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </Button>
    </div>
  );
}
