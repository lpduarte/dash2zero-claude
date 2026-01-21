import { AlertTriangle, Check, Euro, Calendar, Wallet, FileCheck, Gift, BadgePercent, Landmark } from 'lucide-react';
import type { Step3Props } from '../types';
import { getApplicableMeasures } from '@/data/mockMeasures';
import { mockFunding, getApplicableFunding } from '@/data/mockFunding';
import { fundingColors } from '@/lib/styles';
import { formatNumber, formatPercentage } from '@/lib/formatters';

export const Step3Funding = ({
  supplier,
  selectedMeasures,
  selectedFunding,
  onFundingChange,
}: Step3Props) => {
  // Obter categorias das medidas selecionadas
  const applicableMeasures = getApplicableMeasures({
    sector: supplier.sector,
    companySize: supplier.companySize,
    totalEmissions: supplier.totalEmissions
  });
  const selectedMeasuresData = applicableMeasures.filter(m => selectedMeasures.includes(m.id));
  const selectedCategories = [...new Set(selectedMeasuresData.map(m => m.category))];

  // Calcular investimento total das medidas
  const totalInvestment = selectedMeasuresData.reduce((sum, m) => sum + m.investment, 0);

  // Obter fundos aplicáveis
  const applicableFunding = getApplicableFunding(
    selectedCategories,
    supplier.companySize,
    supplier.sector
  );

  // Agrupar por tipo
  const fundingByType = {
    subsidio: applicableFunding.filter(f => f.fund.type === 'subsidio'),
    incentivo: applicableFunding.filter(f => f.fund.type === 'incentivo'),
    financiamento: applicableFunding.filter(f => f.fund.type === 'financiamento'),
  };

  const typeLabels = {
    subsidio: 'Subsídios',
    incentivo: 'Incentivos',
    financiamento: 'Financiamento',
  };

  const typeConfig = {
    subsidio: { headerBg: fundingColors.subsidio.bgLight, text: fundingColors.subsidio.text, badge: 'bg-primary', icon: Gift },
    incentivo: { headerBg: fundingColors.incentivo.bgLight, text: fundingColors.incentivo.text, badge: 'bg-primary', icon: BadgePercent },
    financiamento: { headerBg: fundingColors.financiamento.bgLight, text: fundingColors.financiamento.text, badge: 'bg-primary', icon: Landmark },
  };

  const toggleFunding = (fundingId: string) => {
    const newFunding = selectedFunding.includes(fundingId)
      ? selectedFunding.filter(id => id !== fundingId)
      : [...selectedFunding, fundingId];
    onFundingChange(newFunding);
  };

  // Calcular cobertura
  const selectedFundingData = applicableFunding
    .filter(f => selectedFunding.includes(f.fund.id) && f.eligible)
    .map(f => f.fund);

  const rawCoverage = selectedFundingData.reduce((sum, fund) => {
    if (fund.percentage) {
      const maxFromPercentage = totalInvestment * (fund.percentage / 100);
      return sum + Math.min(fund.maxAmount, maxFromPercentage);
    }
    return sum + fund.maxAmount;
  }, 0);

  const totalCoverage = Math.min(rawCoverage, totalInvestment);
  const coveragePercent = totalInvestment > 0 ? (totalCoverage / totalInvestment) * 100 : 0;
  const remaining = Math.max(0, totalInvestment - totalCoverage);
  const remainingPercent = totalInvestment > 0 ? (remaining / totalInvestment) * 100 : 0;

  // Render card de fundo
  const renderFundingCard = (item: { fund: typeof mockFunding[0]; eligible: boolean; reason?: string }) => {
    const { fund, eligible, reason } = item;
    const isSelected = selectedFunding.includes(fund.id);

    return (
      <div
        key={fund.id}
        onClick={() => eligible && toggleFunding(fund.id)}
        className={`
          p-4 rounded-lg border-2 transition-all
          ${!eligible
            ? 'border-muted bg-muted/30 opacity-60 cursor-not-allowed'
            : isSelected
              ? 'border-primary bg-primary/5 cursor-pointer'
              : 'border-border bg-background hover:border-primary/50 cursor-pointer'
          }
        `}
      >
        <div className="flex items-start gap-3">
          <div className={`
            w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5
            ${!eligible
              ? 'border-muted-foreground/30 bg-muted'
              : isSelected
                ? 'bg-primary border-primary'
                : 'border-muted-foreground/50'
            }
          `}>
            {isSelected && eligible && <Check className="h-3 w-3 text-primary-foreground" />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-normal text-sm">{fund.name}</span>
            </div>

            <p className="text-xs text-muted-foreground mb-2">{fund.provider}</p>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs">
                <Euro className="h-3 w-3 text-muted-foreground" />
                <span>
                  Até {fund.maxAmount.toLocaleString('pt-PT')}€
                  {fund.percentage && ` (${fund.percentage}%)`}
                  {fund.interestRate && ` • ${fund.interestRate}`}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                  {fund.deadline === 'Contínuo'
                    ? 'Candidatura contínua'
                    : `Prazo: ${new Date(fund.deadline!).toLocaleDateString('pt-PT')}`
                  }
                </span>
              </div>

              {fund.remainingBudget && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Wallet className="h-3 w-3" />
                  <span>Disponível: {fund.remainingBudget.toLocaleString('pt-PT')}€</span>
                </div>
              )}

              {fund.requirements.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FileCheck className="h-3 w-3" />
                  <span className="line-clamp-1">{fund.requirements.join(' • ')}</span>
                </div>
              )}
            </div>

            {!eligible && reason && (
              <p className="text-xs text-warning mt-2 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {reason}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render coluna por tipo
  const renderTypeColumn = (type: 'subsidio' | 'incentivo' | 'financiamento') => {
    const funds = fundingByType[type];
    const config = typeConfig[type];
    const Icon = config.icon;

    return (
      <div className="space-y-3">
        <div className={`flex items-center justify-between p-3 rounded-lg mb-3 ${config.headerBg}`}>
          <div className="flex items-center gap-2">
            <Icon className={`h-4 w-4 ${config.text}`} />
            <span className={`font-normal text-sm ${config.text}`}>{typeLabels[type]}</span>
          </div>
          <span className={`w-6 h-6 rounded-full text-white text-xs font-normal flex items-center justify-center ${config.badge}`}>
            {funds.length}
          </span>
        </div>

        <div className="space-y-2">
          {funds.length > 0 ? (
            funds.map(item => renderFundingCard(item))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum fundo disponível</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      {/* Header do step */}
      <div className="p-6 pb-4 border-b border-border/50">
        <div>
          <h3 className="font-bold text-2xl mb-1">Financiamento Disponível</h3>
          <p className="text-sm text-muted-foreground">
            Fundos sugeridos de acordo com as medidas selecionadas. Selecione os que pretende incluir no plano.
          </p>
        </div>

        {selectedMeasures.length === 0 && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-warning/10 border border-warning/30 mt-4">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
            <p className="text-sm text-warning">
              Selecione medidas no passo anterior para ver os fundos aplicáveis.
            </p>
          </div>
        )}
      </div>

      {/* Colunas dos tipos de financiamento */}
      <div className="px-6 pt-4">
        {selectedMeasures.length > 0 && (
          <div className="grid grid-cols-3 gap-4 pb-4">
            {renderTypeColumn('subsidio')}
            {renderTypeColumn('incentivo')}
            {renderTypeColumn('financiamento')}
          </div>
        )}
      </div>

      {/* Resumo/Totais */}
      <div className="p-6 pt-4 border-t bg-muted/10">
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Fundos Selecionados</p>
            <p className="font-bold text-xl">{selectedFunding.length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Comparticipação Possível</p>
            <p className="font-bold text-xl text-success">
              Até {totalCoverage.toLocaleString('pt-PT')}€
              <span className="text-sm font-normal text-muted-foreground ml-1">
                ({formatPercentage(coveragePercent, 0)})
              </span>
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">A cargo da empresa</p>
            <p className={`font-bold text-xl ${remaining === 0 ? 'text-success' : ''}`}>
              {remaining.toLocaleString('pt-PT')}€
              <span className="text-sm font-normal text-muted-foreground ml-1">
                ({formatPercentage(remainingPercent, 0)})
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
