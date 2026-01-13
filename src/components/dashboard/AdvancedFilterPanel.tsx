import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, RotateCcw } from "lucide-react";
import { AdvancedFilters } from "@/types/supplier";

interface AdvancedFilterPanelProps {
  filters: AdvancedFilters;
  onFilterChange: (key: keyof AdvancedFilters, value: any) => void;
  onReset: () => void;
}

export const AdvancedFilterPanel = ({
  filters,
  onFilterChange,
  onReset,
}: AdvancedFilterPanelProps) => {
  return (
    <Card className="p-6 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onReset}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Limpar Filtros
        </Button>
      </div>

      <div className="flex justify-center">
        <div className="space-y-2 w-full max-w-md">
          <Label htmlFor="cluster" className="text-xs text-muted-foreground">
            Selecionar cluster
          </Label>
          <Select 
            value={filters.nifGroup} 
            onValueChange={(value) => onFilterChange('nifGroup', value)}
          >
            <SelectTrigger id="cluster">
              <SelectValue placeholder="Todos os clusters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os clusters</SelectItem>
              <SelectItem value="fornecedor">Fornecedor</SelectItem>
              <SelectItem value="cliente">Cliente</SelectItem>
              <SelectItem value="parceiro">Parceiro</SelectItem>
              <SelectItem value="subcontratado">Subcontratado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};
