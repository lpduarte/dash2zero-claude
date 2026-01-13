import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";
import { Supplier } from "@/types/supplier";
import type { SelectionMode, CustomFilters } from "../types";

interface BulkStep1SelectionProps {
  suppliers: Supplier[];
  selectedEmpresas: Supplier[];
  empresasSemPlano: Supplier[];
  empresasAcimaMedia: Supplier[];
  empresasRiscoAlto: Supplier[];
  selectionMode: SelectionMode;
  onSelectionModeChange: (mode: SelectionMode) => void;
  manualSelection: string[];
  onManualSelectionChange: (ids: string[]) => void;
  customFilters: CustomFilters;
  onCustomFiltersChange: (filters: CustomFilters) => void;
}

export const BulkStep1Selection = ({
  suppliers,
  selectedEmpresas,
  empresasSemPlano,
  empresasAcimaMedia,
  empresasRiscoAlto,
  selectionMode,
  onSelectionModeChange,
  manualSelection,
  onManualSelectionChange,
  customFilters,
  onCustomFiltersChange,
}: BulkStep1SelectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Selecionar Empresas</h3>
        <p className="text-sm text-muted-foreground">
          Escolha as empresas que receberão planos de descarbonização automáticos.
        </p>
      </div>

      {/* Filtros Rápidos */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Filtros rápidos:</p>
        
        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
          <input
            type="radio"
            name="selectionMode"
            checked={selectionMode === 'sem_plano'}
            onChange={() => onSelectionModeChange('sem_plano')}
            className="text-primary"
          />
          <span>Todas sem plano</span>
          <span className="ml-auto text-sm text-muted-foreground">
            ({empresasSemPlano.length} empresas)
          </span>
        </label>

        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
          <input
            type="radio"
            name="selectionMode"
            checked={selectionMode === 'acima_media'}
            onChange={() => onSelectionModeChange('acima_media')}
            className="text-primary"
          />
          <span>Todas acima da média do setor</span>
          <span className="ml-auto text-sm text-muted-foreground">
            ({empresasAcimaMedia.length} empresas)
          </span>
        </label>

        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
          <input
            type="radio"
            name="selectionMode"
            checked={selectionMode === 'risco_alto'}
            onChange={() => onSelectionModeChange('risco_alto')}
            className="text-primary"
          />
          <span>Todas com risco Alto ou Crítico</span>
          <span className="ml-auto text-sm text-muted-foreground">
            ({empresasRiscoAlto.length} empresas)
          </span>
        </label>
      </div>

      {/* Filtros Personalizados */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
          <input
            type="radio"
            name="selectionMode"
            checked={selectionMode === 'personalizado'}
            onChange={() => onSelectionModeChange('personalizado')}
            className="text-primary"
          />
          <span>Personalizar filtros...</span>
        </label>

        {selectionMode === 'personalizado' && (
          <div className="ml-6 p-4 bg-muted/30 rounded-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Risco</label>
                <Select 
                  value={customFilters.risco} 
                  onValueChange={(v) => onCustomFiltersChange({ ...customFilters, risco: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="crítico">Crítico</SelectItem>
                    <SelectItem value="alto">Alto</SelectItem>
                    <SelectItem value="médio">Médio</SelectItem>
                    <SelectItem value="baixo">Baixo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Estado</label>
                <Select 
                  value={customFilters.estado} 
                  onValueChange={(v) => onCustomFiltersChange({ ...customFilters, estado: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="sem_plano">Sem plano</SelectItem>
                    <SelectItem value="em_preparacao">Em preparação</SelectItem>
                    <SelectItem value="plano_pronto">Plano pronto</SelectItem>
                    <SelectItem value="enviado">Enviado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Cluster</label>
                <Select 
                  value={customFilters.cluster} 
                  onValueChange={(v) => onCustomFiltersChange({ ...customFilters, cluster: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="apoiadas">Apoiadas</SelectItem>
                    <SelectItem value="monitorizadas">Monitorizadas</SelectItem>
                    <SelectItem value="parceiras">Parceiras</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Setor</label>
                <Select 
                  value={customFilters.setor} 
                  onValueChange={(v) => onCustomFiltersChange({ ...customFilters, setor: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="comércio">Comércio</SelectItem>
                    <SelectItem value="indústria">Indústria</SelectItem>
                    <SelectItem value="serviços">Serviços</SelectItem>
                    <SelectItem value="turismo">Turismo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2">
                <label className="text-sm font-medium">Âmbito dominante</label>
                <Select 
                  value={customFilters.ambitoDominante} 
                  onValueChange={(v) => onCustomFiltersChange({ ...customFilters, ambitoDominante: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="ambito1">Âmbito 1 (Diretas)</SelectItem>
                    <SelectItem value="ambito2">Âmbito 2 (Energia)</SelectItem>
                    <SelectItem value="ambito3">Âmbito 3 (Indiretas)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Seleção Manual */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
          <input
            type="radio"
            name="selectionMode"
            checked={selectionMode === 'manual'}
            onChange={() => onSelectionModeChange('manual')}
            className="text-primary"
          />
          <span>Selecionar manualmente</span>
        </label>

        {selectionMode === 'manual' && (
          <div className="ml-6 p-4 bg-muted/30 rounded-lg max-h-60 overflow-y-auto space-y-2">
            {suppliers.map(supplier => (
              <label key={supplier.id} className="flex items-center gap-3 p-2 hover:bg-muted rounded cursor-pointer">
                <Checkbox
                  checked={manualSelection.includes(supplier.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onManualSelectionChange([...manualSelection, supplier.id]);
                    } else {
                      onManualSelectionChange(manualSelection.filter(id => id !== supplier.id));
                    }
                  }}
                />
                <span>{supplier.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {supplier.emissionsPerRevenue.toFixed(2)} kg CO₂e/€
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Resumo da seleção */}
      <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <span className="font-medium">Empresas selecionadas: {selectedEmpresas.length}</span>
        </div>
      </div>
    </div>
  );
};
