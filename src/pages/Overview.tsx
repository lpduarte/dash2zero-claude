import { useState, useMemo } from "react";
import { usePageTitle } from "@/lib/usePageTitle";
import { Header } from "@/components/dashboard/Header";
import { ClusterSelector, ImprovementPotential } from "@/components/dashboard/ClusterSelector";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { InfrastructureKPIs } from "@/components/dashboard/InfrastructureKPIs";
import { Card } from "@/components/ui/card";
import { BarChart3, Landmark } from "lucide-react";
import { TopSuppliersHighlight } from "@/components/dashboard/TopSuppliersHighlight";
import { CriticalSuppliersHighlight } from "@/components/dashboard/CriticalSuppliersHighlight";
import { CompaniesTab } from "@/components/dashboard/CompaniesTab";
import { ComparisonChart } from "@/components/dashboard/ComparisonChart";
import { EmissionsBreakdown } from "@/components/dashboard/EmissionsBreakdown";
import { PerformanceHeatmap } from "@/components/dashboard/PerformanceHeatmap";
import { SupplierEmissionsChart } from "@/components/dashboard/SupplierEmissionsChart";
import { SectorBenchmarking } from "@/components/dashboard/SectorBenchmarking";
import { FinancialAnalysis } from "@/components/dashboard/FinancialAnalysis";
import { EmissionsParetoChart } from "@/components/dashboard/EmissionsParetoChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { 
  getSuppliersWithFootprintByOwnerType,
  allEmpresaSuppliers,
  allMunicipioSuppliers,
} from "@/data/suppliers";
import { getClustersByOwnerType } from "@/data/clusters";
import { getSectorsWithCounts } from "@/data/sectors";
import { Supplier, UniversalFilterState } from "@/types/supplier";
import { useUser } from "@/contexts/UserContext";

// Função para calcular potencial de melhoria de um conjunto de fornecedores
// Lógica diferenciada: Empresa usa substituição, Município usa média setorial
const calculateImprovementPotential = (suppliers: Supplier[], isMunicipio: boolean): ImprovementPotential => {
  if (suppliers.length === 0) return 'low';

  const totalEmissions = suppliers.reduce((acc, s) => acc + s.totalEmissions, 0);

  // Calcular média de emissões por setor
  const sectorAverages: Record<string, { total: number; count: number }> = {};
  suppliers.forEach(s => {
    if (!sectorAverages[s.sector]) {
      sectorAverages[s.sector] = { total: 0, count: 0 };
    }
    sectorAverages[s.sector].total += s.totalEmissions;
    sectorAverages[s.sector].count += 1;
  });

  const getSectorAverage = (sector: string) => {
    const data = sectorAverages[sector];
    return data ? data.total / data.count : 0;
  };

  let potentialEmissions: number;

  if (isMunicipio) {
    // MUNICÍPIO: Se empresas acima da média setorial chegassem à média
    potentialEmissions = totalEmissions;
    suppliers.forEach(supplier => {
      const sectorAvg = getSectorAverage(supplier.sector);
      if (supplier.totalEmissions > sectorAvg) {
        potentialEmissions -= (supplier.totalEmissions - sectorAvg);
      }
    });
  } else {
    // EMPRESA: Substituição por melhores alternativas do mesmo setor
    potentialEmissions = totalEmissions;
    suppliers.forEach(supplier => {
      const alternatives = suppliers.filter(s =>
        s.id !== supplier.id &&
        s.sector === supplier.sector &&
        s.totalEmissions < supplier.totalEmissions
      );
      if (alternatives.length > 0) {
        const bestAlternative = alternatives.sort((a, b) => a.totalEmissions - b.totalEmissions)[0];
        potentialEmissions -= (supplier.totalEmissions - bestAlternative.totalEmissions);
      }
    });
  }

  const savingsPercentage = totalEmissions > 0 ? ((totalEmissions - potentialEmissions) / totalEmissions) * 100 : 0;

  if (savingsPercentage > 20) return 'high';
  if (savingsPercentage > 10) return 'medium';
  return 'low';
};

