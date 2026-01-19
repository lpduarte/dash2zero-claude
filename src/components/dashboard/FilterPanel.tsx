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
    <Card className="p-6 shadow-md mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Filtros</h2>
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
              <SelectItem value="industria">Indústria</SelectItem>
              <SelectItem value="tecnologia">Tecnologia</SelectItem>
              <SelectItem value="construcao">Construção</SelectItem>
              <SelectItem value="logistica">Logística</SelectItem>
              <SelectItem value="servicos">Serviços</SelectItem>
              <SelectItem value="comercio">Comércio</SelectItem>
              <SelectItem value="alimentar">Alimentar</SelectItem>
              <SelectItem value="energia">Energia</SelectItem>
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
