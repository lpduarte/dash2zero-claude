import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import {
  Zap,
  Recycle,
  Bike,
  Leaf,
  Route,
  Bus,
  Wind,
  Settings,
  Landmark,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { KPICard } from '@/components/ui/kpi-card';
import { SectionHeader } from '@/components/ui/section-header';
import { ManageInfrastructureModal, getInfrastructureVisibility, getInfrastructureValues, InfrastructureVisibility, InfrastructureValues, InfrastructureKey } from './infrastructure';
import { cn } from '@/lib/utils';

interface KPIDefinition {
  key: InfrastructureKey;
  label: string;
  value: number | string;
  unit?: string;
  icon: typeof Zap;
  iconColor: string;
  iconBgColor: string;
  valueColor?: string;
  inlineSubtitle?: string;
}

export const InfrastructureKPIs = () => {
  const { isMunicipio } = useUser();

  // Estados para modal e colapso
  const [showInfrastructureModal, setShowInfrastructureModal] = useState(false);
  const [isInfrastructureExpanded, setIsInfrastructureExpanded] = useState(true);
  const [visibility, setVisibility] = useState<InfrastructureVisibility>(getInfrastructureVisibility);
  const [infraValues, setInfraValues] = useState<InfrastructureValues>(getInfrastructureValues);

  // Se não for município, não renderiza
  if (!isMunicipio) return null;

  const allKpis: KPIDefinition[] = [
    {
      key: 'chargingStations',
      label: 'Postos de Carregamento',
      value: infraValues.chargingStations,
      icon: Zap,
      iconColor: 'text-primary',
      iconBgColor: 'bg-primary/10'
    },
    {
      key: 'ecoPoints',
      label: 'Ecopontos',
      value: infraValues.ecoPoints,
      icon: Recycle,
      iconColor: 'text-primary',
      iconBgColor: 'bg-primary/10'
    },
    {
      key: 'bikeStations',
      label: 'Estações de Bicicletas',
      value: infraValues.bikeStations,
      icon: Bike,
      iconColor: 'text-primary',
      iconBgColor: 'bg-primary/10'
    },
    {
      key: 'organicBins',
      label: 'Contentores Orgânicos',
      value: infraValues.organicBins,
      icon: Leaf,
      iconColor: 'text-primary',
      iconBgColor: 'bg-primary/10'
    },
    {
      key: 'cycleways',
      label: 'Ciclovias',
      value: infraValues.cycleways,
      unit: 'km',
      icon: Route,
      iconColor: 'text-primary',
      iconBgColor: 'bg-primary/10'
    },
    {
      key: 'publicTransport',
      label: 'Paragens Transportes Públicos',
      value: infraValues.publicTransport,
      icon: Bus,
      iconColor: 'text-primary',
      iconBgColor: 'bg-primary/10'
    },
    {
      key: 'airQuality',
      label: 'Qualidade do Ar',
      value: infraValues.airQuality,
      icon: Wind,
      iconColor: 'text-primary',
      iconBgColor: 'bg-primary/10',
      valueColor: 'text-success'
    }
  ];

  // Filter visible KPIs
  const visibleKpis = allKpis.filter(kpi => visibility[kpi.key]);

  // Dynamic grid based on count
  const getGridClass = (count: number) => {
    if (count <= 3) return 'grid-cols-1 md:grid-cols-3';
    if (count <= 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
  };

  // Split into rows for better layout
  const firstRowCount = Math.min(4, visibleKpis.length);
  const firstRow = visibleKpis.slice(0, firstRowCount);
  const secondRow = visibleKpis.slice(firstRowCount);

  const handleVisibilityChange = (newVisibility: InfrastructureVisibility) => {
    setVisibility(newVisibility);
  };

  const handleValuesChange = (newValues: InfrastructureValues) => {
    setInfraValues(newValues);
  };

  return (
    <>
      <Collapsible open={isInfrastructureExpanded} onOpenChange={setIsInfrastructureExpanded}>
        <Card className="shadow-md">
          <CardHeader className={cn("transition-all duration-[400ms]", isInfrastructureExpanded ? "pb-3" : "pb-6")}>
            <SectionHeader
              icon={Landmark}
              title="Infraestruturas Sustentáveis do Município"
              collapsible
              expanded={isInfrastructureExpanded}
              onToggle={() => setIsInfrastructureExpanded(!isInfrastructureExpanded)}
              actions={visibleKpis.length > 0 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => setShowInfrastructureModal(true)}
                >
                  <Settings className="h-3 w-3" />
                  Gerir infraestruturas
                </Button>
              ) : undefined}
            />
          </CardHeader>

          <CollapsibleContent>
            <CardContent className="pt-0">
              {visibleKpis.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center border border-dashed border-primary/30 rounded-lg bg-primary/5">
                  <h4 className="font-bold text-primary mb-2">Adicione infraestruturas para obter melhores medidas de descarbonização</h4>
                  <p className="text-sm text-primary/80 mb-4">
                    Com estes dados, as recomendações de descarbonização tornam-se de menor investimento para o município.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowInfrastructureModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Listar infraestruturas
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* First row */}
                  <div className={`grid ${getGridClass(firstRow.length)} gap-4`}>
                    {firstRow.map((kpi) => (
                      <KPICard
                        key={kpi.key}
                        title={kpi.label}
                        value={kpi.unit ? `${kpi.value} ${kpi.unit}` : kpi.value}
                        icon={kpi.icon}
                        iconColor={kpi.iconColor}
                        iconBgColor={kpi.iconBgColor}
                        valueColor={kpi.valueColor}
                        inlineSubtitle={kpi.inlineSubtitle}
                      />
                    ))}
                  </div>

                  {/* Second row (if any) */}
                  {secondRow.length > 0 && (
                    <div className={`grid ${getGridClass(secondRow.length)} gap-4`}>
                      {secondRow.map((kpi) => (
                        <KPICard
                          key={kpi.key}
                          title={kpi.label}
                          value={kpi.unit ? `${kpi.value} ${kpi.unit}` : kpi.value}
                          icon={kpi.icon}
                          iconColor={kpi.iconColor}
                          iconBgColor={kpi.iconBgColor}
                          valueColor={kpi.valueColor}
                          inlineSubtitle={kpi.inlineSubtitle}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <ManageInfrastructureModal
        open={showInfrastructureModal}
        onOpenChange={setShowInfrastructureModal}
        onVisibilityChange={handleVisibilityChange}
        onValuesChange={handleValuesChange}
      />
    </>
  );
};
