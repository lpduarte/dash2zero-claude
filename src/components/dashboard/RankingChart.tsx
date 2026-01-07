import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Supplier } from "@/types/supplier";

interface RankingChartProps {
  suppliers: Supplier[];
}

export const RankingChart = ({ suppliers }: RankingChartProps) => {
  // Top 10 suppliers by lowest emissions
  const topSuppliers = [...suppliers]
    .sort((a, b) => a.totalEmissions - b.totalEmissions)
    .slice(0, 10)
    .map(s => ({
      name: s.name,
      emissions: s.totalEmissions,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Fornecedores - Menores Emissões</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={topSuppliers} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" label={{ value: 'Emissões (t CO₂e)', position: 'bottom' }} />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(2)} t CO₂e`, 'Emissões']}
            />
            <Bar dataKey="emissions" radius={[0, 8, 8, 0]} fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
