import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Header } from "@/components/dashboard/Header";
import { ClusterStats } from "@/components/clusters/ClusterStats";
import { ProvidersTable } from "@/components/clusters/ProvidersTable";
import { ImportDialog } from "@/components/clusters/ImportDialog";
import { CreateClusterDialog } from "@/components/clusters/CreateClusterDialog";
import { ClusterActionsMenu } from "@/components/clusters/ClusterActionsMenu";
import { ClusterSelector } from "@/components/dashboard/ClusterSelector";
import {
  getSuppliersWithFootprintByOwnerType,
  getSuppliersWithoutFootprintByOwnerType,
} from "@/data/suppliers";
import {
  getClustersByOwnerType,
  createCluster,
  updateCluster,
  archiveCluster,
  deleteCluster,
  duplicateCluster,
  getClusterById,
} from "@/data/clusters";
import { ClusterProvider } from "@/types/cluster";
import { ClusterDefinition, CreateClusterInput } from "@/types/clusterNew";
import { Supplier, UniversalFilterState } from "@/types/supplier";
import { Users, Upload, Download, Search, X, Plus, Target } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { getClusterConfig } from "@/config/clusters";
import { useToast } from "@/hooks/use-toast";

// Converter Supplier para ClusterProvider
const supplierToProvider = (supplier: Supplier): ClusterProvider => ({
  id: supplier.id,
  name: supplier.name,
  nif: supplier.contact.nif,
  email: supplier.contact.email,
  status: supplier.rating === 'A' || supplier.rating === 'B' ? 'completed' : 
          supplier.rating === 'C' ? 'in-progress' : 'not-registered',
  emailsSent: Math.floor(Math.random() * 5),
  lastContact: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
});

const ITEMS_PER_PAGE = 10;

