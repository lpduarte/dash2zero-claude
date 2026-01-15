import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Leaf, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown, 
  ChevronUp,
  Upload, 
  FileText, 
  Edit3, 
  Loader2,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  User,
  Flame,
  Sparkles,
  X,
  BarChart3,
  TrendingDown,
  Lightbulb,
  ArrowRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { formatNumber } from "@/lib/formatters";

// ============ Types ============
interface CompanyData {
  name: string;
  cae: string;
  address: string;
  postalCode: string;
  freguesia: string;
  concelho: string;
  distrito: string;
}

interface ScopeBreakdown {
  [key: string]: number;
}

// ============ Mock Data ============
const mockNifData: Record<string, CompanyData> = {
  "500745898": {
    name: "Caixa Geral de Depósitos SA",
    cae: "64190 - Outra intermediação monetária",
    address: "Av. João XXI, 63",
    postalCode: "1000-300",
    freguesia: "Alvalade",
    concelho: "Lisboa",
    distrito: "Lisboa",
  },
  "500100144": {
    name: "EDP - Energias de Portugal SA",
    cae: "35140 - Comércio de eletricidade",
    address: "Av. 24 de Julho, 12",
    postalCode: "1249-300",
    freguesia: "Estrela",
    concelho: "Lisboa",
    distrito: "Lisboa",
  },
  "502011475": {
    name: "Sonae SGPS SA",
    cae: "64202 - Atividades das sociedades gestoras de participações sociais",
    address: "Lugar do Espido, Via Norte",
    postalCode: "4471-909",
    freguesia: "Maia",
    concelho: "Maia",
    distrito: "Porto",
  },
};

const mockImportedData = {
  nif: "502011475",
  companyName: "Sonae SGPS SA",
  year: "2024",
  scope1: "45.2",
  scope2: "78.9",
  scope3: "234.5",
  employees: "85",
  revenue: "2500000",
};

const scope1Categories = [
  { key: "fontesFixas", label: "Fontes fixas de combustão" },
  { key: "fontesMoveis", label: "Fontes móveis de combustão" },
  { key: "etar", label: "Tratamento de efluentes (ETAR)" },
  { key: "processo", label: "Emissões de processo" },
];

const scope2Categories = [
  { key: "eletricidade", label: "Eletricidade" },
  { key: "calorFrioVapor", label: "Calor, frio e vapor" },
  { key: "veiculosEletricos", label: "Veículos elétricos" },
];

const scope3Categories = [
  { key: "c1", label: "C1. Bens e serviços adquiridos", group: "montante" },
  { key: "c2", label: "C2. Bens de capital", group: "montante" },
  { key: "c3", label: "C3. Combustíveis e energia", group: "montante" },
  { key: "c4", label: "C4. Transporte a montante", group: "montante" },
  { key: "c5", label: "C5. Resíduos", group: "montante" },
  { key: "c6", label: "C6. Viagens de negócio", group: "montante" },
  { key: "c7", label: "C7. Deslocações pendulares", group: "montante" },
  { key: "c8", label: "C8. Ativos arrendados (montante)", group: "montante" },
  { key: "c9", label: "C9. Transporte a jusante", group: "jusante" },
  { key: "c10", label: "C10. Processamento de produtos", group: "jusante" },
  { key: "c11", label: "C11. Uso de produtos vendidos", group: "jusante" },
  { key: "c12", label: "C12. Fim de vida de produtos", group: "jusante" },
  { key: "c13", label: "C13. Ativos arrendados (jusante)", group: "jusante" },
  { key: "c14", label: "C14. Franchising", group: "jusante" },
  { key: "c15", label: "C15. Investimentos", group: "jusante" },
];

// ============ Utility Functions ============
const validateNifChecksum = (nif: string): boolean => {
  if (!/^\d{9}$/.test(nif)) return false;
  
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += parseInt(nif[i]) * (9 - i);
  }
  
  const checkDigit = 11 - (sum % 11);
  const expectedDigit = checkDigit >= 10 ? 0 : checkDigit;
  
  return parseInt(nif[8]) === expectedDigit;
};

