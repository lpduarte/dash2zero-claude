import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from "@/lib/usePageTitle";
import {
  Building2,
  MapPin,
  Landmark,
  Users,
  TrendingUp,
  Search,
  Plus,
  Filter,
  Archive,
  ChevronRight,
  TowerControl,
  LayoutDashboard,
  Pencil,
  AlertTriangle,
  Clock,
  TrendingDown,
  Mail,
  MailWarning,
} from 'lucide-react';
import { Header } from '@/components/dashboard/Header';
import { KPICard } from '@/components/ui/kpi-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { elements, shadows } from '@/lib/styles';
import { useUser } from '@/contexts/UserContext';
import { Client } from '@/types/user';
import { mockClients } from '@/data/mockClients';
import { ClientFormDialog, ClientFormData } from '@/components/admin/ClientFormDialog';
import { Area, AreaChart, ResponsiveContainer, Tooltip as RechartsTooltip, PieChart, Pie, Cell } from 'recharts';

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
      globalWeeklyCompletions: activeClients.reduce((acc, c) => {
        const completions = c.metrics.weeklyCompletions || [];
        completions.forEach((val, idx) => {
          acc[idx] = (acc[idx] || 0) + val;
        });
        return acc;
      }, [] as number[]),
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

  // Totais Simple vs Formulário para donut chart
  const simpleTotal = aggregatedMetrics.funnelTotals.simple.registada +
                      aggregatedMetrics.funnelTotals.simple.emProgresso +
                      aggregatedMetrics.funnelTotals.simple.completo;
  const formularioTotal = aggregatedMetrics.funnelTotals.formulario.emProgresso +
                          aggregatedMetrics.funnelTotals.formulario.completo;

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <KPICard
            title="Total de clientes"
            value={aggregatedMetrics.totalClients}
            icon={Building2}
            iconColor="text-primary"
            iconBgColor="bg-primary/10"
            unit={`${aggregatedMetrics.totalMunicipios} ${aggregatedMetrics.totalMunicipios === 1 ? 'município' : 'municípios'} · ${aggregatedMetrics.totalEmpresas} ${aggregatedMetrics.totalEmpresas === 1 ? 'empresa' : 'empresas'}`}
          />
          <KPICard
            title="Empresas registadas"
            value={aggregatedMetrics.totalCompanies}
            icon={Users}
            unit={`Em ${aggregatedMetrics.totalClusters} clusters`}
          />
          {/* Card composto: Taxa de conversão + Donut chart */}
          <div className="border rounded-md shadow-md bg-card hover:shadow-lg hover:border-primary/25 transition-all duration-200 flex overflow-hidden">
            {/* Info */}
            <div className="flex-1 p-4 flex flex-col gap-3">
              <div className="flex items-center h-7">
                <p className="text-xs font-normal text-muted-foreground">Taxa de conversão</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{globalConversionRate}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {aggregatedMetrics.funnelTotals.simple.completo + aggregatedMetrics.funnelTotals.formulario.completo} cálculos completos
                </p>
              </div>
            </div>

            {/* Separador */}
            <div className="w-px bg-border" />

            {/* Donut chart Simple vs Formulário */}
            <div className="w-[110px] flex items-center justify-center">
              <ResponsiveContainer width={94} height={94}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Simple', value: simpleTotal, color: 'hsl(var(--primary))' },
                      { name: 'Formulário', value: formularioTotal, color: 'hsl(var(--primary-dark))' },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={24}
                    outerRadius={44}
                    stroke="hsl(var(--card))"
                    strokeWidth={1}
                  >
                    <Cell fill="hsl(var(--primary))" />
                    <Cell fill="hsl(var(--primary-dark))" />
                  </Pie>
                  <RechartsTooltip
                    position={{ x: -105, y: 27 }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-card border rounded-lg shadow-lg p-2 text-xs">
                            <p className="font-bold">{data.name}</p>
                            <p className="text-muted-foreground">{data.value} empresas</p>
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
          <KPICard
            title="Por contactar"
            value={aggregatedMetrics.funnelTotals.porContactar}
            icon={MailWarning}
            unit="Aguardam primeiro email"
          />
        </div>

        {/* Funil Global + Gráfico Pegadas */}
        <div className="flex gap-4 mb-8">
          <div className={cn(elements.sectionCard, "flex-[2] rounded-md hover:shadow-lg hover:border-primary/25 transition-all duration-200")}>
            <p className="text-xs font-normal text-muted-foreground mb-4">Progresso de onboarding global</p>
            <GlobalFunnelBar metrics={aggregatedMetrics.funnelTotals} />
          </div>
          <div className={cn(elements.sectionCard, "flex-1 rounded-md flex flex-col hover:shadow-lg hover:border-primary/25 transition-all duration-200")}>
            <div className="flex-1 min-h-0">
              <ActivityLineChart data={aggregatedMetrics.globalWeeklyCompletions} clientId="global" />
            </div>
            <Separator className="my-4" />
            <p className="text-xs text-muted-foreground text-center">Pegadas completadas globais</p>
          </div>
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

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
                {(typeFilter !== 'todos' || statusFilter !== 'ativos') && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                    {[typeFilter !== 'todos', statusFilter !== 'ativos'].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56">
              <div className="space-y-4">
                {/* Tipo */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-muted-foreground">Tipo</p>
                  <div className="flex flex-wrap gap-1">
                    {(['todos', 'municipio', 'empresa'] as const).map((type) => (
                      <Button
                        key={type}
                        variant={typeFilter === type ? 'default' : 'outline'}
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setTypeFilter(type)}
                      >
                        {type === 'todos' ? 'Todos' : type === 'municipio' ? 'Municípios' : 'Empresas'}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Status */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-muted-foreground">Status</p>
                  <div className="flex flex-wrap gap-1">
                    {(['ativos', 'arquivados', 'todos'] as const).map((status) => (
                      <Button
                        key={status}
                        variant={statusFilter === status ? 'default' : 'outline'}
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setStatusFilter(status)}
                      >
                        {status === 'ativos' ? 'Ativos' : status === 'arquivados' ? 'Arquivados' : 'Todos'}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Grid de Cards de Clientes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

// Função auxiliar para calcular alertas do cliente
const getClientAlerts = (client: Client, conversionRate: number) => {
  const alerts: Array<{ type: string; message: string; icon: typeof AlertTriangle; color: string }> = [];

  // Email bounces
  if ((client.metrics.emailBounces ?? 0) > 0) {
    alerts.push({
      type: 'bounce',
      message: `${client.metrics.emailBounces} emails falharam`,
      icon: AlertTriangle,
      color: 'text-destructive',
    });
  }

  // Inatividade (> 14 dias)
  if (client.metrics.lastActivity) {
    const daysSince = Math.floor((Date.now() - client.metrics.lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince > 14) {
      alerts.push({
        type: 'inactivity',
        message: `Sem atividade há ${daysSince} dias`,
        icon: Clock,
        color: 'text-warning',
      });
    }
  }

  // Conversão crítica (< 10%)
  if (conversionRate < 10 && conversionRate > 0) {
    alerts.push({
      type: 'conversion',
      message: `Conversão crítica (${conversionRate}%)`,
      icon: TrendingDown,
      color: 'text-warning',
    });
  }

  // Muitos por contactar (> 50)
  if (client.metrics.funnelStats.porContactar > 50) {
    alerts.push({
      type: 'pending',
      message: `${client.metrics.funnelStats.porContactar} empresas por contactar`,
      icon: Mail,
      color: 'text-muted-foreground',
    });
  }

  return alerts;
};

// Componente: Gráfico de área de atividade (Recharts)
interface ActivityLineChartProps {
  data: number[];
  clientId: string;
}

const ActivityLineChart = ({ data, clientId }: ActivityLineChartProps) => {
  // Adicionar pequeno offset para evitar valores exactamente 0
  // Isto previne que a linha toque no fundo absoluto do gráfico
  const chartData = data.map((value, index) => {
    const weeksAgo = data.length - 1 - index;
    const date = new Date();
    date.setDate(date.getDate() - (weeksAgo * 7));
    return {
      week: `S${index + 1}`,
      date: date.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' }),
      completions: value + 0.1,
    };
  });

  const gradientId = `fillCompletions-${clientId}`;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--status-complete))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--status-complete))" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <RechartsTooltip
          content={({ active, payload }) => {
            if (active && payload?.length) {
              const value = Math.round((payload[0].value as number) - 0.1);
              const date = payload[0].payload.date;
              return (
                <div className="bg-popover border rounded px-2 py-1 text-xs shadow-md">
                  <p className="text-muted-foreground">{date}</p>
                  <p><span className="font-bold">{value}</span> pegadas</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Area
          dataKey="completions"
          type="natural"
          fill={`url(#${gradientId})`}
          fillOpacity={0.4}
          stroke="hsl(var(--status-complete))"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </AreaChart>
    </ResponsiveContainer>
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

  // Alertas
  const alerts = getClientAlerts(client, conversionRate);

  // Cor condicional para conversão
  const conversionColor = conversionRate >= 30 ? 'text-success' : 'text-warning';

  return (
    <div className={cn(
      elements.sectionCard,
      "p-5 transition-all hover:shadow-lg",
      client.isArchived && "opacity-60"
    )}>
      {/* Header do card */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar/Logo */}
        <div className="w-14 h-14 rounded-md flex items-center justify-center overflow-hidden shrink-0 bg-card border shadow-md">
          {client.logo ? (
            <img
              src={client.logo}
              alt={client.name}
              className="w-full h-full object-contain p-2 dark:invert"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={cn(client.logo && "hidden")}>
            {client.type === 'municipio'
              ? <MapPin className="h-7 w-7 text-primary" />
              : <Building2 className="h-7 w-7 text-secondary-foreground" />
            }
          </div>
        </div>
        <div className="min-w-0 flex-1 self-center">
          <h3 className="font-bold text-foreground text-lg line-clamp-1">{client.name}</h3>
          {client.isArchived && (
            <p className="text-sm text-warning">Arquivado</p>
          )}
        </div>
        {/* Ícone tipo (estilo KPI) */}
        <div className="p-1.5 rounded shrink-0 bg-primary/10">
          {client.type === 'municipio'
            ? <Landmark className="h-4 w-4 text-primary" />
            : <Building2 className="h-4 w-4 text-primary" />
          }
        </div>
      </div>

      {/* Métricas em mini-cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* Grelha 2x2 */}
        <div className="grid grid-cols-2 gap-3 col-span-2">
          <div className={cn("border bg-card rounded-md px-3 py-2 flex items-center justify-between", shadows.sm)}>
            <span className="text-xs text-muted-foreground">Empresas</span>
            <span className="text-sm font-bold text-foreground">{client.metrics.totalCompanies}</span>
          </div>
          <div className={cn("border bg-card rounded-md px-3 py-2 flex items-center justify-between", shadows.sm)}>
            <span className="text-xs text-muted-foreground">Conversão</span>
            <span className={cn("text-sm font-bold", conversionColor)}>{conversionRate}%</span>
          </div>
          <div className={cn("border bg-card rounded-md px-3 py-2 flex items-center justify-between", shadows.sm)}>
            <span className="text-xs text-muted-foreground">Último acesso</span>
            <span className="text-sm font-bold text-foreground">
              {client.metrics.lastActivity
                ? `há ${Math.floor((Date.now() - client.metrics.lastActivity.getTime()) / (1000 * 60 * 60 * 24))}d`
                : '—'}
            </span>
          </div>
          <div className={cn("border bg-card rounded-md px-3 py-2 flex items-center justify-between", shadows.sm)}>
            <span className="text-xs text-muted-foreground">Alertas</span>
            <span className={cn("text-sm font-bold", alerts.length > 0 ? "text-warning" : "text-success")}>
              {alerts.length > 0 ? alerts.length : 'OK'}
            </span>
          </div>
        </div>
        {/* Gráfico à direita */}
        <div className={cn("border rounded-md p-3 bg-card", shadows.sm)}>
          <div className="h-12">
            {client.metrics.weeklyCompletions && (
              <ActivityLineChart data={client.metrics.weeklyCompletions} clientId={client.id} />
            )}
          </div>
          <Separator className="my-2 -mx-3 w-[calc(100%+1.5rem)]" />
          <p className="text-xs text-muted-foreground text-center">Pegadas completadas</p>
        </div>
      </div>

      {/* Mini funil com ramificação */}
      <div className={cn("border bg-card rounded-md p-3 mb-4", shadows.sm)}>
        <p className="text-xs text-muted-foreground mb-2">Onboarding</p>
        <MiniFunnelBar stats={client.metrics.funnelStats} showBranches />
      </div>

      {/* Botões em linha */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil className="h-4 w-4 mr-1.5" />
          Editar
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Archive className="h-4 w-4 mr-1.5" />
              Arquivar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {client.isArchived ? 'Desarquivar cliente?' : 'Arquivar cliente?'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {client.isArchived
                  ? `Tem a certeza que quer desarquivar "${client.name}"? O cliente voltará a aparecer na lista de clientes ativos.`
                  : `Tem a certeza que quer arquivar "${client.name}"? O cliente deixará de aparecer na lista principal.`
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={onToggleArchive}>
                {client.isArchived ? 'Desarquivar' : 'Arquivar'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button
          variant="default"
          className="flex-1"
          onClick={onEnter}
          disabled={client.isArchived}
        >
          <LayoutDashboard className="h-4 w-4 mr-1.5" />
          Dashboard
        </Button>
      </div>
    </div>
  );
};

// Componente: Mini Funil com ramificação opcional
interface MiniFunnelBarProps {
  stats: Client['metrics']['funnelStats'];
  showBranches?: boolean;
}

const MiniFunnelBar = ({ stats, showBranches = false }: MiniFunnelBarProps) => {
  const preTotal = stats.porContactar + stats.semInteracao + stats.interessada;
  const simpleTotal = stats.simple.registada + stats.simple.emProgresso + stats.simple.completo;
  const formularioTotal = stats.formulario.emProgresso + stats.formulario.completo;
  const postTotal = simpleTotal + formularioTotal;
  const grandTotal = preTotal + postTotal;

  if (grandTotal === 0) {
    return <div className="h-2 bg-muted rounded-full" />;
  }

  // Se não mostrar branches, usar barra simples agregada
  if (!showBranches) {
    const segments = [
      { key: 'porContactar', value: stats.porContactar, color: 'bg-status-pending' },
      { key: 'semInteracao', value: stats.semInteracao, color: 'bg-status-contacted' },
      { key: 'interessada', value: stats.interessada, color: 'bg-status-interested' },
      { key: 'registada', value: stats.simple.registada, color: 'bg-status-registered' },
      { key: 'emProgresso', value: stats.simple.emProgresso + stats.formulario.emProgresso, color: 'bg-status-progress' },
      { key: 'completo', value: stats.simple.completo + stats.formulario.completo, color: 'bg-status-complete' },
    ].filter(s => s.value > 0);

    return (
      <div className="h-2 flex gap-px rounded-full overflow-hidden">
        {segments.map((segment, index) => (
          <div
            key={segment.key}
            className={cn(
              segment.color,
              index === 0 && "rounded-l-sm",
              index === segments.length - 1 && "rounded-r-sm"
            )}
            style={{ width: `${(segment.value / grandTotal) * 100}%` }}
          />
        ))}
      </div>
    );
  }

  // Com ramificação
  const leftPercent = postTotal === 0 ? 100 : preTotal === 0 ? 0 : (preTotal / grandTotal) * 100;
  const rightPercent = preTotal === 0 ? 100 : postTotal === 0 ? 0 : (postTotal / grandTotal) * 100;
  // Para tamanhos proporcionais dos ramos
  const maxBranch = Math.max(simpleTotal, formularioTotal);

  return (
    <div className="flex items-center gap-2">
      {/* Fase pré-decisão */}
      {preTotal > 0 && (() => {
        const preSegments = [
          { key: 'pending', value: stats.porContactar, color: 'bg-status-pending' },
          { key: 'contacted', value: stats.semInteracao, color: 'bg-status-contacted' },
          { key: 'interested', value: stats.interessada, color: 'bg-status-interested' },
        ].filter(s => s.value > 0);

        return (
          <>
            <div style={{ width: `${leftPercent}%` }}>
              <div className="h-2.5 flex gap-px">
                {preSegments.map((segment, index) => (
                  <div
                    key={segment.key}
                    className={cn(
                      segment.color,
                      index === 0 && "rounded-l-sm",
                      index === preSegments.length - 1 && "rounded-r-sm"
                    )}
                    style={{ width: `${(segment.value / preTotal) * 100}%` }}
                  />
                ))}
              </div>
            </div>
            {postTotal > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
            )}
          </>
        );
      })()}

      {/* Fase pós-decisão com ramificação */}
      {postTotal > 0 && (
        <div style={{ width: `${rightPercent}%` }} className="space-y-1">
          {/* Ramo Simple */}
          {simpleTotal > 0 && (() => {
            const simpleSegments = [
              { key: 'registered', value: stats.simple.registada, color: 'bg-status-registered' },
              { key: 'progress', value: stats.simple.emProgresso, color: 'bg-status-progress' },
              { key: 'complete', value: stats.simple.completo, color: 'bg-status-complete' },
            ].filter(s => s.value > 0);

            // Largura proporcional ao máximo dos ramos
            const branchWidth = (simpleTotal / maxBranch) * 100;

            return (
              <div className="flex items-center gap-1.5">
                <div
                  className="h-2.5 flex gap-px"
                  style={{ width: `${branchWidth}%` }}
                >
                  {simpleSegments.map((segment, index) => (
                    <div
                      key={segment.key}
                      className={cn(
                        segment.color,
                        index === 0 && "rounded-l-sm",
                        index === simpleSegments.length - 1 && "rounded-r-sm"
                      )}
                      style={{ width: `${(segment.value / simpleTotal) * 100}%` }}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-foreground font-bold shrink-0">S</span>
              </div>
            );
          })()}
          {/* Ramo Simple vazio */}
          {simpleTotal === 0 && (
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 flex-1 rounded-sm border border-dashed border-muted-foreground/30" />
              <span className="text-[10px] text-muted-foreground/50 font-bold shrink-0">S</span>
            </div>
          )}

          {/* Ramo Formulário */}
          {formularioTotal > 0 && (() => {
            const formularioSegments = [
              { key: 'progress', value: stats.formulario.emProgresso, color: 'bg-status-progress' },
              { key: 'complete', value: stats.formulario.completo, color: 'bg-status-complete' },
            ].filter(s => s.value > 0);

            // Largura proporcional ao máximo dos ramos
            const branchWidth = (formularioTotal / maxBranch) * 100;

            return (
              <div className="flex items-center gap-1.5">
                <div
                  className="h-2.5 flex gap-px"
                  style={{ width: `${branchWidth}%` }}
                >
                  {formularioSegments.map((segment, index) => (
                    <div
                      key={segment.key}
                      className={cn(
                        segment.color,
                        index === 0 && "rounded-l-sm",
                        index === formularioSegments.length - 1 && "rounded-r-sm"
                      )}
                      style={{ width: `${(segment.value / formularioTotal) * 100}%` }}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-foreground font-bold shrink-0">F</span>
              </div>
            );
          })()}
          {/* Ramo Formulário vazio */}
          {formularioTotal === 0 && (
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 flex-1 rounded-sm border border-dashed border-muted-foreground/30" />
              <span className="text-[10px] text-muted-foreground/50 font-bold shrink-0">F</span>
            </div>
          )}
        </div>
      )}
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
