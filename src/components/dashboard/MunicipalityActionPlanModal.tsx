import { useState, useMemo, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, BarChart3, Zap, Euro, FileText, AlertTriangle, Target, CheckCircle, Minus, Search, Check, Leaf, Clock, TrendingDown, Info, Sparkles, RotateCcw, Calendar, Wallet, FileCheck, ListChecks, Building2, MapPin, Bike, Sun, Recycle, Mail, Download, ChevronDown, ChevronsUpDown, ChevronsDownUp } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Supplier } from '@/types/supplier';
import type { Measure, Scope } from '@/types/actionPlan';
import { sectorLabels } from './SupplierLabel';
import { mockMeasures, getApplicableMeasures, isMeasureRecommended } from '@/data/mockMeasures';
import { cascaisInfrastructure } from '@/data/mockInfrastructure';
import { mockFunding, getFundingByCategory, getApplicableFunding } from '@/data/mockFunding';
interface MunicipalityActionPlanModalProps {
  supplier: Supplier | null;
  riskLevel: 'alto' | 'medio' | 'normal';
  riskMultiplier: number;
  avgSectorIntensity: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
type Step = 1 | 2 | 3 | 4;
const stepConfig = [{
  number: 1,
  title: 'Análise',
  icon: BarChart3
}, {
  number: 2,
  title: 'Medidas',
  icon: Zap
}, {
  number: 3,
  title: 'Financiamento',
  icon: Euro
}, {
  number: 4,
  title: 'Resumo',
  icon: FileText
}];
export const MunicipalityActionPlanModal = ({
  supplier,
  riskLevel,
  riskMultiplier,
  avgSectorIntensity,
  open,
  onOpenChange
}: MunicipalityActionPlanModalProps) => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedMeasures, setSelectedMeasures] = useState<string[]>([]);
  const [recommendedApplied, setRecommendedApplied] = useState(false);
  const [selectedFunding, setSelectedFunding] = useState<string[]>([]);
  const [emailSent, setEmailSent] = useState(false);
  const [municipalityNotes, setMunicipalityNotes] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    proximosPassos: true,
    diagnosticoImpacto: true,
    medidas: true,
    financiamento: true,
    contexto: false,
    notas: true,
  });
  
  // Ref para o container scrollável do Step 4
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Toggle de secção mantendo posição de scroll
  const toggleSection = (section: string, event?: React.MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    
    const scrollTop = scrollContainerRef.current?.scrollTop || 0;
    
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    
    // Restaurar posição após re-render
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollTop;
      }
    });
  };
  
  // Verificar se todas as secções estão expandidas
  const allExpanded = Object.values(expandedSections).every(v => v);
  
  // Alternar todas as secções
  const toggleAllSections = () => {
    const newState = !allExpanded;
    setExpandedSections({
      proximosPassos: newState,
      diagnosticoImpacto: newState,
      medidas: newState,
      financiamento: newState,
      contexto: newState,
      notas: newState,
    });
  };
  
  // Chave única para esta empresa (com fallback para evitar erro se supplier é null)
  const storageKey = supplier ? `actionPlan_${supplier.id}` : '';
  
  // Carregar estado ao abrir modal
  useEffect(() => {
    if (open && storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.selectedMeasures) setSelectedMeasures(parsed.selectedMeasures);
          if (parsed.selectedFunding) setSelectedFunding(parsed.selectedFunding);
          if (parsed.municipalityNotes) setMunicipalityNotes(parsed.municipalityNotes);
          if (parsed.currentStep) setCurrentStep(parsed.currentStep);
          if (parsed.expandedSections) setExpandedSections(parsed.expandedSections);
          if (parsed.emailSent) setEmailSent(parsed.emailSent);
        } catch (e) {
          console.error('Error loading saved action plan:', e);
        }
      }
    }
  }, [open, storageKey]);
  
  // Guardar estado automaticamente
  useEffect(() => {
    if (open && storageKey && supplier) {
      // Calcular se atingiu a meta (necessário para status)
      const selectedMeasureObjects = mockMeasures.filter(m => selectedMeasures.includes(m.id));
      const totalReduction = selectedMeasureObjects.reduce((sum, m) => sum + m.emissionReduction, 0);
      const reductionRatio = supplier.totalEmissions > 0 ? totalReduction / supplier.totalEmissions : 0;
      const currentIntensity = supplier.emissionsPerRevenue || 0;
      const newIntensity = currentIntensity * (1 - reductionRatio);
      const reachedTarget = newIntensity <= avgSectorIntensity;
      
      // Plano está pronto ao ENTRAR no Step 4 (não só ao completar)
      const completedStep4 = currentStep === 4;
      
      const dataToSave = {
        selectedMeasures,
        selectedFunding,
        municipalityNotes,
        currentStep,
        expandedSections,
        lastUpdated: new Date().toISOString(),
        lastStep: currentStep,
        // Flags para estado do plano
        completedStep4,
        reachedTarget,
        emailSent,
      };
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
    }
  }, [selectedMeasures, selectedFunding, municipalityNotes, currentStep, expandedSections, storageKey, open, supplier, avgSectorIntensity, emailSent]);
  
  if (!supplier) return null;
  
  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1 as Step);
  };
  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1 as Step);
  };

  // Determinar estado de cada step
  const getStepState = (step: number): 'current' | 'completed' | 'pending' => {
    // Verificar se há escolhas em cada step
    const hasSelections: Record<number, boolean> = {
      1: false, // Análise - não tem escolhas
      2: selectedMeasures.length > 0,
      3: selectedFunding.length > 0,
      4: false, // Resumo - não tem escolhas
    };

    // Step actual
    if (step === currentStep) return 'current';
    
    // Step anterior ao actual (já foi ultrapassado)
    if (step < currentStep) return 'completed';
    
    // Step posterior mas com escolhas feitas
    if (hasSelections[step]) return 'completed';
    
    // Step posterior sem escolhas
    return 'pending';
  };

  // Verificar se step é clicável
  const isStepClickable = (step: number): boolean => {
    // Step actual - sempre clicável
    if (step === currentStep) return true;
    
    // Step anterior ao actual - sempre clicável
    if (step < currentStep) return true;
    
    // Próximo step imediato - sempre clicável (posso avançar)
    if (step === currentStep + 1) return true;
    
    // Steps mais à frente (2+ passos) - clicável se todos os intermédios têm escolhas
    if (step > currentStep + 1) {
      for (let s = currentStep + 1; s < step; s++) {
        // Step 1 (Análise) não precisa de escolhas
        if (s === 1) continue;
        // Step 2 (Medidas) precisa de escolhas
        if (s === 2 && selectedMeasures.length === 0) return false;
        // Step 3 (Financiamento) precisa de escolhas
        if (s === 3 && selectedFunding.length === 0) return false;
      }
      return true;
    }
    
    return false;
  };

  // Navegar para step
  const goToStep = (step: number) => {
    if (isStepClickable(step)) {
      setCurrentStep(step as Step);
    }
  };

  const handleClose = () => {
    // Não resetar estado - mantido em localStorage
    onOpenChange(false);
  };
  

  // Função para selecionar melhores medidas automaticamente (toggle)
  const selectBestMeasures = () => {
    // Se já aplicadas, limpar seleção
    if (recommendedApplied) {
      setSelectedMeasures([]);
      setRecommendedApplied(false);
      return;
    }
    
    // Obter medidas aplicáveis
    const applicableMeasures = getApplicableMeasures({
      sector: supplier.sector,
      companySize: supplier.companySize,
      totalEmissions: supplier.totalEmissions
    });

    // Preparar dados de fundos para validação
    const fundingByCat = [{
      category: 'energia',
      available: mockFunding.filter(f => f.currentlyOpen && f.applicableTo.measureCategories?.includes('energia')).reduce((sum, f) => sum + f.remainingBudget, 0)
    }, {
      category: 'mobilidade',
      available: mockFunding.filter(f => f.currentlyOpen && f.applicableTo.measureCategories?.includes('mobilidade')).reduce((sum, f) => sum + f.remainingBudget, 0)
    }, {
      category: 'residuos',
      available: mockFunding.filter(f => f.currentlyOpen && f.applicableTo.measureCategories?.includes('residuos')).reduce((sum, f) => sum + f.remainingBudget, 0)
    }, {
      category: 'agua',
      available: mockFunding.filter(f => f.currentlyOpen && f.applicableTo.measureCategories?.includes('agua')).reduce((sum, f) => sum + f.remainingBudget, 0)
    }];

    // Filtrar só medidas recomendadas
    const recommendedMeasures = applicableMeasures.filter(m => {
      const {
        recommended
      } = isMeasureRecommended(m, cascaisInfrastructure, fundingByCat);
      return recommended;
    });

    // Ordenar: Soft primeiro, depois por ROI (redução/investimento)
    const sortedMeasures = [...recommendedMeasures].sort((a, b) => {
      // Primeiro critério: Soft antes de Interventiva
      if (a.interventionLevel !== b.interventionLevel) {
        return a.interventionLevel === 'soft' ? -1 : 1;
      }
      // Segundo critério: Melhor ROI (maior redução por € investido)
      const roiA = a.investment > 0 ? a.emissionReduction / a.investment : 0;
      const roiB = b.investment > 0 ? b.emissionReduction / b.investment : 0;
      return roiB - roiA;
    });

    // Selecionar medidas até atingir meta
    const currentIntensity = supplier.emissionsPerRevenue || 0;
    let accumulatedReduction = 0;
    const selectedIds: string[] = [];
    for (const measure of sortedMeasures) {
      selectedIds.push(measure.id);
      accumulatedReduction += measure.emissionReduction;

      // Calcular nova intensidade
      const reductionRatio = supplier.totalEmissions > 0 ? accumulatedReduction / supplier.totalEmissions : 0;
      const newIntensity = currentIntensity * (1 - reductionRatio);

      // Parar se atingiu meta
      if (newIntensity <= avgSectorIntensity) {
        break;
      }
    }
    setSelectedMeasures(selectedIds);
    setRecommendedApplied(true);
  };
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
      case 'alto':
        return 'destructive';
      case 'medio':
        return 'default';
      default:
        return 'secondary';
    }
  };
  const getRiskLabel = () => {
    switch (riskLevel) {
      case 'alto':
        return 'Alto';
      case 'medio':
        return 'Médio';
      default:
        return 'Normal';
    }
  };

  // Step titles for placeholder
  const stepTitles = ['Análise', 'Medidas', 'Financiamento', 'Resumo'];

  // Função única para Step 1: Conteúdo Análise de Risco (sem Card exterior)
  const renderAnaliseRiscoContent = () => {
    // Calcular percentagens dos âmbitos
    const scope1Pct = supplier.totalEmissions > 0 ? supplier.scope1 / supplier.totalEmissions * 100 : 0;
    const scope2Pct = supplier.totalEmissions > 0 ? supplier.scope2 / supplier.totalEmissions * 100 : 0;
    const scope3Pct = supplier.totalEmissions > 0 ? supplier.scope3 / supplier.totalEmissions * 100 : 0;

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
    const setorBarWidth = empresaIntensity > 0 ? avgSectorIntensity / empresaIntensity * 100 : 0;

    // Cálculos para zona segura
    const reducaoEstimada = Math.round(supplier.totalEmissions * 0.37);
    const reducaoPct = 37;

    // Âmbitos acima de 30%
    const scopesAbove30 = [{
      id: 1,
      name: 'Âmbito 1',
      value: supplier.scope1,
      pct: scope1Pct,
      color: 'violet',
      borderClass: 'border-violet-400'
    }, {
      id: 2,
      name: 'Âmbito 2',
      value: supplier.scope2,
      pct: scope2Pct,
      color: 'blue',
      borderClass: 'border-blue-400'
    }, {
      id: 3,
      name: 'Âmbito 3',
      value: supplier.scope3,
      pct: scope3Pct,
      color: 'orange',
      borderClass: 'border-orange-400'
    }].filter(s => s.pct >= 30).sort((a, b) => b.pct - a.pct);

    // Problemas por âmbito
    const problemsByScope: Record<number, string[]> = {
      1: ['Possíveis ineficiências em processos de combustão', 'Frota própria a combustíveis fósseis', 'Fugas de gases refrigerantes ou industriais'],
      2: ['Elevado consumo de eletricidade', 'Fonte de energia não renovável', 'Ineficiência em sistemas de climatização'],
      3: ['Ineficiências na cadeia de fornecedores', 'Emissões elevadas em transporte e logística', 'Falta de critérios ESG na seleção de parceiros']
    };
    return <div className="space-y-6">
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
                <div className="h-full bg-red-500 rounded-full" style={{
                width: '100%'
              }} />
              </div>
              <span className="text-sm font-medium w-36 text-right shrink-0">
                {empresaIntensity.toFixed(2)} kg CO₂e/€
              </span>
            </div>
            
            {/* Barra Média Setor (proporcional) */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-28 shrink-0">Média do Setor</span>
              <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{
                width: `${Math.min(setorBarWidth, 100)}%`
              }} />
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
            <div className="h-full bg-violet-500 hover:opacity-80 transition-opacity cursor-pointer relative group" style={{
            width: `${scope1Pct}%`
          }}>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                Âmbito 1 (Diretas): {supplier.scope1.toLocaleString('pt-PT')} t CO₂e ({scope1Pct.toFixed(0)}%)
              </div>
            </div>
            <div className="h-full bg-blue-500 hover:opacity-80 transition-opacity cursor-pointer relative group" style={{
            width: `${scope2Pct}%`
          }}>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                Âmbito 2 (Energia): {supplier.scope2.toLocaleString('pt-PT')} t CO₂e ({scope2Pct.toFixed(0)}%)
              </div>
            </div>
            <div className="h-full bg-orange-500 hover:opacity-80 transition-opacity cursor-pointer relative group" style={{
            width: `${scope3Pct}%`
          }}>
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
        {scopesAbove30.length > 0 && <div>
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground">
                Análise por Âmbito
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scopesAbove30.map(scope => <div key={scope.id} className={`p-3 rounded-lg border-2 ${scope.borderClass} bg-background`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full bg-${scope.color}-500`} />
                    <span className="text-sm font-medium">
                      {scope.name} ({scope.pct.toFixed(0)}%)
                    </span>
                  </div>
                  
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {problemsByScope[scope.id].map((problem, idx) => <li key={idx} className="flex items-start gap-2">
                        <span>•</span>
                        <span>{problem}</span>
                      </li>)}
                  </ul>
                </div>)}
            </div>
          </div>}
        
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
      </div>;
  };

  // Step 2: Seleção de Medidas
  const renderMedidasContent = () => {
    // Obter medidas aplicáveis
    const applicableMeasures = getApplicableMeasures({
      sector: supplier.sector,
      companySize: supplier.companySize,
      totalEmissions: supplier.totalEmissions
    });

    // Calcular percentagens dos âmbitos
    const scope1Pct = supplier.totalEmissions > 0 ? supplier.scope1 / supplier.totalEmissions * 100 : 0;
    const scope2Pct = supplier.totalEmissions > 0 ? supplier.scope2 / supplier.totalEmissions * 100 : 0;
    const scope3Pct = supplier.totalEmissions > 0 ? supplier.scope3 / supplier.totalEmissions * 100 : 0;

    // Nota: Removido identificação de âmbito dominante - todas as colunas têm mesmo estilo

    // Agrupar medidas por âmbito
    const measuresByScope = {
      1: applicableMeasures.filter(m => m.scope === 1),
      2: applicableMeasures.filter(m => m.scope === 2),
      3: applicableMeasures.filter(m => m.scope === 3)
    };

    // Preparar dados de fundos para validação
    const fundingByCategory = getFundingByCategory();

    // Calcular impacto das medidas selecionadas
    const selectedMeasuresData = applicableMeasures.filter(m => selectedMeasures.includes(m.id));
    const totalReduction = selectedMeasuresData.reduce((sum, m) => sum + m.emissionReduction, 0);
    const totalInvestment = selectedMeasuresData.reduce((sum, m) => sum + m.investment, 0);
    const reductionPct = supplier.totalEmissions > 0 ? totalReduction / supplier.totalEmissions * 100 : 0;

    // Calcular intensidades
    // Nota: emissionsPerRevenue já está em kg CO₂e/€
    const currentIntensity = supplier.emissionsPerRevenue || 0;

    // Calcular nova intensidade com base na redução proporcional
    const reductionRatio = supplier.totalEmissions > 0 ? totalReduction / supplier.totalEmissions : 0;
    const newIntensity = currentIntensity * (1 - reductionRatio);
    const reachedTarget = newIntensity <= avgSectorIntensity;

    // Toggle medida (resetar estado recommendedApplied quando seleção manual muda)
    const toggleMeasure = (measureId: string) => {
      setSelectedMeasures(prev => prev.includes(measureId) ? prev.filter(id => id !== measureId) : [...prev, measureId]);
      setRecommendedApplied(false);
    };

    // Render card de medida
    const renderMeasureCard = (measure: Measure) => {
      const isSelected = selectedMeasures.includes(measure.id);
      const {
        recommended,
        reason
      } = isMeasureRecommended(measure, cascaisInfrastructure, fundingByCategory);
      return <div key={measure.id} onClick={() => toggleMeasure(measure.id)} className={`
            p-4 rounded-lg border-2 cursor-pointer transition-all
            ${isSelected ? 'border-primary bg-primary/5' : recommended ? 'border-border hover:border-primary/50 bg-background' : 'border-muted bg-muted/30 opacity-60 hover:opacity-100'}
          `}>
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <div className={`
              w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5
              ${isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/50'}
            `}>
              {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
            </div>
            
            {/* Conteúdo */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-medium text-sm">
                  {measure.name}
                </span>
                
                {/* Tag Não Recomendado */}
                {!recommended && <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-muted-foreground/30 cursor-help">
                          Não recomendado
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p className="text-xs">{reason}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>}
                
                {/* Tag Nível Intervenção */}
                <span className={`text-xs px-2 py-0.5 rounded-full ${measure.interventionLevel === 'soft' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>
                  {measure.interventionLevel === 'soft' ? 'Soft' : 'Interventiva'}
                </span>
              </div>
              
              <p className="text-xs text-muted-foreground mb-2">
                {measure.description}
              </p>
              
              {/* Métricas */}
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <TrendingDown className="h-3 w-3" />
                  -{measure.emissionReduction}t CO₂e
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Euro className="h-3 w-3" />
                  {measure.investment.toLocaleString('pt-PT')}€
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {measure.timeline}
                </span>
              </div>
            </div>
          </div>
        </div>;
    };

    // Render coluna de âmbito
    const renderScopeColumn = (scope: Scope) => {
      const scopeNames = {
        1: 'Âmbito 1 - Diretas',
        2: 'Âmbito 2 - Energia',
        3: 'Âmbito 3 - Indiretas'
      };
      const scopePcts = {
        1: scope1Pct,
        2: scope2Pct,
        3: scope3Pct
      };
      const scopeColors = {
        1: {
          headerBg: 'bg-violet-50 dark:bg-violet-950/30',
          text: 'text-violet-700 dark:text-violet-300',
          textSecondary: 'text-violet-600 dark:text-violet-400',
          badge: 'bg-violet-700 dark:bg-violet-600'
        },
        2: {
          headerBg: 'bg-blue-50 dark:bg-blue-950/30',
          text: 'text-blue-700 dark:text-blue-300',
          textSecondary: 'text-blue-600 dark:text-blue-400',
          badge: 'bg-blue-700 dark:bg-blue-600'
        },
        3: {
          headerBg: 'bg-orange-50 dark:bg-orange-950/30',
          text: 'text-orange-700 dark:text-orange-300',
          textSecondary: 'text-orange-600 dark:text-orange-400',
          badge: 'bg-orange-700 dark:bg-orange-600'
        }
      };
      const colors = scopeColors[scope];
      const measures = measuresByScope[scope];
      
      return <div className="flex flex-col">
          {/* Header da coluna - estilo igual ao financiamento */}
          <div className={`flex items-center justify-between p-3 rounded-lg mb-3 ${colors.headerBg}`}>
            <div className="flex items-center gap-2">
              <span className={`font-medium text-sm ${colors.text}`}>{scopeNames[scope]}</span>
              <span className={`text-sm ${colors.textSecondary}`}>({scopePcts[scope].toFixed(0)}%)</span>
            </div>
            <span className={`w-6 h-6 rounded-full text-white text-xs font-medium flex items-center justify-center ${colors.badge}`}>
              {measures.length}
            </span>
          </div>
          
          {/* Lista de medidas */}
          <div className="space-y-2 flex-1">
            {measures.length > 0 ? measures.map(measure => renderMeasureCard(measure)) : <div className="p-4 text-center text-sm text-muted-foreground border border-dashed rounded-lg">
                Nenhuma medida disponível para este âmbito
              </div>}
          </div>
        </div>;
    };

    // Calcular larguras das barras
    const maxIntensity = Math.max(currentIntensity, avgSectorIntensity, newIntensity || 0);
    const currentBarWidth = maxIntensity > 0 ? currentIntensity / maxIntensity * 100 : 0;
    const newBarWidth = maxIntensity > 0 ? newIntensity / maxIntensity * 100 : 0;
    const avgBarWidth = maxIntensity > 0 ? avgSectorIntensity / maxIntensity * 100 : 0;
    return <div className="flex flex-col h-full">
        {/* Estilo da animação shadow-pulse */}
        <style>{`
          @keyframes shadow-pulse {
            0%, 100% { box-shadow: 0 0 10px 2px rgba(16, 185, 129, 0.3); }
            50% { box-shadow: 0 0 25px 5px rgba(16, 185, 129, 0.5); }
          }
          .animate-shadow-pulse {
            animation: shadow-pulse 2s ease-in-out infinite;
          }
        `}</style>
        
        {/* Header do step - Fixo */}
        <div className="shrink-0 p-6 pb-4 border-b border-border/50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-2xl mb-1">Seleção de Medidas</h3>
              <p className="text-sm text-muted-foreground">
                Selecione medidas até a intensidade ficar abaixo da média do setor.
              </p>
            </div>
            <button 
              onClick={selectBestMeasures} 
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0
                ${recommendedApplied 
                  ? 'bg-white border border-border text-muted-foreground hover:bg-muted/50' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 animate-shadow-pulse'
                }
              `}
            >
              {recommendedApplied ? (
                <>
                  <RotateCcw className="h-4 w-4" />
                  Repor seleção
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Aplicar medidas recomendadas
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Colunas dos âmbitos - Scrollável */}
        <div className="flex-1 overflow-y-auto px-6 pt-4 min-h-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
            {renderScopeColumn(1)}
            {renderScopeColumn(2)}
            {renderScopeColumn(3)}
          </div>
        </div>
        
        {/* Impacto/Totais - Fixo no fundo */}
        <div className="shrink-0 p-6 pt-4 border-t bg-muted/10">
          <div className="rounded-lg overflow-hidden border border-border">
          
          {/* ÁREA 1: Header (Título | Medidas) */}
          <div className="flex border-b border-border">
            {/* Título - Esquerda */}
            <div className="flex-1 p-5 pr-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </div>
                <h4 className="font-medium text-lg">Impacto das Medidas Selecionadas</h4>
              </div>
            </div>
            
            {/* Medidas - Direita */}
            <div className="w-48 shrink-0 p-5 pl-6 border-l border-border">
              <p className="text-xs text-muted-foreground">Medidas</p>
              <p className="font-semibold text-xl">{selectedMeasures.length}</p>
            </div>
          </div>
          
          {/* ÁREA 2: Conteúdo Principal (Barras | Totais) */}
          <div className="flex border-b border-border">
            {/* Barras - Esquerda */}
            <div className="flex-1 p-5 pr-6">
              <div className="space-y-3">
                {/* Barra Intensidade Atual */}
                <div className="flex items-center gap-3">
                  <span className="text-sm w-32 shrink-0">Intensidade atual</span>
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 rounded-full w-full" />
                  </div>
                  <span className="text-sm font-semibold w-32 text-right">
                    {currentIntensity.toFixed(2)} kg CO₂e/€
                  </span>
                </div>
                
                {/* Barra Com Medidas */}
                <div className="flex items-center gap-3">
                  <span className="text-sm w-32 shrink-0">Com medidas</span>
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    {selectedMeasures.length > 0 ? <div className={`h-full rounded-full transition-all ${reachedTarget ? 'bg-green-500' : 'bg-amber-400'}`} style={{
                    width: `${Math.max(newIntensity / currentIntensity * 100, 5)}%`
                  }} /> : <div className="h-full bg-gray-300 rounded-full w-full" />}
                  </div>
                  <span className={`text-sm w-32 text-right ${selectedMeasures.length > 0 ? reachedTarget ? 'font-semibold text-green-600' : 'font-semibold' : 'text-muted-foreground'}`}>
                    {selectedMeasures.length > 0 ? `${newIntensity.toFixed(2)} kg CO₂e/€` : 'Selecione medidas'}
                  </span>
                </div>
                
                {/* Barra Média Setor */}
                <div className="flex items-center gap-3">
                  <span className="text-sm w-32 shrink-0">Média do setor</span>
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-400 rounded-full" style={{
                    width: `${avgSectorIntensity / currentIntensity * 100}%`
                  }} />
                  </div>
                  <span className="text-sm font-semibold w-32 text-right">
                    {avgSectorIntensity.toFixed(2)} kg CO₂e/€
                  </span>
                </div>
              </div>
            </div>
            
            {/* Totais - Direita */}
            <div className="w-48 shrink-0 p-5 pl-6 border-l border-border">
              <div className="space-y-4">
                {/* Redução Estimada */}
                <div>
                  <p className="text-xs text-muted-foreground">Redução Estimada</p>
                  <p className={`font-semibold text-lg ${totalReduction > 0 ? 'text-green-600' : ''}`}>
                    -{totalReduction.toLocaleString('pt-PT')}t CO₂e
                    <span className="text-sm font-normal ml-1">({reductionPct.toFixed(0)}%)</span>
                  </p>
                </div>
                
                {/* Investimento Total */}
                <div>
                  <p className="text-xs text-muted-foreground">Investimento Total</p>
                  <p className="font-semibold text-lg">
                    {totalInvestment.toLocaleString('pt-PT')}€
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* ÁREA 3: Rodapé (Disclaimer | Meta) */}
          <div className="flex">
            {/* Disclaimer - Esquerda */}
            <div className="flex-1 p-4 pr-6">
              <p className="text-xs text-muted-foreground">
                Estimativas baseadas em cenários típicos. Os resultados reais podem variar conforme a implementação.
              </p>
            </div>
            
            {/* Estado da Meta - Direita */}
            <div className="w-48 shrink-0 p-4 pl-6 border-l border-border">
              <div className={`flex items-center gap-2 ${reachedTarget ? 'text-green-600' : 'text-muted-foreground'}`}>
                {reachedTarget ? <>
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Meta atingida!</span>
                  </> : <>
                    <Target className="h-4 w-4" />
                    <span className="text-sm">Meta não atingida</span>
                  </>}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>;
  };

  // ============================================
  // STEP 3: FINANCIAMENTO
  // ============================================
  const renderFinanciamentoContent = () => {
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
    
    const typeColors = {
      subsidio: { border: 'border-green-500', bg: 'bg-green-50 dark:bg-green-950/30', text: 'text-green-700 dark:text-green-300', headerBg: 'bg-green-50 dark:bg-green-950/30', badge: 'bg-green-600 dark:bg-green-500' },
      incentivo: { border: 'border-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-700 dark:text-blue-300', headerBg: 'bg-blue-50 dark:bg-blue-950/30', badge: 'bg-blue-600 dark:bg-blue-500' },
      financiamento: { border: 'border-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30', text: 'text-purple-700 dark:text-purple-300', headerBg: 'bg-purple-50 dark:bg-purple-950/30', badge: 'bg-purple-600 dark:bg-purple-500' },
    };
    
    // Toggle fundo
    const toggleFunding = (fundingId: string) => {
      setSelectedFunding(prev => 
        prev.includes(fundingId) 
          ? prev.filter(id => id !== fundingId)
          : [...prev, fundingId]
      );
    };
    
    // Calcular cobertura
    const selectedFundingData = applicableFunding
      .filter(f => selectedFunding.includes(f.fund.id) && f.eligible)
      .map(f => f.fund);
    
    // Soma bruta dos fundos selecionados
    const rawCoverage = selectedFundingData.reduce((sum, fund) => {
      if (fund.percentage) {
        const maxFromPercentage = totalInvestment * (fund.percentage / 100);
        return sum + Math.min(fund.maxAmount, maxFromPercentage);
      }
      return sum + fund.maxAmount;
    }, 0);
    
    // Cobertura limitada ao investimento total
    const totalCoverage = Math.min(rawCoverage, totalInvestment);
    const coveragePercent = totalInvestment > 0 ? (totalCoverage / totalInvestment) * 100 : 0;
    
    // Valor a cargo da empresa
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
            {/* Checkbox */}
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
            
            {/* Conteúdo */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-medium text-sm">
                  {fund.name}
                </span>
              </div>
              
              <p className="text-xs text-muted-foreground mb-2">
                {fund.provider}
              </p>
              
              {/* Info principal */}
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
              
              {/* Razão de não elegibilidade */}
              {!eligible && reason && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
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
      const colors = typeColors[type];
      
      return (
        <div className="space-y-3">
          {/* Header da coluna - estilo igual às medidas */}
          <div className={`flex items-center justify-between p-3 rounded-lg mb-3 ${colors.headerBg}`}>
            <span className={`font-medium text-sm ${colors.text}`}>
              {typeLabels[type]}
            </span>
            <span className={`w-6 h-6 rounded-full text-white text-xs font-medium flex items-center justify-center ${colors.badge}`}>
              {funds.length}
            </span>
          </div>
          
          {/* Lista de fundos */}
          <div className="space-y-2">
            {funds.length > 0 ? (
              funds.map(item => renderFundingCard(item))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum fundo disponível
              </p>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="flex flex-col h-full">
        {/* Header do step - Fixo */}
        <div className="shrink-0 p-6 pb-4 border-b border-border/50">
          <div>
            <h3 className="font-semibold text-2xl mb-1">Financiamento Disponível</h3>
            <p className="text-sm text-muted-foreground">
              Fundos sugeridos de acordo com as medidas selecionadas. Selecione os que pretende incluir no plano.
            </p>
          </div>
          
          {/* Aviso se não há medidas selecionadas */}
          {selectedMeasures.length === 0 && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 mt-4">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Selecione medidas no passo anterior para ver os fundos aplicáveis.
              </p>
            </div>
          )}
        </div>
        
        {/* Colunas dos tipos de financiamento - Scrollável */}
        <div className="flex-1 overflow-y-auto px-6 pt-4 min-h-0">
          {selectedMeasures.length > 0 && (
            <div className="grid grid-cols-3 gap-4 pb-4">
              {renderTypeColumn('subsidio')}
              {renderTypeColumn('incentivo')}
              {renderTypeColumn('financiamento')}
            </div>
          )}
        </div>
        
        {/* Resumo/Totais - Fixo no fundo */}
        <div className="shrink-0 p-6 pt-4 border-t bg-muted/10">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Fundos Selecionados</p>
              <p className="font-semibold text-xl">{selectedFunding.length}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Comparticipação Possível</p>
              <p className="font-semibold text-lg text-green-600 dark:text-green-400">
                Até {totalCoverage.toLocaleString('pt-PT')}€
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  ({coveragePercent.toFixed(0)}%)
                </span>
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">A cargo da empresa</p>
              <p className={`font-semibold text-lg ${remaining === 0 ? 'text-green-600 dark:text-green-400' : ''}`}>
                {remaining.toLocaleString('pt-PT')}€
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  ({remainingPercent.toFixed(0)}%)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Componente de secção colapsável com animação suave
  const CollapsibleSection = ({ 
    id, 
    title, 
    icon: Icon, 
    badge,
    children,
    highlighted = false
  }: { 
    id: string;
    title: string; 
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    children: React.ReactNode;
    highlighted?: boolean;
  }) => {
    const isExpanded = expandedSections[id];
    
    return (
      <div className={`border rounded-lg overflow-hidden ${highlighted ? 'border-2 border-primary/30 bg-primary/5' : ''}`}>
        <button
          type="button"
          onClick={(e) => toggleSection(id, e)}
          className={`w-full flex items-center justify-between p-4 transition-colors ${
            highlighted 
              ? 'bg-primary/10 hover:bg-primary/20' 
              : 'bg-muted/30 hover:bg-muted/50'
          }`}
        >
          <div className="flex items-center gap-3">
            {highlighted ? (
              <div className="p-2 rounded-lg bg-primary/20">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            ) : (
              <Icon className="h-5 w-5 text-muted-foreground" />
            )}
            <span className={`font-medium ${highlighted ? 'font-semibold text-primary' : ''}`}>{title}</span>
            {badge !== undefined && (
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                {badge}
              </span>
            )}
          </div>
          <ChevronDown 
            className={`h-5 w-5 transition-transform duration-200 ${
              highlighted ? 'text-primary' : 'text-muted-foreground'
            } ${isExpanded ? 'rotate-180' : ''}`} 
          />
        </button>
        
        {/* Conteúdo com transição suave */}
        <div 
          className={`
            overflow-hidden transition-all duration-200 ease-in-out
            ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className={`p-4 border-t ${highlighted ? 'border-primary/20' : ''}`}>
            {children}
          </div>
        </div>
      </div>
    );
  };

  const renderResumoContent = () => {
    // Dados calculados dos steps anteriores
    const selectedMeasuresData = mockMeasures.filter(m => selectedMeasures.includes(m.id));
    const selectedFundingData = mockFunding.filter(f => selectedFunding.includes(f.id));
    
    // Cálculos de impacto
    const totalReduction = selectedMeasuresData.reduce((sum, m) => sum + m.emissionReduction, 0);
    const totalInvestment = selectedMeasuresData.reduce((sum, m) => sum + m.investment, 0);
    const reductionPercent = supplier.totalEmissions > 0 
      ? (totalReduction / supplier.totalEmissions) * 100 
      : 0;
    
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
    
    // Nova intensidade - usar redução proporcional (consistente com Step 2)
    const currentIntensity = supplier.emissionsPerRevenue || 0;
    const reductionRatio = supplier.totalEmissions > 0 ? totalReduction / supplier.totalEmissions : 0;
    const newIntensity = currentIntensity * (1 - reductionRatio);
    const reachedTarget = newIntensity <= avgSectorIntensity;
    
    // Próximos prazos de fundos (ordenados por data)
    const upcomingDeadlines = selectedFundingData
      .filter(f => f.deadline && f.deadline !== 'Contínuo')
      .map(f => ({
        name: f.name,
        deadline: new Date(f.deadline!),
        daysRemaining: Math.ceil((new Date(f.deadline!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      }))
      .sort((a, b) => a.deadline.getTime() - b.deadline.getTime());

    return (
      <div className="flex flex-col h-full">
        {/* Header do step - Fixo */}
        <div className="shrink-0 p-6 pb-4 border-b border-border/50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-2xl mb-1">Resumo do Plano de Ação</h3>
              <p className="text-sm text-muted-foreground">
                Reveja o plano antes de exportar ou enviar à empresa.
                <span className="text-muted-foreground/70 ml-1">
                  • Gerado em {new Date().toLocaleDateString('pt-PT')}
                </span>
              </p>
            </div>
            
            {/* Botão Expandir/Colapsar Todas */}
            <button
              type="button"
              onClick={toggleAllSections}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors"
            >
              {allExpanded ? (
                <>
                  <ChevronsDownUp className="h-4 w-4" />
                  Colapsar todas
                </>
              ) : (
                <>
                  <ChevronsUpDown className="h-4 w-4" />
                  Expandir todas
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Conteúdo - Scrollável */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          
          {/* SECÇÃO: Próximos Passos - DESTAQUE NO TOPO */}
          <CollapsibleSection id="proximosPassos" title="Próximos Passos" icon={ListChecks} highlighted>
            {/* Prazos Urgentes */}
            {upcomingDeadlines.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Prazos de Candidatura
                </h5>
                <div className="space-y-2">
                  {upcomingDeadlines.map((item, idx) => (
                    <div 
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        item.daysRemaining <= 30 
                          ? 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800' 
                          : item.daysRemaining <= 60 
                            ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800'
                            : 'bg-muted/50'
                      }`}
                    >
                      <span className="text-sm">{item.name}</span>
                      <span className={`text-sm font-medium ${
                        item.daysRemaining <= 30 
                          ? 'text-red-600 dark:text-red-400' 
                          : item.daysRemaining <= 60 
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-muted-foreground'
                      }`}>
                        {item.daysRemaining <= 30 && <AlertTriangle className="h-4 w-4 inline mr-1" />}
                        {item.daysRemaining} dias ({item.deadline.toLocaleDateString('pt-PT')})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Acções Sugeridas */}
            <div>
              <h5 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Acções Recomendadas
              </h5>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium shrink-0">1</div>
                  <div>
                    <p className="text-sm font-medium">Contactar a empresa</p>
                    <p className="text-xs text-muted-foreground">Apresentar o plano de ação e discutir prioridades de implementação</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium shrink-0">2</div>
                  <div>
                    <p className="text-sm font-medium">Preparar candidaturas aos fundos</p>
                    <p className="text-xs text-muted-foreground">Reunir documentação necessária para os fundos selecionados</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium shrink-0">3</div>
                  <div>
                    <p className="text-sm font-medium">Implementar medidas Soft primeiro</p>
                    <p className="text-xs text-muted-foreground">Menor investimento, resultados mais rápidos, prepara terreno para intervenções maiores</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium shrink-0">4</div>
                  <div>
                    <p className="text-sm font-medium">Agendar acompanhamento</p>
                    <p className="text-xs text-muted-foreground">Definir data para revisão de progresso (sugestão: 30 dias)</p>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* SECÇÃO: Diagnóstico e Impacto (UNIFICADA) */}
          <CollapsibleSection id="diagnosticoImpacto" title="Diagnóstico e Impacto" icon={BarChart3}>
            <div className="space-y-6">
              {/* Dados Base */}
              <div>
                <h5 className="text-sm font-medium text-muted-foreground mb-3">Dados Base</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 border border-border rounded-lg text-center">
                    <p className="text-xs text-muted-foreground mb-1">Faturação</p>
                    <p className="font-semibold text-lg">{supplier.revenue.toLocaleString('pt-PT')}€</p>
                  </div>
                  <div className="p-3 bg-muted/50 border border-border rounded-lg text-center">
                    <p className="text-xs text-muted-foreground mb-1">Emissões Totais</p>
                    <p className="font-semibold text-lg">{supplier.totalEmissions.toLocaleString('pt-PT')} t CO₂e</p>
                  </div>
                </div>
              </div>
              
              {/* Emissões por Âmbito */}
              <div>
                <h5 className="text-sm font-medium text-muted-foreground mb-3">Emissões por Âmbito</h5>
                <div className="grid grid-cols-3 gap-4">
                  {/* Âmbito 1 - Violet */}
                  <div className="p-3 bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-lg text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-violet-500" />
                      <p className="text-xs text-violet-600 dark:text-violet-400">Âmbito 1 - Diretas</p>
                    </div>
                    <p className="font-semibold text-lg text-violet-700 dark:text-violet-300">
                      {(supplier.scope1 || 0).toLocaleString('pt-PT')} t CO₂e
                    </p>
                    <p className="text-xs text-violet-600 dark:text-violet-400">
                      {supplier.totalEmissions > 0 
                        ? `${((supplier.scope1 || 0) / supplier.totalEmissions * 100).toFixed(0)}%`
                        : '0%'
                      }
                    </p>
                  </div>
                  
                  {/* Âmbito 2 - Blue */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <p className="text-xs text-blue-600 dark:text-blue-400">Âmbito 2 - Energia</p>
                    </div>
                    <p className="font-semibold text-lg text-blue-700 dark:text-blue-300">
                      {(supplier.scope2 || 0).toLocaleString('pt-PT')} t CO₂e
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {supplier.totalEmissions > 0 
                        ? `${((supplier.scope2 || 0) / supplier.totalEmissions * 100).toFixed(0)}%`
                        : '0%'
                      }
                    </p>
                  </div>
                  
                  {/* Âmbito 3 - Orange */}
                  <div className="p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <p className="text-xs text-orange-600 dark:text-orange-400">Âmbito 3 - Indiretas</p>
                    </div>
                    <p className="font-semibold text-lg text-orange-700 dark:text-orange-300">
                      {(supplier.scope3 || 0).toLocaleString('pt-PT')} t CO₂e
                    </p>
                    <p className="text-xs text-orange-600 dark:text-orange-400">
                      {supplier.totalEmissions > 0 
                        ? `${((supplier.scope3 || 0) / supplier.totalEmissions * 100).toFixed(0)}%`
                        : '0%'
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Intensidades */}
              <div>
                <h5 className="text-sm font-medium text-muted-foreground mb-3">Intensidade de Carbono</h5>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-center">
                    <p className="text-xs text-red-600 dark:text-red-400 mb-1">Intensidade Actual</p>
                    <p className="font-semibold text-xl text-red-700 dark:text-red-300">{currentIntensity.toFixed(2)}</p>
                    <p className="text-xs text-red-600 dark:text-red-400">kg CO₂e/€</p>
                  </div>
                  <div className={`p-4 rounded-lg text-center border ${reachedTarget ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'}`}>
                    <p className={`text-xs mb-1 ${reachedTarget ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>Nova Intensidade</p>
                    <p className={`font-semibold text-xl ${reachedTarget ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300'}`}>{newIntensity.toFixed(2)}</p>
                    <p className={`text-xs ${reachedTarget ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>kg CO₂e/€</p>
                  </div>
                  <div className="p-4 bg-muted border border-border rounded-lg text-center">
                    <p className="text-xs text-muted-foreground mb-1">Média do Setor</p>
                    <p className="font-semibold text-xl">{avgSectorIntensity.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">kg CO₂e/€</p>
                  </div>
                </div>
              </div>
              
              {/* Estado da Meta */}
              <div className={`flex items-center gap-2 p-3 rounded-lg border ${reachedTarget ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'}`}>
                {reachedTarget ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Meta atingida! A empresa passará a estar abaixo da média do setor.</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">Meta não atingida. Considere adicionar mais medidas.</span>
                  </>
                )}
              </div>
              
              <Separator />
              
              {/* Impacto Total */}
              <div>
                <h5 className="text-sm font-medium text-muted-foreground mb-3">Impacto das Medidas</h5>
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg text-center">
                    <p className="text-xs text-green-600 dark:text-green-400 mb-1">Redução</p>
                    <p className="font-semibold text-xl text-green-700 dark:text-green-300">-{totalReduction.toLocaleString('pt-PT')}t</p>
                    <p className="text-xs text-green-600 dark:text-green-400">CO₂e ({reductionPercent.toFixed(0)}%)</p>
                  </div>
                  <div className="p-4 bg-muted border border-border rounded-lg text-center">
                    <p className="text-xs text-muted-foreground mb-1">Investimento</p>
                    <p className="font-semibold text-xl">{totalInvestment.toLocaleString('pt-PT')}€</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
                    <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Comparticipação</p>
                    <p className="font-semibold text-xl text-blue-700 dark:text-blue-300">{totalCoverage.toLocaleString('pt-PT')}€</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Até {coveragePercent.toFixed(0)}%</p>
                  </div>
                  <div className={`p-4 rounded-lg text-center border ${remaining === 0 ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'}`}>
                    <p className={`text-xs mb-1 ${remaining === 0 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>A cargo da empresa</p>
                    <p className={`font-semibold text-xl ${remaining === 0 ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300'}`}>{remaining.toLocaleString('pt-PT')}€</p>
                    <p className={`text-xs ${remaining === 0 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>{(100 - coveragePercent).toFixed(0)}%</p>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* SECÇÃO: Medidas Selecionadas */}
          <CollapsibleSection id="medidas" title="Medidas Selecionadas" icon={Zap} badge={selectedMeasuresData.length}>
            {selectedMeasuresData.length > 0 ? (
              <div className="space-y-2">
                {selectedMeasuresData.map(measure => (
                  <div key={measure.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        measure.scope === 1 ? 'bg-violet-500' : 
                        measure.scope === 2 ? 'bg-blue-500' : 'bg-orange-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium">{measure.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Âmbito {measure.scope} • {measure.interventionLevel === 'soft' ? 'Soft' : 'Interventiva'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">-{measure.emissionReduction}t CO₂e</p>
                      <p className="text-xs text-muted-foreground">{measure.investment.toLocaleString('pt-PT')}€</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhuma medida selecionada</p>
            )}
          </CollapsibleSection>

          {/* SECÇÃO: Financiamento */}
          <CollapsibleSection id="financiamento" title="Financiamento" icon={Euro} badge={selectedFundingData.length}>
            {selectedFundingData.length > 0 ? (
              <div className="space-y-2">
                {selectedFundingData.map(fund => (
                  <div key={fund.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{fund.name}</p>
                      <p className="text-xs text-muted-foreground">{fund.provider}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        Até {fund.maxAmount.toLocaleString('pt-PT')}€
                        {fund.percentage && ` (${fund.percentage}%)`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {fund.deadline === 'Contínuo' ? 'Candidatura contínua' : `Prazo: ${new Date(fund.deadline!).toLocaleDateString('pt-PT')}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum fundo selecionado</p>
            )}
          </CollapsibleSection>

          {/* SECÇÃO: Contexto do Município */}
          <CollapsibleSection id="contexto" title="Infraestrutura Municipal de Suporte" icon={MapPin}>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Zap className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{cascaisInfrastructure.chargingStations} postos de carregamento</p>
                  <p className="text-xs text-muted-foreground">Mobilidade elétrica</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Bike className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{cascaisInfrastructure.cyclingNetworkKm} km de ciclovias</p>
                  <p className="text-xs text-muted-foreground">Rede ciclável</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Sun className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{cascaisInfrastructure.solarPotentialZones} zonas de potencial solar</p>
                  <p className="text-xs text-muted-foreground">Energia renovável</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Recycle className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{cascaisInfrastructure.recyclingCenters} centros de reciclagem</p>
                  <p className="text-xs text-muted-foreground">Gestão de resíduos</p>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* SECÇÃO: Notas do Município */}
          <CollapsibleSection id="notas" title="Notas do Município" icon={FileText}>
            <Textarea
              value={municipalityNotes}
              onChange={(e) => setMunicipalityNotes(e.target.value)}
              placeholder="Adicione observações, recomendações adicionais, informações sobre outros fundos disponíveis, ou notas para seguimento interno..."
              className="w-full h-32 resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Estas notas serão incluídas no documento exportado e no email enviado à empresa.
            </p>
          </CollapsibleSection>

        </div>
        
        {/* Footer - Fixo (IGUAL AOS OUTROS STEPS) */}
        <div className="shrink-0 p-4 border-t bg-background">
          <div className="relative flex items-center justify-between">
            {/* Esquerda - Botão Anterior */}
            <Button
              variant="outline"
              onClick={() => setCurrentStep(3)}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            
            {/* Centro - Indicador de passo (posicionamento absoluto) */}
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              Passo 4 de 4
            </span>
            
            {/* Direita - Acções */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Fechar
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // Marcar email como enviado
                  setEmailSent(true);
                  // Actualizar localStorage imediatamente
                  if (storageKey) {
                    const stored = localStorage.getItem(storageKey);
                    if (stored) {
                      const data = JSON.parse(stored);
                      data.emailSent = true;
                      data.emailSentAt = new Date().toISOString();
                      localStorage.setItem(storageKey, JSON.stringify(data));
                    }
                  }
                  // TODO: Implementar envio de email real
                }}
                className="gap-2"
                disabled={emailSent}
              >
                <Mail className="h-4 w-4" />
                {emailSent ? 'Email Enviado' : 'Enviar Email'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {/* TODO: Implementar exportação PDF */}}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Exportar PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    // Step 1: Análise - Conteúdo direto (sem Card exterior)
    if (currentStep === 1) {
      return <div className="p-6">
          {renderAnaliseRiscoContent()}
        </div>;
    }

    // Step 2: Medidas - layout flex com scroll interno
    if (currentStep === 2) {
      return renderMedidasContent();
    }

    // Step 3: Financiamento - layout flex com scroll interno
    if (currentStep === 3) {
      return renderFinanciamentoContent();
    }

    // Step 4: Resumo - layout flex com scroll interno
    if (currentStep === 4) {
      return renderResumoContent();
    }

    return null;
  };
  return <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
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
                <span className={`font-medium ${riskLevel === 'alto' ? 'text-red-600' : riskLevel === 'medio' ? 'text-amber-600' : 'text-green-600'}`}>
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
          <div className="flex items-center justify-center gap-2">
            {stepConfig.map((step, idx) => {
              const StepIcon = step.icon;
              const state = getStepState(step.number);
              const clickable = isStepClickable(step.number);
              
              return (
                <div key={step.number} className="flex items-center">
                  {/* Linha conectora (antes de cada step excepto o primeiro) */}
                  {idx > 0 && (
                    <div 
                      className={`
                        h-0.5 w-16 mx-2 transition-colors
                        ${step.number <= currentStep || state === 'completed'
                          ? 'bg-primary/40' 
                          : 'bg-border'
                        }
                      `} 
                    />
                  )}
                  
                  {/* Step indicator */}
                  <button
                    onClick={() => goToStep(step.number)}
                    disabled={!clickable}
                    className={`
                      flex flex-col items-center gap-2 transition-all
                      ${clickable ? 'cursor-pointer' : 'cursor-not-allowed'}
                    `}
                  >
                    {/* Círculo com ícone */}
                    <div 
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center transition-all
                        ${state === 'current' 
                          ? 'bg-primary text-primary-foreground' 
                          : state === 'completed'
                            ? 'bg-primary/20 text-primary border-2 border-primary/30'
                            : 'bg-background text-muted-foreground border-2 border-border'
                        }
                        ${clickable && state !== 'current' ? 'hover:border-primary/50 hover:bg-primary/10' : ''}
                      `}
                    >
                      <StepIcon className="h-5 w-5" />
                    </div>
                    
                    {/* Label */}
                    <span 
                      className={`
                        text-sm font-medium transition-colors
                        ${state === 'current' 
                          ? 'text-primary' 
                          : state === 'completed'
                            ? 'text-primary/70'
                            : 'text-muted-foreground'
                        }
                      `}
                    >
                      {step.title}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {renderStepContent()}
        </div>
        
        {/* Footer Navigation - Escondido no Step 4 (tem footer próprio) */}
        {currentStep !== 4 && (
          <div className="p-4 border-t shrink-0 bg-background rounded-b-lg">
            <div className="relative flex items-center justify-between">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1} className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              
              {/* Centro - Indicador de passo (posicionamento absoluto) */}
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                Passo {currentStep} de 4
              </span>
              
              <div className="relative group">
                <Button 
                  onClick={handleNext} 
                  disabled={currentStep === 2 && selectedMeasures.length === 0} 
                  className="gap-2"
                >
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                {/* Tooltip quando disabled no Step 2 - posicionado à direita para evitar clipping */}
                {currentStep === 2 && selectedMeasures.length === 0 && (
                  <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Selecione pelo menos uma medida
                    <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-900" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>;
};