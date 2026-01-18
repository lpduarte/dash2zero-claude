import { useState, useEffect } from "react";
import {
  Palette, Type, Square, Layers, MousePointerClick, Tag, LayoutGrid,
  FormInput, ListFilter, BarChart3, AlertCircle, Activity, Columns,
  Table2, PieChart, Star, Moon, Sun, Factory, Building2,
  Zap, TrendingUp, TrendingDown, Download, Filter, Search, Settings,
  Info, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronRight,
  Eye, Mail, Users, Leaf, Copy, Monitor, Code
} from "lucide-react";

// ============================================
// VERSIONING - Update this when making changes
// ============================================
const STYLE_GUIDE_VERSION = {
  major: 1,
  minor: 4,
  patch: 8,
  date: "2026-01-18",
  changelog: [
    "Auto-update via commit",
    "Auto-update via commit",
    "Auto-update via commit",
    "Auto-update via commit",
    "Auto-update via commit",
    "Auto-update via commit",
    "Auto-update via commit",
    "Auto-update via commit",
    "Sistema de cores simplificado: 20 variáveis CSS (vs 35+), aliases Tailwind preservados",
    "Adicionadas cores de Scope, Medalhas e Gráficos; Ícones oficiais das tecnologias"
  ]
};

const getVersionString = () => `v${STYLE_GUIDE_VERSION.major}.${STYLE_GUIDE_VERSION.minor}.${STYLE_GUIDE_VERSION.patch}`;
const getVersionDate = () => {
  const date = new Date(STYLE_GUIDE_VERSION.date);
  return date.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });
};
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { KPICard } from "@/components/ui/kpi-card";
import { riskColors, scopeColors, cardStyles, textStyles, spacing, iconSizes } from "@/lib/styles";
// Recharts
import {
  AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// Technology brand icons (official SVG paths)
const ReactIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85S10.13 13 10.13 12c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 0 1-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9s-1.17 0-1.71.03c-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03s1.17 0 1.71-.03c.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68s-1.83 2.93-4.37 3.68c.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68s1.83-2.93 4.37-3.68c-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26s-1.18-1.63-3.28-2.26c-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26s1.18 1.63 3.28 2.26c.25-.76.55-1.51.89-2.26m9 2.26-.3.51c.31-.05.61-.1.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-9.82-.26c.11.29.22.58.29.86.27-.06.57-.11.88-.16l-.29-.51-.88-.19m9.53-4.51c-.11-.29-.22-.58-.29-.86-.27.06-.57.11-.88.16l.29.51.88.19" />
  </svg>
);

const TypeScriptIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M3 3h18v18H3V3m10.71 14.86c.5.98 1.51 1.73 3.09 1.73 1.6 0 2.8-.83 2.8-2.36 0-1.41-.81-2.04-2.25-2.66l-.42-.18c-.73-.31-1.04-.52-1.04-1.02 0-.41.31-.73.81-.73.48 0 .8.21 1.09.73l1.31-.87c-.55-.96-1.33-1.33-2.4-1.33-1.51 0-2.48.96-2.48 2.23 0 1.38.81 2.03 2.03 2.55l.42.18c.78.34 1.24.55 1.24 1.13 0 .48-.45.83-1.15.83-.83 0-1.31-.43-1.67-1.03l-1.38.8M13 11.25H8v1.5h1.5V20h1.75v-7.25H13v-1.5" />
  </svg>
);

const TailwindIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C15.61 7.15 14.5 6 12 6m-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35C8.39 16.85 9.5 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C10.61 13.15 9.5 12 7 12z" />
  </svg>
);

const ShadcnIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3L3 21h18L12 3z" />
  </svg>
);

const sections = [
  { id: 'stack', label: 'Stack', icon: Code },
  { id: 'cores', label: 'Cores', icon: Palette },
  { id: 'tipografia', label: 'Tipografia', icon: Type },
  { id: 'espacamento', label: 'Espaçamento', icon: Square },
  { id: 'responsividade', label: 'Responsividade', icon: Monitor },
  { id: 'sombras', label: 'Sombras', icon: Layers },
  { id: 'botoes', label: 'Botões', icon: MousePointerClick },
  { id: 'badges', label: 'Badges', icon: Tag },
  { id: 'cards', label: 'Cards', icon: LayoutGrid },
  { id: 'inputs', label: 'Inputs', icon: FormInput },
  { id: 'select', label: 'Select', icon: ListFilter },
  { id: 'kpi-cards', label: 'KPI Cards', icon: BarChart3 },
  { id: 'alerts', label: 'Alerts', icon: AlertCircle },
  { id: 'progress', label: 'Progress', icon: Activity },
  { id: 'tabs', label: 'Tabs', icon: Columns },
  { id: 'tabelas', label: 'Tabelas', icon: Table2 },
  { id: 'graficos', label: 'Gráficos', icon: PieChart },
  { id: 'icones', label: 'Ícones', icon: Star },
];

