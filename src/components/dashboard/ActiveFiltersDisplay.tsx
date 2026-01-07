import { X, Building2, MapPin, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UniversalFilterState } from "@/types/supplier";

interface ActiveFiltersDisplayProps {
  filters: UniversalFilterState;
  onRemoveFilter: (key: keyof UniversalFilterState, value: string) => void;
}

const companySizeLabels: Record<string, string> = {
  micro: "Micro",
  pequena: "Pequena",
  media: "Média",
  grande: "Grande",
};

export function ActiveFiltersDisplay({ filters, onRemoveFilter }: ActiveFiltersDisplayProps) {
  const hasActiveFilters = 
    filters.companySize.length > 0 ||
    filters.district.length > 0 ||
    filters.municipality.length > 0 ||
    filters.parish.length > 0;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      <span className="text-sm text-muted-foreground">Filtros ativos:</span>
      
      {filters.companySize.map(size => (
        <Badge
          key={`size-${size}`}
          variant="secondary"
          className="gap-1 cursor-pointer hover:bg-secondary/80 transition-colors"
          onClick={() => onRemoveFilter('companySize', size)}
        >
          <Building2 className="h-3 w-3" />
          {companySizeLabels[size] || size}
          <X className="h-3 w-3" />
        </Badge>
      ))}
      
      {filters.district.map(district => (
        <Badge
          key={`district-${district}`}
          variant="secondary"
          className="gap-1 cursor-pointer hover:bg-secondary/80 transition-colors"
          onClick={() => onRemoveFilter('district', district)}
        >
          <MapPin className="h-3 w-3" />
          {district}
          <X className="h-3 w-3" />
        </Badge>
      ))}
      
      {filters.municipality.map(municipality => (
        <Badge
          key={`municipality-${municipality}`}
          variant="secondary"
          className="gap-1 cursor-pointer hover:bg-secondary/80 transition-colors"
          onClick={() => onRemoveFilter('municipality', municipality)}
        >
          <Landmark className="h-3 w-3" />
          {municipality}
          <X className="h-3 w-3" />
        </Badge>
      ))}
      
      {filters.parish.map(parish => (
        <Badge
          key={`parish-${parish}`}
          variant="secondary"
          className="gap-1 cursor-pointer hover:bg-secondary/80 transition-colors"
          onClick={() => onRemoveFilter('parish', parish)}
        >
          <MapPin className="h-3 w-3" />
          {parish}
          <X className="h-3 w-3" />
        </Badge>
      ))}
    </div>
  );
}
