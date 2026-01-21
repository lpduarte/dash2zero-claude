import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Search,
  Send,
  AlertTriangle,
  Loader2,
  Mail,
  Target,
  TrendingUp,
  Info,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Archive,
  CheckCircle2,
  Clock,
  Star,
  Lightbulb,
  Zap,
  Settings2,
  Plus,
  Pencil,
  Trash2,
  MailOpen,
  MousePointerClick,
  Circle,
  MailX,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { getClustersByOwnerType } from "@/data/clusters";
import {
  getSuppliersWithoutFootprintByOwnerType,
} from "@/data/suppliers";
import { ClusterSelector } from "@/components/dashboard/ClusterSelector";
import { UniversalFilterState, Supplier } from "@/types/supplier";
import { emailTemplates as defaultEmailTemplates, getCompanyEmailTracking, getDeliveryMetrics, EmailRecord, EmailTemplate } from "@/data/emailTracking";
import { SupplierWithoutFootprint } from "@/types/supplierNew";
import { useToast } from "@/hooks/use-toast";
import { format, formatDistanceToNow } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { pt } from "date-fns/locale";
import { IncentiveFiltersDialog, IncentiveFilters } from "@/components/dashboard/IncentiveFiltersDialog";

interface CompanyWithTracking extends SupplierWithoutFootprint {
  emailsSent: number;
  lastContactDate?: string;
  emailHistory: EmailRecord[];
  completedVia?: 'simple' | 'formulario';
  // Deliverability
  hasDeliveryIssues: boolean;
  lastDeliveryIssue?: {
    type: 'bounced' | 'spam';
    reason?: string;
    date: string;
  };
}

