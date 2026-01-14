import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Minus, CheckCircle, Target, Search } from 'lucide-react';
import type { Step1Props } from '../types';
import { riskColors, scopeColors } from '@/lib/styles';

export const Step1Analysis = ({
  supplier,
  riskLevel,
  riskMultiplier,
  avgSectorIntensity,
}: Step1Props) => {
  // Calcular percentagens dos âmbitos
  const scope1Pct = supplier.totalEmissions > 0 ? supplier.scope1 / supplier.totalEmissions * 100 : 0;
  const scope2Pct = supplier.totalEmissions > 0 ? supplier.scope2 / supplier.totalEmissions * 100 : 0;
  const scope3Pct = supplier.totalEmissions > 0 ? supplier.scope3 / supplier.totalEmissions * 100 : 0;

  // Configuração por nível de risco usando cores centralizadas
  const riskConfig = {
    alto: {
      label: 'Alto',
      icon: AlertTriangle,
      iconColor: 'text-danger',
      iconBg: `${riskColors.alto.bg} ${riskColors.alto.bgDark}`,
      tagColor: `${riskColors.alto.badge}`
    },
    medio: {
      label: 'Médio',
      icon: Minus,
      iconColor: 'text-warning',
      iconBg: `${riskColors.medio.bg} ${riskColors.medio.bgDark}`,
      tagColor: `${riskColors.medio.badge}`
    },
    normal: {
      label: 'Baixo',
      icon: CheckCircle,
      iconColor: 'text-success',
      iconBg: `${riskColors.baixo.bg} ${riskColors.baixo.bgDark}`,
      tagColor: `${riskColors.baixo.badge}`
    }
  };
  const config = riskConfig[riskLevel];
  const RiskIcon = config.icon;

  // Calcular largura da barra do setor (empresa = 100%)
  const empresaIntensity = supplier.emissionsPerRevenue || 0;
  const setorBarWidth = empresaIntensity > 0 ? avgSectorIntensity / empresaIntensity * 100 : 0;

  // Cálculos para zona segura
  const reducaoEstimada = Math.round(supplier.totalEmissions * 0.37);
  const reducaoPct = 37;

  // Âmbitos acima de 30%
  const scopesAbove30 = [
    { id: 1 as const, name: 'Âmbito 1', value: supplier.scope1, pct: scope1Pct },
    { id: 2 as const, name: 'Âmbito 2', value: supplier.scope2, pct: scope2Pct },
    { id: 3 as const, name: 'Âmbito 3', value: supplier.scope3, pct: scope3Pct }
  ].filter(s => s.pct >= 30).sort((a, b) => b.pct - a.pct);

  // Problemas por âmbito
  const problemsByScope: Record<number, string[]> = {
    1: ['Possíveis ineficiências em processos de combustão', 'Frota própria a combustíveis fósseis', 'Fugas de gases refrigerantes ou industriais'],
    2: ['Elevado consumo de eletricidade', 'Fonte de energia não renovável', 'Ineficiência em sistemas de climatização'],
    3: ['Ineficiências na cadeia de fornecedores', 'Emissões elevadas em transporte e logística', 'Falta de critérios ESG na seleção de parceiros']
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* HEADER: Título Risco + Tag Multiplier - ENCOSTADOS */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${config.iconBg} flex items-center justify-center`}>
              <RiskIcon className={`h-5 w-5 ${config.iconColor}`} />
            </div>
            <h3 className="text-2xl font-semibold">
              Risco {config.label}
            </h3>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full border ${config.tagColor}`}>
            {riskMultiplier.toFixed(1)}x média setor
          </span>
        </div>

        {/* SECÇÃO 1: Intensidade de Carbono */}
        <div>
          <p className="text-lg font-medium text-foreground mb-4">
            Intensidade de Carbono
          </p>

          <div className="space-y-4">
            {/* Barra Empresa (100%) */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-28 shrink-0">Esta Empresa</span>
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-danger rounded-full" style={{ width: '100%' }} />
              </div>
              <span className="text-sm font-medium w-36 text-right shrink-0">
                {empresaIntensity.toFixed(2)} kg CO₂e/€
              </span>
            </div>

            {/* Barra Média Setor (proporcional) */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-28 shrink-0">Média do Setor</span>
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-success rounded-full" style={{ width: `${Math.min(setorBarWidth, 100)}%` }} />
              </div>
              <span className="text-sm font-medium w-36 text-right shrink-0">
                {avgSectorIntensity.toFixed(2)} kg CO₂e/€
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* SECÇÃO 2: Consequências (Vermelho) - VISÃO MUNICÍPIO */}
        <div className={`p-4 ${riskColors.alto.bg} ${riskColors.alto.bgDark} border ${riskColors.alto.border} rounded-lg`}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-danger" />
            <h4 className="font-medium text-sm text-danger">
              Consequências para o Município (intensidade {'>'}1.5x média)
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            {/* Coluna 1 */}
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-danger">
                <span className="text-danger/60 mt-0.5">•</span>
                <span>Empresa em risco de <strong>encerramento ou deslocalização</strong></span>
              </li>
              <li className="flex items-start gap-2 text-sm text-danger">
                <span className="text-danger/60 mt-0.5">•</span>
                <span>Potencial <strong>perda de postos de trabalho</strong> no município</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-danger">
                <span className="text-danger/60 mt-0.5">•</span>
                <span>Menor <strong>atratividade do território</strong> para investimento sustentável</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-danger">
                <span className="text-danger/60 mt-0.5">•</span>
                <span><strong>Risco reputacional</strong> para o ecossistema empresarial local</span>
              </li>
            </ul>

            {/* Coluna 2 */}
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-danger">
                <span className="text-danger/60 mt-0.5">•</span>
                <span>Perda de <strong>elegibilidade para fundos</strong> europeus e nacionais</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-danger">
                <span className="text-danger/60 mt-0.5">•</span>
                <span>Exclusão de <strong>programas de apoio municipal</strong> à transição energética</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-danger">
                <span className="text-danger/60 mt-0.5">•</span>
                <span>Dificuldade em atingir <strong>metas municipais</strong> de descarbonização</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-danger">
                <span className="text-danger/60 mt-0.5">•</span>
                <span>Aumento de <strong>custos regulatórios</strong> que afetam competitividade local</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator />

        {/* SECÇÃO 3: Distribuição por Âmbito */}
        <div>
          <p className="text-lg font-medium text-foreground mb-4">
            Distribuição por Âmbito
          </p>

          {/* Barra Stacked */}
          <div className="w-full h-6 rounded-full overflow-hidden flex mb-4">
            <div
              className={`h-full ${scopeColors[1].bg} hover:opacity-80 transition-opacity cursor-pointer relative group`}
              style={{ width: `${scope1Pct}%` }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                Âmbito 1 (Diretas): {supplier.scope1.toLocaleString('pt-PT')} t CO₂e ({scope1Pct.toFixed(0)}%)
              </div>
            </div>
            <div
              className={`h-full ${scopeColors[2].bg} hover:opacity-80 transition-opacity cursor-pointer relative group`}
              style={{ width: `${scope2Pct}%` }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                Âmbito 2 (Energia): {supplier.scope2.toLocaleString('pt-PT')} t CO₂e ({scope2Pct.toFixed(0)}%)
              </div>
            </div>
            <div
              className={`h-full ${scopeColors[3].bg} hover:opacity-80 transition-opacity cursor-pointer relative group`}
              style={{ width: `${scope3Pct}%` }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                Âmbito 3 (Indiretas): {supplier.scope3.toLocaleString('pt-PT')} t CO₂e ({scope3Pct.toFixed(0)}%)
              </div>
            </div>
          </div>

          {/* Legenda completa */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${scopeColors[1].bg}`} />
              <span>Âmbito 1 ({supplier.scope1.toLocaleString('pt-PT')} t CO₂e, {scope1Pct.toFixed(0)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${scopeColors[2].bg}`} />
              <span>Âmbito 2 ({supplier.scope2.toLocaleString('pt-PT')} t CO₂e, {scope2Pct.toFixed(0)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${scopeColors[3].bg}`} />
              <span>Âmbito 3 ({supplier.scope3.toLocaleString('pt-PT')} t CO₂e, {scope3Pct.toFixed(0)}%)</span>
            </div>
          </div>
        </div>

        {/* SECÇÃO 4: Análise por Âmbito (só >30%) */}
        {scopesAbove30.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground">
                Análise por Âmbito
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scopesAbove30.map(scope => (
                <div key={scope.id} className={`p-3 rounded-lg border-2 ${scopeColors[scope.id].border} bg-background`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${scopeColors[scope.id].bg}`} />
                    <span className="text-sm font-medium">
                      {scope.name} ({scope.pct.toFixed(0)}%)
                    </span>
                  </div>

                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {problemsByScope[scope.id].map((problem, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span>•</span>
                        <span>{problem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* SECÇÃO 5: Para Atingir Zona Segura (Vermelho) */}
        <div className={`p-4 ${riskColors.alto.bg} ${riskColors.alto.bgDark} border ${riskColors.alto.border} rounded-lg`}>
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-danger" />
            <p className="text-sm font-medium text-danger">
              Para atingir zona segura
            </p>
          </div>

          <ul className="space-y-1.5 text-sm text-danger">
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Redução necessária: <span className="font-medium">{reducaoEstimada.toLocaleString('pt-PT')} t CO₂e (-{reducaoPct}%)</span></span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Investimento estimado: <span className="font-medium">85.000€ - 150.000€</span></span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Prazo típico: <span className="font-medium">12-24 meses</span></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};