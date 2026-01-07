import { Card } from "@/components/ui/card";
import { Supplier } from "@/types/supplier";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TrendsChartProps {
  suppliers: Supplier[];
}

export const TrendsChart = ({ suppliers }: TrendsChartProps) => {
  // Top 5 suppliers for cleaner visualization
  const topSuppliers = suppliers.slice(0, 5);
  
  // Get unique years
  const years = Array.from(
    new Set(topSuppliers.flatMap(s => s.yearlyProgress.map(yp => yp.year)))
  ).sort();

  // Transform data for recharts
  const chartData = years.map(year => {
    const dataPoint: any = { year: year.toString() };
    topSuppliers.forEach(supplier => {
      const yearData = supplier.yearlyProgress.find(yp => yp.year === year);
      if (yearData) {
        const shortName = supplier.name.length > 15 
          ? supplier.name.substring(0, 12) + '...' 
          : supplier.name;
        dataPoint[shortName] = yearData.emissions;
      }
    });
    return dataPoint;
  });

  const colors = [
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(var(--accent))',
    'hsl(var(--success))',
    'hsl(var(--warning))',
  ];

  return (
    <Card className="p-6 shadow-md">
      <h2 className="text-xl font-bold mb-4">Tendência de Emissões (2021-2023)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="year" 
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            label={{ value: 'Emissões (t CO₂e)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Legend />
          {topSuppliers.map((supplier, index) => {
            const shortName = supplier.name.length > 15 
              ? supplier.name.substring(0, 12) + '...' 
              : supplier.name;
            return (
              <Line
                key={supplier.id}
                type="monotone"
                dataKey={shortName}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
