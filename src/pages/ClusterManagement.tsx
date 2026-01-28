import { useState, useMemo } from "react";
import { usePageTitle } from "@/lib/usePageTitle";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/dashboard/Header";
import { ClusterStats } from "@/components/clusters/ClusterStats";
import { ProvidersTable } from "@/components/clusters/ProvidersTable";
import { AddCompaniesDialog, NewCompanyData } from "@/components/clusters/AddCompaniesDialog";
import { CreateClusterDialog } from "@/components/clusters/CreateClusterDialog";
import { ClusterSelector, DeleteAction } from "@/components/dashboard/ClusterSelector";
import {
  getSuppliersWithFootprintByOwnerType,
  getSuppliersWithoutFootprintByOwnerType,
  addSuppliersWithoutFootprint,
  addSupplierToCluster,
  removeSupplierFromCluster,
  deleteSuppliers,
  moveSuppliersToCluster,
} from "@/data/suppliers";
import { getCompanyEmailTracking } from "@/data/emailTracking";
import {
  getClustersByOwnerType,
  createCluster,
  updateCluster,
  deleteCluster,
} from "@/data/clusters";
import { ClusterDefinition, CreateClusterInput } from "@/types/clusterNew";
import { Supplier, UniversalFilterState } from "@/types/supplier";
import { SupplierWithoutFootprint, SupplierAny } from "@/types/supplierNew";
import { CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { getClusterConfig } from "@/config/clusters";

export default function ClusterManagement() {
  usePageTitle("Clusters");
  const { isMunicipio, userType, isGet2C, activeClient } = useUser();
  const navigate = useNavigate();
  const ownerType = isMunicipio ? 'municipio' : 'empresa';

  const [selectedClusterType, setSelectedClusterType] = useState<string>('all');
  const [addCompaniesDialogOpen, setAddCompaniesDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingCluster, setEditingCluster] = useState<ClusterDefinition | undefined>();
  const [universalFilters, setUniversalFilters] = useState<UniversalFilterState>({
    companySize: [],
    district: [],
    municipality: [],
    parish: [],
    sector: [],
  });
  // Trigger para forçar refresh dos clusters
  const [clustersVersion, setClustersVersion] = useState(0);
  const refreshClusters = () => setClustersVersion(v => v + 1);

  // Base suppliers - filtrados por ownerType
  const baseSuppliers = useMemo(() => {
    return getSuppliersWithFootprintByOwnerType(ownerType) as Supplier[];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerType, clustersVersion]);

  // Companies without footprint - for onboarding stats
  const companiesWithoutFootprint = useMemo(() => {
    return getSuppliersWithoutFootprintByOwnerType(ownerType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerType, clustersVersion]);

  // Clusters dinâmicos (depende de clustersVersion para refresh)
  const clusters = useMemo(() => {
    return getClustersByOwnerType(ownerType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerType, clustersVersion]);

  // Cluster options (para o selector)
  const clusterOptions = useMemo(() => {
    return getClusterConfig(userType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType, clustersVersion]);

  // Combinar todas as empresas (com e sem pegada) num formato normalizado
  const allCompanies = useMemo((): SupplierAny[] => {
    // Empresas com pegada - são tratadas como "completo"
    const withFootprint = baseSuppliers.map(s => ({
      ...s,
      onboardingStatus: 'completo' as const,
      completedVia: (s.dataSource === 'get2zero' ? 'simple' : 'formulario') as const,
      // Campos extra que SupplierWithoutFootprint tem
      emailsSent: 0,
    }));

    const withoutFootprint = companiesWithoutFootprint as SupplierWithoutFootprint[];

    // Deduplicar por NIF/NIPC (empresas com pegada têm prioridade)
    const seen = new Set<string>();
    const result: SupplierAny[] = [];

    // Primeiro adicionar empresas com pegada
    withFootprint.forEach(company => {
      const key = company.contact.nif;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(company);
      }
    });

    // Depois adicionar empresas sem pegada (apenas se não existirem)
    withoutFootprint.forEach(company => {
      const key = company.contact.nif;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(company);
      }
    });

    return result;
  }, [baseSuppliers, companiesWithoutFootprint]);

  // Get cluster counts - baseado em TODAS as empresas
  const clusterCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allCompanies.length };
    clusters.forEach(cluster => {
      counts[cluster.id] = allCompanies.filter(c => c.clusterIds.includes(cluster.id)).length;
    });
    return counts;
  }, [allCompanies, clusters]);

  // State detection for empty states
  const hasNoClusters = clusterOptions.filter(c => c.value !== 'all').length === 0;
  const selectedClusterId = selectedClusterType !== 'all' ? selectedClusterType : null;

  // Filter suppliers by selected cluster and universal filters
  const filteredSuppliers = useMemo(() => {
    let filtered = baseSuppliers;

    if (selectedClusterType !== 'all') {
      filtered = filtered.filter(s => s.clusterIds.includes(selectedClusterType));
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

    // Filtro de setor/atividade
    if (universalFilters.sector.length > 0) {
      filtered = filtered.filter(s => universalFilters.sector.includes(s.sector));
    }

    return filtered;
  }, [selectedClusterType, universalFilters, baseSuppliers, isMunicipio]);

  // Filter all companies by selected cluster
  const filteredAllCompanies = useMemo(() => {
    if (selectedClusterType === 'all') {
      return allCompanies;
    }
    return allCompanies.filter(c => c.clusterIds.includes(selectedClusterType));
  }, [allCompanies, selectedClusterType]);

  // Calculate incontactaveis count from email tracking data
  const incontactaveis = useMemo(() => {
    return filteredAllCompanies.filter(c => {
      const tracking = getCompanyEmailTracking(c.id);
      return tracking?.hasDeliveryIssues;
    }).length;
  }, [filteredAllCompanies]);

  const handleAddCompanies = (companies: NewCompanyData[]) => {
    // Get the target cluster (use selected cluster if not 'all', otherwise empty string)
    const targetClusterId = selectedClusterType !== 'all' ? selectedClusterType : '';

    if (!targetClusterId) {
      console.warn("No cluster selected for adding companies");
      return;
    }

    // Add companies to the data layer
    const inputs = companies.map(c => ({
      name: c.name,
      nif: c.nif,
      email: c.email,
      clusterIds: [targetClusterId],
    }));

    addSuppliersWithoutFootprint(inputs, ownerType);

    // Trigger refresh to show new companies
    refreshClusters();
  };

  const handleAddCompaniesInline = (companies: NewCompanyData[]) => {
    // Same logic as handleAddCompanies
    handleAddCompanies(companies);
  };

  // Handler para eliminar empresas
  const handleDeleteCompanies = (companyIds: string[]) => {
    deleteSuppliers(companyIds, ownerType);
    refreshClusters();
  };

  // Handler para mover empresas entre clusters
  const handleMoveCompanies = (companyIds: string[], targetClusterId: string, keepCopy: boolean) => {
    // Remove do cluster atual (se não for "Todas" e se não for para manter cópia)
    if (!keepCopy && selectedClusterId && selectedClusterId !== 'all') {
      companyIds.forEach(id => {
        removeSupplierFromCluster(id, selectedClusterId, ownerType);
      });
    }
    // Adiciona ao cluster destino
    moveSuppliersToCluster(companyIds, targetClusterId, ownerType);
    refreshClusters();
  };

  // CRUD Handlers
  const handleCreateCluster = (input: CreateClusterInput) => {
    const newCluster = createCluster(input, ownerType);
    refreshClusters();
    // Automatically select the newly created cluster
    if (newCluster) {
      setSelectedClusterType(newCluster.id);
    }
  };

  const handleEditCluster = (cluster: ClusterDefinition) => {
    setEditingCluster(cluster);
    setCreateDialogOpen(true);
  };

  const handleUpdateCluster = (input: CreateClusterInput) => {
    if (!editingCluster) return;
    updateCluster(editingCluster.id, input);
    refreshClusters();
    setEditingCluster(undefined);
  };

  const handleDeleteCluster = (cluster: ClusterDefinition, action?: DeleteAction, targetClusterId?: string) => {
    // Encontrar empresas neste cluster
    const companiesInCluster = allCompanies.filter(c => c.clusterIds.includes(cluster.id));

    if (action === 'move' && targetClusterId) {
      // Mover: adicionar ao destino E remover do cluster a eliminar
      companiesInCluster.forEach(company => {
        addSupplierToCluster(company.id, targetClusterId, ownerType);
        removeSupplierFromCluster(company.id, cluster.id, ownerType);
      });
    } else if (action === 'delete') {
      // Eliminar referências: remover clusterId das empresas
      companiesInCluster.forEach(company => {
        removeSupplierFromCluster(company.id, cluster.id, ownerType);
      });
      // Eliminar empresas que ficam sem clusters (órfãs não são permitidas)
      const orphanIds = companiesInCluster
        .filter(c => c.clusterIds.length === 1) // só tinham este cluster
        .map(c => c.id);
      if (orphanIds.length > 0) {
        deleteSuppliers(orphanIds, ownerType);
      }
    }

    // Encontrar cluster adjacente antes de eliminar
    let nextClusterId = 'all';
    if (selectedClusterType === cluster.id) {
      const clusterList = clusterOptions.filter(c => c.value !== 'all' && c.value !== cluster.id);
      if (clusterList.length > 0) {
        const currentIndex = clusterOptions.findIndex(c => c.value === cluster.id);
        const nextOption = clusterOptions[currentIndex + 1];
        const prevOption = clusterOptions[currentIndex - 1];
        if (nextOption && nextOption.value !== 'all') {
          nextClusterId = nextOption.value;
        } else if (prevOption && prevOption.value !== 'all') {
          nextClusterId = prevOption.value;
        } else {
          nextClusterId = clusterList[0].value;
        }
      }
    }

    const success = deleteCluster(cluster.id);
    if (success) {
      if (selectedClusterType === cluster.id) {
        setSelectedClusterType(nextClusterId);
      }
      refreshClusters();
    }
  };

  const handleDialogClose = (open: boolean) => {
    setCreateDialogOpen(open);
    if (!open) {
      setEditingCluster(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className={cn("relative z-10 max-w-[1400px] mx-auto px-8", isGet2C && activeClient ? "pt-4 pb-8" : "py-8")}>
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CircleDot className="h-6 w-6 text-primary" />
            Gerir clusters
          </h1>
          <p className="text-muted-foreground mt-1">
            Organize e monitorize os seus grupos de empresas
          </p>
        </div>

        {/* Cluster Selector */}
        <ClusterSelector
          selectedCluster={selectedClusterType}
          onClusterChange={setSelectedClusterType}
          clusterCounts={clusterCounts}
          showPotential={false}
          showFilterButton={false}
          suppliers={baseSuppliers}
          universalFilters={universalFilters}
          onUniversalFiltersChange={setUniversalFilters}
          onEdit={handleEditCluster}
          onDelete={handleDeleteCluster}
          onCreateNew={() => setCreateDialogOpen(true)}
          clusterOptions={clusterOptions}
          clusters={clusters}
        />

        {!hasNoClusters && (
          <div className="space-y-6">
            <ClusterStats
              selectedCluster={selectedClusterType}
              companies={filteredAllCompanies}
              incontactaveis={incontactaveis}
            />
            <Card className="p-6 shadow-md">
              <ProvidersTable
                companies={filteredAllCompanies}
                onAddCompanies={() => setAddCompaniesDialogOpen(true)}
                onAddCompaniesInline={handleAddCompaniesInline}
                onDeleteCompanies={handleDeleteCompanies}
                onMoveCompanies={handleMoveCompanies}
                onIncentivize={() => navigate(`/incentivo?cluster=${selectedClusterType}`)}
                hasNoClusters={hasNoClusters}
                selectedClusterId={selectedClusterId}
                clusters={clusters}
              />
            </Card>
          </div>
        )}
      </main>

      <AddCompaniesDialog
        open={addCompaniesDialogOpen}
        onOpenChange={setAddCompaniesDialogOpen}
        clusterId={selectedClusterType === 'all' ? '' : selectedClusterType}
        onClusterChange={setSelectedClusterType}
        clusters={clusters}
        onAddCompanies={handleAddCompanies}
      />

      <CreateClusterDialog
        open={createDialogOpen}
        onOpenChange={handleDialogClose}
        onSave={editingCluster ? handleUpdateCluster : handleCreateCluster}
        existingCluster={editingCluster}
        existingClusterNames={clusters.map(c => c.name)}
      />
    </div>
  );
}
