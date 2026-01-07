import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts";
import { Supplier } from "@/types/supplier";

interface RadarComparisonProps {
  suppliers: Supplier[];
}

export const RadarComparison = ({ suppliers }: RadarComparisonProps) => {
  // Get top 3 suppliers for comparison
  const topSuppliers = [...suppliers]
    .sort((a, b) => a.totalEmissions - b.totalEmissions)
    .slice(0, 3);

  // Normalize metrics to 0-100 scale
  const maxEmissions = Math.max(...suppliers.map(s => s.totalEmissions));

  const data = [
    {
      metric: 'Baixas Emissões',
      [topSuppliers[0]?.name || 'S1']: 100 - (topSuppliers[0]?.totalEmissions || 0) / maxEmissions * 100,
      [topSuppliers[1]?.name || 'S2']: 100 - (topSuppliers[1]?.totalEmissions || 0) / maxEmissions * 100,
      [topSuppliers[2]?.name || 'S3']: 100 - (topSuppliers[2]?.totalEmissions || 0) / maxEmissions * 100,
    },
    {
      metric: 'Certificações',
      [topSuppliers[0]?.name || 'S1']: Math.min((topSuppliers[0]?.certifications.length || 0) * 25, 100),
      [topSuppliers[1]?.name || 'S2']: Math.min((topSuppliers[1]?.certifications.length || 0) * 25, 100),
      [topSuppliers[2]?.name || 'S3']: Math.min((topSuppliers[2]?.certifications.length || 0) * 25, 100),
    },
    {
      metric: 'Compromisso SBTi',
      [topSuppliers[0]?.name || 'S1']: topSuppliers[0]?.hasSBTi ? 100 : 0,
      [topSuppliers[1]?.name || 'S2']: topSuppliers[1]?.hasSBTi ? 100 : 0,
      [topSuppliers[2]?.name || 'S3']: topSuppliers[2]?.hasSBTi ? 100 : 0,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparação Multi-Critério (Top 3)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar
              name={topSuppliers[0]?.name || 'Supplier 1'}
              dataKey={topSuppliers[0]?.name || 'S1'}
              stroke="hsl(var(--success))"
              fill="hsl(var(--success))"
              fillOpacity={0.3}
            />
            <Radar
              name={topSuppliers[1]?.name || 'Supplier 2'}
              dataKey={topSuppliers[1]?.name || 'S2'}
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
            />
            <Radar
              name={topSuppliers[2]?.name || 'Supplier 3'}
              dataKey={topSuppliers[2]?.name || 'S3'}
              stroke="hsl(var(--secondary))"
              fill="hsl(var(--secondary))"
              fillOpacity={0.3}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
