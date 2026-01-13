import { Sparkles } from "lucide-react";
import { Supplier } from "@/types/supplier";
import type { BulkPlanResult } from "../types";
import { getDominantScope } from "../utils";

interface BulkStep2MeasuresProps {
  selectedEmpresas: Supplier[];
  planResults: BulkPlanResult[];
}

export const BulkStep2Measures = ({
  selectedEmpresas,
  planResults,
}: BulkStep2MeasuresProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Definir Medidas</h3>
        <p className="text-sm text-muted-foreground">
          O sistema irá selecionar automaticamente as melhores medidas para cada empresa
          com base no seu perfil de emissões.
        </p>
      </div>

      <div className="p-6 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
            <Sparkles className="h-6 w-6 text-green-600" />
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-green-800 dark:text-green-200">Recomendações automáticas</h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              Para cada empresa, o sistema irá:
            </p>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 ml-4 list-disc">
              <li>Analisar a distribuição de emissões por âmbito</li>
              <li>Selecionar medidas com maior impacto potencial</li>
              <li>Priorizar medidas Soft (menor investimento, resultados rápidos)</li>
              <li>Verificar compatibilidade com infraestrutura municipal</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">
          Pré-visualização ({selectedEmpresas.length} empresas):
        </h4>
        <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
          {planResults.slice(0, 5).map(result => (
            <div key={result.empresa.id} className="p-3 flex items-center justify-between">
              <div>
                <p className="font-medium">{result.empresa.name}</p>
                <p className="text-xs text-muted-foreground">
                  Âmbito dominante: {getDominantScope(result.empresa)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-primary">{result.measures.length} medidas</p>
                <p className="text-xs text-muted-foreground">
                  -{result.totalReduction.toLocaleString('pt-PT')}t CO₂e
                </p>
              </div>
            </div>
          ))}
          {selectedEmpresas.length > 5 && (
            <div className="p-3 text-center text-sm text-muted-foreground">
              ... e mais {selectedEmpresas.length - 5} empresas
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
