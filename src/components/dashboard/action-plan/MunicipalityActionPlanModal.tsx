import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ChevronRight, BarChart3, Zap, Euro, FileText, Target } from 'lucide-react';
import { sectorLabels } from '../SupplierLabel';
import { mockMeasures } from '@/data/mockMeasures';
import { Step1Analysis, Step2Measures, Step3Funding, Step4Summary } from './steps';
import type { MunicipalityActionPlanModalProps, Step, StepConfig, ExpandedSections } from './types';
import { getDimensionLabel } from './types';
import { riskColors } from '@/lib/styles';

const stepConfig: StepConfig[] = [
  { number: 1, title: 'Análise', icon: BarChart3 },
  { number: 2, title: 'Medidas', icon: Zap },
  { number: 3, title: 'Financiamento', icon: Euro },
  { number: 4, title: 'Resumo', icon: FileText },
];

export const MunicipalityActionPlanModal = ({
  supplier,
  riskLevel,
  riskMultiplier,
  avgSectorIntensity,
  open,
  onOpenChange,
}: MunicipalityActionPlanModalProps) => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedMeasures, setSelectedMeasures] = useState<string[]>([]);
  const [recommendedApplied, setRecommendedApplied] = useState(false);
  const [selectedFunding, setSelectedFunding] = useState<string[]>([]);
  const [emailSent, setEmailSent] = useState(false);
  const [municipalityNotes, setMunicipalityNotes] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    proximosPassos: true,
    diagnosticoImpacto: true,
    medidas: true,
    financiamento: true,
    contexto: false,
    notas: true,
  });

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
      const selectedMeasureObjects = mockMeasures.filter(m => selectedMeasures.includes(m.id));
      const totalReduction = selectedMeasureObjects.reduce((sum, m) => sum + m.emissionReduction, 0);
      const reductionRatio = supplier.totalEmissions > 0 ? totalReduction / supplier.totalEmissions : 0;
      const currentIntensity = supplier.emissionsPerRevenue || 0;
      const newIntensity = currentIntensity * (1 - reductionRatio);
      const reachedTarget = newIntensity <= avgSectorIntensity;
      const completedStep4 = currentStep === 4;

      const dataToSave = {
        selectedMeasures,
        selectedFunding,
        municipalityNotes,
        currentStep,
        expandedSections,
        lastUpdated: new Date().toISOString(),
        lastStep: currentStep,
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

  const getStepState = (step: number): 'current' | 'completed' | 'pending' => {
    const hasSelections: Record<number, boolean> = {
      1: false,
      2: selectedMeasures.length > 0,
      3: selectedFunding.length > 0,
      4: false,
    };
    if (step === currentStep) return 'current';
    if (step < currentStep) return 'completed';
    if (hasSelections[step]) return 'completed';
    return 'pending';
  };

  const isStepClickable = (step: number): boolean => {
    if (step === currentStep) return true;
    if (step < currentStep) return true;
    if (step === currentStep + 1) return true;
    if (step > currentStep + 1) {
      for (let s = currentStep + 1; s < step; s++) {
        if (s === 1) continue;
        if (s === 2 && selectedMeasures.length === 0) return false;
        if (s === 3 && selectedFunding.length === 0) return false;
      }
      return true;
    }
    return false;
  };

  const goToStep = (step: number) => {
    if (isStepClickable(step)) {
      setCurrentStep(step as Step);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const toggleSection = (section: string, event?: React.MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] } as ExpandedSections));
  };

  const allExpanded = Object.values(expandedSections).every(v => v);

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

  const handleSendEmail = () => {
    setEmailSent(true);
  };

  const getRiskLabel = () => {
    switch (riskLevel) {
      case 'alto': return 'Alto';
      case 'medio': return 'Médio';
      default: return 'Normal';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Analysis
            supplier={supplier}
            riskLevel={riskLevel}
            riskMultiplier={riskMultiplier}
            avgSectorIntensity={avgSectorIntensity}
          />
        );
      case 2:
        return (
          <Step2Measures
            supplier={supplier}
            selectedMeasures={selectedMeasures}
            onMeasuresChange={setSelectedMeasures}
            recommendedApplied={recommendedApplied}
            onRecommendedAppliedChange={setRecommendedApplied}
            avgSectorIntensity={avgSectorIntensity}
          />
        );
      case 3:
        return (
          <Step3Funding
            supplier={supplier}
            selectedMeasures={selectedMeasures}
            selectedFunding={selectedFunding}
            onFundingChange={setSelectedFunding}
            avgSectorIntensity={avgSectorIntensity}
          />
        );
      case 4:
        return (
          <Step4Summary
            supplier={supplier}
            selectedMeasures={selectedMeasures}
            selectedFunding={selectedFunding}
            municipalityNotes={municipalityNotes}
            onNotesChange={setMunicipalityNotes}
            emailSent={emailSent}
            onSendEmail={handleSendEmail}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
            onToggleAllSections={toggleAllSections}
            allExpanded={allExpanded}
            avgSectorIntensity={avgSectorIntensity}
            riskLevel={riskLevel}
            onClose={handleClose}
            onPrevious={handlePrevious}
            storageKey={storageKey}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-y-auto">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-start justify-between pr-10">
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

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 border rounded-lg bg-muted/30 text-sm">
                <span className="text-muted-foreground">Setor: </span>
                <span className="font-normal">{sectorLabels[supplier.sector] || supplier.sector}</span>
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="text-muted-foreground">Dimensão: </span>
                <span className="font-normal">{getDimensionLabel(supplier.companySize)}</span>
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="text-muted-foreground">Freguesia: </span>
                <span className="font-normal">{supplier.parish || 'N/A'}</span>
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="text-muted-foreground">Risco: </span>
                <span className={`font-normal ${riskColors[riskLevel as keyof typeof riskColors]?.text || 'text-muted-foreground'}`}>
                  {getRiskLabel()}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        {/* Steps Indicator */}
        <div className="px-6 py-4 bg-muted/30 border-b">
          <div className="flex items-center justify-center gap-2">
            {stepConfig.map((step, idx) => {
              const StepIcon = step.icon;
              const state = getStepState(step.number);
              const clickable = isStepClickable(step.number);

              return (
                <div key={step.number} className="flex items-center">
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

                  <button
                    onClick={() => goToStep(step.number)}
                    disabled={!clickable}
                    className={`
                      flex flex-col items-center gap-2 transition-all
                      ${clickable ? 'cursor-pointer' : 'cursor-not-allowed'}
                    `}
                  >
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

                    <span
                      className={`
                        text-sm font-normal transition-colors
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
        <div>
          {renderStepContent()}
        </div>

        {/* Footer Navigation - Escondido no Step 4 (tem footer próprio) */}
        {currentStep !== 4 && (
          <div className="p-4 border-t bg-background rounded-b-lg">
            <div className="relative flex items-center justify-between">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1} className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>

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
    </Dialog>
  );
};
