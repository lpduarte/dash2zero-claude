import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Supplier } from "@/types/supplier";

interface EmissionsBreakdownProps {
  suppliers: Supplier[];
}

export const EmissionsBreakdown = ({ suppliers }: EmissionsBreakdownProps) => {
  const totalScope1 = suppliers.reduce((sum, s) => sum + s.scope1, 0);
  const totalScope2 = suppliers.reduce((sum, s) => sum + s.scope2, 0);
  const totalScope3 = suppliers.reduce((sum, s) => sum + s.scope3, 0);
  const total = totalScope1 + totalScope2 + totalScope3;

  const data = [
    { name: "Âmbito 1", value: totalScope1, color: "hsl(var(--scope-1))" },
    { name: "Âmbito 2", value: totalScope2, color: "hsl(var(--scope-2))" },
    { name: "Âmbito 3", value: totalScope3, color: "hsl(var(--scope-3))" },
  ];

  return (
    <div className="flex flex-col h-full">
      <Card className="shadow-sm flex-1">
        <CardHeader>
          <h2 className="text-xl font-semibold">Emissões por âmbito</h2>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="hsl(var(--scope-1))"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `${value.toFixed(2)} t CO₂e`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-3 mt-3">
        {data.map((scope, index) => {
          const percentage = total > 0 ? (scope.value / total) * 100 : 0;
          return (
            <Card key={scope.name} className="p-3 shadow-sm">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">
                  Âmbito {index + 1}
                </div>
                <div className="text-xl font-bold" style={{ color: scope.color }}>
                  {scope.value.toFixed(0)}
                </div>
                <div className="text-xs text-muted-foreground">t CO₂e</div>
                <div className="border-t border-border/50 mt-2 pt-2">
                  <div className="text-sm font-medium" style={{ color: scope.color }}>
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
