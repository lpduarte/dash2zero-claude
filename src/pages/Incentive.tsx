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
  Star
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { getClustersByOwnerType } from "@/data/clusters";
import { 
  getSuppliersWithoutFootprintByOwnerType,
  getSuppliersWithFootprintByOwnerType,
} from "@/data/suppliers";
import { emailTemplates, getCompanyEmailTracking, EmailRecord } from "@/data/emailTracking";
import { getSectorName } from "@/data/sectors";
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
    color: 'bg-muted text-muted-foreground', 
    tooltip: 'Ainda não recebeu nenhum email' 
  },
  sem_interacao: { 
    label: 'Sem interação', 
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', 
    tooltip: 'Recebeu email mas não clicou no link' 
  },
  interessada: { 
    label: 'Interessada', 
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', 
    tooltip: 'Clicou no link do email' 
  },
  interessada_simple: { 
    label: 'Interessada / Simple', 
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', 
    tooltip: 'Escolheu o caminho Simple na landing page' 
  },
  interessada_formulario: { 
    label: 'Interessada / Formulário', 
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', 
    tooltip: 'Escolheu o caminho Formulário na landing page' 
  },
  registada_simple: { 
    label: 'Registada', 
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', 
    tooltip: 'Criou conta no Simple' 
  },
  em_progresso_simple: { 
    label: 'Em progresso / Simple', 
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', 
    tooltip: 'Iniciou o cálculo da pegada no Simple' 
  },
  em_progresso_formulario: { 
    label: 'Em progresso / Formulário', 
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', 
    tooltip: 'Iniciou o preenchimento do formulário' 
  },
  completo: { 
    label: 'Completo', 
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', 
    tooltip: 'Pegada calculada com sucesso' 
  },
};