const onboardingStatusConfig: Record<string, { label: string; color: string; borderColor: string; tooltip: string }> = {
  por_contactar: {
    label: 'Por contactar',
    color: 'bg-status-pending/15 text-status-pending border border-status-pending/30 hover:bg-status-pending/25 transition-colors',
    borderColor: 'border-status-pending',
    tooltip: 'Ainda não recebeu nenhum email'
  },
  sem_interacao: {
    label: 'Sem interação',
    color: 'bg-status-contacted/15 text-status-contacted border border-status-contacted/30 hover:bg-status-contacted/25 transition-colors',
    borderColor: 'border-status-contacted',
    tooltip: 'Recebeu email mas não clicou no link'
  },
  interessada: {
    label: 'Interessada',
    color: 'bg-status-interested/15 text-status-interested border border-status-interested/30 hover:bg-status-interested/25 transition-colors',
    borderColor: 'border-status-interested',
    tooltip: 'Clicou no link do email'
  },
  interessada_simple: {
    label: 'Interessada / Simple',
    color: 'bg-status-interested/15 text-status-interested border border-status-interested/30 hover:bg-status-interested/25 transition-colors',
    borderColor: 'border-status-interested',
    tooltip: 'Escolheu o caminho Simple na landing page'
  },
  interessada_formulario: {
    label: 'Interessada / Formulário',
    color: 'bg-status-interested/15 text-status-interested border border-status-interested/30 hover:bg-status-interested/25 transition-colors',
    borderColor: 'border-status-interested',
    tooltip: 'Escolheu o caminho Formulário na landing page'
  },
  registada_simple: {
    label: 'Registada / Simple',
    color: 'bg-status-registered/15 text-status-registered border border-status-registered/30 hover:bg-status-registered/25 transition-colors',
    borderColor: 'border-status-registered',
    tooltip: 'Criou conta no Simple'
  },
  em_progresso_simple: {
    label: 'Em progresso / Simple',
    color: 'bg-status-progress/15 text-status-progress border border-status-progress/30 hover:bg-status-progress/25 transition-colors',
    borderColor: 'border-status-progress',
    tooltip: 'Iniciou o cálculo da pegada no Simple'
  },
  em_progresso_formulario: {
    label: 'Em progresso / Formulário',
    color: 'bg-status-progress/15 text-status-progress border border-status-progress/30 hover:bg-status-progress/25 transition-colors',
    borderColor: 'border-status-progress',
    tooltip: 'Iniciou o preenchimento do formulário'
  },
  completo: {
    label: 'Completo',
    color: 'bg-status-complete/15 text-status-complete border border-status-complete/30 hover:bg-status-complete/25 transition-colors',
    borderColor: 'border-status-complete',
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
  const [searchParams] = useSearchParams();

  // Read URL params for deep linking from Clusters page
  const initialCluster = searchParams.get('cluster') || 'all';
  const initialCompany = searchParams.get('company');

  // State
  const [activeTab, setActiveTab] = useState<"pending" | "archive">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCluster, setSelectedCluster] = useState(initialCluster);
  const [universalFilters, setUniversalFilters] = useState<UniversalFilterState>({
    companySize: [],
    district: [],
    municipality: [],
    parish: [],
    sector: [],
  });
  const [advancedFilters, setAdvancedFilters] = useState<IncentiveFilters>({
    onboardingStatus: [],
    emailCount: "all",
    deliveryIssues: [],
  });
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  
  // Templates state
  const [templates, setTemplates] = useState<EmailTemplate[]>(defaultEmailTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState(defaultEmailTemplates[0].id);
  const [subject, setSubject] = useState(defaultEmailTemplates[0].subject);
  const [message, setMessage] = useState(defaultEmailTemplates[0].body);

  // Template editing state
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [templateForm, setTemplateForm] = useState({ name: '', description: '', subject: '', body: '' });

  const [isLoading, setIsLoading] = useState(false);
  const [isMetricsExpanded, setIsMetricsExpanded] = useState(true);
  const [sortBy, setSortBy] = useState<'status' | 'status-desc' | 'emails' | 'emails-desc'>('status');
  const [showSmartSendDialog, setShowSmartSendDialog] = useState(false);
  const [showKPIsModal, setShowKPIsModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  
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

  // Handle URL params from Clusters page
  useEffect(() => {
    if (initialCompany) {
      setSelectedCompanies([initialCompany]);
    }
  }, [initialCompany]);

  // Show toast when navigating from Clusters with context
  useEffect(() => {
    if (initialCluster && initialCluster !== 'all') {
      toast({
        title: "Cluster selecionado",
        description: "Lista filtrada pelo cluster escolhido.",
      });
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Data
  const clusters = useMemo(() => {
    const ownerType = isMunicipio ? 'municipio' : 'empresa';
    return getClustersByOwnerType(ownerType);
  }, [isMunicipio]);

  // Empresas SEM pegada (para contactar)
  const companiesWithoutFootprint = useMemo((): CompanyWithTracking[] => {
    const ownerType = isMunicipio ? 'municipio' : 'empresa';
    const suppliers = getSuppliersWithoutFootprintByOwnerType(ownerType);

    return suppliers.map(s => {
      const tracking = getCompanyEmailTracking(s.id);
      // Derivar caminho de conclusão baseado no ID (simulação - em produção viria do backend)
      const completedVia: 'simple' | 'formulario' = s.id.includes('001') || s.id.includes('003') || s.id.includes('005')
        ? 'simple'
        : 'formulario';
      return {
        ...s,
        emailsSent: tracking.emailsSent,
        lastContactDate: tracking.emailHistory[0]?.sentAt,
        emailHistory: tracking.emailHistory,
        completedVia,
        // Deliverability
        hasDeliveryIssues: tracking.hasDeliveryIssues,
        lastDeliveryIssue: tracking.lastDeliveryIssue,
      };
    });
  }, [isMunicipio]);

  // Cluster counts para o ClusterSelector
  const clusterCounts = useMemo(() => {
    const counts: Record<string, number> = { all: companiesWithoutFootprint.length };
    clusters.forEach(cluster => {
      counts[cluster.id] = companiesWithoutFootprint.filter(c => c.clusterId === cluster.id).length;
    });
    return counts;
  }, [companiesWithoutFootprint, clusters]);

  // Empresas filtradas por cluster e filtros universais (para KPIs)
  const globalFilteredCompanies = useMemo(() => {
    let filtered = companiesWithoutFootprint;

    // Filtro de cluster
    if (selectedCluster !== 'all') {
      filtered = filtered.filter(c => c.clusterId === selectedCluster);
    }

    // Filtros universais
    if (universalFilters.companySize.length > 0) {
      filtered = filtered.filter(c => universalFilters.companySize.includes(c.companySize || ''));
    }
    if (universalFilters.sector.length > 0) {
      filtered = filtered.filter(c => universalFilters.sector.includes(c.sector));
    }
    if (universalFilters.district.length > 0) {
      filtered = filtered.filter(c => universalFilters.district.includes(c.district || ''));
    }
    if (universalFilters.municipality.length > 0) {
      filtered = filtered.filter(c => universalFilters.municipality.includes(c.municipality || ''));
    }
    if (universalFilters.parish.length > 0) {
      filtered = filtered.filter(c => universalFilters.parish.includes(c.parish || ''));
    }

    return filtered;
  }, [companiesWithoutFootprint, selectedCluster, universalFilters]);

  // Empresas que completaram o onboarding (para o arquivo)
  const companiesCompleted = useMemo(() => {
    return globalFilteredCompanies.filter(c => c.onboardingStatus === 'completo');
  }, [globalFilteredCompanies]);

  // Empresas pendentes (sem pegada e não completas)
  const companiesPending = useMemo(() => {
    return globalFilteredCompanies.filter(c => c.onboardingStatus !== 'completo');
  }, [globalFilteredCompanies]);
  
  // Filtered companies (já tem cluster e universal filters aplicados via companiesPending)
  const filteredCompanies = useMemo(() => {
    let filtered = [...companiesPending];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query)
      );
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

    // Advanced filters - delivery issues
    if (advancedFilters.deliveryIssues.length > 0) {
      filtered = filtered.filter(c => {
        if (advancedFilters.deliveryIssues.includes('bounced') && c.hasDeliveryIssues && c.lastDeliveryIssue?.type === 'bounced') {
          return true;
        }
        if (advancedFilters.deliveryIssues.includes('spam') && c.hasDeliveryIssues && c.lastDeliveryIssue?.type === 'spam') {
          return true;
        }
        if (advancedFilters.deliveryIssues.includes('none') && !c.hasDeliveryIssues) {
          return true;
        }
        return false;
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'status':
        filtered.sort((a, b) => (statusOrder[a.onboardingStatus] || 99) - (statusOrder[b.onboardingStatus] || 99));
        break;
      case 'status-desc':
        filtered.sort((a, b) => (statusOrder[b.onboardingStatus] || 99) - (statusOrder[a.onboardingStatus] || 99));
        break;
      case 'emails':
        filtered.sort((a, b) => b.emailsSent - a.emailsSent);
        break;
      case 'emails-desc':
        filtered.sort((a, b) => a.emailsSent - b.emailsSent);
        break;
    }

    return filtered;
  }, [companiesPending, searchQuery, advancedFilters, sortBy, statusOrder]);

  // Filtered archive (já tem cluster e universal filters aplicados via companiesCompleted)
  const filteredArchive = useMemo(() => {
    let filtered = [...companiesCompleted];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [companiesCompleted, searchQuery]);
  
  // Funnel metrics based on onboardingStatus (filtrados por cluster e filtros universais)
  const funnelMetrics = useMemo(() => {
    const allCompanies = globalFilteredCompanies;
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

    // Contagem de completos por caminho (baseado em completedVia)
    const completedCompanies = allCompanies.filter(c => c.onboardingStatus === 'completo');
    const completoSimple = completedCompanies.filter(c => c.completedVia === 'simple').length;
    const completoFormulario = completedCompanies.filter(c => c.completedVia === 'formulario').length;
    const completo = completoSimple + completoFormulario;

    // Dados para o funil com ramificação
    const simpleRegistered = statusCounts['registada_simple'] || 0;
    const simpleProgress = statusCounts['em_progresso_simple'] || 0;
    const formularioProgress = statusCounts['em_progresso_formulario'] || 0;
    
    const conversionRate = total > 0 ? Math.round((completo / total) * 100) : 0;
    
    // Percentages for funnel visualization
    const porContactarPerc = total > 0 ? Math.round((porContactar / total) * 100) : 0;
    const semInteracaoPerc = total > 0 ? Math.round((semInteracao / total) * 100) : 0;
    const interessadaPerc = total > 0 ? Math.round((interessada / total) * 100) : 0;
    const registadaPerc = total > 0 ? Math.round((registada / total) * 100) : 0;
    const emProgressoPerc = total > 0 ? Math.round((emProgresso / total) * 100) : 0;
    const completoPerc = total > 0 ? Math.round((completo / total) * 100) : 0;
    
    // Mock data for time to value and best template
    const avgDaysToConversion = 12;
    const bestTemplate = "Convite Inicial";
    const bestTemplateRate = 42;

    // Template success stats (mock data)
    const templateStats = [
      { name: "Convite Inicial", conversions: 42, color: "hsl(var(--primary))" },
      { name: "Lembrete", conversions: 31, color: "hsl(var(--warning))" },
      { name: "Benefícios", conversions: 27, color: "hsl(var(--primary-dark))" },
    ];

    // Funnel stage distribution (excluding "por contactar" - not in active funnel)
    const funnelStats = [
      { name: "Sem interação", value: semInteracao, color: "hsl(var(--status-contacted))" },
      { name: "Interessada", value: interessada, color: "hsl(var(--status-interested))" },
      { name: "Registada", value: registada, color: "hsl(var(--status-registered))" },
      { name: "Em progresso", value: emProgresso, color: "hsl(var(--status-progress))" },
      { name: "Completo", value: completo, color: "hsl(var(--status-complete))" },
    ].filter(s => s.value > 0);

    // Calculate bottleneck (stage with most companies stuck - excluding completo)
    const bottleneckStages = [
      { name: "Sem interação", value: semInteracao, color: "hsl(var(--status-contacted))", tooltip: "Recebeu email mas não clicou no link" },
      { name: "Interessada", value: interessada, color: "hsl(var(--status-interested))", tooltip: "Clicou no link do email" },
      { name: "Registada", value: registada, color: "hsl(var(--status-registered))", tooltip: "Criou conta no Simple" },
      { name: "Em progresso", value: emProgresso, color: "hsl(var(--status-progress))", tooltip: "Iniciou o cálculo da pegada" },
    ];
    const bottleneckStage = bottleneckStages.reduce((max, stage) =>
      stage.value > max.value ? stage : max, bottleneckStages[0]);
    const bottleneck = bottleneckStage.name;
    const bottleneckColor = bottleneckStage.color;
    const bottleneckTooltip = bottleneckStage.tooltip;

    // Email performance metrics (mock data)
    // Nota: Neste modelo simplificado, assumimos que quem progrediu no funil abriu/clicou no email
    const emailsSent = total - porContactar; // Empresas que receberam pelo menos 1 email
    const emailsOpened = semInteracao + interessada + registada + emProgresso + completo; // Quem abriu = quem passou de "por contactar"
    const emailsClicked = interessada + registada + emProgresso + completo; // Quem clicou = quem ficou interessado+

    const openRate = emailsSent > 0 ? Math.round((emailsOpened / emailsSent) * 100) : 0;
    const clickToOpenRate = emailsOpened > 0 ? Math.round((emailsClicked / emailsOpened) * 100) : 0;

    // Deliverability metrics (bounces e spam)
    const deliveryMetrics = getDeliveryMetrics(allCompanies.map(c => c.id));
    const companiesWithBounce = allCompanies.filter(c => c.hasDeliveryIssues && c.lastDeliveryIssue?.type === 'bounced').length;
    const companiesWithSpam = allCompanies.filter(c => c.hasDeliveryIssues && c.lastDeliveryIssue?.type === 'spam').length;
    
    const chartData = [
      {
        name: "Funil",
        porContactar,
        semInteracao,
        interessada,
        registada,
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
      registada,
      registadaPerc,
      emProgresso,
      emProgressoPerc,
      avgDaysToConversion,
      bottleneck,
      bottleneckColor,
      bottleneckTooltip,
      bestTemplate,
      bestTemplateRate,
      total,
      completo,
      completoPerc,
      chartData,
      // Dados para funil com ramificação
      simple: {
        registered: simpleRegistered,
        progress: simpleProgress,
        complete: completoSimple,
      },
      formulario: {
        progress: formularioProgress,
        complete: completoFormulario,
      },
      // Email performance metrics
      emailsSent,
      openRate,
      clickToOpenRate,
      // Template stats
      templateStats,
      // Funnel stats
      funnelStats,
      // Flag: sem atividade (só empresas por contactar)
      hasNoActivity: emailsSent === 0,
      // Deliverability metrics
      bounceRate: deliveryMetrics.bounceRate,
      spamRate: deliveryMetrics.spamRate,
      bounced: deliveryMetrics.bounced,
      spam: deliveryMetrics.spam,
      companiesWithBounce,
      companiesWithSpam,
    };
  }, [globalFilteredCompanies]);

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
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setSubject(template.subject);
      setMessage(template.body);
    }
  };

  // Template management handlers
  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setTemplateForm({
      name: template.name,
      description: template.description,
      subject: template.subject,
      body: template.body,
    });
    setIsCreatingTemplate(false);
  };

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setTemplateForm({ name: '', description: '', subject: '', body: '' });
    setIsCreatingTemplate(true);
  };

  const handleSaveTemplate = () => {
    if (!templateForm.name || !templateForm.subject || !templateForm.body) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (isCreatingTemplate) {
      // Create new template
      const newTemplate: EmailTemplate = {
        id: `t${Date.now()}`,
        name: templateForm.name,
        description: templateForm.description,
        subject: templateForm.subject,
        body: templateForm.body,
      };
      setTemplates(prev => [...prev, newTemplate]);
      toast({
        title: "Template criado",
        description: `O template "${newTemplate.name}" foi criado com sucesso.`,
      });
    } else if (editingTemplate) {
      // Update existing template
      setTemplates(prev => prev.map(t =>
        t.id === editingTemplate.id
          ? { ...t, ...templateForm }
          : t
      ));
      // Update composer if this template is selected
      if (selectedTemplate === editingTemplate.id) {
        setSubject(templateForm.subject);
        setMessage(templateForm.body);
      }
      toast({
        title: "Template atualizado",
        description: `O template "${templateForm.name}" foi atualizado com sucesso.`,
      });
    }

    // Reset form state
    setEditingTemplate(null);
    setIsCreatingTemplate(false);
    setTemplateForm({ name: '', description: '', subject: '', body: '' });
  };

  const handleDeleteTemplate = (template: EmailTemplate) => {
    if (templates.length <= 1) {
      toast({
        title: "Não é possível apagar",
        description: "Deve existir pelo menos um template.",
        variant: "destructive",
      });
      return;
    }

    setTemplates(prev => prev.filter(t => t.id !== template.id));

    // If deleted template was selected, select another one
    if (selectedTemplate === template.id) {
      const remaining = templates.filter(t => t.id !== template.id);
      if (remaining.length > 0) {
        handleTemplateChange(remaining[0].id);
      }
    }

    toast({
      title: "Template removido",
      description: `O template "${template.name}" foi removido.`,
    });
  };

  const handleCancelTemplateEdit = () => {
    setEditingTemplate(null);
    setIsCreatingTemplate(false);
    setTemplateForm({ name: '', description: '', subject: '', body: '' });
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
  
    const formatEmailDate = (dateString: string) => {
    return format(new Date(dateString), "d MMM yyyy, HH:mm", { locale: pt });
  };
  
  const getEmailCountColor = (count: number) => {
    if (count === 0) return "bg-muted text-muted-foreground border border-muted-foreground/30";
    if (count === 1) return "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors";
    if (count === 2) return "bg-warning/20 text-warning border border-warning/30 hover:bg-warning/30 transition-colors";
    return "bg-danger/20 text-danger border border-danger/30 hover:bg-danger/30 transition-colors";
  };
  
  // Preview
  const firstSelectedCompany = useMemo(() => {
    if (selectedCompanies.length === 0) return null;
    // Procurar em ambas as listas
    return companiesWithoutFootprint.find(c => c.id === selectedCompanies[0]) ||
           companiesCompleted.find(c => c.id === selectedCompanies[0]) as any;
  }, [selectedCompanies, companiesWithoutFootprint, companiesCompleted]);
  
  // Suggested template based on first selected company's status
  const suggestedTemplate = useMemo(() => {
    if (!firstSelectedCompany) return null;
    const status = firstSelectedCompany.onboardingStatus;
    if (!status) return null;
    return templateSuggestions[status] || null;
  }, [firstSelectedCompany]);
  
  const suggestedTemplateName = useMemo(() => {
    if (!suggestedTemplate) return null;
    const template = templates.find(t => t.id === suggestedTemplate);
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
      const template = templates.find(t => t.id === suggestedId);
      
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
  
  
  const currentList = activeTab === "pending" ? filteredCompanies : filteredArchive;
  const allSelected = currentList.length > 0 && currentList.every(c => selectedCompanies.includes(c.id));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="relative z-10 max-w-[1400px] mx-auto px-8 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            Incentivo ao Cálculo de Pegada
          </h1>
          <p className="text-muted-foreground mt-1">
            Contacte empresas para calcular a sua pegada de carbono
          </p>
        </div>

        {/* Cluster Selector */}
        <ClusterSelector
          selectedCluster={selectedCluster}
          onClusterChange={setSelectedCluster}
          clusterCounts={clusterCounts}
          showPotential={false}
          suppliers={companiesWithoutFootprint as unknown as Supplier[]}
          universalFilters={universalFilters}
          onUniversalFiltersChange={setUniversalFilters}
        />

        {/* Funnel Metrics Card */}
        <Collapsible open={isMetricsExpanded} onOpenChange={setIsMetricsExpanded}>
          <Card className="shadow-md mb-6">
            <CardHeader className={cn("transition-all duration-[400ms]", isMetricsExpanded ? "pb-3" : "pb-6")}>
              <SectionHeader
                icon={TrendingUp}
                title="Progresso de onboarding"
                collapsible
                expanded={isMetricsExpanded}
                onToggle={() => setIsMetricsExpanded(!isMetricsExpanded)}
                actions={
                  !funnelMetrics.hasNoActivity && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => setShowKPIsModal(true)}
                    >
                      <Info className="h-3 w-3" />
                      O que significa cada KPI?
                    </Button>
                  )
                }
              />
            </CardHeader>
            <CollapsibleContent>
              <CardContent>
                {/* KPIs - só mostrar quando há atividade */}
                {!funnelMetrics.hasNoActivity && (
                  <>
                    {/* Linha 1 - Métricas de Performance (6 KPIs) */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                        title="Time to Value"
                        value={funnelMetrics.avgDaysToConversion}
                        unit="dias em média"
                        icon={Clock}
                        iconColor="text-primary"
                        iconBgColor="bg-primary/10"
                      />
                      <KPICard
                        title="Open Rate"
                        value={`${funnelMetrics.openRate}%`}
                        unit={`${funnelMetrics.emailsSent} emails enviados`}
                        icon={Mail}
                        iconColor={funnelMetrics.openRate >= 20 ? "text-success" : "text-warning"}
                        iconBgColor={funnelMetrics.openRate >= 20 ? "bg-success/10" : "bg-warning/10"}
                        valueColor={funnelMetrics.openRate >= 20 ? "text-success" : "text-warning"}
                      />
                      <KPICard
                        title="Click-to-Open"
                        value={`${funnelMetrics.clickToOpenRate}%`}
                        unit="qualidade do conteúdo"
                        icon={Zap}
                        iconColor={funnelMetrics.clickToOpenRate >= 30 ? "text-success" : "text-primary"}
                        iconBgColor={funnelMetrics.clickToOpenRate >= 30 ? "bg-success/10" : "bg-primary/10"}
                        valueColor={funnelMetrics.clickToOpenRate >= 30 ? "text-success" : "text-primary"}
                      />
                      <KPICard
                        title="Bounce Rate"
                        value={`${funnelMetrics.bounceRate}%`}
                        unit={`${funnelMetrics.bounced} não entregues`}
                        icon={MailX}
                        iconColor={funnelMetrics.bounceRate > 5 ? "text-danger" : funnelMetrics.bounceRate > 2 ? "text-warning" : "text-muted-foreground"}
                        iconBgColor={funnelMetrics.bounceRate > 5 ? "bg-danger/10" : funnelMetrics.bounceRate > 2 ? "bg-warning/10" : "bg-muted"}
                        valueColor={funnelMetrics.bounceRate > 5 ? "text-danger" : funnelMetrics.bounceRate > 2 ? "text-warning" : undefined}
                      />
                      <KPICard
                        title="Spam Rate"
                        value={`${funnelMetrics.spamRate}%`}
                        unit={`${funnelMetrics.spam} reportados`}
                        icon={ShieldAlert}
                        iconColor={funnelMetrics.spamRate > 1 ? "text-danger" : funnelMetrics.spamRate > 0.5 ? "text-warning" : "text-muted-foreground"}
                        iconBgColor={funnelMetrics.spamRate > 1 ? "bg-danger/10" : funnelMetrics.spamRate > 0.5 ? "bg-warning/10" : "bg-muted"}
                        valueColor={funnelMetrics.spamRate > 1 ? "text-danger" : funnelMetrics.spamRate > 0.5 ? "text-warning" : undefined}
                      />
                    </div>

                    {/* Linha 2 - Insights Accionáveis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {/* Card composto: Bottleneck + Pie Chart */}
                      <div className="border rounded-lg shadow-md flex overflow-hidden">
                        {/* Lado esquerdo: Info do bottleneck */}
                        <div className="flex-1 p-4 flex flex-col gap-3">
                          <p className="text-xs font-normal text-muted-foreground h-7 flex items-center">Bottleneck</p>
                          <div>
                            <p className="text-2xl font-bold" style={{ color: funnelMetrics.bottleneckColor }}>
                              {funnelMetrics.bottleneck}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {funnelMetrics.bottleneckTooltip}
                            </p>
                          </div>
                        </div>

                        {/* Separador vertical */}
                        <div className="w-px bg-border" />

                        {/* Lado direito: Mini Pie Chart */}
                        <div className="w-[110px] flex items-center justify-center">
                          <ResponsiveContainer width={94} height={94}>
                            <PieChart>
                              <Pie
                                data={funnelMetrics.funnelStats}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={24}
                                outerRadius={44}
                                stroke="hsl(var(--card))"
                                strokeWidth={1}
                              >
                                {funnelMetrics.funnelStats.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <RechartsTooltip
                                position={{ x: -120, y: 27 }}
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                      <div className="bg-popover border rounded-md shadow-md px-3 py-2 whitespace-nowrap">
                                        <p className="text-xs font-medium">{data.name}</p>
                                        <p className="text-xs text-muted-foreground">{data.value} empresas</p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Card composto: Melhor Template + Pie Chart */}
                      <div className="border rounded-lg shadow-md flex overflow-hidden">
                        {/* Lado esquerdo: Info do melhor template */}
                        <div className="flex-1 p-4 flex flex-col gap-3">
                          <p className="text-xs font-normal text-muted-foreground h-7 flex items-center">Melhor Template</p>
                          <div>
                            <p className="text-2xl font-bold">
                              {funnelMetrics.bestTemplate}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {funnelMetrics.bestTemplateRate}% conversão
                            </p>
                          </div>
                        </div>

                        {/* Separador vertical */}
                        <div className="w-px bg-border" />

                        {/* Lado direito: Mini Pie Chart */}
                        <div className="w-[110px] flex items-center justify-center">
                          <ResponsiveContainer width={94} height={94}>
                            <PieChart>
                              <Pie
                                data={funnelMetrics.templateStats}
                                dataKey="conversions"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={24}
                                outerRadius={44}
                                stroke="hsl(var(--card))"
                                strokeWidth={1}
                              >
                                {funnelMetrics.templateStats.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <RechartsTooltip
                                position={{ x: -120, y: 27 }}
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                      <div className="bg-popover border rounded-md shadow-md px-3 py-2 whitespace-nowrap">
                                        <p className="text-xs font-medium">{data.name}</p>
                                        <p className="text-xs text-muted-foreground">{data.conversions}% conversão</p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Funil com ramificação - largura total */}
                {(() => {
                  const preTotal = funnelMetrics.porContactar + funnelMetrics.semInteracao + funnelMetrics.interessada;
                  const simpleTotal = funnelMetrics.simple.registered + funnelMetrics.simple.progress + funnelMetrics.simple.complete;
                  const formularioTotal = funnelMetrics.formulario.progress + funnelMetrics.formulario.complete;
                  const postTotal = simpleTotal + formularioTotal;
                  const grandTotal = preTotal + postTotal;

                  const leftPercent = postTotal === 0 ? 100 : preTotal === 0 ? 0 : (preTotal / grandTotal) * 100;
                  const rightPercent = preTotal === 0 ? 100 : postTotal === 0 ? 0 : (postTotal / grandTotal) * 100;

                  const legendItems = [
                    { label: 'Por contactar', value: funnelMetrics.porContactar, color: 'bg-status-pending', borderColor: 'border-status-pending', tooltip: 'Ainda não recebeu nenhum email' },
                    { label: 'Sem interação', value: funnelMetrics.semInteracao, color: 'bg-status-contacted', borderColor: 'border-status-contacted', tooltip: 'Recebeu email mas não clicou no link' },
                    { label: 'Interessada', value: funnelMetrics.interessada, color: 'bg-status-interested', borderColor: 'border-status-interested', tooltip: 'Clicou no link do email' },
                    { label: 'Registada', value: funnelMetrics.simple.registered, color: 'bg-status-registered', borderColor: 'border-status-registered', tooltip: 'Criou conta no Simple' },
                    { label: 'Em progresso', value: funnelMetrics.simple.progress + funnelMetrics.formulario.progress, color: 'bg-status-progress', borderColor: 'border-status-progress', tooltip: 'Iniciou o cálculo da pegada' },
                    { label: 'Completo', value: funnelMetrics.simple.complete + funnelMetrics.formulario.complete, color: 'bg-status-complete', borderColor: 'border-status-complete', tooltip: 'Pegada calculada com sucesso' },
                  ];

                  return (
                    <div className="border rounded-lg p-4 bg-card shadow-md mt-4">
                      <p className="text-xs font-normal text-muted-foreground mb-4">Progresso de onboarding</p>
                      <div className="flex items-center gap-2">
                        {/* Fase pré-decisão */}
                        {preTotal > 0 && (() => {
                          const preSegments = [
                            { key: 'pending', value: funnelMetrics.porContactar, color: 'bg-status-pending', label: 'Por contactar' },
                            { key: 'contacted', value: funnelMetrics.semInteracao, color: 'bg-status-contacted', label: 'Sem interação' },
                            { key: 'interested', value: funnelMetrics.interessada, color: 'bg-status-interested', label: 'Interessada' },
                          ].filter(s => s.value > 0);

                          return (
                            <>
                              <div style={{ width: `${leftPercent}%` }}>
                                <div className="h-4 flex gap-px">
                                  {preSegments.map((segment, index) => (
                                    <div
                                      key={segment.key}
                                      className={cn(
                                        segment.color,
                                        "h-full",
                                        index === 0 && "rounded-l-md",
                                        index === preSegments.length - 1 && "rounded-r-md"
                                      )}
                                      style={{ width: `${(segment.value / preTotal) * 100}%` }}
                                      title={`${segment.label}: ${segment.value}`}
                                    />
                                  ))}
                                </div>
                              </div>

                              {/* Conector visual */}
                              {postTotal > 0 && (
                                <div className="flex flex-col items-center gap-1 text-muted-foreground/50 shrink-0">
                                  <div className="w-px h-4 bg-current" />
                                  <ChevronRight className="h-4 w-4" />
                                  <div className="w-px h-4 bg-current" />
                                </div>
                              )}
                            </>
                          );
                        })()}

                        {/* Fase pós-decisão */}
                        {postTotal > 0 && (
                          <div style={{ width: `${rightPercent}%` }} className="space-y-1">
                            {/* Ramo Simple */}
                            {(() => {
                              // Calcular largura proporcional para cada ramo
                              const maxBranchTotal = Math.max(simpleTotal, formularioTotal);
                              const simpleWidthPercent = maxBranchTotal > 0 ? (simpleTotal / maxBranchTotal) * 100 : 0;
                              const formularioWidthPercent = maxBranchTotal > 0 ? (formularioTotal / maxBranchTotal) * 100 : 0;

                              const simpleSegments = [
                                { key: 'registered', value: funnelMetrics.simple.registered, color: 'bg-status-registered', label: 'Registada' },
                                { key: 'progress', value: funnelMetrics.simple.progress, color: 'bg-status-progress', label: 'Em progresso' },
                                { key: 'complete', value: funnelMetrics.simple.complete, color: 'bg-status-complete', label: 'Completo' },
                              ].filter(s => s.value > 0);

                              const formularioSegments = [
                                { key: 'progress', value: funnelMetrics.formulario.progress, color: 'bg-status-progress', label: 'Em progresso' },
                                { key: 'complete', value: funnelMetrics.formulario.complete, color: 'bg-status-complete', label: 'Completo' },
                              ].filter(s => s.value > 0);

                              const hasBothBranches = simpleTotal > 0 && formularioTotal > 0;

                              return (
                                <>
                                  {/* Ramo Simple */}
                                  {simpleTotal > 0 && (
                                    <div className={cn("space-y-1", !hasBothBranches && "pb-[28px]")}>
                                      <p className="text-xs font-bold">Simple <span className="font-normal text-muted-foreground">({simpleTotal})</span></p>
                                      <div className="h-4 flex gap-px" style={{ width: hasBothBranches ? `${simpleWidthPercent}%` : '100%' }}>
                                        {simpleSegments.map((segment, index) => (
                                          <div
                                            key={segment.key}
                                            className={cn(
                                              segment.color,
                                              "h-full",
                                              index === 0 && "rounded-l-md",
                                              index === simpleSegments.length - 1 && "rounded-r-md"
                                            )}
                                            style={{ width: `${(segment.value / simpleTotal) * 100}%` }}
                                            title={`${segment.label}: ${segment.value}`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Ramo Formulário */}
                                  {formularioTotal > 0 && (
                                    <div className={cn("space-y-1", !hasBothBranches && "pt-[20px]")}>
                                      <div className="h-4 flex gap-px" style={{ width: hasBothBranches ? `${formularioWidthPercent}%` : '100%' }}>
                                        {formularioSegments.map((segment, index) => (
                                          <div
                                            key={segment.key}
                                            className={cn(
                                              segment.color,
                                              "h-full",
                                              index === 0 && "rounded-l-md",
                                              index === formularioSegments.length - 1 && "rounded-r-md"
                                            )}
                                            style={{ width: `${(segment.value / formularioTotal) * 100}%` }}
                                            title={`${segment.label}: ${segment.value}`}
                                          />
                                        ))}
                                      </div>
                                      <p className="text-xs font-bold">Formulário <span className="font-normal text-muted-foreground">({formularioTotal})</span></p>
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        )}
                      </div>

                      {/* Separador */}
                      <Separator className="my-4" />

                      {/* Legenda com contagens e tooltips */}
                      <div className="flex flex-wrap justify-center gap-4">
                        {legendItems.map((item) => (
                          <TooltipProvider key={item.label} delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1.5 text-xs cursor-help">
                                  <div className={cn("h-2.5 w-2.5 rounded-full", item.color)} />
                                  <span className="text-muted-foreground">{item.label}</span>
                                  <span className="font-normal">{item.value}</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className={cn("border", item.borderColor)}>
                                <p>{item.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
        
        {/* Main Grid: List + Compose */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,480px] gap-6">
          {/* Left Column: Company List */}
          <div className="flex flex-col border rounded-lg overflow-hidden bg-card shadow-md h-[700px]">
            {/* Tabs: Por Contactar / Arquivo */}
            <div className="border-b p-3">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "pending" | "archive")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pending" className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Com pegada por calcular ({companiesPending.length})
                  </TabsTrigger>
                  <TabsTrigger value="archive" className="flex items-center gap-2">
                    <Archive className="h-4 w-4" />
                    Arquivo ({companiesCompleted.length})
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
                    placeholder="Pesquisar empresa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <IncentiveFiltersDialog
                  filters={advancedFilters}
                  onFiltersChange={setAdvancedFilters}
                  companies={activeTab === "pending" ? companiesPending : companiesCompleted as any}
                />
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="status">Status (mais avançado)</SelectItem>
                    <SelectItem value="status-desc">Status (menos avançado)</SelectItem>
                    <SelectItem value="emails">Nº emails (mais)</SelectItem>
                    <SelectItem value="emails-desc">Nº emails (menos)</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleSelectAll} size="sm" className="shrink-0 border-muted-foreground/30 hover:border-muted-foreground/50 hover:bg-muted">
                  {allSelected ? "Desmarcar todas" : "Selecionar todas"}
                </Button>
              </div>
            </div>
            
            {/* Company List */}
            <ScrollArea className="flex-1 h-[500px]">
              <div className="p-2 space-y-1">
                {activeTab === "pending" ? (
                  // Lista de empresas sem pegada
                  filteredCompanies.length > 0 ? (
                    filteredCompanies.map(company => (
                      <div
                        key={company.id}
                        className={cn(
                          "rounded-lg border transition-colors",
                          company.hasDeliveryIssues && "border-danger/30",
                          company.emailsSent >= 3 && !company.hasDeliveryIssues && "border-danger/30",
                          selectedCompanies.includes(company.id) && "bg-primary/5 border-primary/30"
                        )}
                        style={
                          company.hasDeliveryIssues || company.emailsSent >= 3
                            ? { boxShadow: 'inset 0 0 12px hsl(var(--danger) / 0.15)' }
                            : undefined
                        }
                      >
                        <div className="flex items-center gap-3 p-3">
                          <Checkbox
                            checked={selectedCompanies.includes(company.id)}
                            onCheckedChange={() => handleSelectCompany(company.id)}
                          />

                          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleSelectCompany(company.id)}>
                            <div className="flex items-center gap-2">
                              <p className="font-normal truncate">{company.name}</p>
                              {/* Alerta de deliverability */}
                              {company.hasDeliveryIssues && company.lastDeliveryIssue && (
                                <TooltipProvider delayDuration={100}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="cursor-help shrink-0">
                                        {company.lastDeliveryIssue.type === 'bounced' ? (
                                          <MailX className="h-4 w-4 text-danger" />
                                        ) : (
                                          <ShieldAlert className="h-4 w-4 text-danger" />
                                        )}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="border border-danger max-w-[250px]">
                                      <p className="font-medium">
                                        {company.lastDeliveryIssue.type === 'bounced' ? 'Email não entregue' : 'Marcado como spam'}
                                      </p>
                                      {company.lastDeliveryIssue.reason && (
                                        <p className="text-xs text-muted-foreground mt-1">{company.lastDeliveryIssue.reason}</p>
                                      )}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          </div>

                          {/* Status + próxima acção + histórico */}
                          <div className="flex items-center gap-2">
                            {/* Badge de status */}
                            <TooltipProvider delayDuration={100}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help">
                                    <Badge className={`text-xs py-0 shrink-0 ${onboardingStatusConfig[company.onboardingStatus]?.color || 'bg-muted text-muted-foreground'}`}>
                                      {onboardingStatusConfig[company.onboardingStatus]?.label || company.onboardingStatus}
                                    </Badge>
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className={cn("border", onboardingStatusConfig[company.onboardingStatus]?.borderColor)}>
                                  {onboardingStatusConfig[company.onboardingStatus]?.tooltip || ''}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {/* Próxima acção sugerida */}
                            <span className="text-xs text-muted-foreground hidden lg:inline">
                              → {getNextAction(company.onboardingStatus)}
                            </span>

                            {/* Contador de emails com Popover */}
                            {company.emailHistory.length > 0 ? (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button
                                    className={cn(
                                      "inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-normal rounded-md",
                                      company.hasDeliveryIssues
                                        ? "bg-danger/20 text-danger border border-danger/30 hover:bg-danger/30 transition-colors"
                                        : getEmailCountColor(company.emailsSent)
                                    )}
                                  >
                                    {company.hasDeliveryIssues ? (
                                      company.lastDeliveryIssue?.type === 'bounced' ? (
                                        <MailX className="h-3.5 w-3.5" />
                                      ) : (
                                        <ShieldAlert className="h-3.5 w-3.5" />
                                      )
                                    ) : (
                                      <Mail className="h-3.5 w-3.5" />
                                    )}
                                    {company.emailsSent}
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent align="end" className="w-80 p-0">
                                  <div className="p-3 border-b bg-muted/30">
                                    <div className="flex items-center justify-between gap-2">
                                      <p className="font-medium text-sm">Histórico de Emails</p>
                                      <div className="flex items-center gap-1">
                                        {company.hasDeliveryIssues && company.lastDeliveryIssue && (
                                          <Badge variant="outline" className="text-xs border-danger/50 text-danger bg-danger/10">
                                            {company.lastDeliveryIssue.type === 'bounced' ? (
                                              <>
                                                <MailX className="h-3 w-3 mr-1" />
                                                Bounce
                                              </>
                                            ) : (
                                              <>
                                                <ShieldAlert className="h-3 w-3 mr-1" />
                                                Spam
                                              </>
                                            )}
                                          </Badge>
                                        )}
                                        {company.emailsSent >= 3 && !company.hasDeliveryIssues && (
                                          <Badge variant="outline" className="text-xs border-danger/50 text-danger bg-danger/10">
                                            <AlertTriangle className="h-3 w-3 mr-1" />
                                            Saturação
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {company.emailsSent} email{company.emailsSent !== 1 ? 's' : ''} enviado{company.emailsSent !== 1 ? 's' : ''}
                                    </p>
                                  </div>
                                  <div className="p-3 space-y-3 max-h-[250px] overflow-y-auto">
                                    {company.emailHistory.map((email, index) => {
                                      // Determinar ícone e cor baseado no status de entrega
                                      const getEmailIcon = () => {
                                        if (email.deliveryStatus === 'bounced') return { icon: MailX, color: 'bg-danger/20 text-danger' };
                                        if (email.deliveryStatus === 'spam') return { icon: ShieldAlert, color: 'bg-warning/20 text-warning' };
                                        if (email.deliveryStatus === 'clicked') return { icon: MousePointerClick, color: 'bg-success/20 text-success' };
                                        if (email.deliveryStatus === 'opened') return { icon: MailOpen, color: 'bg-primary/20 text-primary' };
                                        return { icon: Mail, color: 'bg-muted text-muted-foreground' };
                                      };
                                      const { icon: EmailIcon, color: iconColor } = getEmailIcon();

                                      return (
                                        <div key={email.id} className="flex gap-3">
                                          <div className="flex flex-col items-center">
                                            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", iconColor)}>
                                              <EmailIcon className="h-4 w-4" />
                                            </div>
                                            {index < company.emailHistory.length - 1 && (
                                              <div className="w-px h-full bg-border mt-1" />
                                            )}
                                          </div>
                                          <div className="flex-1 pb-3">
                                            <div className="flex items-center gap-2">
                                              <p className="font-medium text-sm">{email.templateUsed}</p>
                                              {email.deliveryStatus === 'bounced' && (
                                                <Badge variant="outline" className="text-[10px] px-1 py-0 border-danger/50 text-danger">
                                                  {email.bounceType === 'hard' ? 'Hard bounce' : 'Soft bounce'}
                                                </Badge>
                                              )}
                                              {email.deliveryStatus === 'spam' && (
                                                <Badge variant="outline" className="text-[10px] px-1 py-0 border-warning/50 text-warning">
                                                  Spam
                                                </Badge>
                                              )}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                              {email.subject}
                                            </p>
                                            {email.bounceReason && (
                                              <p className="text-xs text-danger mt-0.5">{email.bounceReason}</p>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-1">
                                              {formatDistanceToNow(new Date(email.sentAt), { addSuffix: true, locale: pt })}
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-normal bg-muted text-muted-foreground border border-muted-foreground/30 rounded-md">
                                <Mail className="h-3.5 w-3.5" />
                                0
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
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
                          <p className="font-normal truncate">{company.name}</p>
                          {company.lastContactDate && (
                            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-success" />
                              Concluído em {format(new Date(company.lastContactDate), "d MMM yyyy", { locale: pt })}
                            </p>
                          )}
                        </div>
                        
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help">
                                <Badge className={`text-xs py-0 shrink-0 ${onboardingStatusConfig['completo']?.color}`}>
                                  Completo / {company.completedVia === 'simple' ? 'Simple' : 'Formulário'}
                                </Badge>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className={cn("border", onboardingStatusConfig['completo']?.borderColor)}>
                              {onboardingStatusConfig['completo']?.tooltip}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                {selectedCompanies.length} selecionada{selectedCompanies.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          
          {/* Right Column: Envio Inteligente + Email Compose */}
          <div className="flex flex-col gap-4 h-[700px]">
            {/* Super Wizard - Envio Inteligente */}
            <div className="p-4 border rounded-lg shadow-md bg-gradient-to-r from-primary/5 to-primary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Envio Inteligente</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedCompanies.length > 0
                        ? `${selectedCompanies.length} empresa${selectedCompanies.length !== 1 ? 's' : ''} selecionada${selectedCompanies.length !== 1 ? 's' : ''}`
                        : 'Selecione uma ou mais empresas'
                      }
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleSmartSendPreview}
                  size="sm"
                  disabled={selectedCompanies.length === 0}
                >
                  Preparar Envio
                </Button>
              </div>
            </div>

            {/* Email Composer */}
            <div className="flex flex-col flex-1 border rounded-lg shadow-md overflow-hidden bg-card">
              <div className="p-4 flex-1 flex flex-col">
                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="space-y-2">
                    <Label>Template</Label>
                    <div className="flex gap-2">
                      <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map(template => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="shrink-0 border-muted-foreground/30 hover:border-muted-foreground/50 hover:bg-muted"
                              onClick={() => setShowTemplatesModal(true)}
                            >
                              <Settings2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Gerir templates</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
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
                  
                  <div className="space-y-2">
                    <Label>Assunto</Label>
                    <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
                  </div>
                  
                  <div className="flex-1 flex flex-col space-y-2">
                    <Label>Mensagem</Label>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1 min-h-[200px] resize-none"
                    />
                  </div>
                </div>
              </div>

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
        </div>
        
        {/* Smart Send Dialog */}
        <Dialog open={showSmartSendDialog} onOpenChange={setShowSmartSendDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader className="pr-12">
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
                    <p className="font-normal text-sm">{group.templateName}</p>
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

        {/* Modal de explicação dos KPIs */}
        <Dialog open={showKPIsModal} onOpenChange={setShowKPIsModal}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader className="pr-12">
              <DialogTitle className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary" />
                O que significa cada KPI?
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Linha 1: Métricas de Performance */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Métricas de Performance</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="p-2 rounded-lg bg-success/10">
                      <TrendingUp className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Taxa de Conversão</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Percentagem de empresas que completaram o cálculo da pegada de carbono.
                        É o indicador principal de sucesso do programa de onboarding.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Time to Value</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Tempo médio (em dias) desde o primeiro contacto até à conclusão do cálculo da pegada.
                        Quanto menor, mais eficiente é o processo de onboarding.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Open Rate</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Percentagem de emails abertos pelos destinatários.
                        Benchmark B2B: <span className="text-success font-medium">&gt;20%</span> é considerado bom.
                        Indica a eficácia do assunto e timing dos emails.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Zap className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Click-to-Open (CTOR)</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Percentagem de quem clicou no link entre quem abriu o email.
                        Benchmark B2B: <span className="text-success font-medium">&gt;30%</span> é considerado bom.
                        Mede a qualidade e relevância do conteúdo do email.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Linha 2: Insights Accionáveis */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Insights Accionáveis</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 border rounded-lg border-warning/30 bg-warning/5">
                    <div className="p-2 rounded-lg bg-warning/10">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Bottleneck</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Identifica a fase do funil onde mais empresas estão acumuladas sem avançar.
                        O gráfico circular mostra a distribuição por fase. É onde deve concentrar esforços
                        de melhoria — seja através de comunicação diferente, simplificação do processo, ou suporte adicional.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Star className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Melhor Template</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        O template de email com maior taxa de conversão histórica.
                        O gráfico circular mostra a comparação entre templates. Use-o como referência
                        para comunicação com empresas em fases iniciais do funil.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alertas de Deliverability */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Alertas de Deliverability</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 border rounded-lg border-danger/30 bg-danger/5">
                    <div className="p-2 rounded-lg bg-danger/10">
                      <MailX className="h-4 w-4 text-danger" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Bounce Rate</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Percentagem de emails que não foram entregues. Existem dois tipos:
                      </p>
                      <ul className="text-xs text-muted-foreground mt-1 ml-4 list-disc">
                        <li><span className="font-medium">Hard bounce:</span> endereço inválido ou domínio inexistente (permanente)</li>
                        <li><span className="font-medium">Soft bounce:</span> caixa cheia ou servidor temporariamente indisponível</li>
                      </ul>
                      <p className="text-xs text-muted-foreground mt-1">
                        Benchmark: <span className="text-danger font-medium">&lt;2%</span> é aceitável. Acima de 5% requer ação imediata.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-lg border-warning/30 bg-warning/5">
                    <div className="p-2 rounded-lg bg-warning/10">
                      <ShieldAlert className="h-4 w-4 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Spam Rate</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Percentagem de destinatários que marcaram o email como spam.
                        Este é um indicador crítico pois afeta a reputação do domínio remetente.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Benchmark: <span className="text-danger font-medium">&lt;0.1%</span> é o ideal.
                        Acima de 0.5% pode resultar em bloqueio pelos provedores de email.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setShowKPIsModal(false)}>
                Entendido
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Templates Management Modal */}
        <Dialog open={showTemplatesModal} onOpenChange={(open) => {
          setShowTemplatesModal(open);
          if (!open) handleCancelTemplateEdit();
        }}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader className="pr-12">
              <DialogTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-primary" />
                {isCreatingTemplate ? 'Novo Template' : editingTemplate ? 'Editar Template' : 'Gestão de Templates'}
              </DialogTitle>
              <DialogDescription>
                {isCreatingTemplate || editingTemplate
                  ? 'Preencha os campos abaixo para configurar o template de email.'
                  : 'Crie, edite ou remova templates de email para comunicação com empresas.'}
              </DialogDescription>
            </DialogHeader>

            {isCreatingTemplate || editingTemplate ? (
              // Edit/Create Form
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nome do template *</Label>
                  <Input
                    placeholder="Ex: Convite Inicial"
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Input
                    placeholder="Ex: Primeiro contacto para convidar ao cálculo"
                    value={templateForm.description}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Assunto do email *</Label>
                  <Input
                    placeholder="Ex: Convite para calcular a sua pegada de carbono"
                    value={templateForm.subject}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Corpo do email *</Label>
                  <Textarea
                    placeholder="Escreva o conteúdo do email..."
                    value={templateForm.body}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, body: e.target.value }))}
                    className="min-h-[200px]"
                  />
                </div>
              </div>
            ) : (
              // Templates List
              <div className="space-y-3 py-4 max-h-[400px] overflow-y-auto">
                {templates.map(template => (
                  <div key={template.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{template.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{template.description}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditTemplate(template)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar template</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-danger hover:text-danger"
                              onClick={() => handleDeleteTemplate(template)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Remover template</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <DialogFooter className="flex-row gap-2 sm:gap-0">
              {isCreatingTemplate || editingTemplate ? (
                <>
                  <Button variant="outline" onClick={handleCancelTemplateEdit}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveTemplate}>
                    {isCreatingTemplate ? 'Criar Template' : 'Guardar Alterações'}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="flex-1 sm:flex-none gap-2" onClick={handleCreateTemplate}>
                    <Plus className="h-4 w-4" />
                    Novo Template
                  </Button>
                  <Button onClick={() => setShowTemplatesModal(false)}>
                    Fechar
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Incentive;
