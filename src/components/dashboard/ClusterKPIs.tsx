import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Supplier } from "@/types/supplier";
import { TrendingDown, Factory, Zap, Building2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import { getClusterInfo, clusterIcons, clusterLabels } from "@/config/clusters";
import { getClustersByOwnerType } from "@/data/clusters";
import { SectionHeader } from "@/components/ui/section-header";
import { formatNumber, formatPercentage } from "@/lib/formatters";

interface ClusterKPIsProps {
  suppliers: Supplier[];
  totalCompaniesInGroup?: number;
}

export const ClusterKPIs = ({ suppliers, totalCompaniesInGroup = 15000 }: ClusterKPIsProps) => {
  const { userType, isMunicipio } = useUser();

  const dynamicClusters = useMemo(() => {
    const ownerType = isMunicipio ? 'municipio' : 'empresa';
    return getClustersByOwnerType(ownerType);
  }, [isMunicipio]);
  
  const getClusterLabel = (clusterId: string) => {
    const cluster = dynamicClusters.find(c => c.id === clusterId);
    return cluster?.name || clusterLabels[clusterId] || clusterId;
  };
  
  const getClusterIconComponent = (clusterId: string) => {
    const info = getClusterInfo(userType, clusterId);
    return info?.icon || clusterIcons[clusterId as keyof typeof clusterIcons] || Factory;
  };

  const defaultColors = ['primary', 'success', 'warning', 'accent'];
  const clusterColors = useMemo(() => {
    const colors: Record<string, { bg: string; border: string; icon: string; iconColor: string; text: string; badge: string; bar: string }> = {};
    dynamicClusters.forEach((cluster, index) => {
      const colorName = defaultColors[index % defaultColors.length];
      colors[cluster.id] = {
        bg: `bg-${colorName}/5`,
        border: `border-${colorName}/50`,
        icon: `bg-${colorName}/10`,
        iconColor: `text-${colorName}`,
        text: `text-${colorName}`,
        badge: `bg-${colorName}`,
        bar: `bg-${colorName}`
      };
    });
    return colors;
  }, [dynamicClusters]);

  const getClusterData = (clusterId: string) => {
    const clusterSuppliers = suppliers.filter(s => s.clusterId === clusterId);
    const totalEmissions = clusterSuppliers.reduce((sum, s) => sum + s.totalEmissions, 0);
    const avgEmissions = clusterSuppliers.length > 0 ? totalEmissions / clusterSuppliers.length : 0;
    const avgEmissionsPerEmployee = clusterSuppliers.length > 0
      ? clusterSuppliers.reduce((sum, s) => sum + s.emissionsPerEmployee, 0) / clusterSuppliers.length
      : 0;
    const hasSBTiCount = clusterSuppliers.filter(s => s.hasSBTi).length;
    const avgCertifications = clusterSuppliers.length > 0
      ? clusterSuppliers.reduce((sum, s) => sum + s.certifications.length, 0) / clusterSuppliers.length
      : 0;

    return {
      count: clusterSuppliers.length,
      totalEmissions,
      avgEmissions,
      avgEmissionsPerEmployee,
      hasSBTiCount,
      avgCertifications,
      responseRate: totalCompaniesInGroup ? formatPercentage(clusterSuppliers.length / totalCompaniesInGroup * 100, 1) : '0%',
    };
  };

  const allClustersData = dynamicClusters.map(cluster => ({
    cluster: cluster.id,
    clusterName: cluster.name,
    ...getClusterData(cluster.id),
  }));


  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-sm bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/20">
        <CardHeader className="pb-3">
          <SectionHeader
            icon={Building2}
            title="KPIs por Cluster do Banco Montepio/Município"
          />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {allClustersData.map(({ cluster, count, totalEmissions, avgEmissions }) => {
              const Icon = getClusterIconComponent(cluster);
              const colors = clusterColors[cluster];
              
              return (
                <Card key={cluster} className={`${colors.border} ${colors.bg}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${colors.icon} p-3 rounded-lg`}>
                        <Icon className={`h-6 w-6 ${colors.iconColor}`} />
                      </div>
                      <Badge className={colors.badge}>{count}</Badge>
                    </div>
                    
                    <h3 className="font-bold text-lg mb-3">{getClusterLabel(cluster)}</h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <TrendingDown className="h-3 w-3" />
                          Total Emissões
                        </span>
                        <span className="font-semibold">{formatNumber(totalEmissions, 0)} t</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Factory className="h-3 w-3" />
                          Média/Empresa
                        </span>
                        <span className="font-semibold">{formatNumber(avgEmissions, 0)} t</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue={dynamicClusters[0]?.id || 'all'} className="w-full">
        <TabsList className={`grid w-full grid-cols-${dynamicClusters.length}`}>
          {dynamicClusters.map(cluster => (
            <TabsTrigger key={cluster.id} value={cluster.id}>
              {cluster.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {dynamicClusters.map(cluster => {
          const data = getClusterData(cluster.id);
          const Icon = getClusterIconComponent(cluster.id);
          
          return (
            <TabsContent key={cluster.id} value={cluster.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    Análise Detalhada - {cluster.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-primary/30 bg-primary/5">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <TrendingDown className="h-5 w-5 text-primary" />
                          </div>
                          <span className="text-sm text-muted-foreground">Emissões Totais</span>
                        </div>
                        <p className="text-3xl font-bold text-primary">{formatNumber(data.totalEmissions, 0)}</p>
                        <p className="text-xs text-muted-foreground mt-1">t CO₂e</p>
                      </CardContent>
                    </Card>

                    <Card className="border-warning/30 bg-warning/5">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-warning/10 p-2 rounded-lg">
                            <Zap className="h-5 w-5 text-warning" />
                          </div>
                          <span className="text-sm text-muted-foreground">Emissões/Funcionário</span>
                        </div>
                        <p className="text-3xl font-bold text-warning">{formatNumber(data.avgEmissionsPerEmployee, 1)}</p>
                        <p className="text-xs text-muted-foreground mt-1">t CO₂e média</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 mt-6">
                    <div className="p-4 border border-border rounded-lg bg-card">
                      <h4 className="font-semibold mb-3">Compliance & Certificações</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Empresas com SBTi</span>
                          <Badge variant="outline">{data.hasSBTiCount} / {data.count}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Certificações Médias</span>
                          <Badge variant="outline">{formatNumber(data.avgCertifications, 1)}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Taxa de Resposta</span>
                          <Badge className="bg-primary">{data.responseRate}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-border rounded-lg bg-card">
                      <h4 className="font-semibold mb-3">Performance do Cluster</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Média de Emissões</span>
                            <span className="font-medium">{formatNumber(data.avgEmissions, 0)} t CO₂e</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                              style={{ width: `${Math.min((data.avgEmissions / 20000) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};