const Incentive = () => {
  const { isMunicipio } = useUser();
  const { toast } = useToast();
  
  // State
  const [activeTab, setActiveTab] = useState<"pending" | "archive">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCluster, setSelectedCluster] = useState("all");
  const [advancedFilters, setAdvancedFilters] = useState<IncentiveFilters>({
    emailCount: "all",
    sectors: [],
    companySize: [],
    regions: [],
  });
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(emailTemplates[0].id);
  const [subject, setSubject] = useState(emailTemplates[0].subject);
  const [message, setMessage] = useState(emailTemplates[0].body);
  const [isLoading, setIsLoading] = useState(false);
  
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
        c.name.toLowerCase().includes(query) ||
        c.contact.email.toLowerCase().includes(query) ||
        c.contact.nif.toLowerCase().includes(query) ||
        getSectorName(c.sector).toLowerCase().includes(query)
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
    
    // Advanced filters - sectors
    if (advancedFilters.sectors.length > 0) {
      filtered = filtered.filter(c => advancedFilters.sectors.includes(c.sector));
    }
    
    // Advanced filters - company size
    if (advancedFilters.companySize.length > 0) {
      filtered = filtered.filter(c => advancedFilters.companySize.includes(c.companySize || ""));
    }
    
    // Advanced filters - regions
    if (advancedFilters.regions.length > 0) {
      filtered = filtered.filter(c => advancedFilters.regions.includes(c.region || ""));
    }
    
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [companiesWithoutFootprint, searchQuery, selectedCluster, advancedFilters]);
  
  // Filtered archive (com pegada)
  const filteredArchive = useMemo(() => {
    let filtered = [...companiesWithFootprint];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.contact.email.toLowerCase().includes(query) ||
        c.contact.nif.toLowerCase().includes(query) ||
        getSectorName(c.sector).toLowerCase().includes(query)
      );
    }
    
    if (selectedCluster !== "all") {
      filtered = filtered.filter(c => c.clusterId === selectedCluster);
    }
    
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [companiesWithFootprint, searchQuery, selectedCluster]);
  
  // Metrics
  const metrics = useMemo(() => {
    const companiesContacted = companiesWithoutFootprint.filter(c => c.emailsSent > 0);
    const totalConverted = companiesWithFootprint.length;
    const conversionRate = companiesContacted.length > 0 
      ? Math.round((totalConverted / (totalConverted + companiesContacted.length)) * 100) 
      : 0;
    
    return {
      conversionRate,
      totalEmailsSent: companiesWithoutFootprint.reduce((sum, c) => sum + c.emailsSent, 0),
      emailsThisMonth: 23, // mock
      neverContacted: companiesWithoutFootprint.filter(c => c.emailsSent === 0).length,
      avgDaysToConversion: 12, // mock
      bestTemplate: "Convite Inicial",
      bestTemplateRate: 34, // mock
      saturatedCount: companiesWithoutFootprint.filter(c => c.emailsSent >= 3).length,
      archivedCount: companiesWithFootprint.length,
    };
  }, [companiesWithoutFootprint, companiesWithFootprint]);
  
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
        
        {/* Metrics Cards */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <SectionHeader
              icon={Target}
              title="Métricas de Campanha"
            />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <KPICard
                title="Taxa de Conversão"
                value={`${metrics.conversionRate}%`}
                unit="contactadas → calcularam"
                icon={TrendingUp}
                iconColor="text-success"
                iconBgColor="bg-success/10"
                valueColor="text-success"
              />
              <KPICard
                title="Emails Enviados"
                value={metrics.totalEmailsSent}
                unit={`${metrics.emailsThisMonth} este mês`}
                icon={Send}
                iconColor="text-primary"
                iconBgColor="bg-primary/10"
              />
              <KPICard
                title="Tempo até Conversão"
                value={metrics.avgDaysToConversion}
                unit="dias em média"
                icon={Clock}
                iconColor="text-muted-foreground"
                iconBgColor="bg-muted"
              />
              <KPICard
                title="Melhor Template"
                value={metrics.bestTemplate}
                unit={`${metrics.bestTemplateRate}% conversão`}
                icon={Star}
                iconColor="text-warning"
                iconBgColor="bg-warning/10"
              />
              <KPICard
                title="Saturadas (3+)"
                value={metrics.saturatedCount}
                unit="parar de insistir"
                icon={AlertTriangle}
                iconColor="text-warning"
                iconBgColor="bg-warning/10"
                valueColor="text-warning"
              />
            </div>
          </CardContent>
        </Card>
        
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
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar empresa ou email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button variant="outline" onClick={handleSelectAll} size="sm">
                  {allSelected ? "Desmarcar" : "Selec. todas"}
                </Button>
              </div>
              
              <div className="flex items-center gap-4 flex-wrap">
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
                
                {activeTab === "pending" && (
                  <>
                    <div className="h-5 w-px bg-border" />
                    <IncentiveFiltersDialog
                      filters={advancedFilters}
                      onFiltersChange={setAdvancedFilters}
                      companies={companiesWithoutFootprint}
                    />
                  </>
                )}
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
                              <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
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
                                <Badge variant="outline" className="text-xs py-0 shrink-0 truncate max-w-[200px]">{company.contact.email}</Badge>
                                <Badge variant="outline" className="text-xs py-0 shrink-0">{company.contact.nif}</Badge>
                                <Badge variant="outline" className="text-xs py-0 shrink-0">{getSectorName(company.sector)}</Badge>
                              </div>
                            </div>
                            
                            {/* Histórico expandível com ícone de aviso */}
                            <div className="flex items-center gap-2">
                              {company.emailsSent >= 3 && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center justify-center h-8 w-8 rounded-md bg-warning/20">
                                        <AlertTriangle className="h-4 w-4 text-warning" />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>Risco de saturação</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                              {company.emailHistory.length > 0 ? (
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
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs py-0 shrink-0 truncate max-w-[200px]">{company.contact.email}</Badge>
                            <Badge variant="outline" className="text-xs py-0 shrink-0">{company.contact.nif}</Badge>
                            <Badge variant="outline" className="text-xs py-0 shrink-0">{getSectorName(company.sector)}</Badge>
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
      </main>
    </div>
  );
};

export default Incentive;
