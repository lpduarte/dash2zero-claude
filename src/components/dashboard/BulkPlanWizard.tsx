import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Sparkles, 
  Euro, 
  Mail, 
  CheckCircle, 
  AlertTriangle,
  Eye
} from "lucide-react";
import { Supplier } from "@/types/supplier";
import { mockMeasures, getApplicableMeasures } from "@/data/mockMeasures";
import { mockFunding, getEligibleFunding } from "@/data/mockFunding";
import { cn } from "@/lib/utils";
import type { Measure, FundingSource } from "@/types/actionPlan";

// Tipos
type SelectionMode = 'sem_plano' | 'acima_media' | 'risco_alto' | 'personalizado' | 'manual';
type TargetHandling = 'all' | 'only_target' | 'review';

interface PlanData {
  selectedMeasures: string[];
  selectedFunding: string[];
  completedStep4?: boolean;
  emailSent?: boolean;
  reachedTarget?: boolean;
  lastStep?: number;
}

interface BulkPlanResult {
  empresa: Supplier;
  measures: Measure[];
  funding: FundingSource[];
  totalReduction: number;
  totalInvestment: number;
  reachedTarget: boolean;
}

interface CustomFilters {
  risco: string;
  estado: string;
  cluster: string;
  setor: string;
  ambitoDominante: string;
}

interface BulkPlanWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suppliers: Supplier[];
  avgSectorIntensity: number;
}

