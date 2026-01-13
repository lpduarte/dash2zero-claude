import { Euro } from "lucide-react";
import { mockFunding } from "@/data/mockFunding";
import { cn } from "@/lib/utils";

export const BulkStep3Funding = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Definir Financiamento</h3>
        <p className="text-sm text-muted-foreground">
          O sistema irá sugerir automaticamente os fundos elegíveis para cada empresa
          com base nas medidas selecionadas.
        </p>
      </div>

      <div className="p-6 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
            <Euro className="h-6 w-6 text-blue-600" />
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-blue-800 dark:text-blue-200">Fundos elegíveis automáticos</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Para cada empresa, o sistema irá:
            </p>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 ml-4 list-disc">
              <li>Verificar elegibilidade com base nas medidas selecionadas</li>
              <li>Priorizar fundos com maior comparticipação</li>
              <li>Considerar prazos de candidatura</li>
              <li>Maximizar cobertura do investimento</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Resumo dos fundos disponíveis */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">
          Fundos disponíveis:
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {mockFunding.filter(f => f.currentlyOpen).slice(0, 6).map(fund => (
            <div key={fund.id} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">{fund.name}</p>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  fund.type === 'subsidio' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                  fund.type === 'incentivo' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                  'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                )}>
                  {fund.type === 'subsidio' ? 'Subsídio' : 
                   fund.type === 'incentivo' ? 'Incentivo' : 'Financiamento'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Até {fund.maxAmount.toLocaleString('pt-PT')}€ ({fund.percentage}%)
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
