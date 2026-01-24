import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from "@/lib/usePageTitle";
import {
  Building2,
  MapPin,
  Users,
  TrendingUp,
  Search,
  Plus,
  Filter,
  Archive,
  MoreHorizontal,
  ChevronRight,
  TowerControl,
} from 'lucide-react';
import { Header } from '@/components/dashboard/Header';
import { KPICard } from '@/components/ui/kpi-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import { Client } from '@/types/user';
import { mockClients } from '@/data/mockClients';
import { ClientFormDialog, ClientFormData } from '@/components/admin/ClientFormDialog';

// Tipos de filtro
type ClientTypeFilter = 'todos' | 'municipio' | 'empresa';
type StatusFilter = 'ativos' | 'arquivados' | 'todos';

const Admin = () => {
  usePageTitle("Painel de controlo");
  const navigate = useNavigate();
  const { setActiveClient } = useUser();

  // Estados de filtro
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ClientTypeFilter>('todos');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ativos');

  // Estados do modal de cliente
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>(undefined);

  // Todos os clientes (incluindo arquivados para métricas)
  const allClients = mockClients;

  // Clientes filtrados
  const filteredClients = useMemo(() => {
    return allClients.filter(client => {
      // Filtro de pesquisa
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = client.name.toLowerCase().includes(query);
        const matchesEmail = client.contactEmail.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail) return false;
      }

      // Filtro de tipo
      if (typeFilter !== 'todos' && client.type !== typeFilter) return false;

      // Filtro de status
      if (statusFilter === 'ativos' && client.isArchived) return false;
      if (statusFilter === 'arquivados' && !client.isArchived) return false;

      return true;
    });
  }, [allClients, searchQuery, typeFilter, statusFilter]);

  // Métricas agregadas (apenas clientes ativos)
  const aggregatedMetrics = useMemo(() => {
    const activeClients = allClients.filter(c => !c.isArchived);

    return {
      totalClients: activeClients.length,
      totalMunicipios: activeClients.filter(c => c.type === 'municipio').length,
      totalEmpresas: activeClients.filter(c => c.type === 'empresa').length,
      totalCompanies: activeClients.reduce((sum, c) => sum + c.metrics.totalCompanies, 0),
      totalClusters: activeClients.reduce((sum, c) => sum + c.metrics.totalClusters, 0),
      funnelTotals: {
        porContactar: activeClients.reduce((sum, c) => sum + c.metrics.funnelStats.porContactar, 0),
        semInteracao: activeClients.reduce((sum, c) => sum + c.metrics.funnelStats.semInteracao, 0),
        interessada: activeClients.reduce((sum, c) => sum + c.metrics.funnelStats.interessada, 0),
        simple: {
          registada: activeClients.reduce((sum, c) => sum + c.metrics.funnelStats.simple.registada, 0),
          emProgresso: activeClients.reduce((sum, c) => sum + c.metrics.funnelStats.simple.emProgresso, 0),
          completo: activeClients.reduce((sum, c) => sum + c.metrics.funnelStats.simple.completo, 0),
        },
        formulario: {
          emProgresso: activeClients.reduce((sum, c) => sum + c.metrics.funnelStats.formulario.emProgresso, 0),
          completo: activeClients.reduce((sum, c) => sum + c.metrics.funnelStats.formulario.completo, 0),
        },
      },
    };
  }, [allClients]);

  // Taxa de conversão global
  const globalConversionRate = useMemo(() => {
    const { funnelTotals } = aggregatedMetrics;
    const totalCompleto = funnelTotals.simple.completo + funnelTotals.formulario.completo;
    const total = funnelTotals.porContactar +
                  funnelTotals.semInteracao +
                  funnelTotals.interessada +
                  funnelTotals.simple.registada +
                  funnelTotals.simple.emProgresso +
                  funnelTotals.simple.completo +
                  funnelTotals.formulario.emProgresso +
                  funnelTotals.formulario.completo;
    if (total === 0) return 0;
    return Math.round((totalCompleto / total) * 100);
  }, [aggregatedMetrics]);

  // Entrar num cliente
  const handleEnterClient = (client: Client) => {
    setActiveClient(client);
    navigate('/');
  };

  // Editar cliente
  const handleEditClient = (client: Client) => {
    setEditingClient(client);
  };

  // Guardar cliente (criar ou editar)
  const handleSaveClient = (data: ClientFormData) => {
    if (editingClient) {
      // TODO: Em produção, isto seria uma chamada API para atualizar
      console.log('Atualizar cliente:', editingClient.id, data);
    } else {
      // TODO: Em produção, isto seria uma chamada API para criar
      console.log('Criar cliente:', data);
    }
    setEditingClient(undefined);
  };

  // Arquivar/desarquivar cliente
  const handleToggleArchive = (client: Client) => {
    // TODO: Implementar lógica
    console.log('Toggle archive:', client.id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="relative z-10 max-w-[1400px] mx-auto px-8 py-8">
        {/* Título da secção */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <TowerControl className="h-6 w-6 text-primary" />
              Painel de controlo
            </h2>
            <p className="text-muted-foreground mt-1">Gestão de clientes e visão global</p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo cliente
          </Button>
        </div>

        {/* KPIs Globais */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <KPICard
            title="Total de clientes"
            value={aggregatedMetrics.totalClients}
            icon={Building2}
            iconColor="text-primary"
            iconBgColor="bg-primary/10"
            unit={`${aggregatedMetrics.totalMunicipios} municípios · ${aggregatedMetrics.totalEmpresas} empresas`}
          />
          <KPICard
            title="Empresas registadas"
            value={aggregatedMetrics.totalCompanies}
            icon={Users}
            iconColor="text-muted-foreground"
            iconBgColor="bg-muted"
            unit={`Em ${aggregatedMetrics.totalClusters} clusters`}
          />
          <KPICard
            title="Taxa de conversão"
            value={`${globalConversionRate}%`}
            icon={TrendingUp}
            iconColor={globalConversionRate >= 30 ? "text-success" : "text-warning"}
            iconBgColor={globalConversionRate >= 30 ? "bg-success/10" : "bg-warning/10"}
            valueColor={globalConversionRate >= 30 ? "text-success" : "text-warning"}
            unit={`${aggregatedMetrics.funnelTotals.simple.completo + aggregatedMetrics.funnelTotals.formulario.completo} cálculos completos`}
          />
          <KPICard
            title="Por contactar"
            value={aggregatedMetrics.funnelTotals.porContactar}
            icon={MapPin}
            iconColor="text-warning"
            iconBgColor="bg-warning/10"
            unit="Aguardam primeiro email"
          />
        </div>

        {/* Funil Global Agregado */}
        <div className="border rounded-lg p-4 bg-card shadow-sm mb-8">
          <p className="text-xs font-normal text-muted-foreground mb-4">Progresso de onboarding global</p>
          <GlobalFunnelBar metrics={aggregatedMetrics.funnelTotals} />
        </div>

        {/* Ferramentas de pesquisa e filtro */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            {/* Filtro por tipo */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {typeFilter === 'todos' ? 'Todos os tipos' : typeFilter === 'municipio' ? 'Municípios' : 'Empresas'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTypeFilter('todos')}>
                  Todos os tipos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('municipio')}>
                  Municípios
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('empresa')}>
                  Empresas
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filtro por status */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Archive className="h-4 w-4" />
                  {statusFilter === 'ativos' ? 'Ativos' : statusFilter === 'arquivados' ? 'Arquivados' : 'Todos'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter('ativos')}>
                  Ativos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('arquivados')}>
                  Arquivados
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('todos')}>
                  Todos
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Contagem de resultados */}
        <p className="text-sm text-muted-foreground mb-4">
          {filteredClients.length} {filteredClients.length === 1 ? 'cliente encontrado' : 'clientes encontrados'}
        </p>

        {/* Grid de Cards de Clientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map(client => (
            <ClientCard
              key={client.id}
              client={client}
              onEnter={() => handleEnterClient(client)}
              onEdit={() => handleEditClient(client)}
              onToggleArchive={() => handleToggleArchive(client)}
            />
          ))}
        </div>

        {/* Estado vazio */}
        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-1">Nenhum cliente encontrado</h3>
            <p className="text-muted-foreground">Tente ajustar os filtros ou criar um novo cliente.</p>
          </div>
        )}

        {/* Modal Criar/Editar Cliente */}
        <ClientFormDialog
          open={isCreateDialogOpen || !!editingClient}
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateDialogOpen(false);
              setEditingClient(undefined);
            }
          }}
          client={editingClient}
          onSave={handleSaveClient}
        />
      </main>
    </div>
  );
};

