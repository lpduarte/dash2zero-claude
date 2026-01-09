import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { Supplier } from "@/types/supplier";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sectorLabels, getSectorsWithCounts } from "@/data/sectors";

interface SectorBenchmarkingProps {
  suppliers: Supplier[];
}
export const SectorBenchmarking = ({
  suppliers
}: SectorBenchmarkingProps) => {
  const [selectedSector, setSelectedSector] = useState<string>("all");

  const sectorsWithCounts = useMemo(() => getSectorsWithCounts(suppliers), [suppliers]);

  // Calculate sector averages
  const sectorAverages = suppliers.reduce((acc, supplier) => {
    if (!acc[supplier.sector]) {
      acc[supplier.sector] = {
        total: 0,
        count: 0,
        suppliers: []
      };
    }
    acc[supplier.sector].total += supplier.totalEmissions;
    acc[supplier.sector].count += 1;
    acc[supplier.sector].suppliers.push(supplier);
    return acc;
  }, {} as Record<string, {
    total: number;
    count: number;
    suppliers: Supplier[];
  }>);

  // Filter suppliers by selected sector
  const filteredSuppliers = selectedSector === "all" 
    ? suppliers 
    : suppliers.filter(s => s.sector === selectedSector);

  // Prepare comparison data for each supplier
  const comparisonData = filteredSuppliers.map(supplier => {
    const sectorAvg = sectorAverages[supplier.sector].total / sectorAverages[supplier.sector].count;
    const deviation = (supplier.totalEmissions - sectorAvg) / sectorAvg * 100;
    const rank = sectorAverages[supplier.sector].suppliers.sort((a, b) => a.totalEmissions - b.totalEmissions).findIndex(s => s.id === supplier.id) + 1;
    return {
      name: supplier.name,
      fullName: supplier.name,
      emissions: supplier.totalEmissions,
      sectorAvg: sectorAvg,
      deviation: deviation,
      sector: sectorLabels[supplier.sector] || supplier.sector,
      sectorKey: supplier.sector,
      rank: rank,
      totalInSector: sectorAverages[supplier.sector].count,
      cluster: supplier.cluster
    };
  }).sort((a, b) => b.deviation - a.deviation);

  const getDeviationColor = (deviation: number) => {
    if (deviation < -20) return "hsl(var(--success))";
    if (deviation < 0) return "hsl(var(--primary))";
    if (deviation < 20) return "hsl(var(--warning))";
    return "hsl(var(--danger))";
  };

  const chartHeight = Math.max(300, comparisonData.length * 14);

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">Comparação com a média da atividade</h2>
              <p className="text-sm text-muted-foreground">
                Desvio das emissões de cada fornecedor em relação à média do seu setor
              </p>
            </div>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-[280px] bg-card border-border">
                <SelectValue placeholder="Filtrar por atividade">
                  <span className="flex items-center justify-between w-full">
                    <span>{selectedSector === 'all' ? 'Todas as atividades' : sectorsWithCounts.find(s => s.sector === selectedSector)?.name}</span>
                    <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      {selectedSector === 'all' ? suppliers.length : sectorsWithCounts.find(s => s.sector === selectedSector)?.count}
                    </span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-card border-border shadow-lg">
                <SelectItem value="all" className="cursor-pointer">
                  <span className="flex items-center justify-between w-full min-w-[220px]">
                    <span>Todas as atividades</span>
                    <span className="ml-4 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      {suppliers.length}
                    </span>
                  </span>
                </SelectItem>
                {sectorsWithCounts.map((s) => (
                  <SelectItem key={s.sector} value={s.sector} className="cursor-pointer">
                    <span className="flex items-center justify-between w-full min-w-[220px]">
                      <span>{s.name}</span>
                      <span className="ml-4 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        {s.count}
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <div className="-ml-4">
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart data={comparisonData} layout="vertical" margin={{ left: 0, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number" 
                tick={{ fill: 'hsl(var(--muted-foreground))' }} 
                label={{ value: 'Desvio (%)', position: 'bottom' }} 
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 8 }} 
                width={280}
                tickLine={false}
                interval={0}
              />
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload || !payload[0]) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                    <p className="font-semibold mb-2">{data.fullName}</p>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">Emissões: </span>
                        <span className="font-bold">{data.emissions.toFixed(0)} t CO₂e</span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Média do Setor: </span>
                        <span className="font-bold">{data.sectorAvg.toFixed(0)} t CO₂e</span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Desvio: </span>
                        <span className={`font-bold ${data.deviation < 0 ? 'text-success' : 'text-danger'}`}>
                          {data.deviation > 0 ? '+' : ''}{data.deviation.toFixed(1)}%
                        </span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Ranking no Setor: </span>
                        <span className="font-bold">{data.rank}º / {data.totalInSector}</span>
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">{data.sector}</Badge>
                        <Badge variant="outline" className="text-xs">{data.cluster}</Badge>
                      </div>
                    </div>
                  </div>
                );
              }} />
              <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
              <Bar dataKey="deviation" radius={[0, 2, 2, 0]} barSize={5}>
                {comparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getDeviationColor(entry.deviation)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};