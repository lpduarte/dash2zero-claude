import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Rocket, ChevronLeft, ChevronRight, CheckCircle, Mail } from "lucide-react";
import { Supplier } from "@/types/supplier";
import { mockFunding } from "@/data/mockFunding";
import { cn } from "@/lib/utils";
import { getPlanData, getPlanStatus, getRiskLevel } from "@/lib/planUtils";
import { BulkStep1Selection, BulkStep2Measures, BulkStep3Funding, BulkStep4Confirm } from "./steps";
import { 
  getRecommendedMeasures, 
  getEligibleFundingForMeasures, 
  calculateTotalReductionPercentage,
  calculateNewIntensity 
} from "./utils";
import type { SelectionMode, TargetHandling, CustomFilters, BulkPlanResult } from "./types";

interface BulkPlanWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suppliers: Supplier[];
  avgSectorIntensity: number;
}

// Helper para âmbito dominante
const getDominantScope = (supplier: Supplier): string => {
  const scopes = [
    { scope: 'Âmbito 1', value: supplier.scope1 },
    { scope: 'Âmbito 2', value: supplier.scope2 },
    { scope: 'Âmbito 3', value: supplier.scope3 },
  ];
  return scopes.sort((a, b) => b.value - a.value)[0].scope;
};

// Aplicar filtros personalizados
const applyCustomFilters = (
  list: Supplier[], 
  customFilters: CustomFilters, 
  avgSectorIntensity: number
): Supplier[] => {
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
        return applyCustomFilters(suppliers, customFilters, avgSectorIntensity);
      case 'manual':
        return suppliers.filter(s => manualSelection.includes(s.id));
      default:
        return [];
    }
  }, [selectionMode, empresasSemPlano, empresasAcimaMedia, empresasRiscoAlto, suppliers, manualSelection, customFilters, avgSectorIntensity]);

  // Calcular resultados dos planos
  const planResults = useMemo((): BulkPlanResult[] => {
    return selectedEmpresas.map(empresa => {
      const measures = getRecommendedMeasures(empresa);
      const funding = getEligibleFundingForMeasures(measures, empresa);

      const totalReductionPercentage = calculateTotalReductionPercentage(measures);
      const totalReduction = empresa.totalEmissions * totalReductionPercentage;

      const totalInvestment = measures.reduce((sum, m) => sum + m.investment, 0);
      const newIntensity = calculateNewIntensity(empresa, measures);
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

  // Render content por step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BulkStep1Selection
            suppliers={suppliers}
            selectedEmpresas={selectedEmpresas}
            empresasSemPlano={empresasSemPlano}
            empresasAcimaMedia={empresasAcimaMedia}
            empresasRiscoAlto={empresasRiscoAlto}
            selectionMode={selectionMode}
            onSelectionModeChange={setSelectionMode}
            manualSelection={manualSelection}
            onManualSelectionChange={setManualSelection}
            customFilters={customFilters}
            onCustomFiltersChange={setCustomFilters}
          />
        );
      case 2:
        return (
          <BulkStep2Measures
            selectedEmpresas={selectedEmpresas}
            planResults={planResults}
          />
        );
      case 3:
        return <BulkStep3Funding />;
      case 4:
        return (
          <BulkStep4Confirm
            planResults={planResults}
            withTarget={withTarget}
            withoutTarget={withoutTarget}
            totalInvestment={totalInvestment}
            totalReduction={totalReduction}
            targetHandling={targetHandling}
            onTargetHandlingChange={setTargetHandling}
            selectedForGeneration={selectedForGeneration}
            onSelectedForGenerationChange={setSelectedForGeneration}
            showSuccess={showSuccess}
            onClose={handleClose}
            initializeReviewSelection={initializeReviewSelection}
          />
        );
      default:
        return null;
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
