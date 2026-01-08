import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Supplier } from "@/types/supplier";
import { getSectorName } from "@/data/sectors";
import { useUser } from "@/contexts/UserContext";
import { getClusterInfo, ClusterType } from "@/config/clusters";

type MetricType = 'total' | 'perRevenue' | 'perEmployee' | 'perArea';

const metricConfig: Record<MetricType, { label: string; title: string; unit: string; tooltip: string }> = {
  total: { 
    label: 'Emissões totais', 
    title: 'Emissões totais por empresa',
    unit: 't CO₂e',
    tooltip: 'Emissões Totais'
  },
  perRevenue: { 
    label: 'Por faturação', 
    title: 'Emissões por faturação',
    unit: 'kg CO₂e/€',
    tooltip: 'Emissões por €'
  },
  perEmployee: { 
    label: 'Por colaborador', 
    title: 'Emissões por colaborador',
    unit: 't CO₂e/colab',
    tooltip: 'Emissões por Colaborador'
  },
  perArea: { 
    label: 'Por área', 
    title: 'Emissões por área',
    unit: 't CO₂e/m²',
    tooltip: 'Emissões por m²'
  },
};

interface SupplierEmissionsChartProps {
  suppliers: Supplier[];
}

export const SupplierEmissionsChart = ({
  suppliers
}: SupplierEmissionsChartProps) => {
  const { userType } = useUser();
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('total');
  
  const getClusterDisplay = (cluster: string) => {
    const info = getClusterInfo(userType, cluster as ClusterType);
    const Icon = info?.icon;
    return {
      label: info?.label || cluster,
      icon: Icon ? <Icon className="h-3 w-3" /> : null
    };
  };

  const getMetricValue = (supplier: Supplier): number => {
    switch (selectedMetric) {
      case 'total': return supplier.totalEmissions;
      case 'perRevenue': return supplier.emissionsPerRevenue;
      case 'perEmployee': return supplier.emissionsPerEmployee;
      case 'perArea': return supplier.emissionsPerArea;
      default: return supplier.totalEmissions;
    }
  };

  const emissionsData = suppliers.map(s => ({
    name: s.name,
    fullName: s.name,
    value: getMetricValue(s),
    totalEmissions: s.totalEmissions,
    emissionsPerRevenue: s.emissionsPerRevenue,
    emissionsPerEmployee: s.emissionsPerEmployee,
    emissionsPerArea: s.emissionsPerArea,
    sector: s.sector,
    cluster: s.cluster
  })).sort((a, b) => b.value - a.value);

  const avgValue = emissionsData.reduce((sum, s) => sum + s.value, 0) / emissionsData.length;

  const getBarColor = (value: number) => {
    if (value < avgValue * 0.5) return "hsl(var(--success))";
    if (value < avgValue) return "hsl(var(--primary))";
    if (value < avgValue * 1.5) return "hsl(var(--warning))";
    return "hsl(var(--danger))";
  };

  const config = metricConfig[selectedMetric];

  const formatValue = (value: number): string => {
    if (selectedMetric === 'perRevenue') {
      return value.toFixed(3);
    }
    if (selectedMetric === 'perArea') {
      return value.toFixed(2);
    }
    return value.toFixed(0);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">{config.title}</h2>
            <p className="text-sm text-muted-foreground">
              Emissões ({config.unit})
            </p>
          </div>
          <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
            {(Object.keys(metricConfig) as MetricType[]).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedMetric(key)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  selectedMetric === key
                    ? 'bg-background text-primary shadow-md border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {metricConfig[key].label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={Math.max(250, emissionsData.length * 14)}>
          <BarChart data={emissionsData} layout="vertical" margin={{
            left: 0,
            right: 20
          }} barSize={5}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" tick={{
              fill: 'hsl(var(--muted-foreground))',
              fontSize: 10
            }} />
            <YAxis dataKey="name" type="category" tick={{
              fill: 'hsl(var(--muted-foreground))',
              fontSize: 10
            }} width={280} interval={0} />
            <Tooltip content={({
              active,
              payload
            }) => {
              if (!active || !payload || !payload[0]) return null;
              const data = payload[0].payload;
              const cluster = getClusterDisplay(data.cluster);
              return (
                <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                  <p className="font-semibold mb-2">{data.fullName}</p>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">{config.tooltip}: </span>
                      <span className="font-bold">{formatValue(data.value)} {config.unit}</span>
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">{getSectorName(data.sector)}</Badge>
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        {cluster.icon}
                        {cluster.label}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {emissionsData.map((entry, index) => <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