// Componente: Card de Cliente
interface ClientCardProps {
  client: Client;
  onEnter: () => void;
  onEdit: () => void;
  onToggleArchive: () => void;
}

const ClientCard = ({ client, onEnter, onEdit, onToggleArchive }: ClientCardProps) => {
  const { funnelStats } = client.metrics;
  const completo = funnelStats.simple.completo + funnelStats.formulario.completo;
  const totalFunnel = funnelStats.porContactar +
                      funnelStats.semInteracao +
                      funnelStats.interessada +
                      funnelStats.simple.registada +
                      funnelStats.simple.emProgresso +
                      funnelStats.simple.completo +
                      funnelStats.formulario.emProgresso +
                      funnelStats.formulario.completo;
  const conversionRate = totalFunnel > 0
    ? Math.round((completo / totalFunnel) * 100)
    : 0;

  // Cor condicional para conversão
  const conversionColor = conversionRate >= 30 ? 'text-success' : 'text-warning';

  return (
    <div className={cn(
      "border rounded-lg p-4 bg-card shadow-sm transition-all hover:shadow-md",
      client.isArchived && "opacity-60"
    )}>
      {/* Header do card */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "relative w-10 h-10 rounded-lg flex items-center justify-center",
            client.type === 'municipio' ? "bg-primary/10" : "bg-secondary/50"
          )}>
            {client.type === 'municipio'
              ? <MapPin className="h-5 w-5 text-primary" />
              : <Building2 className="h-5 w-5 text-secondary-foreground" />
            }
            {/* Badge de tipo no avatar */}
            <div className={cn(
              "absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white",
              client.type === 'municipio' ? "bg-primary" : "bg-secondary-foreground"
            )}>
              {client.type === 'municipio' ? 'M' : 'E'}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-foreground line-clamp-1">{client.name}</h3>
            <p className="text-xs text-muted-foreground">
              {client.type === 'municipio' ? 'Município' : 'Empresa'}
              {client.isArchived && <span className="text-warning ml-2">· Arquivado</span>}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEnter}>
              Entrar como cliente
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onToggleArchive}>
              {client.isArchived ? 'Desarquivar' : 'Arquivar'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Métricas rápidas - simplificado para Empresas + Conversão */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-center">
        <div className="bg-muted/50 rounded-md p-2">
          <p className="text-lg font-bold text-foreground">{client.metrics.totalCompanies}</p>
          <p className="text-xs text-muted-foreground">Empresas</p>
        </div>
        <div className="bg-muted/50 rounded-md p-2">
          <p className={cn("text-lg font-bold", conversionColor)}>{conversionRate}%</p>
          <p className="text-xs text-muted-foreground">Conversão</p>
        </div>
      </div>

      {/* Mini funil */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">Progresso de onboarding</p>
        <MiniFunnelBar stats={client.metrics.funnelStats} />
      </div>

      {/* Botão principal - mais proeminente */}
      <Button
        variant="default"
        className="w-full gap-2"
        onClick={onEnter}
        disabled={client.isArchived}
      >
        Entrar
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Componente: Mini Funil (dentro do card) - simplificado sem ramificação
interface MiniFunnelBarProps {
  stats: Client['metrics']['funnelStats'];
}

const MiniFunnelBar = ({ stats }: MiniFunnelBarProps) => {
  // Calcular totais agregados
  const registada = stats.simple.registada;
  const emProgresso = stats.simple.emProgresso + stats.formulario.emProgresso;
  const completo = stats.simple.completo + stats.formulario.completo;

  const total = stats.porContactar + stats.semInteracao + stats.interessada +
                registada + emProgresso + completo;

  if (total === 0) {
    return <div className="h-2 bg-muted rounded-full" />;
  }

  const segments = [
    { key: 'porContactar', value: stats.porContactar, color: 'bg-status-pending' },
    { key: 'semInteracao', value: stats.semInteracao, color: 'bg-status-contacted' },
    { key: 'interessada', value: stats.interessada, color: 'bg-status-interested' },
    { key: 'registada', value: registada, color: 'bg-status-registered' },
    { key: 'emProgresso', value: emProgresso, color: 'bg-status-progress' },
    { key: 'completo', value: completo, color: 'bg-status-complete' },
  ].filter(s => s.value > 0);

  return (
    <div className="h-2 flex gap-px rounded-full overflow-hidden">
      {segments.map((segment) => (
        <div
          key={segment.key}
          className={cn(segment.color)}
          style={{ width: `${(segment.value / total) * 100}%` }}
        />
      ))}
    </div>
  );
};

// Componente: Funil Global (topo da página) com ramificação Simple/Formulário
interface GlobalFunnelBarProps {
  metrics: {
    porContactar: number;
    semInteracao: number;
    interessada: number;
    simple: {
      registada: number;
      emProgresso: number;
      completo: number;
    };
    formulario: {
      emProgresso: number;
      completo: number;
    };
  };
}

const GlobalFunnelBar = ({ metrics }: GlobalFunnelBarProps) => {
  const preTotal = metrics.porContactar + metrics.semInteracao + metrics.interessada;
  const simpleTotal = metrics.simple.registada + metrics.simple.emProgresso + metrics.simple.completo;
  const formularioTotal = metrics.formulario.emProgresso + metrics.formulario.completo;
  const postTotal = simpleTotal + formularioTotal;
  const grandTotal = preTotal + postTotal;

  const leftPercent = postTotal === 0 ? 100 : preTotal === 0 ? 0 : (preTotal / grandTotal) * 100;
  const rightPercent = preTotal === 0 ? 100 : postTotal === 0 ? 0 : (postTotal / grandTotal) * 100;

  const legendItems = [
    { label: 'Por contactar', value: metrics.porContactar, color: 'bg-status-pending', tooltip: 'Ainda não recebeu nenhum email' },
    { label: 'Sem interação', value: metrics.semInteracao, color: 'bg-status-contacted', tooltip: 'Recebeu email mas não clicou no link' },
    { label: 'Interessada', value: metrics.interessada, color: 'bg-status-interested', tooltip: 'Clicou no link do email' },
    { label: 'Registada', value: metrics.simple.registada, color: 'bg-status-registered', tooltip: 'Criou conta no Simple' },
    { label: 'Em progresso', value: metrics.simple.emProgresso + metrics.formulario.emProgresso, color: 'bg-status-progress', tooltip: 'Iniciou o cálculo da pegada' },
    { label: 'Completo', value: metrics.simple.completo + metrics.formulario.completo, color: 'bg-status-complete', tooltip: 'Pegada calculada com sucesso' },
  ];

  if (grandTotal === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Sem dados de onboarding
      </div>
    );
  }

  return (
    <div>
      {/* Barra com ramificação */}
      <div className="flex items-center gap-2">
        {/* Fase pré-decisão */}
        {preTotal > 0 && (() => {
          const preSegments = [
            { key: 'pending', value: metrics.porContactar, color: 'bg-status-pending', label: 'Por contactar' },
            { key: 'contacted', value: metrics.semInteracao, color: 'bg-status-contacted', label: 'Sem interação' },
            { key: 'interested', value: metrics.interessada, color: 'bg-status-interested', label: 'Interessada' },
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
            {(() => {
              const maxBranchTotal = Math.max(simpleTotal, formularioTotal);
              const simpleWidthPercent = maxBranchTotal > 0 ? (simpleTotal / maxBranchTotal) * 100 : 0;
              const formularioWidthPercent = maxBranchTotal > 0 ? (formularioTotal / maxBranchTotal) * 100 : 0;

              const simpleSegments = [
                { key: 'registered', value: metrics.simple.registada, color: 'bg-status-registered', label: 'Registada' },
                { key: 'progress', value: metrics.simple.emProgresso, color: 'bg-status-progress', label: 'Em progresso' },
                { key: 'complete', value: metrics.simple.completo, color: 'bg-status-complete', label: 'Completo' },
              ].filter(s => s.value > 0);

              const formularioSegments = [
                { key: 'progress', value: metrics.formulario.emProgresso, color: 'bg-status-progress', label: 'Em progresso' },
                { key: 'complete', value: metrics.formulario.completo, color: 'bg-status-complete', label: 'Completo' },
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
              <TooltipContent side="bottom">
                <p>{item.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default Admin;
