import { useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Zap,
  Recycle,
  Bike,
  Leaf,
  Route,
  Bus,
  Wind,
  Settings,
  Link,
  PenLine,
  RefreshCw,
  LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { shadows } from '@/lib/styles';

// Keys for each infrastructure type
export type InfrastructureKey =
  | 'chargingStations'
  | 'ecoPoints'
  | 'bikeStations'
  | 'organicBins'
  | 'cycleways'
  | 'publicTransport'
  | 'airQuality';

export type InfrastructureVisibility = Record<InfrastructureKey, boolean>;

const STORAGE_KEY = 'dash2zero-infrastructure-visibility';
const VALUES_STORAGE_KEY = 'dash2zero-infrastructure-values';
const SOURCES_STORAGE_KEY = 'dash2zero-infrastructure-sources';

// Default: all visible
const defaultVisibility: InfrastructureVisibility = {
  chargingStations: true,
  ecoPoints: true,
  bikeStations: true,
  organicBins: true,
  cycleways: true,
  publicTransport: true,
  airQuality: true,
};

export const getInfrastructureVisibility = (): InfrastructureVisibility => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultVisibility, ...JSON.parse(stored) };
    }
  } catch {
    // ignore
  }
  return defaultVisibility;
};

const saveVisibility = (visibility: InfrastructureVisibility) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(visibility));
};

// Default values for infrastructure
interface InfrastructureValues {
  chargingStations: string;
  ecoPoints: string;
  bikeStations: string;
  organicBins: string;
  cycleways: string;
  publicTransport: string;
  airQuality: string;
}

const defaultValues: InfrastructureValues = {
  chargingStations: '89',
  ecoPoints: '245',
  bikeStations: '52',
  organicBins: '178',
  cycleways: '47.3',
  publicTransport: '312',
  airQuality: 'Bom',
};

const getStoredValues = (): InfrastructureValues => {
  try {
    const stored = localStorage.getItem(VALUES_STORAGE_KEY);
    if (stored) {
      return { ...defaultValues, ...JSON.parse(stored) };
    }
  } catch {
    // ignore
  }
  return defaultValues;
};

const saveValues = (values: InfrastructureValues) => {
  localStorage.setItem(VALUES_STORAGE_KEY, JSON.stringify(values));
};

// Source types for each infrastructure
type SourceType = 'api' | 'manual';

interface InfrastructureSources {
  chargingStations: SourceType;
  bikeStations: SourceType;
  airQuality: SourceType;
}

const defaultSources: InfrastructureSources = {
  chargingStations: 'api',
  bikeStations: 'api',
  airQuality: 'api',
};

const getStoredSources = (): InfrastructureSources => {
  try {
    const stored = localStorage.getItem(SOURCES_STORAGE_KEY);
    if (stored) {
      return { ...defaultSources, ...JSON.parse(stored) };
    }
  } catch {
    // ignore
  }
  return defaultSources;
};

const saveSources = (sources: InfrastructureSources) => {
  localStorage.setItem(SOURCES_STORAGE_KEY, JSON.stringify(sources));
};

// Icon box component (like KPI cards)
const IconBox = ({ icon: Icon }: { icon: LucideIcon }) => (
  <div className="p-2 rounded-lg bg-primary/10">
    <Icon className="h-5 w-5 text-primary" />
  </div>
);

// Manual source label component
const ManualSourceLabel = () => (
  <div className="flex items-center gap-2">
    <PenLine className="h-4 w-4 text-muted-foreground" />
    <span className="text-sm text-muted-foreground">Fonte: Inserção manual</span>
  </div>
);

