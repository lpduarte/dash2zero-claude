import { useState, useMemo } from "react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { KPICard } from "@/components/ui/kpi-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Search, 
  Send, 
  AlertTriangle, 
  Loader2,
  Mail,
  Target,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Archive,
  CheckCircle2,
  Calculator,
  Clock,
  Star,
  Users,
  UserX,
  Lightbulb,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { getClustersByOwnerType } from "@/data/clusters";
import { 
  getSuppliersWithoutFootprintByOwnerType,
  getSuppliersWithFootprintByOwnerType,
} from "@/data/suppliers";
import { emailTemplates, getCompanyEmailTracking, EmailRecord } from "@/data/emailTracking";
import { SupplierWithoutFootprint } from "@/types/supplierNew";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { IncentiveFiltersDialog, IncentiveFilters } from "@/components/dashboard/IncentiveFiltersDialog";

interface CompanyWithTracking extends SupplierWithoutFootprint {
  emailsSent: number;
  lastContactDate?: string;
  emailHistory: EmailRecord[];
}

const onboardingStatusConfig: Record<string, { label: string; color: string; tooltip: string }> = {
  por_contactar: { 
    label: 'Por contactar', 
    color: 'bg-muted text-muted-foreground hover:bg-muted/80', 
    tooltip: 'Ainda não recebeu nenhum email' 
  },
  sem_interacao: { 
    label: 'Sem interação', 
    color: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50', 
    tooltip: 'Recebeu email mas não clicou no link' 
  },
  interessada: { 
    label: 'Interessada', 
    color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-900/50', 
    tooltip: 'Clicou no link do email' 
  },
  interessada_simple: { 
    label: 'Interessada / Simple', 
    color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-900/50', 
    tooltip: 'Escolheu o caminho Simple na landing page' 
  },
  interessada_formulario: { 
    label: 'Interessada / Formulário', 
    color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-900/50', 
    tooltip: 'Escolheu o caminho Formulário na landing page' 
  },
  registada_simple: { 
    label: 'Registada', 
    color: 'bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50', 
    tooltip: 'Criou conta no Simple' 
  },
  em_progresso_simple: { 
    label: 'Em progresso / Simple', 
    color: 'bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50', 
    tooltip: 'Iniciou o cálculo da pegada no Simple' 
  },
  em_progresso_formulario: { 
    label: 'Em progresso / Formulário', 
    color: 'bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50', 
    tooltip: 'Iniciou o preenchimento do formulário' 
  },
  completo: { 
    label: 'Completo', 
    color: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50', 
    tooltip: 'Pegada calculada com sucesso' 
  },
};

// Template suggestions based on onboarding status (map to template IDs)
const templateSuggestions: Record<string, string> = {
  por_contactar: 't1',           // Convite Inicial
  sem_interacao: 't2',           // Lembrete
  interessada: 't3',             // Benefícios (como ajuda)
  interessada_simple: 't3',
  interessada_formulario: 't3',
  registada_simple: 't3',        // Benefícios
  em_progresso_simple: 't2',     // Lembrete (suporte)
  em_progresso_formulario: 't2',
  completo: 't1',                // Ignorado mas mapeado
};


// Next action helper based on onboarding status
const getNextAction = (status: string): string => {
  const actions: Record<string, string> = {
    por_contactar: 'Enviar convite',
    sem_interacao: 'Enviar lembrete',
    interessada: 'Oferecer ajuda',
    interessada_simple: 'Oferecer ajuda',
    interessada_formulario: 'Oferecer ajuda',
    registada_simple: 'Incentivar início',
    em_progresso_simple: 'Dar suporte',
    em_progresso_formulario: 'Dar suporte',
    completo: 'Concluído',
  };
  return actions[status] || '';
};

