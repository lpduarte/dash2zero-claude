import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { 
  Zap, 
  Recycle, 
  Bike, 
  Leaf, 
  Route, 
  Bus, 
  Wind,
  Settings,
  ChevronDown,
  Link,
  PenLine,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  Building
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { mockInfrastructure } from '@/data/mockInfrastructure';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export const InfrastructureKPIs = () => {
  const { user, isMunicipio } = useUser();
  
  // Estados para modal e colapso
  const [showInfrastructureModal, setShowInfrastructureModal] = useState(false);
  const [isInfrastructureExpanded, setIsInfrastructureExpanded] = useState(true);
  
  // Valores dos inputs manuais
  const [ecopontosCount, setEcopontosCount] = useState('245');
  const [organicosCount, setOrganicosCount] = useState('178');
  const [cicloviasKm, setCicloviasKm] = useState('47.3');
  const [transportesCount, setTransportesCount] = useState('312');
  
  // Fonte seleccionada para bicicletas
  const [bicicletasSource, setBicicletasSource] = useState('gira');
  
  // Município sempre vê apenas os seus próprios dados
  const data = mockInfrastructure.find(m => m.municipality === user.municipality);
  
  // Se não houver dados ou não for município, não renderiza
  if (!data || !isMunicipio) return null;

  const handleRefreshData = (type: string) => {
    toast.success(`Dados de ${type} actualizados com sucesso`);
  };

  const handleSaveData = (type: string) => {
    toast.success(`${type} guardado com sucesso`);
  };

  const kpisLine1 = [
    {
      label: 'Postos de Carregamento',
      value: data.chargingStations,
      icon: Zap,
      iconColor: 'text-teal-500'
    },
    {
      label: 'Ecopontos',
      value: data.ecoPoints,
      icon: Recycle,
      iconColor: 'text-teal-500'
    },
    {
      label: 'Estações de Bicicletas',
      value: data.bikeStations,
      icon: Bike,
      iconColor: 'text-teal-500'
    },
    {
      label: 'Contentores Orgânicos',
      value: data.organicBins,
      icon: Leaf,
      iconColor: 'text-teal-500'
    }
  ];

  const kpisLine2 = [
    {
      label: 'Ciclovias',
      value: 47.3,
      unit: 'km',
      icon: Route,
      iconColor: 'text-teal-500'
    },
    {
      label: 'Paragens Transportes Públicos',
      value: 312,
      icon: Bus,
      iconColor: 'text-teal-500'
    },
    {
      label: 'Qualidade do Ar',
      value: 'Bom',
      subtitle: '3 estações',
      icon: Wind,
      iconColor: 'text-teal-500',
      valueColor: 'text-green-600'
    }
  ];

  return (
    <>
      <Card className="p-6">
        {/* Header do card */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Building className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg">Infraestruturas Sustentáveis do Município</h3>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Botão Gerir - à esquerda do chevron */}
            <button
              type="button"
              onClick={() => setShowInfrastructureModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <Settings className="h-4 w-4" />
              Gerir infraestruturas
            </button>
            
            {/* Chevron - mesmo estilo dos outros cards */}
            <button
              type="button"
              onClick={() => setIsInfrastructureExpanded(!isInfrastructureExpanded)}
              className="w-9 h-9 rounded-full border border-input bg-background hover:bg-muted/50 flex items-center justify-center transition-colors shrink-0"
            >
              <ChevronDown 
                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                  isInfrastructureExpanded ? '' : 'rotate-180'
                }`} 
              />
            </button>
          </div>
        </div>

        {/* Conteúdo colapsável */}
        {isInfrastructureExpanded && (
          <div className="space-y-4">
            {/* Linha 1: 4 infraestruturas actuais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpisLine1.map((kpi) => {
                const Icon = kpi.icon;
                return (
                  <div key={kpi.label} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{kpi.label}</span>
                      <Icon className={`h-4 w-4 ${kpi.iconColor}`} />
                    </div>
                    <p className="text-2xl font-bold">{kpi.value.toLocaleString('pt-PT')}</p>
                  </div>
                );
              })}
            </div>
            
            {/* Linha 2: 3 novos KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {kpisLine2.map((kpi) => {
                const Icon = kpi.icon;
                return (
                  <div key={kpi.label} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{kpi.label}</span>
                      <Icon className={`h-4 w-4 ${kpi.iconColor}`} />
                    </div>
                    <p className={`text-2xl font-bold ${kpi.valueColor || ''}`}>
                      {typeof kpi.value === 'number' ? kpi.value.toLocaleString('pt-PT') : kpi.value}
                    </p>
                    {kpi.unit && (
                      <p className="text-xs text-muted-foreground">{kpi.unit}</p>
                    )}
                    {kpi.subtitle && (
                      <p className="text-xs text-muted-foreground">{kpi.subtitle}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Modal de Gestão de Infraestruturas */}
      <Dialog open={showInfrastructureModal} onOpenChange={setShowInfrastructureModal}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Settings className="h-5 w-5" />
              Gerir Infraestruturas
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            
            {/* Texto introdutório */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950/30 dark:border-blue-900">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Estes dados influenciam as medidas de descarbonização disponíveis para as empresas do concelho. 
                Infraestruturas existentes permitem recomendar medidas mais eficazes e de menor investimento.
              </p>
            </div>
            
            {/* Lista de infraestruturas */}
            <div className="space-y-4">
              
              {/* POSTOS DE CARREGAMENTO - API */}
              <div className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-teal-500" />
                    <span className="font-medium">Postos de Carregamento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">89</span>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Fonte: API MOBI.E</span>
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full dark:bg-green-900/30 dark:text-green-400">Recomendada</span>
                    </div>
                    <button
                      onClick={() => handleRefreshData('postos')}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-muted transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Actualizar
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Última actualização: 06/01/2026 · Actualização automática semanal
                  </p>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <Info className="h-4 w-4 inline mr-1" />
                      A existência de postos de carregamento permite recomendar a transição para frotas eléctricas 
                      com menor investimento em infraestrutura própria.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* ECOPONTOS - Manual */}
              <div className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Recycle className="h-5 w-5 text-teal-500" />
                    <span className="font-medium">Ecopontos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">245</span>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PenLine className="h-4 w-4 text-amber-500" />
                      <span className="text-sm">Fonte: Inserção manual</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={ecopontosCount}
                        onChange={(e) => setEcopontosCount(e.target.value)}
                        className="w-24 px-3 py-1.5 text-sm border rounded-lg bg-background"
                      />
                      <button
                        onClick={() => handleSaveData('Ecopontos')}
                        className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <Info className="h-4 w-4 inline mr-1" />
                      Ecopontos próximos facilitam a implementação de programas de separação de resíduos 
                      nas empresas, reduzindo emissões do Âmbito 3.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* ESTAÇÕES DE BICICLETAS - API com escolha */}
              <div className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Bike className="h-5 w-5 text-teal-500" />
                    <span className="font-medium">Estações de Bicicletas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">52</span>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Fonte:</span>
                      <Select value={bicicletasSource} onValueChange={setBicicletasSource}>
                        <SelectTrigger className="w-40 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gira">API GIRA (Lisboa)</SelectItem>
                          <SelectItem value="manual">Inserção manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <button
                      onClick={() => handleRefreshData('bicicletas')}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-muted transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Actualizar
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Última actualização: 06/01/2026 · Actualização automática semanal
                  </p>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <Info className="h-4 w-4 inline mr-1" />
                      Bicicletas partilhadas são alternativa para deslocações de curta distância, 
                      reduzindo emissões de mobilidade (Âmbito 1 e 3).
                    </p>
                  </div>
                </div>
              </div>
              
              {/* CONTENTORES ORGÂNICOS - Manual */}
              <div className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Leaf className="h-5 w-5 text-teal-500" />
                    <span className="font-medium">Contentores Orgânicos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">178</span>
                    {organicosCount ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    )}
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PenLine className="h-4 w-4 text-amber-500" />
                      <span className="text-sm">Fonte: Inserção manual</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={organicosCount}
                        onChange={(e) => setOrganicosCount(e.target.value)}
                        className="w-24 px-3 py-1.5 text-sm border rounded-lg bg-background"
                      />
                      <button
                        onClick={() => handleSaveData('Contentores orgânicos')}
                        className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <Info className="h-4 w-4 inline mr-1" />
                      Recolha selectiva de orgânicos permite compostagem e reduz emissões de metano em aterro. 
                      Essencial para empresas de restauração e retalho.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* CICLOVIAS - Manual */}
              <div className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Route className="h-5 w-5 text-teal-500" />
                    <span className="font-medium">Ciclovias</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">47.3</span>
                    <span className="text-sm text-muted-foreground">km</span>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PenLine className="h-4 w-4 text-amber-500" />
                      <span className="text-sm">Fonte: Inserção manual</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        value={cicloviasKm}
                        onChange={(e) => setCicloviasKm(e.target.value)}
                        className="w-24 px-3 py-1.5 text-sm border rounded-lg bg-background"
                      />
                      <span className="text-sm text-muted-foreground">km</span>
                      <button
                        onClick={() => handleSaveData('Ciclovias')}
                        className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <Info className="h-4 w-4 inline mr-1" />
                      Rede ciclável extensa incentiva deslocações em bicicleta para colaboradores, 
                      reduzindo emissões de mobilidade casa-trabalho.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* TRANSPORTES PÚBLICOS - Manual */}
              <div className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Bus className="h-5 w-5 text-teal-500" />
                    <span className="font-medium">Paragens Transportes Públicos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">312</span>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PenLine className="h-4 w-4 text-amber-500" />
                      <span className="text-sm">Fonte: Inserção manual</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={transportesCount}
                        onChange={(e) => setTransportesCount(e.target.value)}
                        className="w-24 px-3 py-1.5 text-sm border rounded-lg bg-background"
                      />
                      <button
                        onClick={() => handleSaveData('Paragens de transportes')}
                        className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <Info className="h-4 w-4 inline mr-1" />
                      Boa cobertura de transportes públicos facilita programas de mobilidade sustentável 
                      e reduz necessidade de estacionamento nas empresas.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* QUALIDADE DO AR - API */}
              <div className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Wind className="h-5 w-5 text-teal-500" />
                    <span className="font-medium">Qualidade do Ar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-green-600">Bom</span>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Fonte: API QualAr (APA)</span>
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full dark:bg-green-900/30 dark:text-green-400">Recomendada</span>
                    </div>
                    <button
                      onClick={() => handleRefreshData('qualidade do ar')}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-muted transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Actualizar
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Última actualização: 09/01/2026 · Actualização automática semanal · 3 estações de monitorização
                  </p>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <Info className="h-4 w-4 inline mr-1" />
                      A qualidade do ar é um indicador do impacto das emissões locais. Concelhos com pior 
                      qualidade devem priorizar mobilidade sustentável e redução de emissões directas.
                    </p>
                  </div>
                </div>
              </div>
              
            </div>
            
          </div>
          
          <DialogFooter>
            <button
              onClick={() => setShowInfrastructureModal(false)}
              className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              Fechar
            </button>
          </DialogFooter>
          
        </DialogContent>
      </Dialog>
    </>
  );
};
