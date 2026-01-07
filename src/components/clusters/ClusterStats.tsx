import { Card } from "@/components/ui/card";
import { ClusterProvider } from "@/types/cluster";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface ClusterStatsProps {
  providers: ClusterProvider[];
}

export function ClusterStats({ providers }: ClusterStatsProps) {
  const notRegistered = providers.filter((p) => p.status === "not-registered").length;
  const inProgress = providers.filter((p) => p.status === "in-progress").length;
  const completed = providers.filter((p) => p.status === "completed").length;
  const total = providers.length;
  const registeredPercentage = total > 0 ? Math.round(((inProgress + completed) / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-destructive/10">
            <XCircle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <div className="text-2xl font-bold">{notRegistered}</div>
            <div className="text-sm text-muted-foreground">Não Registados</div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Clock className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <div className="text-2xl font-bold">{inProgress}</div>
            <div className="text-sm text-muted-foreground">Em Progresso</div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <div className="text-2xl font-bold">{completed}</div>
            <div className="text-sm text-muted-foreground">Concluídos</div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold">{registeredPercentage}%</div>
            <div className="text-sm text-muted-foreground">Taxa de Registo</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
