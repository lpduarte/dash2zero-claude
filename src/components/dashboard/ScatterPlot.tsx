import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from "recharts";
import { Supplier } from "@/types/supplier";

interface ScatterPlotProps {
  suppliers: Supplier[];
}

export const ScatterPlot = ({ suppliers }: ScatterPlotProps) => {
  // Calculate ESG score for each supplier
  const data = suppliers.map(s => {
    const esgScore = (s.hasSBTi ? 40 : 0) + (s.certifications.length * 15);
    return {
      name: s.name,
      esgScore: esgScore,
      revenue: s.revenue,
      emissions: s.totalEmissions,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>ESG Score vs. Volume de Negócios</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="revenue"
              name="Receita"
              unit=" M€"
              label={{ value: 'Receita (Milhões €)', position: 'bottom' }}
            />
            <YAxis
              type="number"
              dataKey="esgScore"
              name="Score ESG"
              label={{ value: 'Score ESG', angle: -90, position: 'insideLeft' }}
            />
            <ZAxis type="number" dataKey="emissions" range={[50, 400]} name="Emissões" unit=" ton" />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-card border rounded-lg p-3 shadow-lg">
                      <p className="font-medium">{data.name}</p>
                      <p className="text-sm">Score ESG: {data.esgScore.toFixed(0)}</p>
                      <p className="text-sm">Receita: {data.revenue.toFixed(1)} M€</p>
                      <p className="text-sm">Emissões: {data.emissions.toFixed(0)} ton</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter
              name="Fornecedores"
              data={data}
              fill="hsl(var(--primary))"
              fillOpacity={0.6}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
