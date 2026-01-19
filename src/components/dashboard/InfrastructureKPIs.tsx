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
  Landmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { mockInfrastructure } from '@/data/mockInfrastructure';
import { KPICard } from '@/components/ui/kpi-card';
import { SectionHeader } from '@/components/ui/section-header';
import { ManageInfrastructureModal } from './infrastructure';
import { cn } from '@/lib/utils';

export const InfrastructureKPIs = () => {
  const { user, isMunicipio } = useUser();
  
  // Estados para modal e colapso
  const [showInfrastructureModal, setShowInfrastructureModal] = useState(false);
  const [isInfrastructureExpanded, setIsInfrastructureExpanded] = useState(true);
  
  // Município sempre vê apenas os seus próprios dados
  const data = mockInfrastructure.find(m => m.municipality === user.municipality);
  
  // Se não houver dados ou não for município, não renderiza
  if (!data || !isMunicipio) return null;

  const kpisLine1 = [
    {
      label: 'Postos de Carregamento',
      value: data.chargingStations,
      icon: Zap,
      iconColor: 'text-primary',
      iconBgColor: 'bg-primary/10'
    },
    {
      label: 'Ecopontos',
      value: data.ecoPoints,
      icon: Recycle,
      iconColor: 'text-primary',
      iconBgColor: 'bg-primary/10'
    },
    {
      label: 'Estações de Bicicletas',
      value: data.bikeStations,
      icon: Bike,
      iconColor: 'text-primary',
      iconBgColor: 'bg-primary/10'
    },
    {
      label: 'Contentores Orgânicos',
      value: data.organicBins,
      icon: Leaf,
      iconColor: 'text-primary',
      iconBgColor: 'bg-primary/10'
    }
  ];

  const kpisLine2 = [
    {
      label: 'Ciclovias (km)',
      value: 47.3,
      icon: Route,
      iconColor: 'text-primary',
      iconBgColor: 'bg-primary/10'
    },
    {
      label: 'Paragens Transportes Públicos',
      value: 312,
      icon: Bus,
      iconColor: 'text-primary',
      iconBgColor: 'bg-primary/10'
    },
    {
      label: 'Qualidade do Ar',
      value: 'Bom',
      inlineSubtitle: '3 estações',
      icon: Wind,
      iconColor: 'text-primary',
      iconBgColor: 'bg-primary/10',
      valueColor: 'text-success'
    }
  ];

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
              actions={
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => setShowInfrastructureModal(true)}
                >
                  <Settings className="h-3 w-3" />
                  Gerir infraestruturas
                </Button>
              }
            />
          </CardHeader>

          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Linha 1: 4 infraestruturas actuais */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {kpisLine1.map((kpi) => (
                    <KPICard
                      key={kpi.label}
                      title={kpi.label}
                      value={kpi.value.toLocaleString('pt-PT')}
                      icon={kpi.icon}
                      iconColor={kpi.iconColor}
                      iconBgColor={kpi.iconBgColor}
                    />
                  ))}
                </div>
                
                {/* Linha 2: 3 novos KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {kpisLine2.map((kpi) => (
                    <KPICard
                      key={kpi.label}
                      title={kpi.label}
                      value={typeof kpi.value === 'number' ? kpi.value.toLocaleString('pt-PT') : kpi.value}
                      icon={kpi.icon}
                      iconColor={kpi.iconColor}
                      iconBgColor={kpi.iconBgColor}
                      valueColor={kpi.valueColor}
                      inlineSubtitle={kpi.inlineSubtitle}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      
      <ManageInfrastructureModal
        open={showInfrastructureModal}
        onOpenChange={setShowInfrastructureModal}
      />
    </>
  );
};
