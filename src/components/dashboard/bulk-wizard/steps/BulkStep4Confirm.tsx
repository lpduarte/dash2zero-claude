import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, AlertTriangle } from "lucide-react";
import type { BulkPlanResult, TargetHandling } from "../types";

interface BulkStep4ConfirmProps {
  planResults: BulkPlanResult[];
  withTarget: BulkPlanResult[];
  withoutTarget: BulkPlanResult[];
  totalInvestment: number;
  totalReduction: number;
  targetHandling: TargetHandling;
  onTargetHandlingChange: (handling: TargetHandling) => void;
  selectedForGeneration: string[];
  onSelectedForGenerationChange: (ids: string[]) => void;
  showSuccess: boolean;
  onClose: () => void;
  initializeReviewSelection: () => void;
}

export const BulkStep4Confirm = ({
  planResults,
  withTarget,
  withoutTarget,
  totalInvestment,
  totalReduction,
  targetHandling,
  onTargetHandlingChange,
  selectedForGeneration,
  onSelectedForGenerationChange,
  showSuccess,
  onClose,
  initializeReviewSelection,
}: BulkStep4ConfirmProps) => {
  if (showSuccess) {
    return (
      <div className="space-y-6 text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20">
          <CheckCircle className="h-8 w-8 text-success" />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Planos gerados com sucesso!</h3>
          <p className="text-muted-foreground">
            {targetHandling === 'only_target' ? withTarget.length : 
             targetHandling === 'review' ? selectedForGeneration.length : 
             planResults.length} planos foram criados.
          </p>
        </div>
        <Button onClick={onClose} className="mt-4">
          Fechar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Resumo e Confirmação</h3>
        <p className="text-sm text-muted-foreground">
          Reveja os planos antes de gerar.
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-success/10 border border-success/30 rounded-lg text-center">
          <p className="text-sm text-success">Atingem meta</p>
          <p className="text-2xl font-bold text-success">{withTarget.length}</p>
          <p className="text-xs text-success">empresas</p>
        </div>
        <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg text-center">
          <p className="text-sm text-warning">Não atingem meta</p>
          <p className="text-2xl font-bold text-warning">{withoutTarget.length}</p>
          <p className="text-xs text-warning">empresas</p>
        </div>
      </div>

      {/* Aviso se há empresas sem meta */}
      {withoutTarget.length > 0 && (
        <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <p className="font-medium text-warning">
                {withoutTarget.length} empresas não atingem meta com estas medidas.
              </p>
              <p className="text-sm text-warning mt-1">
                Os planos podem ser revistos individualmente depois.
              </p>
            </div>
          </div>

          <div className="space-y-2 ml-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="targetHandling"
                checked={targetHandling === 'all'}
                onChange={() => onTargetHandlingChange('all')}
                className="text-primary"
              />
              <span className="text-sm">Gerar todos os planos (podem ser revistos depois)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="targetHandling"
                checked={targetHandling === 'only_target'}
                onChange={() => onTargetHandlingChange('only_target')}
                className="text-primary"
              />
              <span className="text-sm">Gerar apenas os {withTarget.length} com meta atingida</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="targetHandling"
                checked={targetHandling === 'review'}
                onChange={() => {
                  onTargetHandlingChange('review');
                  initializeReviewSelection();
                }}
                className="text-primary"
              />
              <span className="text-sm">Ver lista e decidir individualmente</span>
            </label>
          </div>
        </div>
      )}

      {/* Totais */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-muted/50 border rounded-lg text-center">
          <p className="text-sm text-muted-foreground">Investimento total</p>
          <p className="text-2xl font-bold">{totalInvestment.toLocaleString('pt-PT')}€</p>
        </div>
        <div className="p-4 bg-muted/50 border rounded-lg text-center">
          <p className="text-sm text-muted-foreground">Redução esperada</p>
          <p className="text-2xl font-bold text-success">-{totalReduction.toLocaleString('pt-PT')}t</p>
          <p className="text-xs text-muted-foreground">CO₂e</p>
        </div>
      </div>

      {/* Lista de empresas (se review) */}
      {targetHandling === 'review' && (
        <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
          {planResults.map(result => (
            <label key={result.empresa.id} className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50">
              <Checkbox
                checked={selectedForGeneration.includes(result.empresa.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onSelectedForGenerationChange([...selectedForGeneration, result.empresa.id]);
                  } else {
                    onSelectedForGenerationChange(selectedForGeneration.filter(id => id !== result.empresa.id));
                  }
                }}
              />
              <div className="flex-1">
                <p className="font-medium">{result.empresa.name}</p>
                <p className="text-xs text-muted-foreground">
                  {result.measures.length} medidas · -{result.totalReduction.toLocaleString('pt-PT')}t CO₂e
                </p>
              </div>
              {result.reachedTarget ? (
                <span className="text-xs text-success flex items-center gap-2">
                  <CheckCircle className="h-3 w-3" /> Meta ✓
                </span>
              ) : (
                <span className="text-xs text-warning flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3" /> Meta ✗
                </span>
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
