import { useState, useEffect, useMemo } from "react";
import { Leaf, BarChart3, CircleDot, Moon, Sun, TowerControl, ChevronDown, Building2, MapPin, Search, Check } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UserTypeToggle } from "./UserTypeToggle";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Client } from "@/types/user";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userType, setUserType, isGet2C, activeClient, clients, setActiveClient } = useUser();
  const { darkMode, setDarkMode } = useTheme();
  const [clientSwitcherOpen, setClientSwitcherOpen] = useState(false);
  const [clientSearchQuery, setClientSearchQuery] = useState('');

  // Filtrar clientes para o dropdown
  const filteredClients = useMemo(() => {
    if (!clientSearchQuery.trim()) return clients;
    const query = clientSearchQuery.toLowerCase();
    return clients.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.contactEmail.toLowerCase().includes(query)
    );
  }, [clients, clientSearchQuery]);

  // Trocar de cliente
  const handleSelectClient = (selectedClient: Client) => {
    setActiveClient(selectedClient);
    setClientSwitcherOpen(false);
    setClientSearchQuery('');
  };

  // Redirecionar Get2C sem cliente ativo para /admin
  useEffect(() => {
    if (isGet2C && !activeClient && location.pathname !== '/admin') {
      navigate('/admin', { replace: true });
    }
  }, [isGet2C, activeClient, location.pathname, navigate]);

  return (
    <header className="relative overflow-x-clip" style={{ overflowY: 'visible' }}>
      <div className="relative py-6 px-8">

        {/* Pulsing elements - above background, below content */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, overflow: 'visible' }}>
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/50 rounded-full blur-3xl animate-pulse-slow" style={{ transform: 'translate(20%, -70%)' }} />
          <div className="absolute top-0 right-20 w-56 h-56 bg-primary/40 rounded-full blur-3xl animate-pulse-slower" style={{ animationDelay: '1s', transform: 'translateY(-60%)' }} />
          <div className="absolute top-0 right-1/4 w-48 h-48 bg-primary/35 rounded-full blur-3xl animate-pulse-slower" style={{ animationDelay: '0.5s', transform: 'translateY(-50%)' }} />
          <div className="absolute top-0 left-0 w-40 h-40 bg-primary/25 rounded-full blur-3xl animate-pulse-slower" style={{ animationDelay: '2s', transform: 'translate(-30%, -70%)' }} />
          <div className="absolute top-0 left-10 w-36 h-36 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s', transform: 'translateY(-50%)' }} />
        </div>

        {/* Content - above everything */}
        <div className="relative max-w-[1400px] mx-auto" style={{ zIndex: 2 }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Leaf className="h-14 w-14 text-primary" />
              <div>
                <h1 className="text-4xl font-bold text-foreground">dash2zero</h1>
                <p className="text-muted-foreground text-sm">Dashboard de Sustentabilidade</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <UserTypeToggle currentType={userType} onTypeChange={setUserType} />

              <nav className="liquid-glass-container flex gap-2 p-2 rounded-full backdrop-blur-xl">
                {/* Dashboard e Clusters - apenas se não for Get2C OU se tiver cliente ativo (nunca em /admin) */}
                {(!isGet2C || activeClient) && location.pathname !== '/admin' && (
                  <>
                    <Link to="/" className={cn(
                      "liquid-glass-btn relative flex items-center justify-center gap-2 h-9 px-5 rounded-full text-sm font-medium overflow-hidden border border-transparent",
                      location.pathname === "/" ? "active border-primary/25" : "inactive"
                    )}>
                      <BarChart3 className="h-4 w-4 relative z-10" />
                      <span className="relative z-10">Dashboard</span>
                    </Link>
                    <Link to="/clusters" className={cn(
                      "liquid-glass-btn relative flex items-center justify-center gap-2 h-9 px-5 rounded-full text-sm font-medium overflow-hidden border border-transparent",
                      location.pathname === "/clusters" ? "active border-primary/25" : "inactive"
                    )}>
                      <CircleDot className="h-4 w-4 relative z-10" />
                      <span className="relative z-10">Gerir clusters</span>
                    </Link>
                  </>
                )}

                {/* Painel de controlo - apenas para Get2C */}
                {isGet2C && (
                  <Link to="/admin" className={cn(
                    "liquid-glass-btn relative flex items-center justify-center gap-2 h-9 px-5 rounded-full text-sm font-medium overflow-hidden border border-transparent",
                    location.pathname === "/admin" ? "active border-primary/25" : "inactive"
                  )}>
                    <TowerControl className="h-4 w-4 relative z-10" />
                    <span className="relative z-10">Painel de controlo</span>
                  </Link>
                )}
              </nav>

              <div className="liquid-glass-container flex gap-1 p-1.5 rounded-full backdrop-blur-xl">
                <button
                  onClick={() => setDarkMode(false)}
                  className={cn(
                    "liquid-glass-btn relative flex items-center justify-center w-9 h-9 rounded-full text-sm font-medium overflow-hidden border border-transparent",
                    !darkMode ? "active border-primary/25" : "inactive"
                  )}
                  title="Light mode"
                >
                  <Sun className="h-4 w-4 relative z-10" />
                </button>
                <button
                  onClick={() => setDarkMode(true)}
                  className={cn(
                    "liquid-glass-btn relative flex items-center justify-center w-9 h-9 rounded-full text-sm font-medium overflow-hidden border border-transparent",
                    darkMode ? "active border-primary/25" : "inactive"
                  )}
                  title="Dark mode"
                >
                  <Moon className="h-4 w-4 relative z-10" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Glowing line */}
      <div className="relative w-full flex items-center justify-center" style={{ zIndex: 2 }}>
        <div
          className="rounded-full"
          style={{
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, hsl(175 66% 38%) 20%, hsl(175 66% 38%) 80%, transparent 100%)',
            opacity: 0.65,
            boxShadow: '0 0 8px hsl(175 66% 38% / 0.4)',
          }}
        />
      </div>

      {/* Client Switcher - apenas para Get2C com cliente ativo (exceto em /admin) */}
      {isGet2C && activeClient && location.pathname !== '/admin' && (
        <div className="px-8 pt-4">
          <div className="max-w-[1400px] mx-auto flex items-center justify-end">
            <div className="liquid-glass-container flex items-center gap-2 p-1.5 pr-2 rounded-full backdrop-blur-xl">
              <span className="text-sm text-muted-foreground pl-2">A ver como:</span>

              <Popover open={clientSwitcherOpen} onOpenChange={setClientSwitcherOpen}>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "liquid-glass-btn inactive relative flex items-center gap-2 h-8 px-3 rounded-full text-sm overflow-hidden border border-transparent",
                      "hover:bg-primary/10"
                    )}
                  >
                    {activeClient.type === 'municipio'
                      ? <MapPin className="h-4 w-4 text-primary" />
                      : <Building2 className="h-4 w-4 text-primary" />
                    }
                    <span className="font-bold max-w-[200px] truncate">
                      {activeClient.name}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {activeClient.type === 'municipio' ? 'Município' : 'Empresa'}
                    </Badge>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  className="w-80 p-0"
                  align="end"
                  sideOffset={8}
                >
                  {/* Pesquisa */}
                  <div className="p-3 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Pesquisar cliente..."
                        value={clientSearchQuery}
                        onChange={(e) => setClientSearchQuery(e.target.value)}
                        className="pl-9 h-9"
                      />
                    </div>
                  </div>

                  {/* Lista de clientes */}
                  <ScrollArea className="max-h-[300px]">
                    <div className="p-2">
                      {filteredClients.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Nenhum cliente encontrado
                        </p>
                      ) : (
                        filteredClients.map(c => (
                          <button
                            key={c.id}
                            onClick={() => handleSelectClient(c)}
                            className={cn(
                              "w-full flex items-center gap-3 p-2 rounded-md text-left",
                              "hover:bg-muted transition-colors",
                              c.id === activeClient.id && "bg-primary/5"
                            )}
                          >
                            <div className={cn(
                              "w-8 h-8 rounded-md flex items-center justify-center shrink-0",
                              c.type === 'municipio' ? "bg-primary/10" : "bg-muted"
                            )}>
                              {c.type === 'municipio'
                                ? <MapPin className="h-4 w-4 text-primary" />
                                : <Building2 className="h-4 w-4 text-muted-foreground" />
                              }
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm truncate">{c.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {c.metrics.totalCompanies} empresas · {c.metrics.totalClusters} clusters
                              </p>
                            </div>
                            {c.id === activeClient.id && (
                              <Check className="h-4 w-4 text-primary shrink-0" />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
