import { TrendingDown, Settings, Pencil, Trash2, Plus, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useMemo, useEffect, useRef } from "react";
import { Supplier, UniversalFilterState } from "@/types/supplier";
import { ClusterDefinition } from "@/types/clusterNew";
import { FilterButton } from "./FilterButton";
import { FilterModal } from "./FilterModal";
import { ActiveFiltersDisplay } from "./ActiveFiltersDisplay";
import { useUser } from "@/contexts/UserContext";
import { getClusterConfig } from "@/config/clusters";
import { getClusterById } from "@/data/clusters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ImprovementPotential = 'high' | 'medium' | 'low';

type DeleteAction = 'move' | 'delete';

interface ClusterActionsProps {
  onEdit?: (cluster: ClusterDefinition) => void;
  onDelete?: (cluster: ClusterDefinition, action?: DeleteAction, targetClusterId?: string) => void;
  onCreateNew?: () => void;
}

interface ClusterSelectorProps extends ClusterActionsProps {
  selectedCluster: string;
  onClusterChange: (cluster: string) => void;
  clusterCounts: Record<string, number>;
  clusterPotentials?: Record<string, ImprovementPotential>;
  showPotential?: boolean;
  showFilterButton?: boolean;
  suppliers: Supplier[];
  universalFilters: UniversalFilterState;
  onUniversalFiltersChange: (filters: UniversalFilterState) => void;
  clusterOptions?: ReturnType<typeof getClusterConfig>;
  clusters?: ClusterDefinition[];
}

const getPotentialConfig = (potential: ImprovementPotential, isSelected: boolean) => {
  const configs = {
    high: {
      icon: TrendingDown,
      color: isSelected ? '!text-red-300' : '!text-danger group-hover:!text-red-300',
      bgColor: isSelected ? 'bg-white/15' : 'bg-danger/15 group-hover:bg-white/15'
    },
    medium: {
      icon: TrendingDown,
      color: isSelected ? '!text-yellow-300' : '!text-warning group-hover:!text-yellow-300',
      bgColor: isSelected ? 'bg-white/15' : 'bg-warning/15 group-hover:bg-white/15'
    },
    low: {
      icon: TrendingDown,
      color: isSelected ? '!text-green-300' : '!text-success group-hover:!text-green-300',
      bgColor: isSelected ? 'bg-white/15' : 'bg-success/15 group-hover:bg-white/15'
    },
  };
  return configs[potential];
};

