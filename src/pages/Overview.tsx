import { useState, useMemo } from "react";
import { Header } from "@/components/dashboard/Header";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { ClusterSelector, ClusterType, ImprovementPotential } from "@/components/dashboard/ClusterSelector";
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

import { mockSuppliers } from "@/data/mockSuppliers";
import { getSectorsWithCounts } from "@/data/sectors";
import { Supplier, UniversalFilterState } from "@/types/supplier";
import { useUser } from "@/contexts/UserContext";

// Função para calcular potencial de melhoria de um conjunto de fornecedores
// Usa média global (não por setor) para consistência com o KPI card
const calculateImprovementPotential = (suppliers: Supplier[]): ImprovementPotential => {
  if (suppliers.length === 0) return 'low';
  
  // Calculate overall average emissions
  const totalEmissions = suppliers.reduce((acc, s) => acc + s.totalEmissions, 0);
  const avgEmissions = totalEmissions / suppliers.length;
  
  // Count critical suppliers (emissions > 1.2x overall average)
  const criticalCount = suppliers.filter(s => 
    s.totalEmissions > avgEmissions * 1.2
  ).length;
  
  const criticalPercentage = (criticalCount / suppliers.length) * 100;
  
  if (criticalPercentage > 30) return 'high';
  if (criticalPercentage > 15) return 'medium';
  return 'low';
};

const Overview = () => {
  const { user, isMunicipio } = useUser();
  const [selectedCluster, setSelectedCluster] = useState<ClusterType>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [universalFilters, setUniversalFilters] = useState<UniversalFilterState>({
    companySize: [],
    district: [],
    municipality: [],
    parish: [],
  });

  // Base suppliers - filtrados por município se userType === 'municipio'
  const baseSuppliers = useMemo(() => {
    if (isMunicipio && user.municipality) {
      return mockSuppliers.filter(s => s.municipality === user.municipality);
    }
    return mockSuppliers;
  }, [isMunicipio, user.municipality]);

  // Get unique sectors with counts from centralized config
  const sectorsWithCounts = useMemo(() => getSectorsWithCounts(baseSuppliers), [baseSuppliers]);

  const clusterCounts = useMemo(() => {
    return {
      all: baseSuppliers.length,
      fornecedor: baseSuppliers.filter(s => s.cluster === 'fornecedor').length,
      cliente: baseSuppliers.filter(s => s.cluster === 'cliente').length,
      parceiro: baseSuppliers.filter(s => s.cluster === 'parceiro').length,
    };
  }, [baseSuppliers]);

  const clusterPotentials = useMemo((): Record<ClusterType, ImprovementPotential> => {
    return {
      all: calculateImprovementPotential(baseSuppliers),
      fornecedor: calculateImprovementPotential(baseSuppliers.filter(s => s.cluster === 'fornecedor')),
      cliente: calculateImprovementPotential(baseSuppliers.filter(s => s.cluster === 'cliente')),
      parceiro: calculateImprovementPotential(baseSuppliers.filter(s => s.cluster === 'parceiro')),
    };
  }, [baseSuppliers]);

  // Total de empresas por cluster (universo total do grupo)
  const clusterTotals: Record<ClusterType, number> = {
    all: 150,
    fornecedor: 20,
    cliente: 55,
    parceiro: 75,
  };

  const filteredSuppliers = useMemo(() => {
    let filtered = baseSuppliers;
    
    // Filtro de cluster
    if (selectedCluster !== 'all') {
      filtered = filtered.filter(supplier => supplier.cluster === selectedCluster);
    }
    
    // Filtro de dimensão (multiselect)
    if (universalFilters.companySize.length > 0) {
      filtered = filtered.filter(s => universalFilters.companySize.includes(s.companySize));
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

  // Suppliers filtered by both cluster and sector (for charts)
  const chartFilteredSuppliers = useMemo(() => {
    let filtered = filteredSuppliers;
    
    if (selectedSector !== 'all') {
      filtered = filtered.filter((s) => s.sector === selectedSector);
    }

    return filtered;
  }, [filteredSuppliers, selectedSector]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-[1400px] mx-auto px-8 py-8">
        <WelcomeBanner />
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

          <TabsContent value="home" className="space-y-6">
            {/* GRUPO 1: KPIs de Emissões */}
            <MetricsOverview suppliers={filteredSuppliers} totalCompanies={clusterTotals[selectedCluster]} />
            
            {/* GRUPO 2: KPIs de Infraestruturas (APENAS municípios) */}
            {isMunicipio && <InfrastructureKPIs />}

            <div className="space-y-6">
              <CriticalSuppliersHighlight suppliers={filteredSuppliers} allSuppliers={baseSuppliers} />
              <TopSuppliersHighlight suppliers={filteredSuppliers} />
            </div>
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            <CompaniesTab suppliers={filteredSuppliers} />
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-4 gap-6 items-stretch">
              <div className="col-span-1 flex flex-col">
                <EmissionsBreakdown suppliers={chartFilteredSuppliers} />
              </div>
              <div className="col-span-3 flex flex-col">
                <ComparisonChart 
                  suppliers={chartFilteredSuppliers} 
                  sectors={sectorsWithCounts}
                  selectedSector={selectedSector}
                  onSectorChange={setSelectedSector}
                />
              </div>
            </div>

            <SupplierEmissionsChart suppliers={chartFilteredSuppliers} />
          </TabsContent>

          <TabsContent value="environmental" className="space-y-6">
            <PerformanceHeatmap suppliers={filteredSuppliers} />
            <SectorBenchmarking suppliers={filteredSuppliers} />
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <FinancialAnalysis suppliers={filteredSuppliers} />
            <EmissionsParetoChart suppliers={filteredSuppliers} />
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
};

export default Overview;