// SIMPLIFIED COLOR SYSTEM - CSS variables reduced, Tailwind classes preserved via aliases
const allColors = {
  // Base colors (6 CSS variables)
  base: [
    { name: '--background', tailwind: 'bg-background', hsl: '170 15% 97%', hex: '#F5F8F7', note: 'Fundo principal da aplicação' },
    { name: '--foreground', tailwind: 'text-foreground', hsl: '175 25% 12%', hex: '#172423', note: 'Texto principal' },
    { name: '--card', tailwind: 'bg-card', hsl: '0 0% 100%', hex: '#FFFFFF', note: 'Branco - cards, popovers, texto sobre cores' },
    { name: '--muted', tailwind: 'bg-muted', hsl: '170 15% 94%', hex: '#EEF2F1', note: 'Fundo subtil' },
    { name: '--muted-foreground', tailwind: 'text-muted-foreground', hsl: '175 15% 40%', hex: '#57726D', note: 'Texto secundário' },
    { name: '--border', tailwind: 'border-border', hsl: '175 20% 88%', hex: '#D6E3E0', note: 'Bordas, inputs, grelhas' },
  ],
  // Brand/Primary colors (3 CSS variables)
  brand: [
    { name: '--primary', tailwind: 'bg-primary', hsl: '175 66% 38%', hex: '#219F94', note: 'Cor principal da marca (= success)' },
    { name: '--primary-light', tailwind: 'bg-primary-light', hsl: '175 55% 48%', hex: '#3AB5A8', note: 'Primary mais claro' },
    { name: '--primary-dark', tailwind: 'bg-primary-dark', hsl: '175 70% 28%', hex: '#157068', note: 'Primary mais escuro (= accent, secondary)' },
  ],
  // Status colors (3 CSS variables)
  status: [
    { name: '--warning', tailwind: 'bg-warning', hsl: '42 90% 50%', hex: '#F2A91E', note: 'Atenção / Médio Risco (texto usa --foreground)' },
    { name: '--danger', tailwind: 'bg-danger', hsl: '0 70% 55%', hex: '#DF4545', note: 'Erro / Alto Risco (= destructive)' },
  ],
  // Scope/Âmbito colors for emissions charts (3 CSS variables)
  scope: [
    { name: '--scope-1', tailwind: 'bg-scope-1', hsl: '12 50% 65%', hex: '#CC9080', note: 'Âmbito 1 - Emissões Diretas (Coral)' },
    { name: '--scope-2', tailwind: 'bg-scope-2', hsl: '45 50% 65%', hex: '#CCB380', note: 'Âmbito 2 - Energia (Âmbar)' },
    { name: '--scope-3', tailwind: 'bg-scope-3', hsl: '195 45% 55%', hex: '#5A9EB3', note: 'Âmbito 3 - Cadeia de Valor (Petróleo)' },
  ],
  // Onboarding status colors (5 CSS variables)
  onboarding: [
    { name: '--status-pending', tailwind: 'bg-status-pending', hsl: '215 16% 65%', hex: '#94A3B8', note: 'Por contactar' },
    { name: '--status-contacted', tailwind: 'bg-status-contacted', hsl: '21 90% 48%', hex: '#EA580C', note: 'Sem interação' },
    { name: '--status-interested', tailwind: 'bg-status-interested', hsl: '38 92% 50%', hex: '#F59E0B', note: 'Interessada' },
    { name: '--status-progress', tailwind: 'bg-status-progress', hsl: '175 55% 48%', hex: '#3AB5A8', note: 'Em progresso' },
    { name: '--status-complete', tailwind: 'bg-status-complete', hsl: '175 66% 38%', hex: '#219F94', note: 'Completo' },
  ],
  // Medal/Ranking colors (3 CSS variables)
  medals: [
    { name: '--medal-gold', tailwind: 'bg-medal-gold', hsl: '51 100% 50%', hex: '#FFD700', note: 'Ouro - 1º lugar' },
    { name: '--medal-silver', tailwind: 'bg-medal-silver', hsl: '0 0% 75%', hex: '#C0C0C0', note: 'Prata - 2º lugar' },
    { name: '--medal-bronze', tailwind: 'bg-medal-bronze', hsl: '30 59% 50%', hex: '#CD7F32', note: 'Bronze - 3º lugar' },
  ],
};

// Computed arrays for display
const primaryColors = [
  ...allColors.base,
  ...allColors.brand,
];

const semanticColors = allColors.status.filter(c =>
  ['--success', '--warning', '--danger'].includes(c.name)
).map(c => ({ ...c, label: c.note }));

const commonIcons = [
  { icon: Factory, name: "Factory" },
  { icon: Building2, name: "Building2" },
  { icon: Zap, name: "Zap" },
  { icon: TrendingUp, name: "TrendingUp" },
  { icon: TrendingDown, name: "TrendingDown" },
  { icon: Download, name: "Download" },
  { icon: Filter, name: "Filter" },
  { icon: Search, name: "Search" },
  { icon: Settings, name: "Settings" },
  { icon: Info, name: "Info" },
  { icon: AlertTriangle, name: "AlertTriangle" },
  { icon: CheckCircle, name: "CheckCircle" },
  { icon: XCircle, name: "XCircle" },
  { icon: ChevronDown, name: "ChevronDown" },
  { icon: ChevronRight, name: "ChevronRight" },
  { icon: Eye, name: "Eye" },
  { icon: Mail, name: "Mail" },
  { icon: Users, name: "Users" },
];

