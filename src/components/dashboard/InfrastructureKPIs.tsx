import { Card } from '@/components/ui/card';
import { Zap, Recycle, Bike, Leaf } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { mockInfrastructure } from '@/data/mockInfrastructure';

export const InfrastructureKPIs = () => {
  const { user, isMunicipio } = useUser();
  
  // Município sempre vê apenas os seus próprios dados
  const data = mockInfrastructure.find(m => m.municipality === user.municipality);
  
  // Se não houver dados ou não for município, não renderiza
  if (!data || !isMunicipio) return null;

  const kpis = [
    {
      label: 'Postos de Carregamento',
      value: data.chargingStations,
      icon: Zap,
      bgColor: 'bg-cyan-500/10',
      iconColor: 'text-cyan-600'
    },
    {
      label: 'Ecopontos',
      value: data.ecoPoints,
      icon: Recycle,
      bgColor: 'bg-teal-500/10',
      iconColor: 'text-teal-600'
    },
    {
      label: 'Estações de Bicicletas',
      value: data.bikeStations,
      icon: Bike,
      bgColor: 'bg-cyan-500/10',
      iconColor: 'text-cyan-600'
    },
    {
      label: 'Contentores Orgânicos',
      value: data.organicBins,
      icon: Leaf,
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.label} className="p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
                <div className={`${kpi.bgColor} ${kpi.iconColor} p-1.5 rounded`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">
                  {kpi.value.toLocaleString('pt-PT')}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