const Overview = () => {
  usePageTitle("Dashboard");
  const { user, isMunicipio } = useUser();
  const [selectedCluster, setSelectedCluster] = useState<string>('all');
  const [universalFilters, setUniversalFilters] = useState<UniversalFilterState>({
    companySize: [],
    district: [],
    municipality: [],
    parish: [],
    sector: [],
  });

  // Base suppliers - usa dados dinâmicos baseado no tipo de utilizador
  const baseSuppliers = useMemo(() => {
    const ownerType = isMunicipio ? 'municipio' : 'empresa';
    return getSuppliersWithFootprintByOwnerType(ownerType) as Supplier[];
  }, [isMunicipio]);

  // Clusters dinâmicos baseados no tipo de utilizador
  const clusters = useMemo(() => {
    const ownerType = isMunicipio ? 'municipio' : 'empresa';
    return getClustersByOwnerType(ownerType);
  }, [isMunicipio]);

  // Get unique sectors with counts from centralized config
  const sectorsWithCounts = useMemo(() => getSectorsWithCounts(baseSuppliers), [baseSuppliers]);

  const clusterCounts = useMemo(() => {
    const counts: Record<string, number> = { all: baseSuppliers.length };
    clusters.forEach(cluster => {
      counts[cluster.id] = baseSuppliers.filter(s => s.clusterIds?.includes(cluster.id)).length;
    });
    return counts;
  }, [baseSuppliers, clusters]);

  const clusterPotentials = useMemo(() => {
    const potentials: Record<string, ImprovementPotential> = {
      all: calculateImprovementPotential(baseSuppliers, isMunicipio),
    };
    clusters.forEach(cluster => {
      potentials[cluster.id] = calculateImprovementPotential(
        baseSuppliers.filter(s => s.clusterIds?.includes(cluster.id)),
        isMunicipio
      );
    });
    return potentials;
  }, [baseSuppliers, clusters, isMunicipio]);

  // Total de empresas por cluster (universo total do grupo)
  const clusterTotals = useMemo(() => {
    const allSuppliers = isMunicipio ? allMunicipioSuppliers : allEmpresaSuppliers;
    const totals: Record<string, number> = { all: allSuppliers.length };
    clusters.forEach(cluster => {
      totals[cluster.id] = allSuppliers.filter(s => s.clusterIds?.includes(cluster.id)).length;
    });
    return totals;
  }, [isMunicipio, clusters]);

  const filteredSuppliers = useMemo(() => {
    let filtered = baseSuppliers;

    // Filtro de cluster
    if (selectedCluster !== 'all') {
      filtered = filtered.filter(supplier => supplier.clusterIds?.includes(selectedCluster));
    }

    // Filtro de dimensão (multiselect)
    if (universalFilters.companySize.length > 0) {
      filtered = filtered.filter(s => universalFilters.companySize.includes(s.companySize));
    }

    // Filtro de setor/atividade
    if (universalFilters.sector.length > 0) {
      filtered = filtered.filter(s => universalFilters.sector.includes(s.sector));
    }

    // Filtros de localização - apenas para empresa
    if (!isMunicipio) {
      if (universalFilters.district.length > 0) {
        filtered = filtered.filter(s => universalFilters.district.includes(s.district));
      }
      if (universalFilters.municipality.length > 0) {
        filtered = filtered.filter(s => universalFilters.municipality.includes(s.municipality));
      }
    }

    // Filtro freguesia (ambos os tipos)
    if (universalFilters.parish.length > 0) {
      filtered = filtered.filter(s => universalFilters.parish.includes(s.parish));
    }

    return filtered.sort((a, b) => a.totalEmissions - b.totalEmissions);
  }, [selectedCluster, universalFilters, baseSuppliers, isMunicipio]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="relative z-10 max-w-[1400px] mx-auto px-8 pt-4 pb-8">
        <ClusterSelector
          selectedCluster={selectedCluster}
          onClusterChange={setSelectedCluster}
          clusterCounts={clusterCounts}
          clusterPotentials={clusterPotentials}
          suppliers={baseSuppliers}
          universalFilters={universalFilters}
          onUniversalFiltersChange={setUniversalFilters}
        />

        
        <Tabs defaultValue="home" className="space-y-6 mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="home">Visão geral</TabsTrigger>
            <TabsTrigger value="companies">Empresas</TabsTrigger>
            <TabsTrigger value="overview">Detalhes das emissões</TabsTrigger>
            <TabsTrigger value="environmental">Análise por atividade</TabsTrigger>
            <TabsTrigger value="financial">Análise por faturação</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6" forceMount={false}>
            {/* GRUPO 1: KPIs de Emissões */}
            <MetricsOverview suppliers={filteredSuppliers} totalCompanies={clusterTotals[selectedCluster]} />

            {/* GRUPO 2: KPIs de Infraestruturas (APENAS municípios) */}
            {isMunicipio && <InfrastructureKPIs />}

            <div className="space-y-6">
              <CriticalSuppliersHighlight suppliers={filteredSuppliers} allSuppliers={baseSuppliers} />
              <TopSuppliersHighlight suppliers={filteredSuppliers} />
            </div>
          </TabsContent>

          <TabsContent value="companies" className="space-y-6" forceMount={false}>
            <CompaniesTab suppliers={filteredSuppliers} />
          </TabsContent>

          <TabsContent value="overview" className="space-y-6" forceMount={false}>
            <div className="grid grid-cols-4 gap-6 items-stretch">
              <div className="col-span-1 flex flex-col">
                <EmissionsBreakdown suppliers={filteredSuppliers} />
              </div>
              <div className="col-span-3 flex flex-col">
                <ComparisonChart
                  suppliers={filteredSuppliers}
                  sectors={sectorsWithCounts}
                />
              </div>
            </div>

            <SupplierEmissionsChart suppliers={filteredSuppliers} />
          </TabsContent>

          <TabsContent value="environmental" className="space-y-6" forceMount={false}>
            <PerformanceHeatmap suppliers={filteredSuppliers} />
            <SectorBenchmarking suppliers={filteredSuppliers} />
          </TabsContent>

          <TabsContent value="financial" className="space-y-6" forceMount={false}>
            <FinancialAnalysis suppliers={filteredSuppliers} />
            <EmissionsParetoChart suppliers={filteredSuppliers} />
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
};

export default Overview;
