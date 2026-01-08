import { TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useMemo, useEffect, useRef } from "react";
import { Supplier, UniversalFilterState } from "@/types/supplier";
import { FilterButton } from "./FilterButton";
import { FilterModal } from "./FilterModal";
import { ActiveFiltersDisplay } from "./ActiveFiltersDisplay";
import { useUser } from "@/contexts/UserContext";
import { getClusterConfig, ClusterType } from "@/config/clusters";

type ImprovementPotential = 'high' | 'medium' | 'low';

interface ClusterSelectorProps {
  selectedCluster: ClusterType;
  onClusterChange: (cluster: ClusterType) => void;
  clusterCounts: Record<ClusterType, number>;
  clusterPotentials: Record<ClusterType, ImprovementPotential>;
  suppliers: Supplier[];
  universalFilters: UniversalFilterState;
  onUniversalFiltersChange: (filters: UniversalFilterState) => void;
}

const getPotentialConfig = (potential: ImprovementPotential, isSelected: boolean) => {
  const configs = {
    high: { 
      icon: TrendingDown, 
      color: isSelected ? 'text-red-200' : 'text-danger',
      bgColor: isSelected ? 'bg-red-200/30' : 'bg-danger/15'
    },
    medium: { 
      icon: TrendingDown, 
      color: isSelected ? 'text-yellow-200' : 'text-warning',
      bgColor: isSelected ? 'bg-yellow-200/30' : 'bg-warning/15'
    },
    low: { 
      icon: TrendingDown, 
      color: isSelected ? 'text-green-200' : 'text-success',
      bgColor: isSelected ? 'bg-green-200/30' : 'bg-success/15'
    },
  };
  return configs[potential];
};

export function ClusterSelector({ 
  selectedCluster, 
  onClusterChange, 
  clusterCounts, 
  clusterPotentials,
  suppliers,
  universalFilters,
  onUniversalFiltersChange,
}: ClusterSelectorProps) {
  const { userType } = useUser();
  const clusterOptions = getClusterConfig(userType);
  
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [isStuck, setIsStuck] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      {/* Label - não faz sticky */}
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Filtrar por Cluster</h3>
      
      {/* Sticky container - só os botões */}
      <div 
        ref={stickyRef}
        className={cn(
          "sticky top-4 z-50 pb-4 mb-2 -mx-8 px-8 pt-2 rounded-lg transition-all duration-200",
          isStuck 
            ? "bg-background/80 backdrop-blur-md shadow-md border-b border-border/30" 
            : "bg-background"
        )}
      >
        <div className="flex justify-between items-center gap-4">
          {/* Left side - Cluster buttons */}
          <div className="flex flex-wrap gap-2">
            {clusterOptions.map((option) => {
              const Icon = option.icon;
              return (
              <button
                key={option.value}
                onClick={() => onClusterChange(option.value)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200",
                  "[&_svg]:text-current",
                  selectedCluster === option.value
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-card text-card-foreground border-border hover:border-primary/50 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{option.labelPlural}</span>
                <span
                  className={cn(
                    "ml-1 px-2 py-0.5 rounded-full text-xs font-semibold",
                    selectedCluster === option.value
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {clusterCounts[option.value]}
                </span>
                {(() => {
                  const potential = clusterPotentials[option.value];
                  const config = getPotentialConfig(potential, selectedCluster === option.value);
                  const PotentialIcon = config.icon;
                  return (
                    <span className={cn("ml-1 p-1 rounded-full", config.bgColor)}>
                      <PotentialIcon className={cn("h-3 w-3", config.color)} />
                    </span>
                  );
                })()}
              </button>
            );})}
          </div>

          {/* Right side - Filter button */}
          <div className="flex-shrink-0">
            <FilterButton
              activeFiltersCount={activeFiltersCount}
              onClick={() => setFilterModalOpen(true)}
            />
          </div>
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
    </>
  );
}

export type { ImprovementPotential };
export type { ClusterType } from "@/config/clusters";
