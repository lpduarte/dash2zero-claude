import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Loader2, ChevronDown, ChevronRight, History, Search, X } from "lucide-react";
import { emailTemplates, getCompanyEmailTracking, EmailRecord } from "@/data/emailTracking";
import { Supplier } from "@/types/supplier";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { useUser } from "@/contexts/UserContext";
import { getClusterConfig, getClusterInfo, ClusterType } from "@/config/clusters";

// Tipo que combina Supplier com dados de email tracking
interface CompanyWithTracking extends Supplier {
  emailsSent: number;
  emailHistory: EmailRecord[];
}

interface IncentiveEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suppliers: Supplier[]; // Todos os suppliers do contexto actual
}

export const IncentiveEmailDialog = ({
  open,
  onOpenChange,
  suppliers,
}: IncentiveEmailDialogProps) => {
  const { toast } = useToast();
  const { userType } = useUser();
  const clusterOptions = getClusterConfig(userType);
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("t1");
  const [subject, setSubject] = useState(emailTemplates[0].subject);
  const [message, setMessage] = useState(emailTemplates[0].body);
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);
  const [clusterFilter, setClusterFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [collapsedSectors, setCollapsedSectors] = useState<Set<string>>(new Set());

  // Empresas sem pegada calculada (dataSource !== "get2zero")
  const companies = useMemo((): CompanyWithTracking[] => {
    return suppliers
      .filter(s => s.dataSource !== "get2zero")
      .map(supplier => {
        const tracking = getCompanyEmailTracking(supplier.id);
        return {
          ...supplier,
          emailsSent: tracking.emailsSent,
          emailHistory: tracking.emailHistory
        };
      });
  }, [suppliers]);

  const filteredCompanies = useMemo(() => {
    let result = companies;
    
    // Filtro por cluster
    if (clusterFilter !== "all") {
      result = result.filter(c => c.cluster === clusterFilter);
    }
    
    // Filtro por pesquisa (nome, email ou NIF)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.contact.email.toLowerCase().includes(query) ||
        c.contact.nif.includes(query)
      );
    }
    
    return result;
  }, [companies, clusterFilter, searchQuery]);

  // Agrupar empresas por sector
  const companiesBySector = useMemo(() => {
    const grouped: Record<string, CompanyWithTracking[]> = {};
    filteredCompanies.forEach(company => {
      if (!grouped[company.sector]) {
        grouped[company.sector] = [];
      }
      grouped[company.sector].push(company);
    });
    // Ordenar sectores alfabeticamente
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredCompanies]);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setMessage(template.body);
    }
  };

  const handleSelectAll = () => {
    const filteredIds = filteredCompanies.map(c => c.id);
    const allSelected = filteredIds.every(id => selectedCompanies.includes(id));
    
    if (allSelected) {
      setSelectedCompanies(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      setSelectedCompanies(prev => [...new Set([...prev, ...filteredIds])]);
    }
  };

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompanies(prev => 
      prev.includes(companyId)
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleSelectSector = (sectorCompanies: CompanyWithTracking[]) => {
    const sectorIds = sectorCompanies.map(c => c.id);
    const allSelected = sectorIds.every(id => selectedCompanies.includes(id));
    
    if (allSelected) {
      setSelectedCompanies(prev => prev.filter(id => !sectorIds.includes(id)));
    } else {
      setSelectedCompanies(prev => [...new Set([...prev, ...sectorIds])]);
    }
  };

  const toggleExpandCompany = (companyId: string) => {
    setExpandedCompany(prev => prev === companyId ? null : companyId);
  };

  const toggleSectorCollapse = (sector: string) => {
    setCollapsedSectors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sector)) {
        newSet.delete(sector);
      } else {
        newSet.add(sector);
      }
      return newSet;
    });
  };

  const getEmailCountColor = (count: number) => {
    if (count === 0) return "bg-slate-100 text-slate-600";
    if (count === 1) return "bg-blue-100 text-blue-700";
    if (count === 2) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  const getClusterIcon = (cluster: string) => {
    const info = getClusterInfo(userType, cluster as ClusterType);
    const Icon = info?.icon;
    const label = info?.label || cluster;
    
    if (!Icon) return null;
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Icon className="h-3.5 w-3.5 text-primary" />
          </TooltipTrigger>
          <TooltipContent><p>{label}</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const handleSend = async () => {
    if (selectedCompanies.length === 0) {
      toast({
        title: "Nenhuma empresa selecionada",
        description: "Selecione pelo menos uma empresa para enviar o convite.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    onOpenChange(false);
    setSelectedCompanies([]);
    
    toast({
      title: "Convites enviados com sucesso!",
      description: `${selectedCompanies.length} email(s) enviado(s) para incentivar o cálculo de pegadas.`,
    });
  };

  const formatEmailDate = (dateString: string) => {
    return format(new Date(dateString), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: pt });
  };

  const filteredSelectedCount = filteredCompanies.filter(c => selectedCompanies.includes(c.id)).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1100px] h-[calc(100vh-200px)] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Incentivar cálculo de pegadas
          </DialogTitle>
          <DialogDescription>
            Selecione as empresas e o template de mensagem para enviar convites.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
          {/* Lista de Empresas */}
          <div className="flex flex-col border rounded-lg overflow-hidden">
            <div className="p-3 bg-muted/50 border-b space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Filtrar por Cluster</span>
                <Button variant="outline" size="sm" onClick={handleSelectAll} className="text-xs h-7 border-border">
                  {filteredSelectedCount === filteredCompanies.length ? "Desmarcar todas" : "Selecionar todas as empresas"}
                </Button>
              </div>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar empresa, email ou NIF..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-8 pr-8 text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              {searchQuery && (
                <p className="text-[10px] text-muted-foreground">
                  {filteredCompanies.length} resultado{filteredCompanies.length !== 1 ? 's' : ''} encontrado{filteredCompanies.length !== 1 ? 's' : ''}
                </p>
              )}
              {/* Cluster Filter */}
              <div className="flex gap-1">
                {clusterOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={option.value}
                      variant={clusterFilter === option.value ? "default" : "outline"}
                      size="sm"
                      className={`h-7 text-xs gap-1 ${clusterFilter !== option.value ? "hover:bg-primary hover:text-primary-foreground hover:border-primary" : ""}`}
                      onClick={() => setClusterFilter(option.value)}
                    >
                      <Icon className="h-4 w-4" />
                      {option.labelPlural}
                    </Button>
                  );
                })}
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div 
                className="p-2 space-y-3 transition-all duration-[400ms] ease-in-out" 
                key={`${clusterFilter}-${searchQuery}`}
              >
                {companiesBySector.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <Search className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma empresa encontrada</p>
                    {searchQuery && (
                      <p className="text-xs mt-1">Tente ajustar a pesquisa ou os filtros</p>
                    )}
                  </div>
                ) : (
                  companiesBySector.map(([sector, sectorCompanies], sectorIndex) => {
                    const sectorSelectedCount = sectorCompanies.filter(c => selectedCompanies.includes(c.id)).length;
                    const isCollapsed = collapsedSectors.has(sector);
                    return (
                      <div key={sector} className="space-y-1 animate-fade-in" style={{ animationDelay: `${sectorIndex * 50}ms`, animationFillMode: 'backwards' }}>
                        <button 
                          onClick={() => toggleSectorCollapse(sector)}
                          className="flex items-center justify-between w-full px-2 py-1.5 bg-muted/30 rounded sticky top-0 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-[400ms] ease-in-out ${isCollapsed ? '-rotate-90' : ''}`} />
                            <span className="text-xs font-semibold text-muted-foreground">{sector}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground">{sectorSelectedCount}/{sectorCompanies.length}</span>
                            <Checkbox
                              checked={sectorSelectedCount === sectorCompanies.length}
                              onCheckedChange={() => handleSelectSector(sectorCompanies)}
                              onClick={(e) => e.stopPropagation()}
                              className="h-3.5 w-3.5"
                            />
                          </div>
                        </button>
                        <div className={`overflow-hidden transition-all duration-[400ms] ease-in-out ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[2000px] opacity-100'}`}>
                          <div className="space-y-1.5 pt-1">
                            {sectorCompanies.map((company, companyIndex) => (
                            <Collapsible key={company.id} open={expandedCompany === company.id}>
                              <div 
                                className="rounded-md border bg-card hover:bg-accent/5 transition-all duration-200 ml-2"
                                style={{ animationDelay: `${(sectorIndex * 50) + (companyIndex * 30)}ms` }}
                              >
                              <div className="flex items-center gap-2 p-2">
                                <Checkbox
                                  checked={selectedCompanies.includes(company.id)}
                                  onCheckedChange={() => handleSelectCompany(company.id)}
                                />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium truncate">{company.name}</p>
                                  {getClusterIcon(company.cluster)}
                                </div>
                              </div>
                              {company.emailHistory.length > 0 ? (
                                <CollapsibleTrigger asChild>
                                  <button 
                                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${getEmailCountColor(company.emailsSent)} hover:opacity-80`}
                                    onClick={() => toggleExpandCompany(company.id)}
                                  >
                                    {company.emailsSent} email{company.emailsSent !== 1 ? "s" : ""}
                                    {expandedCompany === company.id ? (
                                      <ChevronDown className="h-3.5 w-3.5" />
                                    ) : (
                                      <ChevronRight className="h-3.5 w-3.5" />
                                    )}
                                  </button>
                                </CollapsibleTrigger>
                              ) : (
                                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${getEmailCountColor(company.emailsSent)}`}>
                                  {company.emailsSent} emails
                                  <ChevronRight className="h-3.5 w-3.5 opacity-30" />
                                </span>
                              )}
                            </div>
                            <CollapsibleContent>
                              <div className="px-2 pb-2 pt-1 border-t bg-muted/30">
                                <div className="flex items-center gap-1 mb-2">
                                  <History className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs font-medium text-muted-foreground">Histórico de emails</span>
                                </div>
                                <div className="space-y-2">
                                  {company.emailHistory.map((email) => (
                                    <div key={email.id} className="bg-background rounded p-2 text-xs">
                                      <div className="flex items-center justify-between mb-1">
                                        <Badge variant="outline" className="text-[10px] h-5">{email.templateUsed}</Badge>
                                        <span className="text-muted-foreground text-[10px]">
                                          {formatEmailDate(email.sentAt)}
                                        </span>
                                      </div>
                                      <p className="font-medium text-xs mb-1">{email.subject}</p>
                                      <p className="text-muted-foreground line-clamp-2">{email.preview}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </CollapsibleContent>
                          </div>
                        </Collapsible>
                      ))}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
            <div className="p-2 border-t bg-muted/30">
              <p className="text-xs text-muted-foreground text-center">
                {selectedCompanies.length} de {companies.length} selecionada(s)
              </p>
            </div>
          </div>

          {/* Composição do Email */}
          <div className="flex flex-col gap-4 pr-1">
            <div className="grid gap-2">
              <Label htmlFor="template" className="text-xs font-medium">Template de mensagem</Label>
              <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um template">
                    {emailTemplates.find(t => t.id === selectedTemplate)?.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {emailTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{template.name}</span>
                        <span className="text-xs text-muted-foreground">{template.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="subject" className="text-xs font-medium">Assunto</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Assunto do email"
              />
            </div>

            <div className="grid gap-2 flex-1">
              <Label htmlFor="message" className="text-xs font-medium">Mensagem</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escreva a sua mensagem..."
                className="flex-1 min-h-[200px] resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Variáveis disponíveis: {"{companyName}"}, {"{contactName}"}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSend} disabled={isLoading || selectedCompanies.length === 0}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                A enviar...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar ({selectedCompanies.length})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
