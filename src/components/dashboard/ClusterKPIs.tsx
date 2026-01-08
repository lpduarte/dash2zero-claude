import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Supplier } from "@/types/supplier";
import { TrendingDown, Factory, Zap, Building2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import { getClusterInfo, clusterIcons, clusterLabels, ClusterType } from "@/config/clusters";

interface ClusterKPIsProps {
  suppliers: Supplier[];
  totalCompaniesInGroup?: number;
}

export const ClusterKPIs = ({ suppliers, totalCompaniesInGroup = 15000 }: ClusterKPIsProps) => {
  const { userType } = useUser();
  
  const getClusterLabel = (cluster: string) => {
    const info = getClusterInfo(userType, cluster as ClusterType);
    return info?.labelPlural || clusterLabels[cluster] || cluster;
  };
  
  const getClusterIconComponent = (cluster: string) => {
    const info = getClusterInfo(userType, cluster as ClusterType);
    return info?.icon || clusterIcons[cluster as keyof typeof clusterIcons] || Factory;
  };

  const clusterColors = {
    fornecedor: { 
      bg: 'bg-primary/5',
      border: 'border-primary/50',
      icon: 'bg-primary/10',
      iconColor: 'text-primary',
      text: 'text-primary',
      badge: 'bg-primary',
      bar: 'bg-primary'
    },
    cliente: { 
      bg: 'bg-success/5',
      border: 'border-success/50',
      icon: 'bg-success/10',
      iconColor: 'text-success',
      text: 'text-success',
      badge: 'bg-success',
      bar: 'bg-success'
    },
    parceiro: { 
      bg: 'bg-warning/5',
      border: 'border-warning/50',
      icon: 'bg-warning/10',
      iconColor: 'text-warning',
      text: 'text-warning',
      badge: 'bg-warning',
      bar: 'bg-warning'
    },
    subcontratado: { 
      bg: 'bg-accent/5',
      border: 'border-accent/50',
      icon: 'bg-accent/10',
      iconColor: 'text-accent',
      text: 'text-accent',
      badge: 'bg-accent',
      bar: 'bg-accent'
    },
  };

  const clusters = ['fornecedor', 'cliente', 'parceiro', 'subcontratado'] as const;

  const getClusterData = (clusterType: typeof clusters[number]) => {
    const clusterSuppliers = suppliers.filter(s => s.cluster === clusterType);
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
      responseRate: totalCompaniesInGroup ? (clusterSuppliers.length / totalCompaniesInGroup * 100).toFixed(1) : '0',
    };
  };

  const allClustersData = clusters.map(cluster => ({
    cluster,
    ...getClusterData(cluster),
  }));

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            KPIs por Cluster do Banco Montepio/Município
          </CardTitle>
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
                        <span className="text-muted-foreground flex items-center gap-1">
                          <TrendingDown className="h-3 w-3" />
                          Total Emissões
                        </span>
                        <span className="font-semibold">{totalEmissions.toFixed(0)} t</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Factory className="h-3 w-3" />
                          Média/Empresa
                        </span>
                        <span className="font-semibold">{avgEmissions.toFixed(0)} t</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="fornecedor" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {clusters.map(cluster => (
            <TabsTrigger key={cluster} value={cluster}>
              {getClusterLabel(cluster)}
            </TabsTrigger>
          ))}
        </TabsList>

        {clusters.map(cluster => {
          const data = getClusterData(cluster);
          const Icon = getClusterIconComponent(cluster);
          
          return (
            <TabsContent key={cluster} value={cluster}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    Análise Detalhada - {getClusterLabel(cluster)}
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
                        <p className="text-3xl font-bold text-primary">{data.totalEmissions.toFixed(0)}</p>
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
                        <p className="text-3xl font-bold text-warning">{data.avgEmissionsPerEmployee.toFixed(1)}</p>
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
                          <Badge variant="outline">{data.avgCertifications.toFixed(1)}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Taxa de Resposta</span>
                          <Badge className="bg-primary">{data.responseRate}%</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-border rounded-lg bg-card">
                      <h4 className="font-semibold mb-3">Performance do Cluster</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Média de Emissões</span>
                            <span className="font-medium">{data.avgEmissions.toFixed(0)} t CO₂e</span>
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
