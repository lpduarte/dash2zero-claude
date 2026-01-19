import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterButtonProps {
  activeFiltersCount: number;
  onClick: () => void;
}

export function FilterButton({ activeFiltersCount, onClick }: FilterButtonProps) {
  return (
    <Button variant="outline" onClick={onClick} className="gap-2">
      <Filter className="h-4 w-4" />
      <span>Filtros</span>
      {activeFiltersCount > 0 && (
        <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-muted text-muted-foreground">
          {activeFiltersCount}
        </span>
      )}
    </Button>
  );
}