const generateGenericCompanyData = (nif: string): CompanyData => ({
  name: `Empresa ${nif.slice(0, 3)}`,
  cae: "47190 - Comércio a retalho",
  address: "Morada não disponível",
  postalCode: "0000-000",
  freguesia: "Não disponível",
  concelho: "Não disponível",
  distrito: "Não disponível",
});

// ============ Components ============

// Stepper Component with Icons
const stepConfig = [
  { number: 1, title: "Identificação", icon: User },
  { number: 2, title: "Emissões", icon: Flame },
  { number: 3, title: "Confirmação", icon: CheckCircle2 },
];

const Stepper = ({ currentStep }: { currentStep: number }) => {
  const getStepState = (stepNumber: number) => {
    if (stepNumber < currentStep) return "completed";
    if (stepNumber === currentStep) return "current";
    return "upcoming";
  };

  return (
    <div className="flex items-center justify-center mb-12">
      {stepConfig.map((step, idx) => {
        const StepIcon = step.icon;
        const state = getStepState(step.number);

        return (
          <div key={step.number} className="flex items-center">
            {idx > 0 && (
              <div
                className={`
                  h-0.5 w-16 md:w-24 mx-2 transition-colors
                  ${state !== "upcoming" || currentStep > step.number
                    ? "bg-primary/40"
                    : "bg-border"
                  }
                `}
              />
            )}

            <div className="flex flex-col items-center gap-2">
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all
                  ${state === "current"
                    ? "bg-primary text-primary-foreground"
                    : state === "completed"
                      ? "bg-primary/20 text-primary border-2 border-primary/30"
                      : "bg-background text-muted-foreground border-2 border-border"
                  }
                `}
              >
                <StepIcon className="h-5 w-5" />
              </div>

              <span
                className={`
                  text-sm font-medium transition-colors
                  ${state === "current"
                    ? "text-primary"
                    : state === "completed"
                      ? "text-primary/70"
                      : "text-muted-foreground"
                  }
                `}
              >
                {step.title}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Helper function to auto-complete last percentage field
const autoCompleteBreakdown = (
  newBreakdown: ScopeBreakdown,
  categories: { key: string }[]
): ScopeBreakdown => {
  const sum = Object.values(newBreakdown).reduce((a, b) => a + (b || 0), 0);
  const emptyFields = categories.filter(
    cat => !newBreakdown[cat.key] || newBreakdown[cat.key] === 0
  );
  const filledCount = categories.length - emptyFields.length;
  
  // Auto-fill if: sum < 100, exactly 1 field empty, and at least 1 field filled
  if (emptyFields.length === 1 && sum < 100 && sum > 0 && filledCount >= 1) {
    const remaining = 100 - sum;
    if (remaining > 0 && remaining <= 100) {
      return {
        ...newBreakdown,
        [emptyFields[0].key]: remaining
      };
    }
  }
  
  return newBreakdown;
};

// Grouped Breakdown Component for Scope 3
const GroupedBreakdown = ({ 
  categories, 
  breakdown, 
  onChange 
}: { 
  categories: typeof scope3Categories;
  breakdown: ScopeBreakdown;
  onChange: (breakdown: ScopeBreakdown) => void;
}) => {
  const groups: Record<string, { label: string; categories: typeof scope3Categories }> = {
    montante: { label: "Cadeia de valor a montante", categories: [] },
    jusante: { label: "Cadeia de valor a jusante", categories: [] },
  };
  
  categories.forEach(cat => {
    if (cat.group && groups[cat.group]) {
      groups[cat.group].categories.push(cat);
    }
  });

  const handleChange = (key: string, value: number) => {
    const newBreakdown = { ...breakdown, [key]: value };
    const autoCompleted = autoCompleteBreakdown(newBreakdown, categories);
    onChange(autoCompleted);
  };

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([key, group]) => (
        <div key={key} className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">{group.label}</h4>
          <div className="space-y-2">
            {group.categories.map(cat => (
              <div key={cat.key} className="flex items-center gap-3">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  className="w-20 text-right"
                  value={breakdown[cat.key] || ""}
                  onChange={(e) => handleChange(cat.key, Number(e.target.value) || 0)}
                />
                <span className="text-sm text-muted-foreground">%</span>
                <span className="text-sm flex-1">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Simple Breakdown Component
const SimpleBreakdown = ({ 
  categories, 
  breakdown, 
  onChange 
}: { 
  categories: { key: string; label: string }[];
  breakdown: ScopeBreakdown;
  onChange: (breakdown: ScopeBreakdown) => void;
}) => {
  const handleChange = (key: string, value: number) => {
    const newBreakdown = { ...breakdown, [key]: value };
    const autoCompleted = autoCompleteBreakdown(newBreakdown, categories);
    onChange(autoCompleted);
  };

  return (
    <div className="space-y-2">
      {categories.map(cat => (
        <div key={cat.key} className="flex items-center gap-3">
          <Input
            type="number"
            min="0"
            max="100"
            className="w-20 text-right"
            value={breakdown[cat.key] || ""}
            onChange={(e) => handleChange(cat.key, Number(e.target.value) || 0)}
          />
          <span className="text-sm text-muted-foreground">%</span>
          <span className="text-sm flex-1">{cat.label}</span>
        </div>
      ))}
    </div>
  );
};

// Scope Card Component
interface ScopeCardProps {
  scope: 1 | 2 | 3;
  title: string;
  description: string;
  optional?: boolean;
  optionalMessage?: string;
  total: string;
  onTotalChange: (value: string) => void;
  breakdown: ScopeBreakdown;
  onBreakdownChange: (breakdown: ScopeBreakdown) => void;
  categories: { key: string; label: string; group?: string }[];
  grouped?: boolean;
}

const ScopeCard = ({
  scope,
  title,
  description,
  optional,
  optionalMessage,
  total,
  onTotalChange,
  breakdown,
  onBreakdownChange,
  categories,
  grouped,
}: ScopeCardProps) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  
  const breakdownSum = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const isBreakdownValid = breakdownSum === 0 || breakdownSum === 100;
  
  const scopeColors = {
    1: "border-l-violet-500",
    2: "border-l-blue-500",
    3: "border-l-orange-500",
  };

  return (
    <Card className={`p-6 border-l-4 ${scopeColors[scope]}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{title}</h3>
            {optional && (
              <Badge variant="outline" className="text-xs">Opcional</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Label className="whitespace-nowrap">Total de emissões</Label>
          <div className="flex items-center gap-2 flex-1">
            <Input
              type="number"
              step="0.1"
              min="0"
              placeholder="0"
              className="max-w-[150px]"
              value={total}
              onChange={(e) => onTotalChange(e.target.value)}
            />
            <span className="text-sm text-muted-foreground whitespace-nowrap">t CO₂e</span>
          </div>
        </div>
        
        {optionalMessage && !total && (
          <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            💡 {optionalMessage}
          </p>
        )}
        
        <Collapsible open={showBreakdown} onOpenChange={setShowBreakdown}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 -ml-2">
              {showBreakdown ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              Detalhar por categoria
              {breakdownSum > 0 && (
                <Badge variant={isBreakdownValid ? "default" : "destructive"} className="ml-2">
                  {breakdownSum}%
                </Badge>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="bg-muted/30 p-4 rounded-lg space-y-4">
              {grouped ? (
                <GroupedBreakdown 
                  categories={categories as typeof scope3Categories} 
                  breakdown={breakdown} 
                  onChange={onBreakdownChange} 
                />
              ) : (
                <SimpleBreakdown 
                  categories={categories} 
                  breakdown={breakdown} 
                  onChange={onBreakdownChange} 
                />
              )}
              
              {breakdownSum > 0 && !isBreakdownValid && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  A soma das percentagens deve ser 100% (atual: {breakdownSum}%)
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Card>
  );
};

// ============ Main Component ============
const FormularioTotais = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Step state
  const [step, setStep] = useState(1);
  
  // Import dialog state
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importComplete, setImportComplete] = useState(false);
  const [importMode, setImportMode] = useState<"manual" | "import" | null>(null);
  
  // Step 1: Identification - Pre-filled NIF for demo
  const [nif, setNif] = useState("502011475");
  const [isLoadingNif, setIsLoadingNif] = useState(false);
  const [nifError, setNifError] = useState("");
  const [nifValid, setNifValid] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [employees, setEmployees] = useState("");
  const [revenue, setRevenue] = useState("");
  
  // Step 2: Emissions
  const [year, setYear] = useState("2024");
  const [scope1Total, setScope1Total] = useState("");
  const [scope2Total, setScope2Total] = useState("");
  const [scope3Total, setScope3Total] = useState("");
  const [scope1Breakdown, setScope1Breakdown] = useState<ScopeBreakdown>({});
  const [scope2Breakdown, setScope2Breakdown] = useState<ScopeBreakdown>({});
  const [scope3Breakdown, setScope3Breakdown] = useState<ScopeBreakdown>({});
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  
  // Step 3: Confirmation
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // NIF lookup handler
  const handleNifLookup = useCallback(async () => {
    if (!nif || nif.length !== 9) return;
    
    setIsLoadingNif(true);
    setNifError("");
    setNifValid(false);
    setCompanyData(null);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (!validateNifChecksum(nif)) {
      setNifError("NIF inválido");
      setIsLoadingNif(false);
      return;
    }
    
    const data = mockNifData[nif] || generateGenericCompanyData(nif);
    setCompanyData(data);
    setNifValid(true);
    setIsLoadingNif(false);
  }, [nif]);
  
  // Auto-validate NIF on mount (for demo)
  useEffect(() => {
    if (nif && nif.length === 9 && !nifValid && !companyData) {
      handleNifLookup();
    }
  }, []); // Only on mount
  
  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);
  
  // Import handler
  const handleImport = async () => {
    setIsProcessing(true);
    setImportProgress(0);
    
    // Animate progress
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    
    await new Promise(resolve => setTimeout(resolve, 2200));
    
    // Fill form with mock data
    setNif(mockImportedData.nif);
    setYear(mockImportedData.year);
    setScope1Total(mockImportedData.scope1);
    setScope2Total(mockImportedData.scope2);
    setScope3Total(mockImportedData.scope3);
    setEmployees(mockImportedData.employees);
    setRevenue(mockImportedData.revenue);
    setCompanyData(mockNifData[mockImportedData.nif]);
    setNifValid(true);
    
    setImportComplete(true);
    setIsProcessing(false);
  };
  
  // Submit handler
  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    
    // Show success screen instead of navigating
    setSubmitted(true);
  };
  
  // Validation
  const canProceed = useMemo(() => {
    if (step === 1) {
      return nifValid && employees && revenue;
    }
    if (step === 2) {
      return scope1Total && scope2Total;
    }
    return acceptTerms;
  }, [step, nifValid, employees, revenue, scope1Total, scope2Total, acceptTerms]);
  
  // Calculate intensity (kg CO₂e / €)
  const intensity = useMemo(() => {
    const totalEmissions = (parseFloat(scope1Total) || 0) + (parseFloat(scope2Total) || 0);
    const revenueNum = parseFloat(revenue) || 0;
    if (revenueNum === 0) return 0;
    // Emissões em t CO₂e, converter para kg (x1000), dividir por faturação
    return (totalEmissions * 1000) / revenueNum;
  }, [scope1Total, scope2Total, revenue]);

  // ============ Render ============
  
  // Success screen after submission
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <div className="max-w-3xl mx-auto px-6 py-12">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold">Dash2Zero</span>
            </div>
          </div>

          {/* Success confirmation */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Dados submetidos com sucesso
            </h1>
            <p className="text-muted-foreground text-lg">
              A pegada de carbono de {companyData?.name || "sua empresa"} foi registada
            </p>
          </div>

          {/* Quick summary */}
          <Card className="p-6 mb-8">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">{scope1Total || "0"}</p>
                <p className="text-sm text-muted-foreground">t CO₂e Âmbito 1</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">{scope2Total || "0"}</p>
                <p className="text-sm text-muted-foreground">t CO₂e Âmbito 2</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">{scope3Total || "—"}</p>
                <p className="text-sm text-muted-foreground">t CO₂e Âmbito 3</p>
              </div>
            </div>
            {intensity > 0 && (
              <>
                <Separator className="my-6" />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Intensidade carbónica</p>
                  <p className="text-2xl font-bold">{formatNumber(intensity, 4)} <span className="text-base font-normal text-muted-foreground">kg CO₂e/€</span></p>
                </div>
              </>
            )}
          </Card>

          {/* Invitation to Simple */}
          <Card className="p-8 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">
                Quer ir mais longe?
              </h2>
              <p className="text-muted-foreground">
                Com o Dash2Zero Simple, pode obter análises detalhadas e descobrir oportunidades de melhoria
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-background rounded-xl border text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <p className="font-medium mb-1">Comparação sectorial</p>
                <p className="text-sm text-muted-foreground">
                  Veja como se posiciona face à média do seu sector
                </p>
              </div>
              
              <div className="p-4 bg-background rounded-xl border text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <TrendingDown className="h-5 w-5 text-primary" />
                </div>
                <p className="font-medium mb-1">Potencial de redução</p>
                <p className="text-sm text-muted-foreground">
                  Identifique onde pode reduzir até 30% das emissões
                </p>
              </div>
              
              <div className="p-4 bg-background rounded-xl border text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <p className="font-medium mb-1">Medidas concretas</p>
                <p className="text-sm text-muted-foreground">
                  Receba sugestões personalizadas de acções
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                size="lg" 
                className="gap-2"
                onClick={() => navigate("/onboarding")}
              >
                Experimentar o Simple
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/")}
              >
                Voltar ao início
              </Button>
            </div>
          </Card>

          {/* Final note */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Os seus dados foram guardados. Pode aceder ao Simple a qualquer momento.
          </p>
        </div>
      </div>
    );
  }
  
  // Pre-form selection screen (no stepper)
  if (step === 1 && importMode === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <div className="max-w-[800px] mx-auto px-6 py-12">
          {/* Logo */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-semibold">Dash2Zero</span>
            </div>
          </div>
          
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Submissão de Pegada de Carbono
            </h1>
            <p className="text-muted-foreground">
              Escolha como pretende submeter os seus dados
            </p>
          </div>

          {/* Choice Cards - NO stepper */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card 
              className="p-8 cursor-pointer hover:border-primary hover:shadow-md transition-all"
              onClick={() => setImportMode("manual")}
            >
              <Edit3 className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Preencher manualmente</h3>
              <p className="text-sm text-muted-foreground">
                Introduza os dados da sua pegada de carbono passo a passo
              </p>
            </Card>
            
            <Card 
              className="p-8 cursor-pointer hover:border-primary hover:shadow-md transition-all"
              onClick={() => setShowImportDialog(true)}
            >
              <Upload className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Importar relatório</h3>
              <p className="text-sm text-muted-foreground">
                Carregue um PDF ou Excel com os dados de emissões
              </p>
            </Card>
          </div>
          
          {/* Back to onboarding link */}
          <div className="text-center mt-12">
            <Button variant="link" onClick={() => navigate("/onboarding")}>
              ← Voltar ao início
            </Button>
          </div>
        </div>
        
        {/* Import Dialog */}
        <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Importar relatório de emissões</DialogTitle>
              <DialogDescription>
                Carregue o ficheiro PDF ou Excel com os dados da pegada de carbono
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-6">
              {!isProcessing && !importComplete && (
                <div 
                  className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors"
                  onClick={handleImport}
                >
                  <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <p className="font-medium mb-1">Arraste o ficheiro ou clique para selecionar</p>
                  <p className="text-sm text-muted-foreground">PDF, XLSX, XLS ou CSV</p>
                </div>
              )}
              
              {isProcessing && (
                <div className="text-center py-4">
                  <FileText className="h-10 w-10 mx-auto mb-4 text-primary animate-pulse" />
                  <p className="font-medium mb-4">A analisar documento...</p>
                  <Progress value={importProgress} className="w-full" />
                </div>
              )}
              
              {importComplete && (
                <div className="text-center py-4">
                  <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <p className="font-medium mb-2">Dados extraídos com sucesso</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Verifique os valores no formulário
                  </p>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      setShowImportDialog(false);
                      setImportMode("import");
                      setImportComplete(false);
                      setImportProgress(0);
                    }}
                  >
                    Continuar
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="max-w-[800px] mx-auto px-6 py-12">
        {/* Logo */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-semibold">Dash2Zero</span>
          </div>
        </div>
        
        {/* Welcome message - personalized when company data exists */}
        {companyData ? (
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              Bem-vindo, {companyData.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Complete os dados da sua pegada de carbono
            </p>
          </div>
        ) : (
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              Submissão de Pegada de Carbono
            </h1>
            <p className="text-muted-foreground mt-1">
              Preencha os dados da sua empresa e emissões
            </p>
          </div>
        )}
        
        {/* Stepper */}
        <Stepper currentStep={step} />
        
        {/* Step 1: Identification */}
        {step === 1 && importMode !== null && (
          <Card className="p-6 md:p-8">
            <div className="space-y-6">
              {/* NIF Field */}
              <div className="space-y-2">
                <Label htmlFor="nif">NIF da empresa</Label>
                <div className="flex gap-3">
                  <Input
                    id="nif"
                    placeholder="000000000"
                    value={nif}
                    onChange={(e) => {
                      setNif(e.target.value.replace(/\D/g, ""));
                      setNifError("");
                      setNifValid(false);
                      setCompanyData(null);
                    }}
                    maxLength={9}
                    className="flex-1"
                  />
                  <Button onClick={handleNifLookup} disabled={nif.length !== 9 || isLoadingNif}>
                    {isLoadingNif ? <Loader2 className="h-4 w-4 animate-spin" /> : "Validar"}
                  </Button>
                </div>
                {nifError && <p className="text-sm text-destructive">{nifError}</p>}
                {nifValid && (
                  <p className="text-sm text-success flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" /> NIF válido
                  </p>
                )}
              </div>
              
              {/* Company Data (auto-filled) */}
              {companyData && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Dados obtidos automaticamente:</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nome da empresa</Label>
                        <Input value={companyData.name} readOnly className="bg-muted/50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Atividade económica (CAE)</Label>
                        <Input value={companyData.cae} readOnly className="bg-muted/50" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Morada</Label>
                      <Input value={companyData.address} readOnly className="bg-muted/50" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Código Postal</Label>
                        <Input value={companyData.postalCode} readOnly className="bg-muted/50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Concelho</Label>
                        <Input value={companyData.concelho} readOnly className="bg-muted/50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Distrito</Label>
                        <Input value={companyData.distrito} readOnly className="bg-muted/50" />
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              <Separator />
              
              {/* Additional company info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employees">Número de colaboradores</Label>
                  <Input
                    id="employees"
                    type="number"
                    min="1"
                    placeholder="50"
                    className="placeholder:text-muted-foreground/50"
                    value={employees}
                    onChange={(e) => setEmployees(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="revenue">Faturação anual (€)</Label>
                  <Input
                    id="revenue"
                    type="number"
                    min="0"
                    placeholder="1000000"
                    className="placeholder:text-muted-foreground/50"
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </Card>
        )}
        
        {/* Step 2: Emissions */}
        {step === 2 && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="space-y-2">
                <Label>Ano de referência</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecionar ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
            
            <ScopeCard
              scope={1}
              title="Âmbito 1 — Emissões Diretas"
              description="Emissões de fontes controladas pela empresa"
              total={scope1Total}
              onTotalChange={setScope1Total}
              breakdown={scope1Breakdown}
              onBreakdownChange={setScope1Breakdown}
              categories={scope1Categories}
            />
            
            <ScopeCard
              scope={2}
              title="Âmbito 2 — Emissões Indiretas (Energia)"
              description="Emissões da energia adquirida"
              total={scope2Total}
              onTotalChange={setScope2Total}
              breakdown={scope2Breakdown}
              onBreakdownChange={setScope2Breakdown}
              categories={scope2Categories}
            />
            
            <ScopeCard
              scope={3}
              title="Âmbito 3 — Outras Emissões Indiretas"
              description="Emissões da cadeia de valor"
              optional
              optionalMessage="O âmbito 3 é opcional mas fortemente recomendado para uma análise completa."
              total={scope3Total}
              onTotalChange={setScope3Total}
              breakdown={scope3Breakdown}
              onBreakdownChange={setScope3Breakdown}
              categories={scope3Categories}
              grouped
            />
            
            <Card className="p-6">
              <div className="space-y-2">
                <Label>Fonte da informação (opcional)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept=".pdf,.xlsx,.xls,.doc,.docx"
                    className="placeholder:text-muted-foreground/50"
                    onChange={(e) => setSourceFile(e.target.files?.[0] || null)}
                  />
                  {sourceFile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span className="truncate max-w-[200px]">{sourceFile.name}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        onClick={() => setSourceFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Anexe o relatório ou certificado de onde provêm os dados
                </p>
              </div>
            </Card>
          </div>
        )}
        
        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="space-y-6">
            <Card className="p-6 md:p-8">
              <h2 className="text-lg font-semibold mb-6">Resumo da submissão</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Empresa</p>
                  <p className="font-medium">{companyData?.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">NIF</p>
                  <p className="font-medium">{nif}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Ano de referência</p>
                  <p className="font-medium">{year}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Localização</p>
                  <p className="font-medium">{companyData?.concelho}, {companyData?.distrito}</p>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="grid grid-cols-3 gap-4 text-center mb-6">
                <div className="p-4 bg-violet-50 dark:bg-violet-950/30 rounded-lg">
                  <p className="text-2xl font-bold">{scope1Total || "—"}</p>
                  <p className="text-xs text-muted-foreground">t CO₂e Âmbito 1</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <p className="text-2xl font-bold">{scope2Total || "—"}</p>
                  <p className="text-xs text-muted-foreground">t CO₂e Âmbito 2</p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                  <p className="text-2xl font-bold">{scope3Total || "—"}</p>
                  <p className="text-xs text-muted-foreground">t CO₂e Âmbito 3</p>
                </div>
              </div>
              
              {revenue && intensity > 0 && (
                <>
                  <Separator className="my-6" />
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Intensidade carbónica</p>
                    <p className="text-3xl font-bold text-primary">
                      {formatNumber(intensity, 4)}
                    </p>
                    <p className="text-sm text-muted-foreground">kg CO₂e / €</p>
                  </div>
                </>
              )}
            </Card>
            
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <Checkbox 
                id="terms" 
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                className="mt-0.5"
              />
              <div className="space-y-1">
                <Label htmlFor="terms" className="cursor-pointer leading-relaxed">
                  Aceito partilhar estes dados no âmbito da plataforma Dash2Zero
                </Label>
                <p className="text-sm text-muted-foreground">
                  Conforme detalhado nos{" "}
                  <a href="#" className="text-primary underline hover:no-underline">
                    Termos, Condições e Políticas
                  </a>
                </p>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="w-full" 
              disabled={!acceptTerms || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  A submeter...
                </>
              ) : (
                "Submeter dados"
              )}
            </Button>
          </div>
        )}
        
        {/* Navigation */}
        {(step > 1 || importMode !== null) && (
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="ghost"
              onClick={() => {
                if (step === 1) {
                  setImportMode(null);
                } else {
                  setStep(step - 1);
                }
              }}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            
            {step < 3 && (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed}
              >
                Seguinte
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        )}
        
        {/* Back to onboarding link */}
        <div className="text-center mt-12">
          <Button variant="link" onClick={() => navigate("/onboarding")}>
            ← Voltar ao início
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormularioTotais;