// Helper para obter dados do plano do localStorage
const getPlanData = (supplierId: string): PlanData | null => {
  try {
    const stored = localStorage.getItem(`actionPlan_${supplierId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Erro ao ler dados do plano:', e);
  }
  return null;
};

// Calcular estado do plano
const getPlanStatus = (planData: PlanData | null): string => {
  if (!planData || !planData.selectedMeasures || planData.selectedMeasures.length === 0) {
    return 'sem_plano';
  }
  if (planData.emailSent) return 'enviado';
  if (planData.completedStep4) return 'plano_pronto';
  return 'em_preparacao';
};

// Helper para nível de risco
const getRiskLevel = (intensity: number, avgSector: number): string => {
  if (avgSector === 0) return 'N/A';
  const percentAbove = ((intensity - avgSector) / avgSector) * 100;
  if (percentAbove >= 100) return 'Crítico';
  if (percentAbove >= 50) return 'Alto';
  if (percentAbove > 0) return 'Médio';
  return 'Baixo';
};

// Helper para âmbito dominante
const getDominantScope = (supplier: Supplier): string => {
  const scopes = [
    { scope: 'Âmbito 1', value: supplier.scope1 },
    { scope: 'Âmbito 2', value: supplier.scope2 },
    { scope: 'Âmbito 3', value: supplier.scope3 },
  ];
  return scopes.sort((a, b) => b.value - a.value)[0].scope;
};

// Obter medidas recomendadas para uma empresa
const getRecommendedMeasures = (supplier: Supplier): Measure[] => {
  const applicable = getApplicableMeasures(supplier, mockMeasures);
  // Priorizar medidas Soft (menor investimento) e de maior impacto
  return applicable
    .sort((a, b) => {
      // Primeiro por tipo de intervenção (soft primeiro)
      if (a.interventionLevel === 'soft' && b.interventionLevel !== 'soft') return -1;
      if (a.interventionLevel !== 'soft' && b.interventionLevel === 'soft') return 1;
      // Depois por ROI (emissionReduction / investment)
      const roiA = a.emissionReduction / (a.investment || 1);
      const roiB = b.emissionReduction / (b.investment || 1);
      return roiB - roiA;
    })
    .slice(0, 5); // Máximo 5 medidas por empresa
};

// Obter fundos elegíveis para medidas selecionadas
const getEligibleFundingForMeasures = (measures: Measure[], supplier: Supplier): FundingSource[] => {
  return getEligibleFunding(measures, supplier.companySize as any, mockFunding);
};

// Calcular nova intensidade após medidas
const calculateNewIntensity = (supplier: Supplier, totalReduction: number): number => {
  const newEmissions = supplier.totalEmissions - totalReduction;
  return (newEmissions / supplier.revenue) * 1000; // kg CO₂e/€
};

export const BulkPlanWizard = ({
  open,
  onOpenChange,
  suppliers,
  avgSectorIntensity
}: BulkPlanWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('sem_plano');
  const [manualSelection, setManualSelection] = useState<string[]>([]);
  const [targetHandling, setTargetHandling] = useState<TargetHandling>('all');
  const [selectedForGeneration, setSelectedForGeneration] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [customFilters, setCustomFilters] = useState<CustomFilters>({
    risco: 'todos',
    estado: 'todos',
    cluster: 'todos',
    setor: 'todos',
    ambitoDominante: 'todos',
  });

  // Calcular empresas por filtro rápido
  const empresasSemPlano = useMemo(() => 
    suppliers.filter(s => getPlanStatus(getPlanData(s.id)) === 'sem_plano'),
    [suppliers]
  );

  const empresasAcimaMedia = useMemo(() => 
    suppliers.filter(s => s.emissionsPerRevenue > avgSectorIntensity),
    [suppliers, avgSectorIntensity]
  );

  const empresasRiscoAlto = useMemo(() => 
    suppliers.filter(s => {
      const risk = getRiskLevel(s.emissionsPerRevenue, avgSectorIntensity);
      return risk === 'Alto' || risk === 'Crítico';
    }),
    [suppliers, avgSectorIntensity]
  );

  // Aplicar filtros personalizados
  const applyCustomFilters = (list: Supplier[]): Supplier[] => {
    return list.filter(s => {
      // Filtro por risco
      if (customFilters.risco !== 'todos') {
        const risk = getRiskLevel(s.emissionsPerRevenue, avgSectorIntensity).toLowerCase();
        if (risk !== customFilters.risco) return false;
      }
      
      // Filtro por estado
      if (customFilters.estado !== 'todos') {
        const status = getPlanStatus(getPlanData(s.id));
        if (status !== customFilters.estado) return false;
      }
      
      // Filtro por cluster
      if (customFilters.cluster !== 'todos') {
        // Map cluster names
        const clusterMap: Record<string, string> = {
          'apoiadas': 'fornecedor',
          'monitorizadas': 'cliente',
          'parceiras': 'parceiro',
        };
        if (s.cluster !== clusterMap[customFilters.cluster]) return false;
      }
      
      // Filtro por setor
      if (customFilters.setor !== 'todos') {
        const sectorLower = s.sector.toLowerCase();
        if (!sectorLower.includes(customFilters.setor)) return false;
      }
      
      // Filtro por âmbito dominante
      if (customFilters.ambitoDominante !== 'todos') {
        const dominant = getDominantScope(s);
        const filterMap: Record<string, string> = {
          'ambito1': 'Âmbito 1',
          'ambito2': 'Âmbito 2',
          'ambito3': 'Âmbito 3',
        };
        if (dominant !== filterMap[customFilters.ambitoDominante]) return false;
      }
      
      return true;
    });
  };

  // Obter empresas selecionadas com base no modo
  const selectedEmpresas = useMemo(() => {
    switch (selectionMode) {
      case 'sem_plano':
        return empresasSemPlano;
      case 'acima_media':
        return empresasAcimaMedia;
      case 'risco_alto':
        return empresasRiscoAlto;
      case 'personalizado':
        return applyCustomFilters(suppliers);
      case 'manual':
        return suppliers.filter(s => manualSelection.includes(s.id));
      default:
        return [];
    }
  }, [selectionMode, empresasSemPlano, empresasAcimaMedia, empresasRiscoAlto, suppliers, manualSelection, customFilters]);

  // Calcular resultados dos planos
  const planResults = useMemo((): BulkPlanResult[] => {
    return selectedEmpresas.map(empresa => {
      const measures = getRecommendedMeasures(empresa);
      const funding = getEligibleFundingForMeasures(measures, empresa);
      const totalReduction = measures.reduce((sum, m) => sum + m.emissionReduction, 0);
      const totalInvestment = measures.reduce((sum, m) => sum + m.investment, 0);
      const newIntensity = calculateNewIntensity(empresa, totalReduction);
      const reachedTarget = newIntensity <= avgSectorIntensity;
      
      return {
        empresa,
        measures,
        funding,
        totalReduction,
        totalInvestment,
        reachedTarget,
      };
    });
  }, [selectedEmpresas, avgSectorIntensity]);

  // Estatísticas
  const withTarget = planResults.filter(r => r.reachedTarget);
  const withoutTarget = planResults.filter(r => !r.reachedTarget);
  const totalInvestment = planResults.reduce((sum, r) => sum + r.totalInvestment, 0);
  const totalReduction = planResults.reduce((sum, r) => sum + r.totalReduction, 0);

  // Gerar planos
  const handleGeneratePlans = (sendEmail: boolean = false) => {
    const empresasToProcess = targetHandling === 'only_target' 
      ? planResults.filter(r => r.reachedTarget)
      : targetHandling === 'review'
        ? planResults.filter(r => selectedForGeneration.includes(r.empresa.id))
        : planResults;

    for (const result of empresasToProcess) {
      const storageKey = `actionPlan_${result.empresa.id}`;
      const planData = {
        selectedMeasures: result.measures.map(m => m.id),
        selectedFunding: result.funding.map(f => f.id),
        municipalityNotes: '',
        currentStep: 4,
        lastStep: 4,
        completedStep4: true,
        reachedTarget: result.reachedTarget,
        emailSent: sendEmail,
        emailSentAt: sendEmail ? new Date().toISOString() : undefined,
        generatedAt: new Date().toISOString(),
        generatedBy: 'bulk_wizard',
      };
      localStorage.setItem(storageKey, JSON.stringify(planData));
    }

    setShowSuccess(true);
  };

  // Fechar e resetar
  const handleClose = () => {
    setCurrentStep(1);
    setSelectionMode('sem_plano');
    setManualSelection([]);
    setTargetHandling('all');
    setSelectedForGeneration([]);
    setShowSuccess(false);
    onOpenChange(false);
  };

  // Inicializar seleção para revisão
  const initializeReviewSelection = () => {
    setSelectedForGeneration(planResults.filter(r => r.reachedTarget).map(r => r.empresa.id));
  };

  // Render Step 1: Selecionar Empresas
  const renderStep1 = () => (
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
            onChange={() => setSelectionMode('sem_plano')}
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
            onChange={() => setSelectionMode('acima_media')}
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
            onChange={() => setSelectionMode('risco_alto')}
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
            onChange={() => setSelectionMode('personalizado')}
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
                  onValueChange={(v) => setCustomFilters(prev => ({ ...prev, risco: v }))}
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
                  onValueChange={(v) => setCustomFilters(prev => ({ ...prev, estado: v }))}
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
                  onValueChange={(v) => setCustomFilters(prev => ({ ...prev, cluster: v }))}
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
                  onValueChange={(v) => setCustomFilters(prev => ({ ...prev, setor: v }))}
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
                  onValueChange={(v) => setCustomFilters(prev => ({ ...prev, ambitoDominante: v }))}
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
            onChange={() => setSelectionMode('manual')}
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
                      setManualSelection(prev => [...prev, supplier.id]);
                    } else {
                      setManualSelection(prev => prev.filter(id => id !== supplier.id));
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

  // Render Step 2: Medidas Automáticas
  const renderStep2 = () => (
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
                  -{result.totalReduction}t CO₂e
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

  // Render Step 3: Financiamento Automático
  const renderStep3 = () => (
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

  // Render Step 4: Resumo e Confirmação
  const renderStep4 = () => {
    if (showSuccess) {
      return (
        <div className="space-y-6 text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Planos gerados com sucesso!</h3>
            <p className="text-muted-foreground">
              {targetHandling === 'only_target' ? withTarget.length : 
               targetHandling === 'review' ? selectedForGeneration.length : 
               planResults.length} planos foram criados.
            </p>
          </div>
          <Button onClick={handleClose} className="mt-4">
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
          <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg text-center">
            <p className="text-sm text-green-600">Atingem meta</p>
            <p className="text-2xl font-bold text-green-700">{withTarget.length}</p>
            <p className="text-xs text-green-600">empresas</p>
          </div>
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-center">
            <p className="text-sm text-amber-600">Não atingem meta</p>
            <p className="text-2xl font-bold text-amber-700">{withoutTarget.length}</p>
            <p className="text-xs text-amber-600">empresas</p>
          </div>
        </div>

        {/* Aviso se há empresas sem meta */}
        {withoutTarget.length > 0 && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  {withoutTarget.length} empresas não atingem meta com estas medidas.
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
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
                  onChange={() => setTargetHandling('all')}
                  className="text-primary"
                />
                <span className="text-sm">Gerar todos os planos (podem ser revistos depois)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="targetHandling"
                  checked={targetHandling === 'only_target'}
                  onChange={() => setTargetHandling('only_target')}
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
                    setTargetHandling('review');
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
            <p className="text-2xl font-bold text-green-600">-{totalReduction.toLocaleString('pt-PT')}t</p>
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
                      setSelectedForGeneration(prev => [...prev, result.empresa.id]);
                    } else {
                      setSelectedForGeneration(prev => prev.filter(id => id !== result.empresa.id));
                    }
                  }}
                />
                <div className="flex-1">
                  <p className="font-medium">{result.empresa.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {result.measures.length} medidas · -{result.totalReduction}t CO₂e
                  </p>
                </div>
                {result.reachedTarget ? (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Meta ✓
                  </span>
                ) : (
                  <span className="text-xs text-amber-600 flex items-center gap-1">
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

  // Render content por step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return null;
    }
  };

  // Verificar se pode avançar
  const canAdvance = () => {
    if (currentStep === 1) return selectedEmpresas.length > 0;
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            Gerar Planos em Massa
          </DialogTitle>
        </DialogHeader>

        {/* Step Navigation */}
        <div className="flex items-center justify-center gap-2 py-4 border-b">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                currentStep === step ? "bg-primary text-primary-foreground" :
                currentStep > step ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
                "bg-muted text-muted-foreground"
              )}>
                {currentStep > step ? <CheckCircle className="h-4 w-4" /> : step}
              </div>
              {step < 4 && (
                <div className={cn(
                  "w-12 h-0.5 mx-1",
                  currentStep > step ? "bg-green-500" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4">
          {renderStepContent()}
        </div>

        {/* Footer */}
        {!showSuccess && (
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : handleClose()}
            >
              {currentStep === 1 ? (
                'Cancelar'
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Anterior
                </>
              )}
            </Button>

            <span className="text-sm text-muted-foreground">
              Passo {currentStep} de 4
            </span>

            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canAdvance()}
              >
                Próximo
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleGeneratePlans(false)}
                >
                  Gerar planos
                </Button>
                <Button
                  onClick={() => handleGeneratePlans(true)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Gerar e enviar
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
