import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Supplier } from "@/types/supplier";
import { sectorLabels } from "@/data/sectors";
interface PerformanceHeatmapProps {
  suppliers: Supplier[];
}
export const PerformanceHeatmap = ({
  suppliers
}: PerformanceHeatmapProps) => {
  const regions = ['north', 'center', 'south', 'islands'];

  // Get unique sectors from suppliers data
  const sectors = [...new Set(suppliers.map(s => s.sector))];
  const getRegionLabel = (region: string) => {
    const labels: Record<string, string> = {
      north: 'Norte',
      center: 'Centro',
      south: 'Sul',
      islands: 'Ilhas'
    };
    return labels[region] || region;
  };
  const getSectorLabel = (sector: string) => {
    return sectorLabels[sector] || sector;
  };
  const getAverageEmissions = (region: string, sector: string) => {
    const filtered = suppliers.filter(s => s.region === region && s.sector === sector);
    if (filtered.length === 0) return null;
    return filtered.reduce((sum, s) => sum + s.totalEmissions, 0) / filtered.length;
  };
  const allEmissions = suppliers.map(s => s.totalEmissions);
  const minEmissions = Math.min(...allEmissions);
  const maxEmissions = Math.max(...allEmissions);
  const getColor = (value: number | null) => {
    if (value === null) return 'bg-muted';
    const normalized = (value - minEmissions) / (maxEmissions - minEmissions);
    if (normalized < 0.2) return 'bg-success';
    if (normalized < 0.4) return 'bg-success/70';
    if (normalized < 0.6) return 'bg-warning/70';
    if (normalized < 0.8) return 'bg-danger/70';
    return 'bg-danger';
  };
  return <Card className="shadow-sm">
      <CardHeader>
        <h2 className="text-xl font-semibold">Desempenho por região</h2>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr>
                <th className="border p-2 text-left font-medium w-[140px]">​</th>
                {regions.map(region => <th key={region} className="border p-2 text-center font-medium w-[100px]">
                    {getRegionLabel(region)}
                  </th>)}
              </tr>
            </thead>
            <tbody>
              {sectors.map(sector => <tr key={sector} className="h-16">
                  <td className="border p-4 font-medium h-16">{getSectorLabel(sector)}</td>
                  {regions.map(region => {
                const avgEmissions = getAverageEmissions(region, sector);
                return <td key={`${sector}-${region}`} className={`border p-4 text-center h-16 ${getColor(avgEmissions)}`}>
                        {avgEmissions ? <div className="text-sm font-medium">
                            {avgEmissions.toFixed(0)}
                            <div className="text-xs opacity-80">t CO₂e</div>
                          </div> : <span className="text-xs text-muted-foreground">N/A</span>}
                      </td>;
              })}
                </tr>)}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-center gap-4 mt-4 text-sm">
          <span className="text-muted-foreground">Legenda:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-success rounded" />
            <span>Excelente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-warning/70 rounded" />
            <span>Médio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-danger rounded" />
            <span>Alto</span>
          </div>
        </div>
      </CardContent>
    </Card>;
};