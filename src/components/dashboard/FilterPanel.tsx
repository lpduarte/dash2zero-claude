import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectorFilter, RegionFilter } from "@/types/supplier";
import { Filter } from "lucide-react";

interface FilterPanelProps {
  sector: SectorFilter;
  region: RegionFilter;
  onSectorChange: (value: SectorFilter) => void;
  onRegionChange: (value: RegionFilter) => void;
}

export const FilterPanel = ({
  sector,
  region,
  onSectorChange,
  onRegionChange,
}: FilterPanelProps) => {
  return (
    <Card className="p-6 shadow-sm mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Filtros</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="sector">Setor de Atividade</Label>
          <Select value={sector} onValueChange={onSectorChange}>
            <SelectTrigger id="sector">
              <SelectValue placeholder="Selecione o setor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Setores</SelectItem>
              <SelectItem value="manufacturing">Indústria</SelectItem>
              <SelectItem value="technology">Tecnologia</SelectItem>
              <SelectItem value="construction">Construção</SelectItem>
              <SelectItem value="transport">Transporte</SelectItem>
              <SelectItem value="services">Serviços</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="region">Região</Label>
          <Select value={region} onValueChange={onRegionChange}>
            <SelectTrigger id="region">
              <SelectValue placeholder="Selecione a região" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Regiões</SelectItem>
              <SelectItem value="north">Norte</SelectItem>
              <SelectItem value="center">Centro</SelectItem>
              <SelectItem value="south">Sul</SelectItem>
              <SelectItem value="islands">Ilhas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};
