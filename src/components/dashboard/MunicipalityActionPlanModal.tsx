import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Landmark, BarChart3, Zap, Euro, FileText, AlertTriangle, Target, CheckCircle, Minus, Search } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import type { Supplier } from '@/types/supplier';
import { sectorLabels } from './SupplierLabel';

interface MunicipalityActionPlanModalProps {
  supplier: Supplier | null;
  riskLevel: 'alto' | 'medio' | 'normal';
  riskMultiplier: number;
  avgSectorIntensity: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 1 | 2 | 3 | 4;

const stepConfig = [
  { number: 1, title: 'Análise', icon: BarChart3 },
  { number: 2, title: 'Medidas', icon: Zap },
  { number: 3, title: 'Financiamento', icon: Euro },
  { number: 4, title: 'Resumo', icon: FileText }
];

export const MunicipalityActionPlanModal = ({
  supplier,
  riskLevel,
  riskMultiplier,
  avgSectorIntensity,
  open,
  onOpenChange
}: MunicipalityActionPlanModalProps) => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  
  if (!supplier) return null;
  
  const handleNext = () => {
    if (currentStep < 4) setCurrentStep((currentStep + 1) as Step);
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as Step);
  };
  
  const handleClose = () => {
    setCurrentStep(1);
    onOpenChange(false);
  };

  // Dimensão label helper
  const getDimensionLabel = (size: string) => {
    const labels: Record<string, string> = {
      'micro': 'Micro',
      'pequena': 'Pequena',
      'media': 'Média',
      'grande': 'Grande'
    };
    return labels[size] || size;
  };

  // Risco badge
  const getRiskBadgeVariant = () => {
    switch (riskLevel) {
      case 'alto': return 'destructive';
      case 'medio': return 'default';
      default: return 'secondary';
    }
  };
  
  const getRiskLabel = () => {
    switch (riskLevel) {
      case 'alto': return 'Alto';
      case 'medio': return 'Médio';
      default: return 'Normal';
    }
  };
  
  // Step titles for placeholder
  const stepTitles = ['Análise', 'Medidas', 'Financiamento', 'Resumo'];

  // Função única para Step 1: Conteúdo Análise de Risco (sem Card exterior)
  const renderAnaliseRiscoContent = () => {
    // Calcular percentagens dos âmbitos
    const scope1Pct = supplier.totalEmissions > 0 
      ? (supplier.scope1 / supplier.totalEmissions) * 100 : 0;
    const scope2Pct = supplier.totalEmissions > 0 
      ? (supplier.scope2 / supplier.totalEmissions) * 100 : 0;
    const scope3Pct = supplier.totalEmissions > 0 
      ? (supplier.scope3 / supplier.totalEmissions) * 100 : 0;
    
    // Configuração por nível de risco
    const riskConfig = {
      alto: {
        label: 'Alto',
        icon: AlertTriangle,
        iconColor: 'text-red-500',
        iconBg: 'bg-red-100 dark:bg-red-900/30',
        tagColor: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
      },
      medio: {
        label: 'Médio',
        icon: Minus,
        iconColor: 'text-amber-500',
        iconBg: 'bg-amber-100 dark:bg-amber-900/30',
        tagColor: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800'
      },
      normal: {
        label: 'Baixo',
        icon: CheckCircle,
        iconColor: 'text-green-500',
        iconBg: 'bg-green-100 dark:bg-green-900/30',
        tagColor: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
      }
    };
    
    const config = riskConfig[riskLevel];
    const RiskIcon = config.icon;
    
    // Calcular largura da barra do setor (empresa = 100%)
    const empresaIntensity = supplier.emissionsPerRevenue || 0;
    const setorBarWidth = empresaIntensity > 0 
      ? (avgSectorIntensity / empresaIntensity) * 100 
      : 0;
    
    // Cálculos para zona segura
    const reducaoEstimada = Math.round(supplier.totalEmissions * 0.37);
    const reducaoPct = 37;
    
    // Âmbitos acima de 30%
    const scopesAbove30 = [
      { id: 1, name: 'Âmbito 1', value: supplier.scope1, pct: scope1Pct, color: 'violet', borderClass: 'border-violet-400' },
      { id: 2, name: 'Âmbito 2', value: supplier.scope2, pct: scope2Pct, color: 'blue', borderClass: 'border-blue-400' },
      { id: 3, name: 'Âmbito 3', value: supplier.scope3, pct: scope3Pct, color: 'orange', borderClass: 'border-orange-400' }
    ].filter(s => s.pct >= 30).sort((a, b) => b.pct - a.pct);
    
    // Problemas por âmbito
    const problemsByScope: Record<number, string[]> = {
      1: [
        'Possíveis ineficiências em processos de combustão',
        'Frota própria a combustíveis fósseis',
        'Fugas de gases refrigerantes ou industriais'
      ],
      2: [
        'Elevado consumo de eletricidade',
        'Fonte de energia não renovável',
        'Ineficiência em sistemas de climatização'
      ],
      3: [
        'Ineficiências na cadeia de fornecedores',
        'Emissões elevadas em transporte e logística',
        'Falta de critérios ESG na seleção de parceiros'
      ]
    };

    return (
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
              <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: '100%' }}
                />
              </div>
              <span className="text-sm font-medium w-36 text-right shrink-0">
                {empresaIntensity.toFixed(2)} kg CO₂e/€
              </span>
            </div>
            
            {/* Barra Média Setor (proporcional) */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-28 shrink-0">Média do Setor</span>
              <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${Math.min(setorBarWidth, 100)}%` }}
                />
              </div>
              <span className="text-sm font-medium w-36 text-right shrink-0">
                {avgSectorIntensity.toFixed(2)} kg CO₂e/€
              </span>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* SECÇÃO 2: Consequências (Vermelho) - VISÃO MUNICÍPIO */}
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <h4 className="font-medium text-sm text-red-700 dark:text-red-300">
              Consequências para o Município (intensidade {'>'}1.5x média)
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            {/* Coluna 1 */}
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                <span className="text-red-400 mt-0.5">•</span>
                <span>Empresa em risco de <strong>encerramento ou deslocalização</strong></span>
              </li>
              <li className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                <span className="text-red-400 mt-0.5">•</span>
                <span>Potencial <strong>perda de postos de trabalho</strong> no município</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                <span className="text-red-400 mt-0.5">•</span>
                <span>Menor <strong>atratividade do território</strong> para investimento sustentável</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                <span className="text-red-400 mt-0.5">•</span>
                <span><strong>Risco reputacional</strong> para o ecossistema empresarial local</span>
              </li>
            </ul>
            
            {/* Coluna 2 */}
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                <span className="text-red-400 mt-0.5">•</span>
                <span>Perda de <strong>elegibilidade para fundos</strong> europeus e nacionais</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                <span className="text-red-400 mt-0.5">•</span>
                <span>Exclusão de <strong>programas de apoio municipal</strong> à transição energética</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                <span className="text-red-400 mt-0.5">•</span>
                <span>Dificuldade em atingir <strong>metas municipais</strong> de descarbonização</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                <span className="text-red-400 mt-0.5">•</span>
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
              className="h-full bg-violet-500 hover:opacity-80 transition-opacity cursor-pointer relative group"
              style={{ width: `${scope1Pct}%` }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                Âmbito 1 (Diretas): {supplier.scope1.toLocaleString('pt-PT')} t CO₂e ({scope1Pct.toFixed(0)}%)
              </div>
            </div>
            <div 
              className="h-full bg-blue-500 hover:opacity-80 transition-opacity cursor-pointer relative group"
              style={{ width: `${scope2Pct}%` }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                Âmbito 2 (Energia): {supplier.scope2.toLocaleString('pt-PT')} t CO₂e ({scope2Pct.toFixed(0)}%)
              </div>
            </div>
            <div 
              className="h-full bg-orange-500 hover:opacity-80 transition-opacity cursor-pointer relative group"
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
              <div className="w-3 h-3 rounded-full bg-violet-500" />
              <span>Âmbito 1 ({supplier.scope1.toLocaleString('pt-PT')} t CO₂e, {scope1Pct.toFixed(0)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Âmbito 2 ({supplier.scope2.toLocaleString('pt-PT')} t CO₂e, {scope2Pct.toFixed(0)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
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
                <div key={scope.id} className={`p-3 rounded-lg border-2 ${scope.borderClass} bg-background`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full bg-${scope.color}-500`} />
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
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-red-600 dark:text-red-400" />
            <p className="text-sm font-medium text-red-700 dark:text-red-300">
              Para atingir zona segura
            </p>
          </div>
          
          <ul className="space-y-1.5 text-sm text-red-700 dark:text-red-300">
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
    );
  };

  const renderStepContent = () => {
    // Step 1: Análise - Conteúdo direto (sem Card exterior)
    if (currentStep === 1) {
      return (
        <div className="p-6">
          {renderAnaliseRiscoContent()}
        </div>
      );
    }
    
    // Steps 2, 3, 4: Placeholder (será implementado em 2.4B)
    const StepIcon = stepConfig[currentStep - 1].icon;
    
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <Card className="w-full max-w-2xl p-8 text-center border-dashed border-2">
          <div className="mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <StepIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Step {currentStep}: {stepTitles[currentStep - 1]}
            </h3>
            <p className="text-sm text-muted-foreground">
              Conteúdo em construção - Será implementado na Fase 2.4B
            </p>
          </div>
          
          <Separator className="my-6" />
          
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Empresa</p>
              <p className="text-sm font-medium">{supplier.name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Emissões</p>
              <p className="text-sm font-medium">{supplier.totalEmissions.toLocaleString('pt-PT')} t CO₂e</p>
            </div>
          </div>
        </Card>
      </div>
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b shrink-0">
          <div className="flex items-start justify-between pr-10">
            {/* Lado Esquerdo: Ícone + Título */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl">
                  <span className="font-bold">Plano de Ação</span>
                  <span className="font-normal text-muted-foreground"> — {supplier.name}</span>
                </DialogTitle>
              </div>
            </div>
            
            {/* Lado Direito: Tags + Close - ALINHADOS AO CENTRO */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 border rounded-lg bg-muted/30 text-sm">
                <span className="text-muted-foreground">Setor: </span>
                <span className="font-medium">{sectorLabels[supplier.sector] || supplier.sector}</span>
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="text-muted-foreground">Dimensão: </span>
                <span className="font-medium">{getDimensionLabel(supplier.companySize)}</span>
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="text-muted-foreground">Freguesia: </span>
                <span className="font-medium">{supplier.parish || 'N/A'}</span>
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="text-muted-foreground">Risco: </span>
                <span className={`font-medium ${
                  riskLevel === 'alto' ? 'text-red-600' : 
                  riskLevel === 'medio' ? 'text-amber-600' : 'text-green-600'
                }`}>
                  {riskLevel === 'alto' ? 'Alto' : riskLevel === 'medio' ? 'Médio' : 'Baixo'}
                </span>
              </div>
              {/* O botão close nativo do Dialog já está alinhado */}
            </div>
          </div>
        </DialogHeader>
        
        <Separator />
        
        {/* Steps Indicator */}
        <div className="px-6 py-4 bg-muted/30 border-b shrink-0">
          <div className="flex items-center justify-center">
            {stepConfig.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = currentStep >= step.number;
              const isCurrent = currentStep === step.number;
              
              return (
                <div key={step.number} className="flex items-center">
                  {/* Step circle */}
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                      ${isCurrent 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : isActive 
                          ? 'bg-primary/20 text-primary border-primary/50' 
                          : 'bg-muted text-muted-foreground border-muted-foreground/30'
                      }
                    `}>
                      <StepIcon className="h-5 w-5" />
                    </div>
                    
                    {/* Step label */}
                    <div className="mt-2 text-center">
                      <p className={`text-xs font-medium ${
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  
                  {/* Connector line */}
                  {step.number < 4 && (
                    <div className={`
                      w-24 h-0.5 mx-2 mt-[-20px]
                      ${currentStep > step.number ? 'bg-primary' : 'bg-muted-foreground/30'}
                    `} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {renderStepContent()}
        </div>
        
        {/* Footer Navigation */}
        <div className="p-4 border-t flex items-center justify-between shrink-0 bg-background">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Passo {currentStep} de 4
            </span>
          </div>
          
          <Button
            onClick={handleNext}
            disabled={currentStep === 4}
            className="gap-2"
          >
            Próximo
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
