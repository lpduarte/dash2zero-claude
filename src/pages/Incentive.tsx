import { useState, useMemo } from "react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Search, 
  Send, 
  AlertTriangle, 
  History, 
  Loader2,
  Mail,
  Target,
  Clock,
  Star,
  Users,
  TrendingUp
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { getClustersByOwnerType } from "@/data/clusters";
import { 
  getSuppliersWithoutFootprintByOwnerType,
  getSuppliersWithFootprintByOwnerType,
} from "@/data/suppliers";
import { emailTemplates, getCompanyEmailTracking, mockEmailTracking } from "@/data/emailTracking";
import { SupplierWithoutFootprint } from "@/types/supplierNew";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface CompanyWithTracking extends SupplierWithoutFootprint {
  emailsSent: number;
  lastContactDate?: string;
}

const Incentive = () => {
  const { isMunicipio } = useUser();
  
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCluster, setSelectedCluster] = useState<string>("all");
  const [showOnlyNeverContacted, setShowOnlyNeverContacted] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState(emailTemplates[0].id);
  const [subject, setSubject] = useState(emailTemplates[0].subject);
  const [message, setMessage] = useState(emailTemplates[0].body);
  const [isLoading, setIsLoading] = useState(false);
  
  // Data
  const clusters = useMemo(() => {
    const ownerType = isMunicipio ? 'municipio' : 'empresa';
    return getClustersByOwnerType(ownerType);
  }, [isMunicipio]);
  
  const suppliersWithFootprint = useMemo(() => {
    const ownerType = isMunicipio ? 'municipio' : 'empresa';
    return getSuppliersWithFootprintByOwnerType(ownerType);
  }, [isMunicipio]);
  
  const companies = useMemo(() => {
    const ownerType = isMunicipio ? 'municipio' : 'empresa';
    const suppliersWithoutFootprint = getSuppliersWithoutFootprintByOwnerType(ownerType);
    
    return suppliersWithoutFootprint.map(s => {
      const tracking = getCompanyEmailTracking(s.id);
      return {
        ...s,
        emailsSent: tracking.emailsSent,
        lastContactDate: tracking.emailHistory[0]?.sentAt,
      } as CompanyWithTracking;
    });
  }, [isMunicipio]);
  
  // Filtered companies
  const filteredCompanies = useMemo(() => {
    let filtered = [...companies];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.contact.email.toLowerCase().includes(query)
      );
    }
    
    // Cluster filter
    if (selectedCluster !== "all") {
      filtered = filtered.filter(c => c.clusterId === selectedCluster);
    }
    
    // Never contacted filter
    if (showOnlyNeverContacted) {
      filtered = filtered.filter(c => c.emailsSent === 0);
    }
    
    return filtered;
  }, [companies, searchQuery, selectedCluster, showOnlyNeverContacted]);
  
  // Metrics
  const metrics = useMemo(() => {
    const companiesContacted = companies.filter(c => c.emailsSent > 0);
    // Mock: 30% das empresas contactadas "converteram" (passaram a ter pegada)
    const converted = Math.floor(companiesContacted.length * 0.3);
    
    return {
      conversionRate: companiesContacted.length > 0 
        ? Math.round((converted / companiesContacted.length) * 100) 
        : 0,
      totalEmailsSent: companies.reduce((sum, c) => sum + c.emailsSent, 0),
      emailsThisMonth: 23, // mock
      neverContacted: companies.filter(c => c.emailsSent === 0).length,
      avgDaysToConversion: 12, // mock
      bestTemplate: "Convite Inicial",
      bestTemplateRate: 34, // mock
      saturatedCount: companies.filter(c => c.emailsSent >= 3).length,
    };
  }, [companies]);
  
  // Email history - compilar de todas as empresas
  const emailHistory = useMemo(() => {
    const history: Array<{
      id: string;
      sentAt: string;
      companyId: string;
      companyName: string;
      templateUsed: string;
      subject: string;
      converted: boolean;
    }> = [];
    
    companies.forEach(company => {
      const tracking = getCompanyEmailTracking(company.id);
      tracking.emailHistory.forEach(email => {
        history.push({
          id: email.id,
          sentAt: email.sentAt,
          companyId: company.id,
          companyName: company.name,
          templateUsed: email.templateUsed,
          subject: email.subject,
          converted: false, // mock - poderia verificar se existe em suppliersWithFootprint
        });
      });
    });
    
    return history.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()).slice(0, 20);
  }, [companies]);
  
  // Handlers
  const handleSelectCompany = (companyId: string) => {
    setSelectedCompanies(prev => 
      prev.includes(companyId) 
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedCompanies.length === filteredCompanies.length) {
      setSelectedCompanies([]);
    } else {
      setSelectedCompanies(filteredCompanies.map(c => c.id));
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
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Emails enviados",
      description: `${selectedCompanies.length} email(s) enviados com sucesso.`,
    });
    
    setSelectedCompanies([]);
    setIsLoading(false);
  };
  
  // Preview
  const firstSelectedCompany = useMemo(() => {
    if (selectedCompanies.length === 0) return null;
    return companies.find(c => c.id === selectedCompanies[0]);
  }, [selectedCompanies, companies]);
  
  const previewSubject = useMemo(() => {
    if (!firstSelectedCompany) return subject;
    return subject.replace(/{companyName}/g, firstSelectedCompany.name);
  }, [subject, firstSelectedCompany]);
  
  const previewMessage = useMemo(() => {
    if (!firstSelectedCompany) return message;
    return message.replace(/{companyName}/g, firstSelectedCompany.name);
  }, [message, firstSelectedCompany]);
  
  const allSelected = filteredCompanies.length > 0 && selectedCompanies.length === filteredCompanies.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-[1400px] mx-auto p-6">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            Incentivo ao Cálculo de Pegada
          </h2>
          <p className="text-muted-foreground">
            Contacte empresas que ainda não calcularam a sua pegada de carbono
          </p>
        </div>
        
        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Taxa de Conversão</p>
            </div>
            <p className="text-2xl font-bold text-success">{metrics.conversionRate}%</p>
            <p className="text-xs text-muted-foreground">contactadas → calcularam</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Emails Enviados</p>
            </div>
            <p className="text-2xl font-bold">{metrics.totalEmailsSent}</p>
            <p className="text-xs text-muted-foreground">{metrics.emailsThisMonth} este mês</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Nunca Contactadas</p>
            </div>
            <p className="text-2xl font-bold text-primary">{metrics.neverContacted}</p>
            <p className="text-xs text-muted-foreground">empresas por contactar</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Tempo até Conversão</p>
            </div>
            <p className="text-2xl font-bold">{metrics.avgDaysToConversion}</p>
            <p className="text-xs text-muted-foreground">dias em média</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Melhor Template</p>
            </div>
            <p className="text-lg font-bold truncate">{metrics.bestTemplate}</p>
            <p className="text-xs text-muted-foreground">{metrics.bestTemplateRate}% conversão</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Saturadas (3+)</p>
            </div>
            <p className="text-2xl font-bold text-amber-500">{metrics.saturatedCount}</p>
            <p className="text-xs text-muted-foreground">parar de insistir</p>
          </Card>
        </div>
        
        {/* Main Grid: List + Compose */}
        <div className="grid lg:grid-cols-[1fr,400px] gap-6 mb-6">
          {/* Left Column: Company List */}
          <div className="flex flex-col border rounded-lg bg-card h-[600px]">
            {/* Header with filters */}
            <div className="p-4 border-b space-y-3">
              {/* Row 1: Search + Select all */}
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
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  {allSelected ? "Desmarcar todas" : "Seleccionar todas"}
                </Button>
              </div>
              
              {/* Row 2: Cluster filters + toggle */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex gap-1">
                  <Button
                    variant={selectedCluster === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCluster("all")}
                  >
                    Todos
                  </Button>
                  {clusters.map(cluster => (
                    <Button
                      key={cluster.id}
                      variant={selectedCluster === cluster.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCluster(cluster.id)}
                    >
                      {cluster.name}
                    </Button>
                  ))}
                </div>
                
                <div className="h-5 w-px bg-border" />
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={showOnlyNeverContacted}
                    onCheckedChange={(checked) => setShowOnlyNeverContacted(checked === true)}
                  />
                  <span className="text-sm">Só nunca contactadas</span>
                </label>
                
                <span className="text-sm text-muted-foreground ml-auto">
                  {filteredCompanies.length} empresas
                </span>
              </div>
            </div>
            
            {/* Scrollable list */}
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {filteredCompanies.map(company => (
                  <div 
                    key={company.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/5 cursor-pointer transition-colors ${
                      company.emailsSent >= 3 ? 'border-amber-200 bg-amber-50/30 dark:bg-amber-950/10' : ''
                    } ${selectedCompanies.includes(company.id) ? 'bg-primary/5 border-primary/30' : ''}`}
                    onClick={() => handleSelectCompany(company.id)}
                  >
                    <Checkbox 
                      checked={selectedCompanies.includes(company.id)} 
                      onClick={(e) => e.stopPropagation()}
                      onCheckedChange={() => handleSelectCompany(company.id)}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{company.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{company.contact.email}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {company.emailsSent >= 3 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                            </TooltipTrigger>
                            <TooltipContent>Risco de saturação</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      <Badge variant="outline">
                        {company.emailsSent} {company.emailsSent === 1 ? 'email' : 'emails'}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {filteredCompanies.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    Nenhuma empresa encontrada com os filtros actuais.
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {/* Footer with count */}
            <div className="p-3 border-t bg-muted/30">
              <p className="text-sm text-center text-muted-foreground">
                {selectedCompanies.length} de {filteredCompanies.length} seleccionadas
              </p>
            </div>
          </div>
          
          {/* Right Column: Email Compose */}
          <div className="flex flex-col border rounded-lg bg-card h-[600px]">
            <Tabs defaultValue="compose" className="flex-1 flex flex-col">
              <TabsList className="m-4 mb-0">
                <TabsTrigger value="compose">Compor</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="compose" className="flex-1 flex flex-col p-4 pt-2 gap-4 overflow-hidden">
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
                
                <div className="flex-1 flex flex-col min-h-0">
                  <Label>Mensagem</Label>
                  <Textarea 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 min-h-[200px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use {"{companyName}"} para personalizar
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="flex-1 p-4 pt-2 overflow-auto">
                {firstSelectedCompany ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Para</p>
                      <p className="font-medium">{firstSelectedCompany.contact.email}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Assunto</p>
                      <p className="font-medium">{previewSubject}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Mensagem</p>
                      <p className="whitespace-pre-wrap text-sm">{previewMessage}</p>
                    </div>
                    {selectedCompanies.length > 1 && (
                      <p className="text-sm text-muted-foreground text-center">
                        + {selectedCompanies.length - 1} emails semelhantes
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Seleccione empresas para ver o preview
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            {/* Send button */}
            <div className="p-4 border-t">
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
        
        {/* Email History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Histórico de Envios
            </CardTitle>
          </CardHeader>
          <CardContent>
            {emailHistory.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Assunto</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailHistory.map(email => (
                    <TableRow key={email.id}>
                      <TableCell>{format(new Date(email.sentAt), "dd/MM/yyyy HH:mm")}</TableCell>
                      <TableCell className="font-medium">{email.companyName}</TableCell>
                      <TableCell><Badge variant="outline">{email.templateUsed}</Badge></TableCell>
                      <TableCell className="max-w-[300px] truncate">{email.subject}</TableCell>
                      <TableCell>
                        <Badge variant={email.converted ? "default" : "secondary"} className={email.converted ? "bg-success" : ""}>
                          {email.converted ? "Converteu" : "Aguarda"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                Nenhum email enviado ainda.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Incentive;