export function ClusterSelector({
  selectedCluster,
  onClusterChange,
  clusterCounts,
  clusterPotentials,
  showPotential = true,
  showFilterButton = true,
  suppliers,
  universalFilters,
  onUniversalFiltersChange,
  onEdit,
  onDelete,
  onCreateNew,
  clusterOptions: externalOptions,
  clusters: externalClusters,
}: ClusterSelectorProps) {
  const { userType } = useUser();
  // Use external options if provided, otherwise fetch internally
  const clusterOptions = externalOptions ?? getClusterConfig(userType);

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [isStuck, setIsStuck] = useState(false);
  const [actionsDropdownOpen, setActionsDropdownOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteAction, setDeleteAction] = useState<DeleteAction>('move');
  const [targetClusterId, setTargetClusterId] = useState<string>('');
  const stickyRef = useRef<HTMLDivElement>(null);

  // Check if cluster actions are enabled (handlers provided)
  const hasClusterActions = !!(onEdit || onDelete);

  // Get the selected cluster definition for actions
  // Use external clusters if provided, otherwise fetch from data store
  const selectedClusterDef = useMemo(() => {
    if (selectedCluster === 'all') return undefined;
    if (externalClusters) {
      return externalClusters.find(c => c.id === selectedCluster);
    }
    return getClusterById(selectedCluster);
  }, [selectedCluster, externalClusters]);

  // Get companies count in the selected cluster
  const companiesInSelectedCluster = selectedCluster !== 'all' ? (clusterCounts[selectedCluster] || 0) : 0;

  // Get other clusters for move target (excluding 'all' and the current cluster)
  const otherClusters = useMemo(() => {
    return clusterOptions.filter(c => c.value !== 'all' && c.value !== selectedCluster);
  }, [clusterOptions, selectedCluster]);

  // Reset delete dialog state when opening
  useEffect(() => {
    if (showDeleteConfirm) {
      setDeleteAction('move');
      // Set first available cluster as target
      const availableClusters = clusterOptions.filter(c => c.value !== 'all' && c.value !== selectedCluster);
      setTargetClusterId(availableClusters.length > 0 ? availableClusters[0].value : '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDeleteConfirm]);

  // Close dropdown when cluster changes
  useEffect(() => {
    setActionsDropdownOpen(false);
  }, [selectedCluster]);

  // Detect when sticky element is stuck
  useEffect(() => {
    const stickyElement = stickyRef.current;
    if (!stickyElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the sentinel is not visible, the sticky is stuck
        setIsStuck(!entry.isIntersecting);
      },
      { threshold: 1, rootMargin: "-17px 0px 0px 0px" } // 16px (top-4) + 1px buffer
    );

    // Create a sentinel element above the sticky
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    sentinel.style.marginBottom = '-1px';
    stickyElement.parentNode?.insertBefore(sentinel, stickyElement);
    
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, []);

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    return (
      universalFilters.companySize.length +
      universalFilters.sector.length +
      universalFilters.district.length +
      universalFilters.municipality.length +
      universalFilters.parish.length
    );
  }, [universalFilters]);

  // Handle removing individual filter
  const handleRemoveFilter = (key: keyof UniversalFilterState, value: string) => {
    const newFilters = { ...universalFilters };
    
    if (key === 'district') {
      newFilters.district = newFilters.district.filter(v => v !== value);
      // Reset dependent filters if removing last district
      if (newFilters.district.length === 0) {
        newFilters.municipality = [];
        newFilters.parish = [];
      }
    } else if (key === 'municipality') {
      newFilters.municipality = newFilters.municipality.filter(v => v !== value);
      // Reset parish if removing last municipality
      if (newFilters.municipality.length === 0) {
        newFilters.parish = [];
      }
    } else {
      newFilters[key] = newFilters[key].filter(v => v !== value);
    }
    
    onUniversalFiltersChange(newFilters);
  };

  // Detect empty state (no clusters created yet)
  const hasNoClusters = clusterOptions.filter(c => c.value !== 'all').length === 0;

  // Empty state when no clusters exist
  if (hasNoClusters && onCreateNew) {
    return (
      <div className="mb-6">
        <div className="flex items-center gap-4">
          {/* Botão Novo cluster */}
          <button
            onClick={onCreateNew}
            className="inline-flex items-center justify-center gap-2 h-10 px-4 py-2 rounded-md text-sm font-normal border border-dashed border-primary text-primary hover:bg-primary/5 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Novo cluster
          </button>

          {/* Seta animada + texto */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <ArrowLeft className="h-5 w-5" style={{ animation: 'bounce-x 1s ease-in-out infinite' }} />
            <span className="text-sm">
              Começe por criar clusters para organizar empresas (ex: Fornecedores, Clientes, Parceiros)
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Label - não faz sticky */}
      <h3 className="text-sm font-normal text-muted-foreground mb-3">Filtrar por Cluster</h3>

      {/* Sticky container - só os botões */}
      <div
        ref={stickyRef}
        className={cn(
          "sticky top-4 z-50 py-2 px-4 mb-4 -mx-4 rounded-lg transition-all duration-200",
          isStuck && "bg-background/80 backdrop-blur-md shadow-md border-b border-border/30"
        )}
      >
        <div className="flex justify-between items-center gap-4">
          {/* Left side - Cluster buttons */}
          <div data-tour="cluster-selector" className="flex flex-wrap gap-2">
            {clusterOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedCluster === option.value;
              const canHaveActions = hasClusterActions && option.value !== 'all';
              const showActions = isSelected && canHaveActions;

              return (
                <div
                  key={option.value}
                  className={cn(
                    "group flex items-center rounded-lg border transition-all duration-200",
                    "[&_svg]:text-current",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-card text-card-foreground border-border hover:border-primary/50 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
                  )}
                >
                  <button
                    onClick={() => onClusterChange(option.value)}
                    className="flex items-center gap-2 px-4 py-2.5"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-normal">{option.labelPlural}</span>
                    <span
                      className={cn(
                        "ml-1 px-2 py-0.5 rounded-full text-xs font-bold",
                        isSelected
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:bg-primary-foreground/20 group-hover:text-primary-foreground"
                      )}
                    >
                      {clusterCounts[option.value]}
                    </span>
                    {showPotential && clusterPotentials && (() => {
                      const potential = clusterPotentials[option.value];
                      const config = getPotentialConfig(potential, isSelected);
                      const PotentialIcon = config.icon;
                      return (
                        <span className={cn("ml-1 p-1 rounded-full", config.bgColor)}>
                          <PotentialIcon className={cn("h-3 w-3", config.color)} />
                        </span>
                      );
                    })()}
                  </button>
                  {canHaveActions && (
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-300 ease-out flex",
                        showActions ? "max-w-[40px]" : "max-w-0"
                      )}
                    >
                      <DropdownMenu open={showActions && actionsDropdownOpen} onOpenChange={setActionsDropdownOpen}>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="flex items-center justify-center px-2 border-l border-primary-foreground/20 self-stretch"
                            onClick={(e) => e.stopPropagation()}
                            tabIndex={showActions ? 0 : -1}
                          >
                            <span className="flex items-center justify-center p-1 rounded hover:bg-primary-foreground/15 transition-colors">
                              <Settings className="h-4 w-4" />
                            </span>
                          </button>
                        </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {onEdit && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setActionsDropdownOpen(false);
                              if (selectedClusterDef) onEdit(selectedClusterDef);
                            }}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar cluster
                          </DropdownMenuItem>
                        )}
                        {onEdit && onDelete && <DropdownMenuSeparator />}
                        {onDelete && (
                          <DropdownMenuItem
                            className="text-danger focus:text-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActionsDropdownOpen(false);
                              setShowDeleteConfirm(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar cluster
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
                  )}
                </div>
              );
            })}

            {/* New cluster button */}
            {onCreateNew && (
              <button
                onClick={onCreateNew}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                <span className="font-normal">Novo cluster</span>
              </button>
            )}
          </div>

          {/* Right side - Filter button */}
          {showFilterButton && (
            <div data-tour="filter-button" className="flex-shrink-0">
              <FilterButton
                activeFiltersCount={activeFiltersCount}
                onClick={() => setFilterModalOpen(true)}
              />
            </div>
          )}
        </div>

        {/* Active filters chips */}
        <ActiveFiltersDisplay
          filters={universalFilters}
          onRemoveFilter={handleRemoveFilter}
        />
      </div>

      <FilterModal
        suppliers={suppliers}
        currentFilters={universalFilters}
        onFilterChange={onUniversalFiltersChange}
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
      />

      {/* Delete Confirmation Dialog */}
      {selectedClusterDef && (
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Eliminar cluster</DialogTitle>
              <DialogDescription>
                Tem a certeza que pretende eliminar o cluster "{selectedClusterDef.name}"?
                Esta ação é irreversível.
              </DialogDescription>
            </DialogHeader>

            {companiesInSelectedCluster > 0 && (
              <div className="space-y-4 py-2">
                <p className="text-sm">
                  Este cluster tem <strong>{companiesInSelectedCluster}</strong> empresa{companiesInSelectedCluster !== 1 ? 's' : ''} associada{companiesInSelectedCluster !== 1 ? 's' : ''}.
                  O que deseja fazer com ela{companiesInSelectedCluster !== 1 ? 's' : ''}?
                </p>

                <div className="space-y-3">
                  {/* Move option */}
                  <div
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                      deleteAction === 'move' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    )}
                    onClick={() => setDeleteAction('move')}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center",
                      deleteAction === 'move' ? "border-primary" : "border-muted-foreground"
                    )}>
                      {deleteAction === 'move' && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label className="cursor-pointer">Mover para outro cluster</Label>
                      {deleteAction === 'move' && otherClusters.length > 0 && (
                        <Select value={targetClusterId} onValueChange={setTargetClusterId}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione o cluster de destino" />
                          </SelectTrigger>
                          <SelectContent>
                            {otherClusters.map(cluster => (
                              <SelectItem key={cluster.value} value={cluster.value}>
                                {cluster.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {deleteAction === 'move' && otherClusters.length === 0 && (
                        <p className="text-sm text-muted-foreground">Não existem outros clusters disponíveis.</p>
                      )}
                    </div>
                  </div>

                  {/* Delete option */}
                  <div
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                      deleteAction === 'delete' ? "border-danger bg-danger/5" : "border-border hover:border-danger/50"
                    )}
                    onClick={() => setDeleteAction('delete')}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center",
                      deleteAction === 'delete' ? "border-danger" : "border-muted-foreground"
                    )}>
                      {deleteAction === 'delete' && <div className="w-2 h-2 rounded-full bg-danger" />}
                    </div>
                    <div>
                      <Label className="cursor-pointer text-danger">Eliminar empresas</Label>
                      <p className="text-xs text-muted-foreground mt-1">As empresas serão removidas permanentemente.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                disabled={companiesInSelectedCluster > 0 && deleteAction === 'move' && !targetClusterId}
                onClick={() => {
                  if (onDelete) {
                    onDelete(
                      selectedClusterDef,
                      companiesInSelectedCluster > 0 ? deleteAction : undefined,
                      deleteAction === 'move' ? targetClusterId : undefined
                    );
                  }
                  setShowDeleteConfirm(false);
                }}
              >
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export type { ImprovementPotential, DeleteAction };
export type { ClusterType } from "@/config/clusters";
