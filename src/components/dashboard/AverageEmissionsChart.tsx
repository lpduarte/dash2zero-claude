import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Supplier } from "@/types/supplier";

interface AverageEmissionsChartProps {
  suppliers: Supplier[];
}

export const AverageEmissionsChart = ({ suppliers }: AverageEmissionsChartProps) => {
  const chartData = suppliers.map(s => ({
    name: s.name.length > 15 ? s.name.substring(0, 12) + '...' : s.name,
    avgEmissions: s.totalEmissions / s.employees,
    totalEmissions: s.totalEmissions,
    employees: s.employees,
  }));

  const getBarColor = (avgEmissions: number) => {
    if (avgEmissions < 5) return "hsl(var(--success))";
    if (avgEmissions < 10) return "hsl(var(--primary))";
    if (avgEmissions < 20) return "hsl(var(--warning))";
    return "hsl(var(--danger))";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emissões Médias por Funcionário</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              label={{ value: 't CO₂e / funcionário', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number, name: string, props: any) => [
                `${value.toFixed(2)} t CO₂e/func`,
                'Média'
              ]}
              labelFormatter={(label: string, payload: any) => {
                if (payload && payload[0]) {
                  const data = payload[0].payload;
                  return `${label} (${data.employees} func, ${data.totalEmissions.toFixed(0)} t total)`;
                }
                return label;
              }}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="avgEmissions" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.avgEmissions)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