const chartData = [
  { name: 'Jan', value: 400 },
  { name: 'Fev', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Abr', value: 450 },
];

// scopeChartData is defined inline in the Pie chart

// Mini Stacked Bar Chart with custom implementation
const miniChartData = [
  { month: 'Jan', s1: 180, s2: 120, s3: 380 },
  { month: 'Fev', s1: 200, s2: 140, s3: 420 },
  { month: 'Mar', s1: 160, s2: 110, s3: 360 },
  { month: 'Abr', s1: 220, s2: 160, s3: 460 },
  { month: 'Mai', s1: 190, s2: 130, s3: 400 },
  { month: 'Jun', s1: 210, s2: 150, s3: 440 },
  { month: 'Jul', s1: 240, s2: 170, s3: 490 },
  { month: 'Ago', s1: 200, s2: 140, s3: 420 },
  { month: 'Set', s1: 220, s2: 155, s3: 455 },
  { month: 'Out', s1: 175, s2: 115, s3: 370 },
  { month: 'Nov', s1: 230, s2: 165, s3: 475 },
  { month: 'Dez', s1: 250, s2: 180, s3: 510 },
];

const MiniStackedBarChart = () => {
  const [visibleScopes, setVisibleScopes] = useState({ s1: true, s2: true, s3: true });
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  const toggleScope = (scope: 's1' | 's2' | 's3') => {
    setVisibleScopes(prev => ({ ...prev, [scope]: !prev[scope] }));
  };

  // Ordem de stack: s1 (base), s2 (meio), s3 (topo)
  const scopeConfig = [
    { key: 's1' as const, label: 'Âmbito 1', colorClass: 'bg-scope-1', textClass: 'text-scope-1' },
    { key: 's2' as const, label: 'Âmbito 2', colorClass: 'bg-scope-2', textClass: 'text-scope-2' },
    { key: 's3' as const, label: 'Âmbito 3', colorClass: 'bg-scope-3', textClass: 'text-scope-3' },
  ];

  const maxTotal = Math.max(...miniChartData.map(d => {
    let total = 0;
    if (visibleScopes.s1) total += d.s1;
    if (visibleScopes.s2) total += d.s2;
    if (visibleScopes.s3) total += d.s3;
    return total;
  }));

  // Determina qual é o scope do topo (para aplicar radius)
  const getTopScope = () => {
    if (visibleScopes.s3) return 's3';
    if (visibleScopes.s2) return 's2';
    if (visibleScopes.s1) return 's1';
    return null;
  };
  const topScope = getTopScope();

  return (
    <div className="space-y-3">
      {/* Chart */}
      <div className="flex items-end gap-1.5 h-44 relative">
        {miniChartData.map((bar) => {
          const total = (visibleScopes.s1 ? bar.s1 : 0) + (visibleScopes.s2 ? bar.s2 : 0) + (visibleScopes.s3 ? bar.s3 : 0);
          const heightPercent = maxTotal > 0 ? (total / maxTotal) * 100 : 0;

          // Calcular alturas de cada segmento como percentagem do total da barra
          const getSegmentHeight = (value: number) => total > 0 ? (value / total) * 100 : 0;

          return (
            <div
              key={bar.month}
              className="flex-1 flex flex-col justify-end h-full group relative"
              onMouseEnter={() => setHoveredBar(bar.month)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <div
                className="flex flex-col-reverse transition-all duration-300 ease-out overflow-hidden"
                style={{ height: `${heightPercent}%` }}
              >
                {/* Renderiza de baixo para cima: s1, s2, s3 */}
                {visibleScopes.s1 && (
                  <div
                    className={`bg-scope-1 flex-shrink-0 transition-all duration-300 ${topScope === 's1' ? 'rounded-t' : ''}`}
                    style={{
                      height: `${getSegmentHeight(bar.s1)}%`,
                      marginTop: (visibleScopes.s2 || visibleScopes.s3) ? '1px' : 0
                    }}
                  />
                )}
                {visibleScopes.s2 && (
                  <div
                    className={`bg-scope-2 flex-shrink-0 transition-all duration-300 ${topScope === 's2' ? 'rounded-t' : ''}`}
                    style={{
                      height: `${getSegmentHeight(bar.s2)}%`,
                      marginTop: visibleScopes.s3 ? '1px' : 0
                    }}
                  />
                )}
                {visibleScopes.s3 && (
                  <div
                    className={`bg-scope-3 flex-shrink-0 transition-all duration-300 rounded-t`}
                    style={{ height: `${getSegmentHeight(bar.s3)}%` }}
                  />
                )}
              </div>
              {/* Tooltip */}
              {hoveredBar === bar.month && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 bg-card border rounded-lg shadow-lg p-2 text-xs whitespace-nowrap pointer-events-none">
                  <p className="font-medium mb-1">{bar.month}</p>
                  {visibleScopes.s1 && <p className="text-scope-1">Âmbito 1: {bar.s1} t CO₂e</p>}
                  {visibleScopes.s2 && <p className="text-scope-2">Âmbito 2: {bar.s2} t CO₂e</p>}
                  {visibleScopes.s3 && <p className="text-scope-3">Âmbito 3: {bar.s3} t CO₂e</p>}
                  <p className="font-medium mt-1 pt-1 border-t">Total: {total} t CO₂e</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend as filter */}
      <div className="flex justify-center gap-4">
        {scopeConfig.map(scope => (
          <button
            key={scope.key}
            onClick={() => toggleScope(scope.key)}
            className={`flex items-center gap-2 text-xs transition-opacity ${visibleScopes[scope.key] ? 'opacity-100' : 'opacity-40'}`}
          >
            <div className={`w-3 h-3 rounded ${scope.colorClass}`} />
            <span className={visibleScopes[scope.key] ? scope.textClass : 'text-muted-foreground'}>{scope.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const ColorSwatch = ({
  label,
  hsl,
  tailwind,
  hex,
  note
}: {
  label: string;
  hsl: string;
  tailwind: string;
  hex?: string;
  note?: string;
}) => (
  <div className="border rounded-lg bg-card overflow-hidden">
    <div
      className="h-16"
      style={{ backgroundColor: `hsl(${hsl})` }}
    />
    <div className="p-3">
      <p className="text-xs font-medium truncate">{note || label}</p>
      <p className="text-[12px] text-muted-foreground font-mono truncate">{tailwind}</p>
      <p className="text-[12px] text-muted-foreground/60 font-mono truncate">{hsl}{hex && ` · ${hex}`}</p>
    </div>
  </div>
);

const SectionHeader = ({
  title,
  id,
  icon: Icon,
  description,
}: {
  title: string;
  id: string;
  icon?: React.ElementType;
  description?: string;
}) => (
  <div id={id} className="scroll-mt-6 mb-8 mt-16 pt-8 border-t border-border/50 first:border-t-0 first:pt-0 first:mt-0">
    <div className="flex items-center gap-3 mb-2">
      {Icon && (
        <div className="p-2.5 rounded-xl bg-primary/10 shadow-sm">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      )}
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
    {description && <p className="text-muted-foreground mt-1">{description}</p>}
  </div>
);

const CodeBlock = ({ children }: { children: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group mt-3">
      <pre className="p-4 pr-12 bg-muted rounded-lg text-xs font-mono overflow-x-auto">
        <code>{children}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-md bg-background/80 border opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
        title="Copiar código"
      >
        {copied ? (
          <CheckCircle className="h-4 w-4 text-success" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
};

const TextReveal = ({ children, className = "" }: { children: string; className?: string }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Small delay to ensure the component is mounted before starting animation
    const timer = setTimeout(() => setIsActive(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const characters = children.split('');
  let charIndex = 0;

  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {characters.map((char, index) => {
        if (char === ' ') {
          return <span key={index} className="inline-block">&nbsp;</span>;
        }
        const delay = 0.05 + charIndex * 0.05; // 50ms between each character
        charIndex++;
        return (
          <span
            key={index}
            className={`inline-block transition-all duration-500 ${
              isActive
                ? 'opacity-100 blur-0 scale-100'
                : 'opacity-0 blur-sm scale-110'
            }`}
            style={{
              transitionDelay: `${delay}s`,
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};

const StyleGuide = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('stack');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);


  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar de navegação */}
      <aside className="w-64 border-r bg-card fixed h-screen overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6">
            {/* Logo + Título */}
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Leaf className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-bold">Get2C</h1>
                <p className="text-xs text-muted-foreground">Product Design System</p>
              </div>
            </div>

            {/* Toggle Dark Mode */}
            <div className="flex items-center justify-between p-3 mb-6 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span className="text-sm">{darkMode ? 'Dark' : 'Light'}</span>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            {/* Lista de links para secções */}
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                      ${isActive
                        ? 'bg-primary/10 text-primary font-medium shadow-sm'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1'
                      }
                    `}
                  >
                    <div className={`p-1.5 rounded-md transition-colors ${isActive ? 'bg-primary/20' : 'bg-muted'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {section.label}
                  </button>
                );
              })}
            </nav>

            <div className="mt-8 p-3 border rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">
                {getVersionString()} · {getVersionDate()}
              </p>
            </div>
          </div>
        </ScrollArea>
      </aside>

      {/* Conteúdo principal */}
      <main className="ml-64">
        {/* Header da página - vai até aos limites */}
        <header className="relative bg-background overflow-hidden border-b">
          {/* Animated pulsing background elements - mostly right, some left for balance */}
          <div className="absolute inset-0 overflow-visible">
            {/* RIGHT SIDE (main concentration) */}
            {/* Pulse 1 - top right corner */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/50 rounded-full blur-3xl animate-pulse-slow" style={{ transform: 'translate(20%, -30%)' }} />
            {/* Pulse 2 - right side upper */}
            <div className="absolute top-1/4 right-10 w-56 h-56 bg-primary/40 rounded-full blur-3xl animate-pulse-slower" style={{ animationDelay: '1s' }} />
            {/* Pulse 3 - center right */}
            <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-primary/35 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s', transform: 'translateY(-50%)' }} />
            {/* Pulse 4 - bottom right */}
            <div className="absolute bottom-0 right-20 w-48 h-48 bg-accent/45 rounded-full blur-3xl animate-pulse-slower" style={{ animationDelay: '0.5s', transform: 'translateY(30%)' }} />
            {/* Pulse 5 - far right */}
            <div className="absolute top-1/3 right-0 w-60 h-60 bg-primary/40 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s', transform: 'translateX(30%)' }} />

            {/* LEFT SIDE (subtle, for balance) */}
            {/* Pulse 6 - top left corner (smaller, more transparent) */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-primary/25 rounded-full blur-3xl animate-pulse-slower" style={{ animationDelay: '2s', transform: 'translate(-30%, -30%)' }} />
            {/* Pulse 7 - bottom left (subtle) */}
            <div className="absolute bottom-0 left-10 w-36 h-36 bg-white/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '3.5s', transform: 'translateY(40%)' }} />
            {/* Pulse 8 - left middle (very subtle) */}
            <div className="absolute top-1/2 left-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse-slower" style={{ animationDelay: '1.2s', transform: 'translate(-40%, -50%)' }} />
          </div>

          <div className="relative p-8 max-w-5xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-primary/20">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <Badge variant="outline" className="text-primary border-primary/30 cursor-help" title={`Última atualização: ${STYLE_GUIDE_VERSION.date}\n\nAlterações:\n${STYLE_GUIDE_VERSION.changelog.map(c => `• ${c}`).join('\n')}`}>
                {getVersionString()}
              </Badge>
            </div>

            <h1 className="text-4xl font-bold mb-4">
              <TextReveal>Get2C Product Design System</TextReveal>
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl">
              O guia de referência visual para todas as plataformas Get2C.<br />
              Componentes, cores, tipografia e padrões que definem a linguagem visual.<br />
              Para a equipa e sistemas de IA.
            </p>
          </div>
        </header>

        {/* Conteúdo das secções */}
        <div className="p-8 max-w-5xl">

        {/* === SECÇÃO: STACK TECNOLÓGICO === */}
        <SectionHeader
          id="stack"
          title="Stack Tecnológico"
          icon={Code}
          description="As tecnologias e ferramentas que compõem este sistema"
        />

        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className={cardStyles.kpi}>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-[#61DAFB]/10">
                  <ReactIcon className="h-5 w-5 text-[#61DAFB]" />
                </div>
                <span className="font-semibold">React 18</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Biblioteca principal para construção de interfaces
              </p>
            </Card>
            <Card className={cardStyles.kpi}>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-[#3178C6]/10">
                  <TypeScriptIcon className="h-5 w-5 text-[#3178C6]" />
                </div>
                <span className="font-semibold">TypeScript</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Tipagem estática para código mais robusto
              </p>
            </Card>
            <Card className={cardStyles.kpi}>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-[#06B6D4]/10">
                  <TailwindIcon className="h-5 w-5 text-[#06B6D4]" />
                </div>
                <span className="font-semibold">Tailwind CSS</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Framework de utility classes para estilos
              </p>
            </Card>
            <Card className={cardStyles.kpi}>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-foreground/10">
                  <ShadcnIcon className="h-5 w-5" />
                </div>
                <span className="font-semibold">shadcn/ui</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Componentes base acessíveis e customizáveis
              </p>
            </Card>
          </div>

          <Card className={cardStyles.nested}>
            <h4 className="font-semibold mb-3">Outras dependências relevantes</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Recharts</Badge>
              <Badge variant="outline">Lucide React</Badge>
              <Badge variant="outline">Radix UI</Badge>
              <Badge variant="outline">React Router</Badge>
              <Badge variant="outline">TanStack Query</Badge>
              <Badge variant="outline">React Hook Form</Badge>
              <Badge variant="outline">Zod</Badge>
              <Badge variant="outline">Vite</Badge>
            </div>
          </Card>
        </div>

        {/* === SECÇÃO: CORES === */}
        <SectionHeader
          id="cores"
          title="Cores"
          icon={Palette}
          description="Todas as cores CSS do sistema"
        />

        <div className="space-y-8">
          {/* Base */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Base</h3>
            <p className="text-sm text-muted-foreground mb-4">Fundos, texto e bordas da aplicação</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {allColors.base.map((c) => (
                <ColorSwatch
                  key={c.name}
                  label={c.name}
                  hsl={c.hsl}
                  tailwind={c.tailwind}
                  hex={c.hex}
                  note={c.note}
                />
              ))}
            </div>
          </div>

          {/* Brand/Primary */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Marca / Primary</h3>
            <p className="text-sm text-muted-foreground mb-4">Cor principal da marca e variações</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {allColors.brand.map((c) => (
                <ColorSwatch
                  key={c.name}
                  label={c.name}
                  hsl={c.hsl}
                  tailwind={c.tailwind}
                  hex={c.hex}
                  note={c.note}
                />
              ))}
            </div>
          </div>

          {/* Status/Semantic */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Status</h3>
            <p className="text-sm text-muted-foreground mb-4">Cores para feedback e estados</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {allColors.status.map((c) => (
                <ColorSwatch
                  key={c.name}
                  label={c.name}
                  hsl={c.hsl}
                  tailwind={c.tailwind}
                  hex={c.hex}
                  note={c.note}
                />
              ))}
            </div>
          </div>

          {/* Cores de Scope */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Âmbitos</h3>
            <p className="text-sm text-muted-foreground mb-4">Cores para gráficos de emissões por âmbito</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {allColors.scope.map((c) => (
                <ColorSwatch
                  key={c.name}
                  label={c.name}
                  hsl={c.hsl}
                  tailwind={c.tailwind}
                  hex={c.hex}
                  note={c.note}
                />
              ))}
            </div>

          </div>

          {/* Cores de Onboarding Status */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Status de Onboarding</h3>
            <p className="text-sm text-muted-foreground mb-4">Cores para os estados do funil de conversão</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {allColors.onboarding.map((c) => (
                <ColorSwatch
                  key={c.name}
                  label={c.name}
                  hsl={c.hsl}
                  tailwind={c.tailwind}
                  hex={c.hex}
                  note={c.note}
                />
              ))}
            </div>

            {/* Badge Examples */}
            <h4 className="text-sm font-medium mt-6 mb-3">Badges de Status</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-xs rounded-md bg-status-pending/15 text-status-pending border border-status-pending/30">Por contactar</span>
              <span className="px-2 py-1 text-xs rounded-md bg-status-contacted/15 text-status-contacted border border-status-contacted/30">Sem interação</span>
              <span className="px-2 py-1 text-xs rounded-md bg-status-interested/15 text-status-interested border border-status-interested/30">Interessada</span>
              <span className="px-2 py-1 text-xs rounded-md bg-status-progress/15 text-status-progress border border-status-progress/30">Em progresso</span>
              <span className="px-2 py-1 text-xs rounded-md bg-status-complete/15 text-status-complete border border-status-complete/30">Completo</span>
            </div>
          </div>

          {/* Cores de Medalhas */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Rankings</h3>
            <p className="text-sm text-muted-foreground mb-4">Cores para destaques de ranking</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {allColors.medals.map((c) => (
                <ColorSwatch
                  key={c.name}
                  label={c.name}
                  hsl={c.hsl}
                  tailwind={c.tailwind}
                  hex={c.hex}
                  note={c.note}
                />
              ))}
            </div>
          </div>

        </div>

        {/* === SECÇÃO: TIPOGRAFIA === */}
        <SectionHeader
          id="tipografia"
          title="Tipografia"
          icon={Type}
          description="Escala de tamanhos e pesos tipográficos"
        />

        <div className="space-y-8">
          {/* Tipo de Letra */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Tipo de Letra</h3>
            <Card className={cardStyles.section}>
              <h4 className="text-xl font-semibold mb-1">Plus Jakarta Sans</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Font principal para toda a interface
              </p>
              <div className="text-2xl tracking-wide text-foreground/80 mb-2">
                Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm
              </div>
              <div className="text-2xl tracking-wide text-foreground/80 mb-2">
                Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
              </div>
              <div className="text-xl tracking-wide text-muted-foreground mb-4">
                0 1 2 3 4 5 6 7 8 9 á é í ó ú ã õ ç € % @
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  <span><strong>Geométrica com personalidade</strong> — moderna sem ser genérica</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  <span><strong>Optimizada para ecrãs</strong> — excelente legibilidade</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  <span><strong>Versátil</strong> — funciona bem de 12px a 48px</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  <span><strong>Suporte completo</strong> — acentos e caracteres especiais</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  <span><strong>Open source</strong> — disponível gratuitamente via Google Fonts</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  <span><strong>Profissional</strong> — transmite confiança sem ser corporativa</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Escala de Tamanhos */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Escala de Tamanhos</h3>
            <div className="space-y-4 border rounded-lg p-4 bg-card">
              <div className="flex items-baseline gap-4">
                <span className="text-xs w-24 text-muted-foreground">text-xs (12px)</span>
                <span className="text-xs">Labels e metadata</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs w-24 text-muted-foreground">text-sm (14px)</span>
                <span className="text-sm">Texto corpo</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs w-24 text-muted-foreground">text-xl (20px)</span>
                <span className="text-xl">Títulos de cards e secções</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs w-24 text-muted-foreground">text-2xl (24px)</span>
                <span className="text-2xl">Valores de KPI</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs w-24 text-muted-foreground">text-4xl (36px)</span>
                <span className="text-4xl">Headers principais</span>
              </div>
            </div>
          </div>

          {/* Pesos */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Pesos</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xl font-normal">Aa</p>
                <p className="text-xs text-muted-foreground mt-2">font-normal (400)</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xl font-medium">Aa</p>
                <p className="text-xs text-muted-foreground mt-2">font-medium (500)</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xl font-semibold">Aa</p>
                <p className="text-xs text-muted-foreground mt-2">font-semibold (600)</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xl font-bold">Aa</p>
                <p className="text-xs text-muted-foreground mt-2">font-bold (700)</p>
              </div>
            </div>
          </div>

          {/* Padrões de Texto */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Padrões de Texto (textStyles)</h3>
            <div className="space-y-3">
              <div className="p-4 border rounded-lg bg-card">
                <p className={textStyles.kpiTitle}>Título de KPI</p>
                <p className="font-mono text-xs text-muted-foreground mt-1">textStyles.kpiTitle</p>
              </div>
              <div className="p-4 border rounded-lg bg-card">
                <p className={textStyles.kpiValue}>15.749</p>
                <p className="font-mono text-xs text-muted-foreground mt-1">textStyles.kpiValue</p>
              </div>
              <div className="p-4 border rounded-lg bg-card">
                <p className={textStyles.kpiUnit}>t CO₂e</p>
                <p className="font-mono text-xs text-muted-foreground mt-1">textStyles.kpiUnit</p>
              </div>
              <div className="p-4 border rounded-lg bg-card">
                <p className={textStyles.sectionTitle}>Título de Secção</p>
                <p className="font-mono text-xs text-muted-foreground mt-1">textStyles.sectionTitle</p>
              </div>
            </div>
          </div>
        </div>

        {/* === SECÇÃO: ESPAÇAMENTO === */}
        <SectionHeader
          id="espacamento"
          title="Espaçamento"
          icon={Square}
          description="Escala de padding, margin e gap"
        />

        <div className="space-y-8">
          {/* Escala Visual */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Escala Visual</h3>
            <div className="space-y-3">
              {[
                { size: 1, px: 4 },
                { size: 2, px: 8 },
                { size: 3, px: 12 },
                { size: 4, px: 16 },
                { size: 5, px: 20 },
                { size: 6, px: 24 },
                { size: 8, px: 32 },
              ].map((s) => (
                <div key={s.size} className="flex items-center gap-4">
                  <div 
                    className="bg-primary rounded" 
                    style={{ width: s.px * 3, height: 24 }}
                  />
                  <span className="text-sm font-mono w-16">p-{s.size}</span>
                  <span className="text-xs text-muted-foreground">{s.px}px</span>
                </div>
              ))}
            </div>
          </div>

          {/* Padrões de Spacing */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Padrões de Spacing (lib/styles.ts)</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(spacing).map(([key, value]) => (
                <div key={key} className="p-3 border rounded-lg bg-card flex justify-between items-center">
                  <span className="text-sm font-mono">spacing.{key}</span>
                  <Badge variant="outline">{value}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === SECÇÃO: RESPONSIVIDADE === */}
        <SectionHeader
          id="responsividade"
          title="Responsividade"
          icon={Monitor}
          description="Breakpoints e padrões de layout adaptativo"
        />

        <div className="space-y-8">
          {/* Breakpoints */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Breakpoints (Tailwind padrão)</h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prefixo</TableHead>
                    <TableHead>Min-width</TableHead>
                    <TableHead>Dispositivo típico</TableHead>
                    <TableHead>Exemplo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono text-sm">(default)</TableCell>
                    <TableCell>0px</TableCell>
                    <TableCell>Mobile</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">grid-cols-1</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-sm">sm:</TableCell>
                    <TableCell>640px</TableCell>
                    <TableCell>Mobile landscape</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">sm:grid-cols-2</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-sm">md:</TableCell>
                    <TableCell>768px</TableCell>
                    <TableCell>Tablet</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">md:grid-cols-2</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-sm">lg:</TableCell>
                    <TableCell>1024px</TableCell>
                    <TableCell>Desktop</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">lg:grid-cols-4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-sm">xl:</TableCell>
                    <TableCell>1280px</TableCell>
                    <TableCell>Desktop grande</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">xl:grid-cols-5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-sm">2xl:</TableCell>
                    <TableCell>1400px</TableCell>
                    <TableCell>Container max</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">2xl:grid-cols-6</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Grids de KPIs */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Padrão: Grid de KPIs</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Padrão recomendado: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">grid-cols-1 sm:grid-cols-2 lg:grid-cols-4</code>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard
                title="KPI 1"
                value="1.234"
                unit="unid"
                icon={Factory}
                iconColor="text-primary"
                iconBgColor="bg-primary/10"
              />
              <KPICard
                title="KPI 2"
                value="567"
                unit="unid"
                icon={Building2}
                iconColor="text-primary"
                iconBgColor="bg-primary/10"
              />
              <KPICard
                title="KPI 3"
                value="89%"
                icon={TrendingUp}
                iconColor="text-success"
                iconBgColor="bg-success/10"
              />
              <KPICard
                title="KPI 4"
                value="12"
                inlineSubtitle="items"
                icon={Zap}
                iconColor="text-warning"
                iconBgColor="bg-warning/10"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Redimensiona a janela para ver a adaptação: 4 → 2 → 1 colunas
            </p>
          </div>

          {/* Grid de Cards */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Padrão: Grid de Cards</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Padrão recomendado: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">grid-cols-1 md:grid-cols-2 xl:grid-cols-3</code>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className={cardStyles.section}>
                  <h4 className="font-semibold mb-2">Card {i}</h4>
                  <p className="text-sm text-muted-foreground">
                    Conteúdo de exemplo para demonstrar o comportamento responsivo dos cards de secção.
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Layout Sidebar + Content */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Padrão: Sidebar + Conteúdo</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Padrão recomendado: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">flex flex-col lg:flex-row</code>
            </p>
            <div className="flex flex-col lg:flex-row gap-4 border rounded-lg p-4 bg-muted/30">
              <div className="lg:w-64 shrink-0 p-4 border rounded-lg bg-card">
                <p className="font-medium text-sm">Sidebar</p>
                <p className="text-xs text-muted-foreground mt-1">Fixa em lg+, full-width em mobile</p>
              </div>
              <div className="flex-1 p-4 border rounded-lg bg-card">
                <p className="font-medium text-sm">Conteúdo principal</p>
                <p className="text-xs text-muted-foreground mt-1">Expande para preencher o espaço disponível</p>
              </div>
            </div>
          </div>

          {/* Visibilidade Condicional */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Visibilidade Condicional</h3>
            <div className="space-y-3">
              <div className="p-4 border rounded-lg bg-card">
                <div className="hidden sm:block">
                  <Badge variant="outline" className="mb-2">Visível em sm+</Badge>
                  <p className="text-sm text-muted-foreground">
                    Este conteúdo usa <code className="bg-muted px-1.5 py-0.5 rounded text-xs">hidden sm:block</code>
                  </p>
                </div>
                <div className="sm:hidden">
                  <Badge variant="outline" className="mb-2">Só mobile</Badge>
                  <p className="text-sm text-muted-foreground">
                    Este conteúdo usa <code className="bg-muted px-1.5 py-0.5 rounded text-xs">sm:hidden</code>
                  </p>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-card">
                <div className="hidden lg:block">
                  <Badge variant="outline" className="mb-2">Visível em lg+</Badge>
                  <p className="text-sm text-muted-foreground">
                    Desktop only: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">hidden lg:block</code>
                  </p>
                </div>
                <div className="lg:hidden">
                  <Badge variant="outline" className="mb-2">Mobile/Tablet</Badge>
                  <p className="text-sm text-muted-foreground">
                    Esconde em desktop: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">lg:hidden</code>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Padrões Comuns */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Padrões Comuns</h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Uso</TableHead>
                    <TableHead>Classes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Grid de KPIs (4 cols)</TableCell>
                    <TableCell className="font-mono text-xs">grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Grid de Cards (3 cols)</TableCell>
                    <TableCell className="font-mono text-xs">grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Grid de Cards (2 cols)</TableCell>
                    <TableCell className="font-mono text-xs">grid-cols-1 lg:grid-cols-2 gap-4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Sidebar + Content</TableCell>
                    <TableCell className="font-mono text-xs">flex flex-col lg:flex-row gap-4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Stack → Row</TableCell>
                    <TableCell className="font-mono text-xs">flex flex-col sm:flex-row gap-2</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Texto responsivo</TableCell>
                    <TableCell className="font-mono text-xs">text-xs md:text-sm lg:text-xl</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Padding responsivo</TableCell>
                    <TableCell className="font-mono text-xs">p-4 md:p-6 lg:p-8</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Esconder em mobile</TableCell>
                    <TableCell className="font-mono text-xs">hidden sm:block</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Só em mobile</TableCell>
                    <TableCell className="font-mono text-xs">sm:hidden</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* === SECÇÃO: SOMBRAS === */}
        <SectionHeader
          id="sombras"
          title="Sombras & Elevação"
          icon={Layers}
          description="Níveis de profundidade e arredondamento"
        />

        <div className="space-y-8">
          {/* Sombras */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Níveis de Sombra</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="p-6 border rounded-lg bg-card shadow-sm text-center">
                <p className="font-medium">shadow-sm</p>
                <p className="text-xs text-muted-foreground mt-2">Cards pequenos</p>
              </div>
              <div className="p-6 border rounded-lg bg-card shadow-md text-center">
                <p className="font-medium">shadow-md</p>
                <p className="text-xs text-muted-foreground mt-2">Cards principais</p>
              </div>
              <div className="p-6 border rounded-lg bg-card shadow-lg text-center">
                <p className="font-medium">shadow-lg</p>
                <p className="text-xs text-muted-foreground mt-2">Modais</p>
              </div>
            </div>
          </div>

          {/* Shadow Glow */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Shadow Glow (Marca)</h3>
            <div 
              className="p-6 border rounded-lg bg-card text-center"
              style={{ boxShadow: 'var(--shadow-glow)' }}
            >
              <p className="font-medium">shadow-glow</p>
              <p className="text-xs text-muted-foreground mt-2">Elementos de destaque da marca</p>
            </div>
          </div>

          {/* Border Radius */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Border Radius</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="p-6 border bg-card rounded-md text-center">
                <p className="font-medium">rounded-md</p>
                <p className="text-xs text-muted-foreground mt-2">Elementos pequenos</p>
              </div>
              <div className="p-6 border bg-card rounded-lg text-center">
                <p className="font-medium">rounded-lg</p>
                <p className="text-xs text-muted-foreground mt-2">Cards, botões (padrão)</p>
              </div>
              <div className="p-6 border bg-card rounded-full text-center">
                <p className="font-medium">rounded-full</p>
                <p className="text-xs text-muted-foreground mt-2">Badges, avatars</p>
              </div>
            </div>
          </div>
        </div>

        {/* === SECÇÃO: BOTÕES === */}
        <SectionHeader
          id="botoes"
          title="Botões"
          icon={MousePointerClick}
          description="Variantes, tamanhos e estados"
        />

        <div className="space-y-8">
          {/* Variantes */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Variantes</h3>
            <div className="flex flex-wrap gap-3">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          {/* Tamanhos */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Tamanhos</h3>
            <div className="flex items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          {/* Estados */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Estados</h3>
            <div className="flex items-center gap-3">
              <Button>Normal</Button>
              <Button disabled>Disabled</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Hover: passe o cursor sobre o botão "Normal"
            </p>
          </div>

          {/* Com Ícone */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Com Ícone</h3>
            <div className="flex flex-wrap gap-3">
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </Button>
              <Button size="icon" variant="ghost">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* === SECÇÃO: BADGES === */}
        <SectionHeader
          id="badges"
          title="Badges"
          icon={Tag}
          description="Etiquetas e indicadores visuais"
        />

        <div className="space-y-8">
          {/* Variantes Padrão */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Variantes Padrão</h3>
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </div>

          {/* Badges Semânticos (Risco) */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Badges de Risco (riskColors)</h3>
            <div className="flex flex-wrap gap-3">
              <Badge className={riskColors.baixo.badge}>Baixo</Badge>
              <Badge className={riskColors.medio.badge}>Médio</Badge>
              <Badge className={riskColors.alto.badge}>Alto</Badge>
              <Badge className={riskColors.critico.badge}>Crítico</Badge>
            </div>
            <CodeBlock>
              {`import { riskColors } from "@/lib/styles";
<Badge className={riskColors.baixo.badge}>Baixo</Badge>`}
            </CodeBlock>
          </div>

          {/* Badges de Âmbito */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Badges de Âmbito (scopeColors)</h3>
            <div className="flex flex-wrap gap-3">
              <Badge className={scopeColors[1].badge}>Âmbito 1</Badge>
              <Badge className={scopeColors[2].badge}>Âmbito 2</Badge>
              <Badge className={scopeColors[3].badge}>Âmbito 3</Badge>
            </div>
            <CodeBlock>
              {`import { scopeColors } from "@/lib/styles";
<Badge className={scopeColors[1].badge}>Âmbito 1</Badge>`}
            </CodeBlock>
          </div>
        </div>

        {/* === SECÇÃO: CARDS === */}
        <SectionHeader
          id="cards"
          title="Cards"
          icon={LayoutGrid}
          description="Estilos de contentor"
        />

        <div className="space-y-8">
          {/* Estilos de Card */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Estilos (cardStyles)</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card className={cardStyles.kpi}>
                <p className="font-medium">Card KPI</p>
                <p className="text-xs text-muted-foreground mt-1">cardStyles.kpi</p>
                <p className="font-mono text-xs text-muted-foreground/70">{cardStyles.kpi}</p>
              </Card>
              <Card className={cardStyles.section}>
                <p className="font-medium">Card Secção</p>
                <p className="text-xs text-muted-foreground mt-1">cardStyles.section</p>
                <p className="font-mono text-xs text-muted-foreground/70">{cardStyles.section}</p>
              </Card>
              <Card className={cardStyles.nested}>
                <p className="font-medium">Card Nested</p>
                <p className="text-xs text-muted-foreground mt-1">cardStyles.nested</p>
                <p className="font-mono text-xs text-muted-foreground/70">{cardStyles.nested}</p>
              </Card>
              <Card className={`${cardStyles.kpi} ${cardStyles.clickable}`}>
                <p className="font-medium">Card Clicável</p>
                <p className="text-xs text-muted-foreground mt-1">cardStyles.clickable</p>
                <p className="font-mono text-xs text-muted-foreground/70">{cardStyles.clickable}</p>
              </Card>
              <Card className={`${cardStyles.kpi} ${cardStyles.selected}`}>
                <p className="font-medium">Card Seleccionado</p>
                <p className="text-xs text-muted-foreground mt-1">cardStyles.selected</p>
                <p className="font-mono text-xs text-muted-foreground/70">{cardStyles.selected}</p>
              </Card>
            </div>
          </div>
        </div>

        {/* === SECÇÃO: INPUTS === */}
        <SectionHeader
          id="inputs"
          title="Inputs"
          icon={FormInput}
          description="Campos de entrada de dados"
        />

        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="input-example">Input</Label>
              <Input id="input-example" placeholder="Escreva aqui..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="input-disabled">Input Disabled</Label>
              <Input id="input-disabled" placeholder="Desactivado" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="textarea-example">Textarea</Label>
              <Textarea id="textarea-example" placeholder="Texto longo..." />
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="checkbox" />
                <Label htmlFor="checkbox">Checkbox com label</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="switch" />
                <Label htmlFor="switch">Switch com label</Label>
              </div>
            </div>
          </div>
        </div>

        {/* === SECÇÃO: SELECT === */}
        <SectionHeader
          id="select"
          title="Select"
          icon={ListFilter}
          description="Seletores dropdown"
        />

        <div className="space-y-4">
          <Select>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Seleccione uma opção..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="opt1">Opção 1</SelectItem>
              <SelectItem value="opt2">Opção 2</SelectItem>
              <SelectItem value="opt3">Opção 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* === SECÇÃO: KPI CARDS === */}
        <SectionHeader
          id="kpi-cards"
          title="KPI Cards"
          icon={BarChart3}
          description="Cards de métricas padronizados"
        />

        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Emissões Totais"
              value="15.749"
              unit="t CO₂e"
              icon={Factory}
              iconColor="text-primary"
              iconBgColor="bg-primary/10"
            />
            <KPICard
              title="Intensidade"
              value="0,45"
              unit="kg CO₂e/€"
              icon={Zap}
              iconColor="text-warning"
              iconBgColor="bg-warning/10"
            />
            <KPICard
              title="Redução Possível"
              value="-30%"
              icon={TrendingDown}
              iconColor="text-success"
              iconBgColor="bg-success/10"
              valueColor="text-success"
            />
            <KPICard
              title="Empresas"
              value="42"
              inlineSubtitle="monitorizadas"
              icon={Building2}
            />
          </div>
          <CodeBlock>
            {`import { KPICard } from "@/components/ui/kpi-card";

<KPICard
  title="Emissões Totais"
  value="15.749"
  unit="t CO₂e"
  icon={Factory}
  iconColor="text-primary"
  iconBgColor="bg-primary/10"
/>`}
          </CodeBlock>

          {/* Exemplo Real: Mini Dashboard */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Exemplo Real: Mini Dashboard</h3>
            <Card className="p-6 bg-muted/30 border-dashed">
              <div className="space-y-4">
                {/* Header do mini dashboard */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <h4 className="font-semibold">Empresa ABC, Lda.</h4>
                    <p className="text-sm text-muted-foreground">Resumo de emissões 2025</p>
                  </div>
                  <Badge className={scopeColors[1].badge}>Indústria</Badge>
                </div>

                {/* KPIs em grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3 bg-card rounded-lg border">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-xl font-bold">8.245</p>
                    <p className="text-xs text-muted-foreground">t CO₂e</p>
                  </div>
                  <div className="p-3 rounded-lg border border-scope-1/30 bg-scope-1/10">
                    <p className="text-xs text-muted-foreground">Âmbito 1</p>
                    <p className="text-xl font-bold text-scope-1">2.156</p>
                    <p className="text-xs text-muted-foreground">t CO₂e (26%)</p>
                  </div>
                  <div className="p-3 rounded-lg border border-scope-2/30 bg-scope-2/10">
                    <p className="text-xs text-muted-foreground">Âmbito 2</p>
                    <p className="text-xl font-bold text-scope-2">1.489</p>
                    <p className="text-xs text-muted-foreground">t CO₂e (18%)</p>
                  </div>
                  <div className="p-3 rounded-lg border border-scope-3/30 bg-scope-3/10">
                    <p className="text-xs text-muted-foreground">Âmbito 3</p>
                    <p className="text-xl font-bold text-scope-3">4.600</p>
                    <p className="text-xs text-muted-foreground">t CO₂e (56%)</p>
                  </div>
                </div>

                {/* Mini gráfico de barras empilhadas (Custom) */}
                <MiniStackedBarChart />
              </div>
            </Card>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Este exemplo mostra como combinar KPIs, badges e elementos visuais num layout coeso
            </p>
          </div>
        </div>

        {/* === SECÇÃO: ALERTS === */}
        <SectionHeader
          id="alerts"
          title="Alerts"
          icon={AlertCircle}
          description="Mensagens de feedback"
        />

        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Informação</AlertTitle>
            <AlertDescription>Mensagem informativa neutra.</AlertDescription>
          </Alert>
          <Alert className="border-success/30 bg-success/10">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertTitle className="text-success">Sucesso</AlertTitle>
            <AlertDescription>Operação concluída com êxito.</AlertDescription>
          </Alert>
          <Alert className="border-warning/30 bg-warning/10">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertTitle className="text-warning">Atenção</AlertTitle>
            <AlertDescription>Verifique os dados antes de continuar.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>Ocorreu um problema.</AlertDescription>
          </Alert>
        </div>

        {/* === SECÇÃO: PROGRESS === */}
        <SectionHeader
          id="progress"
          title="Progress"
          icon={Activity}
          description="Indicadores de progresso"
        />

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>25%</span>
            </div>
            <Progress value={25} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>50%</span>
            </div>
            <Progress value={50} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>75%</span>
            </div>
            <Progress value={75} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>100%</span>
            </div>
            <Progress value={100} />
          </div>
        </div>

        {/* === SECÇÃO: TABS === */}
        <SectionHeader
          id="tabs"
          title="Tabs"
          icon={Columns}
          description="Navegação por separadores"
        />

        <div>
          <Tabs defaultValue="resumo">
            <TabsList>
              <TabsTrigger value="resumo">Resumo</TabsTrigger>
              <TabsTrigger value="emissoes">Detalhes das Emissões</TabsTrigger>
            </TabsList>
            <TabsContent value="resumo" className="p-4 border rounded-lg mt-2">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Visão geral das métricas principais da empresa.</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-card rounded-lg border">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-xl font-bold">8.245</p>
                    <p className="text-xs text-muted-foreground">t CO₂e</p>
                  </div>
                  <div className="p-3 bg-card rounded-lg border">
                    <p className="text-xs text-muted-foreground">vs Média Setor</p>
                    <p className="text-xl font-bold text-success">-12%</p>
                    <p className="text-xs text-muted-foreground">abaixo</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="emissoes" className="p-4 border rounded-lg mt-2">
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Emissões por Âmbito</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded border border-scope-1/30 bg-scope-1/10">
                    <p className="text-xs text-muted-foreground mb-0.5">Âmbito 1</p>
                    <p className="text-sm font-semibold text-scope-1">2.156 t CO₂e</p>
                  </div>
                  <div className="p-2 rounded border border-scope-2/30 bg-scope-2/10">
                    <p className="text-xs text-muted-foreground mb-0.5">Âmbito 2</p>
                    <p className="text-sm font-semibold text-scope-2">1.489 t CO₂e</p>
                  </div>
                  <div className="p-2 rounded border border-scope-3/30 bg-scope-3/10">
                    <p className="text-xs text-muted-foreground mb-0.5">Âmbito 3</p>
                    <p className="text-sm font-semibold text-scope-3">4.600 t CO₂e</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* === SECÇÃO: TABELAS === */}
        <SectionHeader
          id="tabelas"
          title="Tabelas"
          icon={Table2}
          description="Apresentação de dados tabulares"
        />

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead className="text-right">Emissões</TableHead>
                <TableHead>Risco</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Empresa A</TableCell>
                <TableCell>Indústria</TableCell>
                <TableCell className="text-right">1.234 t CO₂e</TableCell>
                <TableCell><Badge className={riskColors.alto.badge}>Alto</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Empresa B</TableCell>
                <TableCell>Serviços</TableCell>
                <TableCell className="text-right">456 t CO₂e</TableCell>
                <TableCell><Badge className={riskColors.medio.badge}>Médio</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Empresa C</TableCell>
                <TableCell>Comércio</TableCell>
                <TableCell className="text-right">89 t CO₂e</TableCell>
                <TableCell><Badge className={riskColors.baixo.badge}>Baixo</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* === SECÇÃO: GRÁFICOS === */}
        <SectionHeader
          id="graficos"
          title="Gráficos"
          icon={PieChart}
          description="Recharts - biblioteca de visualização de dados"
        />

        <div className="grid grid-cols-2 gap-6">
          {/* Area Chart */}
          <Card className="p-4">
            <h3 className="text-xl font-semibold mb-4">Area Chart</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Pie Chart */}
          <Card className="p-4">
            <h3 className="text-xl font-semibold mb-4">Pie Chart</h3>
            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={[
                      { name: 'Âmbito 1', value: 27, color: 'hsl(var(--scope-1))' },
                      { name: 'Âmbito 2', value: 18, color: 'hsl(var(--scope-2))' },
                      { name: 'Âmbito 3', value: 55, color: 'hsl(var(--scope-3))' },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    dataKey="value"
                  >
                    <Cell fill="hsl(var(--scope-1))" />
                    <Cell fill="hsl(var(--scope-2))" />
                    <Cell fill="hsl(var(--scope-3))" />
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value}%`}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-scope-1" />
                <span className="text-xs">Âmbito 1</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-scope-2" />
                <span className="text-xs">Âmbito 2</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-scope-3" />
                <span className="text-xs">Âmbito 3</span>
              </div>
            </div>
          </Card>
        </div>

        {/* === SECÇÃO: ÍCONES === */}
        <SectionHeader
          id="icones"
          title="Ícones"
          icon={Star}
          description="Biblioteca de ícones Lucide React"
        />

        <div className="space-y-8">
          {/* Grid de Ícones */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Ícones Mais Usados</h3>
            <div className="grid grid-cols-6 gap-4">
              {commonIcons.map(({ icon: Icon, name }) => (
                <div key={name} className="flex flex-col items-center gap-2 p-3 border rounded-lg">
                  <Icon className="h-5 w-5" />
                  <span className="text-xs text-muted-foreground">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tamanhos de Ícone */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Tamanhos (iconSizes)</h3>
            <div className="flex items-end gap-6">
              {Object.entries(iconSizes).map(([size, classes]) => (
                <div key={size} className="flex flex-col items-center gap-2">
                  <Factory className={classes} />
                  <span className="text-xs text-muted-foreground">{size}</span>
                  <span className="font-mono text-xs text-muted-foreground/70">{classes}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

                </div>
      </main>

      {/* Footer with gradient */}
      <footer className="footer-gradient ml-64 border-t">
        <div className="footer-gradient-grain" />
        <div className="relative z-10 max-w-5xl px-8 pt-16 pb-[40rem]">
          <div className="text-muted-foreground text-sm">
            <p className="text-foreground font-medium">Get2C Product Design System {getVersionString()} · {getVersionDate()}</p>
            <p className="mt-2">For a cooler world.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StyleGuide;