export default function ClusterManagement() {
  const { user, isMunicipio, userType } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const ownerType = isMunicipio ? 'municipio' : 'empresa';

  const [selectedClusterType, setSelectedClusterType] = useState<string>('all');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingCluster, setEditingCluster] = useState<ClusterDefinition | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>(["NIF/NIPC", "Email", "Setor"]);
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
  }, [ownerType]);

  // Companies without footprint - for onboarding stats
  const companiesWithoutFootprint = useMemo(() => {
    return getSuppliersWithoutFootprintByOwnerType(ownerType);
  }, [ownerType]);

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

  // Get cluster counts - dinâmicos
  const clusterCounts = useMemo(() => {
    const counts: Record<string, number> = { all: baseSuppliers.length };
    clusters.forEach(cluster => {
      counts[cluster.id] = baseSuppliers.filter(s => s.clusterId === cluster.id).length;
    });
    return counts;
  }, [baseSuppliers, clusters]);

  // Filter suppliers by selected cluster and universal filters
  const filteredSuppliers = useMemo(() => {
    let filtered = baseSuppliers;
    
    if (selectedClusterType !== 'all') {
      filtered = filtered.filter(s => s.clusterId === selectedClusterType);
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

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(query) ||
          company.id.toLowerCase().includes(query) ||
          company.contact.email.toLowerCase().includes(query) ||
          company.sector.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [selectedClusterType, searchQuery, universalFilters, baseSuppliers, isMunicipio]);

  // Converter suppliers filtrados para formato ClusterProvider
  const clusterProviders = useMemo(() => {
    return filteredSuppliers.map(supplierToProvider);
  }, [filteredSuppliers]);

  const totalPages = Math.ceil(filteredSuppliers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSuppliers = filteredSuppliers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleImport = (file: File) => {
    console.log("Importing file:", file.name);
  };

  const handleExport = () => {
    const headers = [
      "Nome", "NIF/NIPC", "Email", "Setor", "Cluster", "Distrito", "Faturação anual (€)",
      "Colaboradores", "Área (m²)", "Âmbito 1 (t CO₂e)", "Âmbito 2 (t CO₂e)",
      "Âmbito 3 (t CO₂e)", "Emissões Totais (t CO₂e)", "Rating"
    ];

    const csvContent = [
      headers.join(","),
      ...filteredSuppliers.map((company) =>
        [
          `"${company.name}"`,
          company.id,
          company.contact.email,
          company.sector,
          company.clusterId || '',
          company.region,
          company.revenue * 1000000,
          company.employees,
          company.area,
          company.scope1,
          company.scope2,
          company.scope3,
          company.totalEmissions,
          company.rating,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `cluster_${selectedClusterType}_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter));
  };

  const getClusterLabel = () => {
    const option = clusterOptions.find(o => o.value === selectedClusterType);
    return option?.label || 'Cluster';
  };

  // CRUD Handlers
  const handleCreateCluster = (input: CreateClusterInput) => {
    const newCluster = createCluster(input, ownerType);
    refreshClusters();
    toast({
      title: "Cluster criado",
      description: `O cluster "${newCluster.name}" foi criado com sucesso.`,
    });
  };

  const handleEditCluster = (cluster: ClusterDefinition) => {
    setEditingCluster(cluster);
    setCreateDialogOpen(true);
  };

  const handleUpdateCluster = (input: CreateClusterInput) => {
    if (!editingCluster) return;
    const updated = updateCluster(editingCluster.id, input);
    if (updated) {
      refreshClusters();
      toast({
        title: "Cluster atualizado",
        description: `O cluster "${updated.name}" foi atualizado com sucesso.`,
      });
    }
    setEditingCluster(undefined);
  };

  const handleDuplicateCluster = (cluster: ClusterDefinition) => {
    const duplicated = duplicateCluster(cluster.id);
    if (duplicated) {
      refreshClusters();
      toast({
        title: "Cluster duplicado",
        description: `Foi criada uma cópia do cluster "${cluster.name}".`,
      });
    }
  };

  const handleArchiveCluster = (cluster: ClusterDefinition) => {
    const success = archiveCluster(cluster.id);
    if (success) {
      // Se o cluster arquivado estava selecionado, voltar para "all"
      if (selectedClusterType === cluster.id) {
        setSelectedClusterType('all');
      }
      refreshClusters();
      toast({
        title: "Cluster arquivado",
        description: `O cluster "${cluster.name}" foi arquivado.`,
      });
    }
  };

  const handleDeleteCluster = (cluster: ClusterDefinition) => {
    const success = deleteCluster(cluster.id);
    if (success) {
      // Se o cluster eliminado estava selecionado, voltar para "all"
      if (selectedClusterType === cluster.id) {
        setSelectedClusterType('all');
      }
      refreshClusters();
      toast({
        title: "Cluster eliminado",
        description: `O cluster "${cluster.name}" foi eliminado permanentemente.`,
        variant: "destructive",
      });
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

      <main className="relative z-10 max-w-[1400px] mx-auto px-8 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Gestão de Clusters
          </h1>
          <p className="text-muted-foreground mt-1">
            Organize e monitorize os seus grupos de empresas
          </p>
        </div>

        {/* Cluster Selector */}
        <ClusterSelector
          selectedCluster={selectedClusterType}
          onClusterChange={(cluster) => {
            setSelectedClusterType(cluster);
            setCurrentPage(1);
          }}
          clusterCounts={clusterCounts}
          showPotential={false}
          suppliers={baseSuppliers}
          universalFilters={universalFilters}
          onUniversalFiltersChange={setUniversalFilters}
        />

        {/* Actions Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-xl font-bold">{getClusterLabel()}</h2>
              <p className="text-sm text-muted-foreground">
                {filteredSuppliers.length.toLocaleString('pt-PT')} empresas {selectedClusterType !== 'all' ? 'neste cluster' : 'no total'}
              </p>
            </div>
            {/* Menu de ações do cluster selecionado */}
            {selectedClusterType !== 'all' && (() => {
              const cluster = getClusterById(selectedClusterType);
              return cluster ? (
                <ClusterActionsMenu
                  cluster={cluster}
                  onEdit={handleEditCluster}
                  onDuplicate={handleDuplicateCluster}
                  onArchive={handleArchiveCluster}
                  onDelete={handleDeleteCluster}
                />
              ) : null;
            })()}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cluster
            </Button>
            <Button onClick={() => navigate(`/incentivo?cluster=${selectedClusterType}`)}>
              <Target className="h-4 w-4 mr-2" />
              Incentivar
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
          </div>
        </div>

        <Tabs defaultValue="resumo" className="space-y-6">
          <TabsList>
            <TabsTrigger value="resumo">Vista Resumida</TabsTrigger>
            <TabsTrigger value="detalhes">Vista Detalhada</TabsTrigger>
          </TabsList>

          <TabsContent value="resumo" className="space-y-6">
            <ClusterStats
              providers={clusterProviders}
              selectedCluster={selectedClusterType}
              companiesWithoutFootprint={companiesWithoutFootprint}
            />
            <Card className="p-6 shadow-md">
              <ProvidersTable providers={clusterProviders} />
            </Card>
          </TabsContent>

          <TabsContent value="detalhes" className="space-y-6">
            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex items-center gap-2 border border-border rounded-md px-4 py-2 bg-card">
                {activeFilters.map((filter) => (
                  <Badge key={filter} variant="secondary" className="gap-1 bg-secondary/50">
                    {filter}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter(filter)} />
                  </Badge>
                ))}
              </div>
              <div className="relative sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Full details table */}
            <Card className="shadow-md overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="text-foreground font-bold min-w-[180px]">Nome</TableHead>
                    <TableHead className="text-foreground font-bold min-w-[200px]">Email</TableHead>
                    <TableHead className="text-foreground font-bold min-w-[120px]">Setor</TableHead>
                    <TableHead className="text-foreground font-bold min-w-[100px]">Região</TableHead>
                    <TableHead className="text-foreground font-bold min-w-[120px]">Faturação (€)</TableHead>
                    <TableHead className="text-foreground font-bold min-w-[100px]">Colab.</TableHead>
                    <TableHead className="text-foreground font-bold min-w-[100px]">Área (m²)</TableHead>
                    <TableHead className="text-foreground font-bold min-w-[120px]">Âmbito 1</TableHead>
                    <TableHead className="text-foreground font-bold min-w-[120px]">Âmbito 2</TableHead>
                    <TableHead className="text-foreground font-bold min-w-[120px]">Âmbito 3</TableHead>
                    <TableHead className="text-foreground font-bold min-w-[140px]">Total (t CO₂e)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSuppliers.map((company, index) => (
                    <TableRow
                      key={company.id}
                      className={index % 2 === 0 ? "bg-muted/50" : "bg-background"}
                    >
                      <TableCell className="font-normal">{company.name}</TableCell>
                      <TableCell>{company.contact.email}</TableCell>
                      <TableCell className="capitalize">{company.sector}</TableCell>
                      <TableCell className="capitalize">{company.region}</TableCell>
                      <TableCell>{(company.revenue * 1000000).toLocaleString('pt-PT')}</TableCell>
                      <TableCell>{company.employees}</TableCell>
                      <TableCell>{company.area.toLocaleString('pt-PT')}</TableCell>
                      <TableCell>{company.scope1.toFixed(1)}</TableCell>
                      <TableCell>{company.scope2.toFixed(1)}</TableCell>
                      <TableCell>{company.scope3.toFixed(1)}</TableCell>
                      <TableCell className="font-bold">{company.totalEmissions.toFixed(1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {currentPage > 2 && (
                    <PaginationItem>
                      <PaginationLink onClick={() => setCurrentPage(1)} className="cursor-pointer">1</PaginationLink>
                    </PaginationItem>
                  )}
                  {currentPage > 3 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationLink onClick={() => setCurrentPage(currentPage - 1)} className="cursor-pointer">
                        {currentPage - 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink isActive className="cursor-pointer">{currentPage}</PaginationLink>
                  </PaginationItem>
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationLink onClick={() => setCurrentPage(currentPage + 1)} className="cursor-pointer">
                        {currentPage + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  {currentPage < totalPages - 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                  {currentPage < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationLink onClick={() => setCurrentPage(totalPages)} className="cursor-pointer">
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <ImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        clusterId={selectedClusterType}
        onImport={handleImport}
      />

      <CreateClusterDialog
        open={createDialogOpen}
        onOpenChange={handleDialogClose}
        onSave={editingCluster ? handleUpdateCluster : handleCreateCluster}
        existingCluster={editingCluster}
      />
    </div>
  );
}