// Source selector for API-capable infrastructures
const SourceSelector = ({
  source,
  apiLabel,
  onSourceChange,
}: {
  source: SourceType;
  apiLabel: string;
  onSourceChange: (source: SourceType) => void;
}) => (
  <div className="flex items-center gap-2">
    {source === 'api' ? (
      <Link className="h-4 w-4 text-muted-foreground" />
    ) : (
      <PenLine className="h-4 w-4 text-muted-foreground" />
    )}
    <span className="text-sm text-muted-foreground">Fonte:</span>
    <Select
      value={source}
      onValueChange={(value: SourceType) => onSourceChange(value)}
    >
      <SelectTrigger className="w-44 h-8">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="api">{apiLabel}</SelectItem>
        <SelectItem value="manual">Inserção manual</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

// Visibility toggle component
const VisibilityToggle = ({
  isVisible,
  onToggle,
}: {
  isVisible: boolean;
  onToggle: () => void;
}) => (
  <div className="flex items-center gap-2">
    <span className="text-sm w-20 text-right">
      {isVisible ? 'Listado' : 'Removido'}
    </span>
    <Switch
      checked={isVisible}
      onCheckedChange={onToggle}
    />
  </div>
);

// Infrastructure card component
const InfrastructureCard = ({
  icon,
  title,
  description,
  unit,
  allowDecimal,
  isApiCapable = false,
  apiLabel,
  apiLastUpdate,
  isVisible,
  isApiSource,
  value,
  source,
  onToggleVisibility,
  onValueChange,
  onValueBlur,
  onSourceChange,
  onRefresh,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  unit?: string;
  allowDecimal?: boolean;
  isApiCapable?: boolean;
  apiLabel?: string;
  apiLastUpdate?: string;
  isVisible: boolean;
  isApiSource: boolean;
  value: string;
  source?: SourceType;
  onToggleVisibility: () => void;
  onValueChange: (value: string) => void;
  onValueBlur: () => void;
  onSourceChange?: (source: SourceType) => void;
  onRefresh: () => void;
}) => {
  return (
    <div className={`border rounded-lg ${isVisible ? shadows.sm : ''}`}>
      {/* Header with toggle - always full opacity */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-3 transition-opacity ${!isVisible ? 'opacity-40' : ''}`}>
            <IconBox icon={icon} />
            <span className="font-bold">{title}</span>
          </div>
          <VisibilityToggle isVisible={isVisible} onToggle={onToggleVisibility} />
        </div>
      </div>

      {/* Content area - affected by opacity */}
      <div className={`transition-opacity ${!isVisible ? 'opacity-40' : ''}`}>
        {/* Description/disclaimer - below title */}
        <div className="px-4 pb-4">
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Separator */}
        <div className="border-t border-border" />

        {/* Source and value section */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            {isApiCapable && source && onSourceChange ? (
              <SourceSelector
                source={source}
                apiLabel={apiLabel!}
                onSourceChange={onSourceChange}
              />
            ) : (
              <ManualSourceLabel />
            )}

            <div className="flex items-center gap-3">
              <Input
                type="text"
                inputMode={allowDecimal ? 'decimal' : 'numeric'}
                value={value}
                placeholder="0"
                onChange={(e) => onValueChange(e.target.value)}
                onBlur={onValueBlur}
                disabled={isApiSource || !isVisible}
                className="w-24"
              />
              {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
              {isApiSource && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                >
                  <RefreshCw className="h-4 w-4" />
                  Atualizar
                </Button>
              )}
            </div>
          </div>

          {/* API last update info */}
          {isApiSource && apiLastUpdate && (
            <p className="text-xs text-muted-foreground mt-3">
              Última atualização: {apiLastUpdate} · Atualização automática semanal
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

interface ManageInfrastructureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVisibilityChange?: (visibility: InfrastructureVisibility) => void;
}

export const ManageInfrastructureModal = ({
  open,
  onOpenChange,
  onVisibilityChange,
}: ManageInfrastructureModalProps) => {
  // Visibility state
  const [visibility, setVisibility] = useState<InfrastructureVisibility>(getInfrastructureVisibility);

  // Values state
  const [values, setValues] = useState<InfrastructureValues>(getStoredValues);

  // Sources state (for API-capable infrastructures)
  const [sources, setSources] = useState<InfrastructureSources>(getStoredSources);

  const toggleVisibility = (key: InfrastructureKey) => {
    const newVisibility = { ...visibility, [key]: !visibility[key] };
    setVisibility(newVisibility);
    saveVisibility(newVisibility);
    onVisibilityChange?.(newVisibility);
  };

  const updateValue = (key: keyof InfrastructureValues, value: string, allowDecimal: boolean = false) => {
    // Only allow numbers (and decimal point if allowDecimal)
    const regex = allowDecimal ? /^[0-9]*\.?[0-9]*$/ : /^[0-9]*$/;
    if (value !== '' && !regex.test(value)) {
      return; // Reject non-numeric input
    }
    // Only update local state while typing
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const handleValueBlur = (key: InfrastructureKey) => {
    const value = values[key];
    // If empty or zero, set to removed
    if (value === '' || value === '0' || value === '0.0') {
      const newVisibility = { ...visibility, [key]: false };
      setVisibility(newVisibility);
      saveVisibility(newVisibility);
      onVisibilityChange?.(newVisibility);
    }
  };

  // Validate all empty values when modal closes
  const handleModalClose = (open: boolean) => {
    if (!open) {
      // Check all infrastructure values and mark empty ones as removed
      let newVisibility = { ...visibility };
      let hasChanges = false;

      (Object.keys(values) as InfrastructureKey[]).forEach((key) => {
        const value = values[key];
        if (value === '' || value === '0' || value === '0.0') {
          if (newVisibility[key]) {
            newVisibility[key] = false;
            hasChanges = true;
          }
        }
      });

      if (hasChanges) {
        setVisibility(newVisibility);
        saveVisibility(newVisibility);
        onVisibilityChange?.(newVisibility);
      }

      // Save all values
      saveValues(values);
    }
    onOpenChange(open);
  };

  const updateSource = (key: keyof InfrastructureSources, source: SourceType) => {
    const newSources = { ...sources, [key]: source };
    setSources(newSources);
    saveSources(newSources);
  };

  const handleRefreshData = (type: string) => {
    toast.success(`Dados de ${type} atualizados com sucesso`);
  };

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Settings className="h-5 w-5" />
            Gerir Infraestruturas
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">

          {/* Texto introdutório */}
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-primary">
              Estes dados influenciam as medidas de descarbonização disponíveis para as empresas do concelho.
              Infraestruturas existentes permitem recomendar medidas mais eficazes e de menor investimento.
            </p>
          </div>

          {/* Lista de infraestruturas */}
          <div className="space-y-4">

            {/* POSTOS DE CARREGAMENTO - API */}
            <InfrastructureCard
              icon={Zap}
              title="Postos de Carregamento"
              description="A existência de postos de carregamento permite recomendar a transição para frotas elétricas com menor investimento em infraestrutura própria."
              isApiCapable
              apiLabel="API MOBI.E"
              apiLastUpdate="06/01/2026"
              isVisible={visibility.chargingStations}
              isApiSource={sources.chargingStations === 'api'}
              value={values.chargingStations}
              source={sources.chargingStations}
              onToggleVisibility={() => toggleVisibility('chargingStations')}
              onValueChange={(v) => updateValue('chargingStations', v)}
              onValueBlur={() => handleValueBlur('chargingStations')}
              onSourceChange={(s) => updateSource('chargingStations', s)}
              onRefresh={() => handleRefreshData('postos de carregamento')}
            />

            {/* ECOPONTOS - Manual */}
            <InfrastructureCard
              icon={Recycle}
              title="Ecopontos"
              description="Ecopontos próximos facilitam a implementação de programas de separação de resíduos nas empresas, reduzindo emissões do Âmbito 3."
              isVisible={visibility.ecoPoints}
              isApiSource={false}
              value={values.ecoPoints}
              onToggleVisibility={() => toggleVisibility('ecoPoints')}
              onValueChange={(v) => updateValue('ecoPoints', v)}
              onValueBlur={() => handleValueBlur('ecoPoints')}
              onRefresh={() => {}}
            />

            {/* ESTAÇÕES DE BICICLETAS - API com escolha */}
            <InfrastructureCard
              icon={Bike}
              title="Estações de Bicicletas"
              description="Bicicletas partilhadas são alternativa para deslocações de curta distância, reduzindo emissões de mobilidade (Âmbito 1 e 3)."
              isApiCapable
              apiLabel="API GIRA (Lisboa)"
              apiLastUpdate="06/01/2026"
              isVisible={visibility.bikeStations}
              isApiSource={sources.bikeStations === 'api'}
              value={values.bikeStations}
              source={sources.bikeStations}
              onToggleVisibility={() => toggleVisibility('bikeStations')}
              onValueChange={(v) => updateValue('bikeStations', v)}
              onValueBlur={() => handleValueBlur('bikeStations')}
              onSourceChange={(s) => updateSource('bikeStations', s)}
              onRefresh={() => handleRefreshData('estações de bicicletas')}
            />

            {/* CONTENTORES ORGÂNICOS - Manual */}
            <InfrastructureCard
              icon={Leaf}
              title="Contentores Orgânicos"
              description="Recolha seletiva de orgânicos permite compostagem e reduz emissões de metano em aterro. Essencial para empresas de restauração e retalho."
              isVisible={visibility.organicBins}
              isApiSource={false}
              value={values.organicBins}
              onToggleVisibility={() => toggleVisibility('organicBins')}
              onValueChange={(v) => updateValue('organicBins', v)}
              onValueBlur={() => handleValueBlur('organicBins')}
              onRefresh={() => {}}
            />

            {/* CICLOVIAS - Manual */}
            <InfrastructureCard
              icon={Route}
              title="Ciclovias"
              description="Rede ciclável extensa incentiva deslocações em bicicleta para colaboradores, reduzindo emissões de mobilidade casa-trabalho."
              unit="km"
              allowDecimal
              isVisible={visibility.cycleways}
              isApiSource={false}
              value={values.cycleways}
              onToggleVisibility={() => toggleVisibility('cycleways')}
              onValueChange={(v) => updateValue('cycleways', v, true)}
              onValueBlur={() => handleValueBlur('cycleways')}
              onRefresh={() => {}}
            />

            {/* TRANSPORTES PÚBLICOS - Manual */}
            <InfrastructureCard
              icon={Bus}
              title="Paragens Transportes Públicos"
              description="Boa cobertura de transportes públicos facilita programas de mobilidade sustentável e reduz necessidade de estacionamento nas empresas."
              isVisible={visibility.publicTransport}
              isApiSource={false}
              value={values.publicTransport}
              onToggleVisibility={() => toggleVisibility('publicTransport')}
              onValueChange={(v) => updateValue('publicTransport', v)}
              onValueBlur={() => handleValueBlur('publicTransport')}
              onRefresh={() => {}}
            />

            {/* QUALIDADE DO AR - API */}
            <InfrastructureCard
              icon={Wind}
              title="Qualidade do Ar"
              description="Dados de qualidade do ar permitem sensibilizar empresas para o impacto local das emissões e priorizar medidas em zonas mais afetadas."
              isApiCapable
              apiLabel="API QualAr (APA)"
              apiLastUpdate="09/01/2026"
              isVisible={visibility.airQuality}
              isApiSource={sources.airQuality === 'api'}
              value={values.airQuality}
              source={sources.airQuality}
              onToggleVisibility={() => toggleVisibility('airQuality')}
              onValueChange={(v) => updateValue('airQuality', v)}
              onValueBlur={() => handleValueBlur('airQuality')}
              onSourceChange={(s) => updateSource('airQuality', s)}
              onRefresh={() => handleRefreshData('qualidade do ar')}
            />

          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => handleModalClose(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