const Incentive = () => {
  const { isMunicipio } = useUser();
  const { toast } = useToast();
  
  // State
  const [activeTab, setActiveTab] = useState<"pending" | "archive">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCluster, setSelectedCluster] = useState("all");
  const [advancedFilters, setAdvancedFilters] = useState<IncentiveFilters>({
    onboardingStatus: [],
    emailCount: "all",
  });
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(emailTemplates[0].id);
  const [subject, setSubject] = useState(emailTemplates[0].subject);
  const [message, setMessage] = useState(emailTemplates[0].body);
  const [isLoading, setIsLoading] = useState(false);
  const [isMetricsExpanded, setIsMetricsExpanded] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'emails' | 'lastContact'>('status');
  const [showSmartSendDialog, setShowSmartSendDialog] = useState(false);
  
  // Status order for sorting (most advanced first)
  const statusOrder: Record<string, number> = {
    completo: 0,
    em_progresso_formulario: 1,
    em_progresso_simple: 2,
    registada_simple: 3,
    interessada_formulario: 4,
    interessada_simple: 5,
    interessada: 6,
    sem_interacao: 7,
    por_contactar: 8,
  };
  
  // Data
  const clusters = useMemo(() => {
    const ownerType = isMunicipio ? 'municipio' : 'empresa';
    return getClustersByOwnerType(ownerType);
  }, [isMunicipio]);
  
  // Empresas COM pegada (para o arquivo)
  const companiesWithFootprint = useMemo(() => {
    const ownerType = isMunicipio ? 'municipio' : 'empresa';
    return getSuppliersWithFootprintByOwnerType(ownerType);
  }, [isMunicipio]);
  
  // Empresas SEM pegada (para contactar)
  const companiesWithoutFootprint = useMemo((): CompanyWithTracking[] => {
    const ownerType = isMunicipio ? 'municipio' : 'empresa';
    const suppliers = getSuppliersWithoutFootprintByOwnerType(ownerType);
    
    return suppliers.map(s => {
      const tracking = getCompanyEmailTracking(s.id);
      return {
        ...s,
        emailsSent: tracking.emailsSent,
        lastContactDate: tracking.emailHistory[0]?.sentAt,
        emailHistory: tracking.emailHistory,
      };
    });
  }, [isMunicipio]);
  
  // Filtered companies (sem pegada)
  const filteredCompanies = useMemo(() => {
    let filtered = [...companiesWithoutFootprint];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(query)
      );
    }
    
    if (selectedCluster !== "all") {
      filtered = filtered.filter(c => c.clusterId === selectedCluster);
    }
    
    // Advanced filters - email count
    if (advancedFilters.emailCount !== "all") {
      if (advancedFilters.emailCount === "0") {
        filtered = filtered.filter(c => c.emailsSent === 0);
      } else if (advancedFilters.emailCount === "1") {
        filtered = filtered.filter(c => c.emailsSent === 1);
      } else if (advancedFilters.emailCount === "2") {
        filtered = filtered.filter(c => c.emailsSent === 2);
      } else if (advancedFilters.emailCount === "3+") {
        filtered = filtered.filter(c => c.emailsSent >= 3);
      }
    }
    
    // Advanced filters - onboarding status
    if (advancedFilters.onboardingStatus.length > 0) {
      filtered = filtered.filter(c => advancedFilters.onboardingStatus.includes(c.onboardingStatus));
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'status':
        filtered.sort((a, b) => (statusOrder[a.onboardingStatus] || 99) - (statusOrder[b.onboardingStatus] || 99));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'emails':
        filtered.sort((a, b) => b.emailsSent - a.emailsSent);
        break;
      case 'lastContact':
        filtered.sort((a, b) => {
          if (!a.lastContactDate) return 1;
          if (!b.lastContactDate) return -1;
          return new Date(b.lastContactDate).getTime() - new Date(a.lastContactDate).getTime();
        });
        break;
    }
    
    return filtered;
  }, [companiesWithoutFootprint, searchQuery, selectedCluster, advancedFilters, sortBy, statusOrder]);
  
  // Filtered archive (com pegada)
  const filteredArchive = useMemo(() => {
    let filtered = [...companiesWithFootprint];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(query)
      );
    }
    
    if (selectedCluster !== "all") {
      filtered = filtered.filter(c => c.clusterId === selectedCluster);
    }
    
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [companiesWithFootprint, searchQuery, selectedCluster]);
  
  // Funnel metrics based on onboardingStatus
  const funnelMetrics = useMemo(() => {
    const allCompanies = companiesWithoutFootprint;
    const total = allCompanies.length;
    
    const statusCounts = allCompanies.reduce((acc, c) => {
      acc[c.onboardingStatus] = (acc[c.onboardingStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const porContactar = statusCounts['por_contactar'] || 0;
    const semInteracao = statusCounts['sem_interacao'] || 0;
    const interessada = (statusCounts['interessada'] || 0) + 
                        (statusCounts['interessada_simple'] || 0) + 
                        (statusCounts['interessada_formulario'] || 0);
    const registada = statusCounts['registada_simple'] || 0;
    const emProgresso = (statusCounts['em_progresso_simple'] || 0) + 
                        (statusCounts['em_progresso_formulario'] || 0);
    const completo = statusCounts['completo'] || 0;
    
    const emFunil = semInteracao + interessada + registada + emProgresso;
    const conversionRate = total > 0 ? Math.round((completo / total) * 100) : 0;
    
    // Percentages for funnel visualization
    const porContactarPerc = total > 0 ? Math.round((porContactar / total) * 100) : 0;
    const semInteracaoPerc = total > 0 ? Math.round((semInteracao / total) * 100) : 0;
    const interessadaPerc = total > 0 ? Math.round((interessada / total) * 100) : 0;
    const emProgressoPerc = total > 0 ? Math.round((emProgresso / total) * 100) : 0;
    const completoPerc = total > 0 ? Math.round((completo / total) * 100) : 0;
    
    // Mock data for time to value, bottleneck and best template
    const avgDaysToConversion = 12;
    const bottleneck = "Sem interação → Interessada";
    const bestTemplate = "Convite Inicial";
    const bestTemplateRate = 42;
    
    const chartData = [
      {
        name: "Funil",
        porContactar,
        semInteracao,
        interessada,
        emProgresso,
        completo,
      }
    ];
    
    return {
      conversionRate,
      porContactar,
      porContactarPerc,
      semInteracao,
      semInteracaoPerc,
      interessada,
      interessadaPerc,
      emProgresso,
      emProgressoPerc,
      emFunil,
      avgDaysToConversion,
      bottleneck,
      bestTemplate,
      bestTemplateRate,
      total,
      completo,
      completoPerc,
      chartData,
    };
  }, [companiesWithoutFootprint]);
  
  // Handlers
  const handleSelectCompany = (companyId: string) => {
    setSelectedCompanies(prev => 
      prev.includes(companyId) 
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };
  
  const handleSelectAll = () => {
    const currentList = activeTab === "pending" ? filteredCompanies : filteredArchive;
    const currentIds = currentList.map(c => c.id);
    const allSelected = currentIds.every(id => selectedCompanies.includes(id));
    
    if (allSelected) {
      setSelectedCompanies(prev => prev.filter(id => !currentIds.includes(id)));
    } else {
      setSelectedCompanies(prev => [...new Set([...prev, ...currentIds])]);
    }
  };
  
  const handleTemplateChange = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setSubject(template.subject);
      setMessage(template.body);
    }
  };
  
  const handleSend = async () => {
    if (selectedCompanies.length === 0) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Emails enviados",
      description: `${selectedCompanies.length} email(s) enviados com sucesso.`,
    });
    
    setSelectedCompanies([]);
    setIsLoading(false);
  };
  
  const toggleExpandCompany = (companyId: string) => {
    setExpandedCompany(prev => prev === companyId ? null : companyId);
  };
  
  const formatEmailDate = (dateString: string) => {
    return format(new Date(dateString), "d MMM yyyy, HH:mm", { locale: pt });
  };
  
  const getEmailCountColor = (count: number) => {
    if (count === 0) return "bg-muted text-muted-foreground";
    if (count === 1) return "bg-primary/20 text-primary";
    if (count === 2) return "bg-warning/20 text-warning";
    return "bg-danger/20 text-danger";
  };
  
  // Preview
  const firstSelectedCompany = useMemo(() => {
    if (selectedCompanies.length === 0) return null;
    // Procurar em ambas as listas
    return companiesWithoutFootprint.find(c => c.id === selectedCompanies[0]) ||
           companiesWithFootprint.find(c => c.id === selectedCompanies[0]) as any;
  }, [selectedCompanies, companiesWithoutFootprint, companiesWithFootprint]);
  
  // Suggested template based on first selected company's status
  const suggestedTemplate = useMemo(() => {
    if (!firstSelectedCompany) return null;
    const status = firstSelectedCompany.onboardingStatus;
    if (!status) return null;
    return templateSuggestions[status] || null;
  }, [firstSelectedCompany]);
  
  const suggestedTemplateName = useMemo(() => {
    if (!suggestedTemplate) return null;
    const template = emailTemplates.find(t => t.id === suggestedTemplate);
    return template?.name || null;
  }, [suggestedTemplate]);
  
  // Smart send summary - group companies by suggested template
  const getSmartSendSummary = useMemo(() => {
    if (selectedCompanies.length === 0) return [];
    
    const groups: Record<string, { template: string; templateName: string; companies: string[] }> = {};
    
    selectedCompanies.forEach(companyId => {
      const company = companiesWithoutFootprint.find(c => c.id === companyId);
      if (!company) return;
      
      const suggestedId = templateSuggestions[company.onboardingStatus] || 't1';
      const template = emailTemplates.find(t => t.id === suggestedId);
      
      if (!groups[suggestedId]) {
        groups[suggestedId] = {
          template: suggestedId,
          templateName: template?.name || 'Template',
          companies: []
        };
      }
      groups[suggestedId].companies.push(company.name);
    });
    
    return Object.values(groups);
  }, [selectedCompanies, companiesWithoutFootprint]);
  
  const handleSmartSendPreview = () => {
    setShowSmartSendDialog(true);
  };
  
  const handleSmartSend = async () => {
    setShowSmartSendDialog(false);
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Emails enviados",
      description: `${selectedCompanies.length} email(s) enviados com templates optimizados.`,
    });
    
    setSelectedCompanies([]);
    setIsLoading(false);
  };
  
  const previewSubject = useMemo(() => {
    if (!firstSelectedCompany) return subject;
    return subject.replace(/{companyName}/g, firstSelectedCompany.name);
  }, [subject, firstSelectedCompany]);
  
  const previewMessage = useMemo(() => {
    if (!firstSelectedCompany) return message;
    return message.replace(/{companyName}/g, firstSelectedCompany.name);
  }, [message, firstSelectedCompany]);
  
  const currentList = activeTab === "pending" ? filteredCompanies : filteredArchive;
  const allSelected = currentList.length > 0 && currentList.every(c => selectedCompanies.includes(c.id));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            Incentivo ao Cálculo de Pegada
          </h1>
          <p className="text-muted-foreground mt-1">
            Contacte empresas para calcular ou actualizar a sua pegada de carbono
          </p>
        </div>
        
        {/* Funnel Metrics Card */}
        <Collapsible open={isMetricsExpanded} onOpenChange={setIsMetricsExpanded}>
          <Card className="shadow-sm mb-6">
            <CardHeader className={cn("transition-all duration-[400ms]", isMetricsExpanded ? "pb-3" : "pb-6")}>
              <SectionHeader
                icon={TrendingUp}
                title="Funil de Conversão"
                collapsible
                expanded={isMetricsExpanded}
                onToggle={() => setIsMetricsExpanded(!isMetricsExpanded)}
              />
            </CardHeader>
            <CollapsibleContent>
              <CardContent>
                {/* Linha 1 - 5 KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <KPICard
                    title="Taxa de Conversão"
                    value={`${funnelMetrics.conversionRate}%`}
                    unit={`${funnelMetrics.completo} de ${funnelMetrics.total} empresas`}
                    icon={TrendingUp}
                    iconColor="text-success"
                    iconBgColor="bg-success/10"
                    valueColor="text-success"
                  />
                  <KPICard
                    title="Por Contactar"
                    value={funnelMetrics.porContactar}
                    unit="sem nenhum email"
                    icon={UserX}
                    iconColor="text-muted-foreground"
                    iconBgColor="bg-muted"
                  />
                  <KPICard
                    title="Em Funil"
                    value={funnelMetrics.emFunil}
                    unit="contactadas em progresso"
                    icon={Users}
                    iconColor="text-primary"
                    iconBgColor="bg-primary/10"
                    valueColor="text-primary"
                  />
                  <KPICard
                    title="Time to Value"
                    value={funnelMetrics.avgDaysToConversion}
                    unit="dias em média"
                    icon={Clock}
                    iconColor="text-muted-foreground"
                    iconBgColor="bg-muted"
                  />
                  <KPICard
                    title="Melhor Template"
                    value={funnelMetrics.bestTemplate}
                    unit={`${funnelMetrics.bestTemplateRate}% conversão`}
                    icon={Star}
                    iconColor="text-warning"
                    iconBgColor="bg-warning/10"
                  />
                </div>
                
                {/* Linha 2 - Bottleneck largo + espaço para funil visual */}
                <div className="grid grid-cols-5 gap-4 mt-4">
                  <div className="col-span-2">
                    <KPICard
                      title="Bottleneck"
                      value={funnelMetrics.bottleneck}
                      unit="fase com maior drop-off no funil"
                      icon={AlertTriangle}
                      iconColor="text-warning"
                      iconBgColor="bg-warning/10"
                      valueColor="text-warning"
                    />
                  </div>
                  {/* Funnel visual with CSS */}
                  <div className="col-span-3 border rounded-lg p-4 bg-card shadow-sm">
                    <p className="text-xs font-medium text-muted-foreground mb-4">Progressão do Funil</p>
                    
                    {/* Barra CSS */}
                    <div className="h-8 w-full flex rounded-md overflow-hidden">
                      {[
                        { key: 'porContactar', value: funnelMetrics.porContactar, color: 'bg-slate-300 dark:bg-slate-600', label: 'Por contactar' },
                        { key: 'semInteracao', value: funnelMetrics.semInteracao, color: 'bg-blue-500', label: 'Sem interação' },
                        { key: 'interessada', value: funnelMetrics.interessada, color: 'bg-yellow-400', label: 'Interessada' },
                        { key: 'emProgresso', value: funnelMetrics.emProgresso, color: 'bg-orange-500', label: 'Em progresso' },
                        { key: 'completo', value: funnelMetrics.completo, color: 'bg-green-500', label: 'Completo' },
                      ].map((stage, index, arr) => {
                        const total = arr.reduce((sum, s) => sum + s.value, 0);
                        const percentage = total > 0 ? (stage.value / total) * 100 : 0;
                        if (percentage === 0) return null;
                        return (
                          <TooltipProvider key={stage.key}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div 
                                  className={cn(
                                    stage.color,
                                    "h-full transition-opacity hover:opacity-80 cursor-default",
                                    index > 0 && "border-l border-white/50"
                                  )}
                                  style={{ width: `${percentage}%` }}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{stage.label}: {stage.value} ({percentage.toFixed(0)}%)</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    </div>
                    
                    {/* Legenda */}
                    <div className="flex flex-wrap justify-center gap-4 mt-3">
                      {[
                        { label: 'Por contactar', value: funnelMetrics.porContactar, color: 'bg-slate-300 dark:bg-slate-600' },
                        { label: 'Sem interação', value: funnelMetrics.semInteracao, color: 'bg-blue-500' },
                        { label: 'Interessada', value: funnelMetrics.interessada, color: 'bg-yellow-400' },
                        { label: 'Em progresso', value: funnelMetrics.emProgresso, color: 'bg-orange-500' },
                        { label: 'Completo', value: funnelMetrics.completo, color: 'bg-green-500' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-1.5 text-xs">
                          <div className={cn("h-2.5 w-2.5 rounded-full", item.color)} />
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className="font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
        
        {/* Main Grid: List + Compose */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-6">
          {/* Left Column: Company List */}
          <div className="flex flex-col border rounded-lg overflow-hidden bg-card h-[700px]">
            {/* Tabs: Por Contactar / Arquivo */}
            <div className="border-b p-3">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "pending" | "archive")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pending" className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Por Contactar ({companiesWithoutFootprint.length})
                  </TabsTrigger>
                  <TabsTrigger value="archive" className="flex items-center gap-2">
                    <Archive className="h-4 w-4" />
                    Arquivo ({companiesWithFootprint.length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Filters */}
            <div className="p-4 border-b space-y-3 bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar empresa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <IncentiveFiltersDialog
                  filters={advancedFilters}
                  onFiltersChange={setAdvancedFilters}
                  companies={activeTab === "pending" ? companiesWithoutFootprint : companiesWithFootprint as any}
                />
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="status">Status (avançado)</SelectItem>
                    <SelectItem value="name">Nome (A-Z)</SelectItem>
                    <SelectItem value="emails">Nº emails</SelectItem>
                    <SelectItem value="lastContact">Último contacto</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleSelectAll} size="sm">
                  {allSelected ? "Desmarcar" : "Selec. todas"}
                </Button>
              </div>
              
              <div className="flex gap-1 flex-wrap">
                <Button
                  variant={selectedCluster === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCluster("all")}
                  className="gap-1.5"
                >
                  Todos
                  <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
                    {activeTab === "pending" ? companiesWithoutFootprint.length : companiesWithFootprint.length}
                  </Badge>
                </Button>
                {clusters.map(cluster => {
                  const count = activeTab === "pending"
                    ? companiesWithoutFootprint.filter(c => c.clusterId === cluster.id).length
                    : companiesWithFootprint.filter(c => c.clusterId === cluster.id).length;
                  return (
                    <Button
                      key={cluster.id}
                      variant={selectedCluster === cluster.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCluster(cluster.id)}
                      className="gap-1.5"
                    >
                      {cluster.name}
                      <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
                        {count}
                      </Badge>
                    </Button>
                  );
                })}
              </div>
            </div>
            
            {/* Company List */}
            <ScrollArea className="flex-1 h-[500px]">
              <div className="p-2 space-y-1">
                {activeTab === "pending" ? (
                  // Lista de empresas sem pegada
                  filteredCompanies.length > 0 ? (
                    filteredCompanies.map(company => (
                      <Collapsible key={company.id} open={expandedCompany === company.id}>
                        <div className={`rounded-lg border transition-colors ${
                          company.emailsSent >= 3 ? 'border-warning/30 bg-warning/10' : ''
                        } ${selectedCompanies.includes(company.id) ? 'bg-primary/5 border-primary/30' : ''}`}>
                          <div className="flex items-center gap-3 p-3">
                            <Checkbox
                              checked={selectedCompanies.includes(company.id)}
                              onCheckedChange={() => handleSelectCompany(company.id)}
                            />
                            
                            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleSelectCompany(company.id)}>
                              <p className="font-medium truncate">{company.name}</p>
                            </div>
                            
                            {/* Status + próxima acção + histórico */}
                            <div className="flex items-center gap-2">
                              {/* Badge de status */}
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge className={`text-xs py-0 shrink-0 ${onboardingStatusConfig[company.onboardingStatus]?.color || 'bg-muted text-muted-foreground'}`}>
                                      {onboardingStatusConfig[company.onboardingStatus]?.label || company.onboardingStatus}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {onboardingStatusConfig[company.onboardingStatus]?.tooltip || ''}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              {/* Próxima acção sugerida */}
                              <span className="text-xs text-muted-foreground hidden lg:inline">
                                → {getNextAction(company.onboardingStatus)}
                              </span>
                              
                              {/* Contador de emails com hover de saturação */}
                              {company.emailHistory.length > 0 ? (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <CollapsibleTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className={`gap-1 ${getEmailCountColor(company.emailsSent)}`}
                                          onClick={() => toggleExpandCompany(company.id)}
                                        >
                                          <Mail className="h-3 w-3" />
                                          {company.emailsSent}
                                          {expandedCompany === company.id ? (
                                            <ChevronDown className="h-3 w-3" />
                                          ) : (
                                            <ChevronRight className="h-3 w-3" />
                                          )}
                                        </Button>
                                      </CollapsibleTrigger>
                                    </TooltipTrigger>
                                    {company.emailsSent >= 3 && (
                                      <TooltipContent>Risco de saturação - considere parar de contactar</TooltipContent>
                                    )}
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <Badge variant="outline" className="text-muted-foreground">
                                  0 emails
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {/* Histórico expandido */}
                          <CollapsibleContent>
                            <div className="px-3 pb-3 pt-0">
                              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  Histórico de emails
                                </p>
                                <div className="space-y-1.5">
                                  {company.emailHistory.map(email => (
                                    <div key={email.id} className="flex items-center gap-2 text-xs">
                                      {email.templateUsed === "Personalizado" ? (
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Badge variant="outline" className="text-xs py-0 cursor-help">
                                              {email.templateUsed}
                                            </Badge>
                                          </TooltipTrigger>
                                          <TooltipContent side="top" className="max-w-[300px]">
                                            <p className="text-xs">{email.subject}</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      ) : (
                                        <Badge variant="outline" className="text-xs py-0">
                                          {email.templateUsed}
                                        </Badge>
                                      )}
                                      <span className="text-muted-foreground">{formatEmailDate(email.sentAt)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      Nenhuma empresa encontrada.
                    </div>
                  )
                ) : (
                  // Lista de empresas no arquivo (com pegada)
                  filteredArchive.length > 0 ? (
                    filteredArchive.map(company => (
                      <div
                        key={company.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/5 cursor-pointer transition-colors ${
                          selectedCompanies.includes(company.id) ? 'bg-primary/5 border-primary/30' : ''
                        }`}
                        onClick={() => handleSelectCompany(company.id)}
                      >
                        <Checkbox
                          checked={selectedCompanies.includes(company.id)}
                          onClick={(e) => e.stopPropagation()}
                          onCheckedChange={() => handleSelectCompany(company.id)}
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{company.name}</p>
                            <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-success border-success/30 bg-success/10">
                            <Calculator className="h-3 w-3 mr-1" />
                            Pegada calculada
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {company.dataSource === 'get2zero' ? 'Simple' : 'Formulário'}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      Nenhuma empresa no arquivo.
                    </div>
                  )
                )}
              </div>
            </ScrollArea>
            
            {/* Footer */}
            <div className="p-3 border-t bg-muted/30">
              <p className="text-sm text-center text-muted-foreground">
                {selectedCompanies.length} seleccionada{selectedCompanies.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          
          {/* Right Column: Email Compose - altura fixa com scroll próprio */}
          <div className="flex flex-col border rounded-lg overflow-hidden bg-card h-[700px]">
            {/* Super Wizard - Envio Inteligente */}
            {selectedCompanies.length > 0 && (
              <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Envio Inteligente</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedCompanies.length} empresa{selectedCompanies.length !== 1 ? 's' : ''} · Templates optimizados por status
                      </p>
                    </div>
                  </div>
                  <Button onClick={handleSmartSendPreview} size="sm" className="gap-1.5">
                    <Zap className="h-4 w-4" />
                    Preparar Envio
                  </Button>
                </div>
              </div>
            )}
            <Tabs defaultValue="compose" className="flex flex-col flex-1 min-h-0">
              <TabsList className="m-4 mb-0 grid grid-cols-2 shrink-0">
                <TabsTrigger value="compose">Compor</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="compose" className="flex-1 overflow-auto p-4 pt-2">
                <div className="space-y-4">
                  <div>
                    <Label>Template</Label>
                    <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {emailTemplates.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {suggestedTemplate && selectedTemplate !== suggestedTemplate && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2 p-2 bg-warning/10 rounded-md border border-warning/20">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Lightbulb className="h-4 w-4 text-warning shrink-0" />
                            </TooltipTrigger>
                            <TooltipContent>
                              Baseado no status de onboarding desta empresa, recomendamos este template para maior eficácia
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <span className="flex-1">Sugestão: usar template "<strong>{suggestedTemplateName}</strong>"</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleTemplateChange(suggestedTemplate)}
                        >
                          Aplicar
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label>Assunto</Label>
                    <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
                  </div>
                  
                  <div>
                    <Label>Mensagem</Label>
                    <Textarea 
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[280px] resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use {"{companyName}"} para personalizar
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="flex-1 overflow-auto p-4 pt-2">
                {firstSelectedCompany ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Para</p>
                      <p className="font-medium">{firstSelectedCompany.contact.email}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Assunto</p>
                      <p className="font-medium">{previewSubject}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Mensagem</p>
                      <p className="whitespace-pre-wrap text-sm">{previewMessage}</p>
                    </div>
                    {selectedCompanies.length > 1 && (
                      <p className="text-sm text-muted-foreground text-center">
                        + {selectedCompanies.length - 1} emails semelhantes
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Seleccione empresas para ver o preview</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            {/* Send button - sempre visível no fundo */}
            <div className="p-4 border-t shrink-0">
              <Button 
                className="w-full" 
                disabled={selectedCompanies.length === 0 || isLoading}
                onClick={handleSend}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> A enviar...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Enviar ({selectedCompanies.length})
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Smart Send Dialog */}
        <Dialog open={showSmartSendDialog} onOpenChange={setShowSmartSendDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Confirmar Envio Inteligente
              </DialogTitle>
              <DialogDescription>
                Os emails serão enviados com o template mais adequado ao status de cada empresa.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 py-4">
              {getSmartSendSummary.map(group => (
                <div key={group.template} className="p-3 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm">{group.templateName}</p>
                    <Badge variant="secondary">{group.companies.length}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {group.companies.slice(0, 3).join(', ')}
                    {group.companies.length > 3 && ` +${group.companies.length - 3} mais`}
                  </p>
                </div>
              ))}
            </div>
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setShowSmartSendDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSmartSend} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Enviar {selectedCompanies.length} emails
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Incentive;
