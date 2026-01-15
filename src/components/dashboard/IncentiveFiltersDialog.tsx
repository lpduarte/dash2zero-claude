import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Filter, X } from "lucide-react";
import { getSectorsWithCounts, SectorWithCount } from "@/data/sectors";

export interface IncentiveFilters {
  emailCount: "all" | "0" | "1" | "2" | "3+";
  sectors: string[];
  companySize: string[];
  regions: string[];
}

interface IncentiveFiltersDialogProps {
  filters: IncentiveFilters;
  onFiltersChange: (filters: IncentiveFilters) => void;
  companies: { sector: string; companySize?: string; region?: string }[];
}

const emailCountOptions = [
  { value: "all", label: "Todos" },
  { value: "0", label: "Nunca contactadas" },
  { value: "1", label: "1 email" },
  { value: "2", label: "2 emails" },
  { value: "3+", label: "3+ emails (saturadas)" },
];

const companySizeOptions = [
  { value: "Micro", label: "Micro" },
  { value: "Pequena", label: "Pequena" },
  { value: "Média", label: "Média" },
  { value: "Grande", label: "Grande" },
];

export const IncentiveFiltersDialog = ({
  filters,
  onFiltersChange,
  companies,
}: IncentiveFiltersDialogProps) => {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<IncentiveFilters>(filters);

  // Calculate sectors with counts
  const sectorsWithCounts = useMemo(() => {
    return getSectorsWithCounts(companies);
  }, [companies]);

  // Calculate regions with counts
  const regionsWithCounts = useMemo(() => {
    const regionCounts = companies.reduce((acc, c) => {
      const region = c.region || "Desconhecida";
      acc[region] = (acc[region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(regionCounts)
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => a.region.localeCompare(b.region));
  }, [companies]);

  // Calculate company sizes with counts
  const sizesWithCounts = useMemo(() => {
    const sizeCounts = companies.reduce((acc, c) => {
      const size = c.companySize || "Desconhecida";
      acc[size] = (acc[size] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return companySizeOptions.map(opt => ({
      ...opt,
      count: sizeCounts[opt.value] || 0,
    }));
  }, [companies]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.emailCount !== "all") count++;
    if (filters.sectors.length > 0) count++;
    if (filters.companySize.length > 0) count++;
    if (filters.regions.length > 0) count++;
    return count;
  }, [filters]);

  const handleEmailCountChange = (value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      emailCount: value as IncentiveFilters["emailCount"],
    }));
  };

  const handleSectorToggle = (sector: string) => {
    setLocalFilters(prev => ({
      ...prev,
      sectors: prev.sectors.includes(sector)
        ? prev.sectors.filter(s => s !== sector)
        : [...prev.sectors, sector],
    }));
  };

  const handleSizeToggle = (size: string) => {
    setLocalFilters(prev => ({
      ...prev,
      companySize: prev.companySize.includes(size)
        ? prev.companySize.filter(s => s !== size)
        : [...prev.companySize, size],
    }));
  };

  const handleRegionToggle = (region: string) => {
    setLocalFilters(prev => ({
      ...prev,
      regions: prev.regions.includes(region)
        ? prev.regions.filter(r => r !== region)
        : [...prev.regions, region],
    }));
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    const resetFilters: IncentiveFilters = {
      emailCount: "all",
      sectors: [],
      companySize: [],
      regions: [],
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setLocalFilters(filters);
    }
    setOpen(isOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Filter className="h-4 w-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="text-xs px-1.5 py-0 h-5">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:max-w-[400px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Filtros Avançados</SheetTitle>
          <SheetDescription>
            Refine a lista de empresas a contactar
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 py-4">
            {/* Email Count Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Nº de emails enviados</Label>
              <div className="space-y-2">
                {emailCountOptions.map(option => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Checkbox
                      checked={localFilters.emailCount === option.value}
                      onCheckedChange={() => handleEmailCountChange(option.value)}
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sector Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Sector de actividade</Label>
              <div className="space-y-2">
                {sectorsWithCounts.map(({ sector, name, count }) => (
                  <label
                    key={sector}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Checkbox
                      checked={localFilters.sectors.includes(sector)}
                      onCheckedChange={() => handleSectorToggle(sector)}
                    />
                    <span className="text-sm flex-1">{name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </label>
                ))}
              </div>
            </div>

            {/* Company Size Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Dimensão da empresa</Label>
              <div className="space-y-2">
                {sizesWithCounts.map(({ value, label, count }) => (
                  <label
                    key={value}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Checkbox
                      checked={localFilters.companySize.includes(value)}
                      onCheckedChange={() => handleSizeToggle(value)}
                    />
                    <span className="text-sm flex-1">{label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </label>
                ))}
              </div>
            </div>

            {/* Region Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Região</Label>
              <div className="space-y-2">
                {regionsWithCounts.map(({ region, count }) => (
                  <label
                    key={region}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Checkbox
                      checked={localFilters.regions.includes(region)}
                      onCheckedChange={() => handleRegionToggle(region)}
                    />
                    <span className="text-sm flex-1">{region}</span>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <SheetFooter className="flex-row gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            <X className="h-4 w-4 mr-2" />
            Limpar
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Aplicar filtros
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
