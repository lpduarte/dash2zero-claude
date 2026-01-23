import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import { Client } from '@/types/user';
import { mockClients } from '@/data/mockClients';
import { ClientFormDialog, ClientFormData } from '@/components/admin/ClientFormDialog';

// Tipos de filtro
type ClientTypeFilter = 'todos' | 'municipio' | 'empresa';
type StatusFilter = 'ativos' | 'arquivados' | 'todos';

const Admin = () => {
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
        registada: activeClients.reduce((sum, c) => sum + c.metrics.funnelStats.registada, 0),
        emProgresso: activeClients.reduce((sum, c) => sum + c.metrics.funnelStats.emProgresso, 0),
        completo: activeClients.reduce((sum, c) => sum + c.metrics.funnelStats.completo, 0),
      },
    };
  }, [allClients]);

  // Taxa de conversão global
  const globalConversionRate = useMemo(() => {
    const total = Object.values(aggregatedMetrics.funnelTotals).reduce((a, b) => a + b, 0);
    if (total === 0) return 0;
    return Math.round((aggregatedMetrics.funnelTotals.completo / total) * 100);
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

      <main className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Título da secção */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Administração Get2C</h2>
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
            unit={`${aggregatedMetrics.totalMunicipios} municípios · ${aggregatedMetrics.totalEmpresas} empresas`}
          />
          <KPICard
            title="Empresas registadas"
            value={aggregatedMetrics.totalCompanies}
            icon={Users}
            unit={`Em ${aggregatedMetrics.totalClusters} clusters`}
          />
          <KPICard
            title="Taxa de conversão"
            value={`${globalConversionRate}%`}
            icon={TrendingUp}
            unit={`${aggregatedMetrics.funnelTotals.completo} cálculos completos`}
          />
          <KPICard
            title="Por contactar"
            value={aggregatedMetrics.funnelTotals.porContactar}
            icon={MapPin}
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
  const totalFunnel = Object.values(client.metrics.funnelStats).reduce((a, b) => a + b, 0);
  const conversionRate = totalFunnel > 0
    ? Math.round((client.metrics.funnelStats.completo / totalFunnel) * 100)
    : 0;

  return (
    <div className={cn(
      "border rounded-lg p-4 bg-card shadow-sm transition-all hover:shadow-md",
      client.isArchived && "opacity-60"
    )}>
      {/* Header do card */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            client.type === 'municipio' ? "bg-primary/10" : "bg-secondary/50"
          )}>
            {client.type === 'municipio'
              ? <MapPin className="h-5 w-5 text-primary" />
              : <Building2 className="h-5 w-5 text-secondary-foreground" />
            }
          </div>
          <div>
            <h3 className="font-bold text-foreground line-clamp-1">{client.name}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {client.type === 'municipio' ? 'Município' : 'Empresa'}
              </Badge>
              {client.isArchived && (
                <Badge variant="secondary" className="text-xs">Arquivado</Badge>
              )}
            </div>
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

      {/* Métricas rápidas */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="bg-muted/50 rounded-md p-2">
          <p className="text-lg font-bold text-foreground">{client.metrics.totalCompanies}</p>
          <p className="text-xs text-muted-foreground">Empresas</p>
        </div>
        <div className="bg-muted/50 rounded-md p-2">
          <p className="text-lg font-bold text-foreground">{client.metrics.totalClusters}</p>
          <p className="text-xs text-muted-foreground">Clusters</p>
        </div>
        <div className="bg-muted/50 rounded-md p-2">
          <p className="text-lg font-bold text-foreground">{conversionRate}%</p>
          <p className="text-xs text-muted-foreground">Conversão</p>
        </div>
      </div>

      {/* Mini funil */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">Progresso de onboarding</p>
        <MiniFunnelBar stats={client.metrics.funnelStats} />
      </div>

      {/* Botão principal */}
      <Button
        variant="outline"
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

// Componente: Mini Funil (dentro do card)
interface MiniFunnelBarProps {
  stats: Client['metrics']['funnelStats'];
}

const MiniFunnelBar = ({ stats }: MiniFunnelBarProps) => {
  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  if (total === 0) {
    return <div className="h-2 bg-muted rounded-full" />;
  }

  const segments = [
    { key: 'porContactar', value: stats.porContactar, color: 'bg-status-pending' },
    { key: 'semInteracao', value: stats.semInteracao, color: 'bg-status-contacted' },
    { key: 'interessada', value: stats.interessada, color: 'bg-status-interested' },
    { key: 'registada', value: stats.registada, color: 'bg-status-registered' },
    { key: 'emProgresso', value: stats.emProgresso, color: 'bg-status-progress' },
    { key: 'completo', value: stats.completo, color: 'bg-status-complete' },
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

// Componente: Funil Global (topo da página)
interface GlobalFunnelBarProps {
  metrics: {
    porContactar: number;
    semInteracao: number;
    interessada: number;
    registada: number;
    emProgresso: number;
    completo: number;
  };
}

const GlobalFunnelBar = ({ metrics }: GlobalFunnelBarProps) => {
  const total = Object.values(metrics).reduce((a, b) => a + b, 0);

  const legendItems = [
    { label: 'Por contactar', value: metrics.porContactar, color: 'bg-status-pending' },
    { label: 'Sem interação', value: metrics.semInteracao, color: 'bg-status-contacted' },
    { label: 'Interessada', value: metrics.interessada, color: 'bg-status-interested' },
    { label: 'Registada', value: metrics.registada, color: 'bg-status-registered' },
    { label: 'Em progresso', value: metrics.emProgresso, color: 'bg-status-progress' },
    { label: 'Completo', value: metrics.completo, color: 'bg-status-complete' },
  ];

  const segments = legendItems.filter(s => s.value > 0);

  if (total === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Sem dados de onboarding
      </div>
    );
  }

  return (
    <div>
      {/* Barra */}
      <div className="h-4 flex gap-px rounded-md overflow-hidden mb-4">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className={cn(segment.color)}
            style={{ width: `${(segment.value / total) * 100}%` }}
            title={`${segment.label}: ${segment.value}`}
          />
        ))}
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {legendItems.map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full", item.color)} />
            <span className="text-sm text-muted-foreground">
              {item.label} <span className="font-bold text-foreground">{item.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
