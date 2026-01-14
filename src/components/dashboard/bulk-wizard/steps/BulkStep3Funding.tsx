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

      <div className="p-6 bg-primary/10 border border-primary/30 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-primary/20">
            <Euro className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-primary">Fundos elegíveis automáticos</h4>
            <p className="text-sm text-primary">
              Para cada empresa, o sistema irá:
            </p>
            <ul className="text-sm text-primary space-y-1 ml-4 list-disc">
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
                  fund.type === 'subsidio' ? 'bg-success/20 text-success' :
                  fund.type === 'incentivo' ? 'bg-primary/20 text-primary' :
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
