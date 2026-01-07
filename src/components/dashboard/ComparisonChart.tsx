import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Supplier } from "@/types/supplier";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SectorOption {
  sector: string;
  name: string;
  count: number;
}

interface ComparisonChartProps {
  suppliers: Supplier[];
  sectors?: SectorOption[];
  selectedSector?: string;
  onSectorChange?: (sector: string) => void;
}

const SCOPE_COLORS = {
  'Âmbito 1': 'hsl(220 70% 55%)',
  'Âmbito 2': 'hsl(280 60% 60%)',
  'Âmbito 3': 'hsl(25 85% 55%)',
};

export const ComparisonChart = ({
  suppliers,
  sectors = [],
  selectedSector = 'all',
  onSectorChange
}: ComparisonChartProps) => {
  const [visibleScopes, setVisibleScopes] = useState({
    scope1: true,
    scope2: true,
    scope3: true,
  });

  const toggleScope = (scope: 'scope1' | 'scope2' | 'scope3') => {
    setVisibleScopes(prev => ({ ...prev, [scope]: !prev[scope] }));
  };

  const topSuppliers = suppliers;
  const chartData = topSuppliers.map(supplier => ({
    name: supplier.name,
    ...(visibleScopes.scope1 && { 'Âmbito 1': supplier.scope1 }),
    ...(visibleScopes.scope2 && { 'Âmbito 2': supplier.scope2 }),
    ...(visibleScopes.scope3 && { 'Âmbito 3': supplier.scope3 }),
  }));

  return (
    <Card className="p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Comparação de emissões por âmbito</h2>
          <p className="text-sm text-muted-foreground">Emissões (t CO₂e)</p>
        </div>
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[180px] justify-between">
                <span className="flex items-center gap-2">
                  <span className="flex gap-1">
                    {visibleScopes.scope1 && <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: SCOPE_COLORS['Âmbito 1'] }} />}
                    {visibleScopes.scope2 && <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: SCOPE_COLORS['Âmbito 2'] }} />}
                    {visibleScopes.scope3 && <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: SCOPE_COLORS['Âmbito 3'] }} />}
                  </span>
                  Âmbitos
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[180px] p-2 bg-popover" align="start">
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-md cursor-pointer" onClick={() => toggleScope('scope1')}>
                  <Checkbox id="scope1-dd" checked={visibleScopes.scope1} />
                  <Label htmlFor="scope1-dd" className="text-sm cursor-pointer flex items-center gap-1.5 flex-1">
                    <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: SCOPE_COLORS['Âmbito 1'] }} />
                    Âmbito 1
                  </Label>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-md cursor-pointer" onClick={() => toggleScope('scope2')}>
                  <Checkbox id="scope2-dd" checked={visibleScopes.scope2} />
                  <Label htmlFor="scope2-dd" className="text-sm cursor-pointer flex items-center gap-1.5 flex-1">
                    <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: SCOPE_COLORS['Âmbito 2'] }} />
                    Âmbito 2
                  </Label>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-md cursor-pointer" onClick={() => toggleScope('scope3')}>
                  <Checkbox id="scope3-dd" checked={visibleScopes.scope3} />
                  <Label htmlFor="scope3-dd" className="text-sm cursor-pointer flex items-center gap-1.5 flex-1">
                    <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: SCOPE_COLORS['Âmbito 3'] }} />
                    Âmbito 3
                  </Label>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {sectors.length > 0 && onSectorChange && (
            <Select value={selectedSector} onValueChange={onSectorChange}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Filtrar por atividade" />
              </SelectTrigger>
              <SelectContent className="w-[280px]">
                <SelectItem value="all">
                  <div className="flex items-center justify-between w-[230px]">
                    <span>Todas as atividades</span>
                    <span className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded-full min-w-[28px] text-center">{suppliers.length}</span>
                  </div>
                </SelectItem>
                {sectors.map(s => (
                  <SelectItem key={s.sector} value={s.sector}>
                    <div className="flex items-center justify-between w-[230px]">
                      <span>{s.name}</span>
                      <span className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded-full min-w-[28px] text-center">{s.count}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      <div className="flex-1" style={{ minHeight: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={8} barGap={0} barCategoryGap={3}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9, dx: -4 }} 
              angle={-90} 
              textAnchor="end" 
              height={180} 
              interval={0}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} 
              domain={[0, 'auto']} 
              tickCount={8} 
              width={40} 
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            {visibleScopes.scope1 && (
              <Bar 
                dataKey="Âmbito 1" 
                stackId="stack" 
                fill={SCOPE_COLORS['Âmbito 1']} 
                radius={!visibleScopes.scope2 && !visibleScopes.scope3 ? [2, 2, 0, 0] : [0, 0, 0, 0]} 
              />
            )}
            {visibleScopes.scope2 && (
              <Bar 
                dataKey="Âmbito 2" 
                stackId="stack" 
                fill={SCOPE_COLORS['Âmbito 2']} 
                radius={!visibleScopes.scope3 ? [2, 2, 0, 0] : [0, 0, 0, 0]} 
              />
            )}
            {visibleScopes.scope3 && (
              <Bar 
                dataKey="Âmbito 3" 
                stackId="stack" 
                fill={SCOPE_COLORS['Âmbito 3']} 
                radius={[2, 2, 0, 0]} 
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
