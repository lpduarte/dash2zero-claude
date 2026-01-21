import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClusterProvider } from "@/types/cluster";
import { CheckCircle2, Clock, XCircle, Mail, ChevronRight } from "lucide-react";
import { ClusterOnboardingStats } from "./ClusterOnboardingStats";

interface ClusterStatsProps {
  providers: ClusterProvider[];
  selectedCluster?: string;
  companiesWithoutFootprint?: Array<{ onboardingStatus: string; clusterId: string }>;
}

export function ClusterStats({ providers, selectedCluster, companiesWithoutFootprint }: ClusterStatsProps) {
  const notRegistered = providers.filter((p) => p.status === "not-registered").length;
  const inProgress = providers.filter((p) => p.status === "in-progress").length;
  const completed = providers.filter((p) => p.status === "completed").length;
  const total = providers.length;
  const registeredPercentage = total > 0 ? Math.round(((inProgress + completed) / total) * 100) : 0;

  // Filter companies without footprint by selected cluster
  const filteredCompaniesWithoutFootprint = companiesWithoutFootprint
    ? selectedCluster && selectedCluster !== 'all'
      ? companiesWithoutFootprint.filter(c => c.clusterId === selectedCluster)
      : companiesWithoutFootprint
    : [];

  const showOnboardingSection = filteredCompaniesWithoutFootprint.length > 0 && selectedCluster;

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
          <div className="p-2 rounded-lg bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold">{inProgress}</div>
            <div className="text-sm text-muted-foreground">Em Progresso</div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-success/10">
            <CheckCircle2 className="h-5 w-5 text-success" />
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

      {/* Onboarding Section - spans full width */}
      {showOnboardingSection && (
        <Card className="p-4 md:col-span-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <span className="font-bold text-sm">Estado de Onboarding</span>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/incentive?cluster=${selectedCluster}`}>
                Gerir <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
          <ClusterOnboardingStats
            clusterId={selectedCluster}
            companies={filteredCompaniesWithoutFootprint}
          />
        </Card>
      )}
    </div>
  );
}
