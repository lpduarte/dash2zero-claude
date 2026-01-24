import { X, Building2, MapPin, Landmark, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UniversalFilterState } from "@/types/supplier";
import { getSectorName } from "@/data/sectors";

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
    filters.sector.length > 0 ||
    filters.district.length > 0 ||
    filters.municipality.length > 0 ||
    filters.parish.length > 0;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 mt-3">
      
      {filters.companySize.map(size => (
        <Badge
          key={`size-${size}`}
          className="gap-2 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/80 transition-colors border-transparent"
          onClick={() => onRemoveFilter('companySize', size)}
        >
          <Building2 className="h-3 w-3" />
          {companySizeLabels[size] || size}
          <X className="h-3 w-3" />
        </Badge>
      ))}

      {filters.sector.map(sector => (
        <Badge
          key={`sector-${sector}`}
          className="gap-2 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/80 transition-colors border-transparent"
          onClick={() => onRemoveFilter('sector', sector)}
        >
          <Briefcase className="h-3 w-3" />
          {getSectorName(sector)}
          <X className="h-3 w-3" />
        </Badge>
      ))}

      {filters.district.map(district => (
        <Badge
          key={`district-${district}`}
          className="gap-2 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/80 transition-colors border-transparent"
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
          className="gap-2 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/80 transition-colors border-transparent"
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
          className="gap-2 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/80 transition-colors border-transparent"
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
