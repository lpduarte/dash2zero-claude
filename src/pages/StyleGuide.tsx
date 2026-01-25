import { useState, useEffect } from "react";
import { usePageTitle } from "@/lib/usePageTitle";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Palette, Type, Layers, MousePointerClick, Tag,
  FormInput, ListFilter, BarChart3, AlertCircle, Columns,
  Table2, PieChart, Star, Moon, Sun, Factory, Building2,
  Zap, TrendingUp, TrendingDown, Download, Filter, Search, Settings,
  Info, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronRight,
  Eye, Mail, Users, Leaf, Copy, Code, Truck, Plus, MessageSquare,
  ListOrdered, User, Euro, FileText
} from "lucide-react";

// ============================================
// VERSIONING - Update this when making changes
// ============================================
const STYLE_GUIDE_VERSION = {
  major: 1,
  minor: 4,
  patch: 12,
  date: "2026-01-20",
  changelog: [
    "Auto-update via commit",
    "Auto-update via commit",
    "Auto-update via commit",
    "Auto-update via commit",
    "Auto-update via commit",
    "Auto-update via commit",
    "Auto-update via commit",
    "Auto-update via commit",
    "Auto-update via commit",
    "Auto-update via commit"
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { KPICard } from "@/components/ui/kpi-card";
import { riskColors, scopeColors, iconSizes } from "@/lib/styles";
// Recharts
import {
  AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from "recharts";
import { cn } from "@/lib/utils";

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
  { id: 'sombras', label: 'Sombras', icon: Layers },
  { id: 'botoes', label: 'Botões', icon: MousePointerClick },
  { id: 'badges', label: 'Badges', icon: Tag },
  { id: 'inputs', label: 'Inputs', icon: FormInput },
  { id: 'select', label: 'Select', icon: ListFilter },
  { id: 'dialogs', label: 'Dialogs', icon: MessageSquare },
  { id: 'steps', label: 'Steps', icon: ListOrdered },
  { id: 'kpi-cards', label: 'KPI Cards', icon: BarChart3 },
  { id: 'tabs', label: 'Tabs', icon: Columns },
  { id: 'tabelas', label: 'Tabelas', icon: Table2 },
  { id: 'graficos', label: 'Gráficos', icon: PieChart },
  { id: 'funil', label: 'Funil Onboarding', icon: Users },
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
  // Onboarding status colors (6 CSS variables)
  onboarding: [
    { name: '--status-pending', tailwind: 'bg-status-pending', hsl: '215 16% 65%', hex: '#94A3B8', note: 'Por contactar' },
    { name: '--status-contacted', tailwind: 'bg-status-contacted', hsl: '21 90% 48%', hex: '#EA580C', note: 'Sem interação' },
    { name: '--status-interested', tailwind: 'bg-status-interested', hsl: '38 92% 50%', hex: '#F59E0B', note: 'Interessada' },
    { name: '--status-registered', tailwind: 'bg-status-registered', hsl: '78 50% 48%', hex: '#8FB85C', note: 'Registada' },
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
    <div className="space-y-4">
      {/* Chart with X axis */}
      <div>
        <div className="flex items-end gap-1.5 h-44 relative border-b border-border">
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
                      style={{ height: `${getSegmentHeight(bar.s1)}%` }}
                    />
                  )}
                  {visibleScopes.s2 && (
                    <div
                      className={`bg-scope-2 flex-shrink-0 transition-all duration-300 ${topScope === 's2' ? 'rounded-t' : ''}`}
                      style={{ height: `${getSegmentHeight(bar.s2)}%` }}
                    />
                  )}
                  {visibleScopes.s3 && (
                    <div
                      className="bg-scope-3 flex-shrink-0 transition-all duration-300 rounded-t"
                      style={{ height: `${getSegmentHeight(bar.s3)}%` }}
                    />
                  )}
                </div>
                {/* Tooltip */}
                {hoveredBar === bar.month && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 bg-card border rounded-lg shadow-lg p-2 text-xs whitespace-nowrap pointer-events-none">
                    <p className="font-normal mb-1">{bar.month}</p>
                    {visibleScopes.s1 && <p className="text-scope-1">Âmbito 1: {bar.s1} t CO₂e</p>}
                    {visibleScopes.s2 && <p className="text-scope-2">Âmbito 2: {bar.s2} t CO₂e</p>}
                    {visibleScopes.s3 && <p className="text-scope-3">Âmbito 3: {bar.s3} t CO₂e</p>}
                    <p className="font-normal mt-1 pt-1 border-t">Total: {total} t CO₂e</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* X axis labels */}
        <div className="flex gap-1.5 mt-1">
          {miniChartData.map((bar) => (
            <div key={bar.month} className="flex-1 text-center">
              <span className="text-xs text-muted-foreground lowercase">{bar.month.toLowerCase().slice(0, 3)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend as filter */}
      <div className="flex justify-center gap-4 pt-2">
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
      <p className="text-xs font-bold truncate">{note || label}</p>
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
  <div id={id} className="scroll-mt-6 mb-8 mt-16 first:mt-0">
    <div className="flex items-center gap-3 mb-2">
      {Icon && (
        <div className="p-2.5 rounded-lg bg-primary/10 shadow-md">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      )}
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
    {description && <p className="text-muted-foreground mt-1">{description}</p>}
  </div>
);

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
  usePageTitle("Style Guide");
  const { darkMode, setDarkMode } = useTheme();
  const [activeSection, setActiveSection] = useState('stack');

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
    <div className="min-h-screen bg-background relative z-10">
      {/* Sidebar de navegação */}
      <aside className="w-64 border-r bg-card fixed h-screen overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6">
            {/* Logo + Título */}
            <div className="flex items-center gap-2 mb-6">
              <Leaf className="h-8 w-8 text-primary" />
              <div>
                <h1 className="font-bold">Dash2Zero</h1>
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
                        ? 'bg-primary/10 text-primary font-normal shadow-md'
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

      {/* Conteúdo principal - bg-dot-pattern provides both gray bg and dot pattern */}
      <main className="ml-64 bg-dot-pattern">
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
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <Badge variant="outline" className="text-primary border-primary/30 cursor-help" title={`Última atualização: ${STYLE_GUIDE_VERSION.date}\n\nAlterações:\n${STYLE_GUIDE_VERSION.changelog.map(c => `• ${c}`).join('\n')}`}>
                {getVersionString()}
              </Badge>
            </div>

            <h1 className="text-4xl font-bold mb-4">
              <TextReveal>Product Design System</TextReveal>
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl">
              O guia de referência visual para a plataforma Dash2Zero.<br />
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
            <Card className="p-4">
              <div className="p-2 rounded-lg bg-[#61DAFB]/10 w-fit mb-3">
                <ReactIcon className="h-5 w-5 text-[#61DAFB]" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold">React</span>
                <Badge variant="outline" className="text-xs">19.2</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Biblioteca principal para construção de interfaces
              </p>
            </Card>
            <Card className="p-4">
              <div className="p-2 rounded-lg bg-[#3178C6]/10 w-fit mb-3">
                <TypeScriptIcon className="h-5 w-5 text-[#3178C6]" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold">TypeScript</span>
                <Badge variant="outline" className="text-xs">5.9</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Tipagem estática para código mais robusto
              </p>
            </Card>
            <Card className="p-4">
              <div className="p-2 rounded-lg bg-[#06B6D4]/10 w-fit mb-3">
                <TailwindIcon className="h-5 w-5 text-[#06B6D4]" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold">Tailwind CSS</span>
                <Badge variant="outline" className="text-xs">3.4</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Framework de utility classes para estilos
              </p>
            </Card>
            <Card className="p-4">
              <div className="p-2 rounded-lg bg-foreground/10 w-fit mb-3">
                <ShadcnIcon className="h-5 w-5" />
              </div>
              <span className="font-bold">shadcn/ui</span>
              <p className="text-sm text-muted-foreground mt-2">
                Componentes base acessíveis e customizáveis
              </p>
            </Card>
          </div>

          <Card className="p-4">
            <h4 className="font-bold mb-3">Outras dependências relevantes</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Recharts</Badge>
              <Badge variant="outline">Lucide React</Badge>
              <Badge variant="outline">Radix UI</Badge>
              <Badge variant="outline">React Router</Badge>
              <Badge variant="outline">TanStack Query</Badge>
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
            <h3 className="text-xl font-bold mb-2">Base</h3>
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
            <h3 className="text-xl font-bold mb-2">Marca / Primary</h3>
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
            <h3 className="text-xl font-bold mb-2">Status</h3>
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
            <h3 className="text-xl font-bold mb-2">Âmbitos</h3>
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
            <h3 className="text-xl font-bold mb-2">Status de Onboarding</h3>
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

          </div>

          {/* Cores de Medalhas */}
          <div>
            <h3 className="text-xl font-bold mb-2">Rankings</h3>
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
            <h3 className="text-xl font-bold mb-4">Tipo de Letra</h3>
            <Card className="p-4">
              <h4 className="text-xl font-bold mb-1">Plus Jakarta Sans</h4>
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
            <h3 className="text-xl font-bold mb-4">Escala de Tamanhos</h3>
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
            <h3 className="text-xl font-bold mb-4">Pesos</h3>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="p-4 border rounded-lg bg-card text-center">
                <p className="text-xl font-normal">Aa</p>
                <p className="text-xs text-muted-foreground mt-2">font-normal (400)</p>
              </div>
              <div className="p-4 border rounded-lg bg-card text-center">
                <p className="text-xl font-bold">Aa</p>
                <p className="text-xs text-muted-foreground mt-2">font-bold (700)</p>
              </div>
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
            <h3 className="text-xl font-bold mb-4">Níveis de Sombra</h3>
            <div className="grid grid-cols-2 gap-6 max-w-md">
              <div className="p-6 border rounded-lg bg-card shadow-md text-center">
                <p className="font-normal">shadow-md</p>
                <p className="text-xs text-muted-foreground mt-2">Cards e elementos</p>
              </div>
              <div className="p-6 border rounded-lg bg-card shadow-lg text-center">
                <p className="font-normal">shadow-lg</p>
                <p className="text-xs text-muted-foreground mt-2">Modais e tooltips</p>
              </div>
            </div>
          </div>

          {/* Border Radius */}
          <div>
            <h3 className="text-xl font-bold mb-4">Border Radius</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="p-6 border bg-card rounded-md text-center">
                <p className="font-normal">rounded-md</p>
                <p className="text-xs text-muted-foreground mt-2">Elementos pequenos</p>
              </div>
              <div className="p-6 border bg-card rounded-lg text-center">
                <p className="font-normal">rounded-lg</p>
                <p className="text-xs text-muted-foreground mt-2">Cards, botões (padrão)</p>
              </div>
              <div className="p-6 border bg-card rounded-full text-center">
                <p className="font-normal">rounded-full</p>
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
            <h3 className="text-xl font-bold mb-4">Variantes</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
              <button className="inline-flex items-center justify-center gap-2 h-10 px-4 py-2 rounded-md text-sm font-normal border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors">
                <Plus className="h-4 w-4" />
                Dashed
              </button>
            </div>
          </div>

          {/* Tamanhos */}
          <div>
            <h3 className="text-xl font-bold mb-4">Tamanhos</h3>
            <div className="flex items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          {/* Estados */}
          <div>
            <h3 className="text-xl font-bold mb-4">Estados</h3>
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
            <h3 className="text-xl font-bold mb-4">Com Ícone</h3>
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
            <h3 className="text-xl font-bold mb-4">Variantes Padrão</h3>
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </div>

          {/* Badges Semânticos (Risco) */}
          <div>
            <h3 className="text-xl font-bold mb-4">Badges de Risco</h3>
            <div className="flex flex-wrap gap-3">
              <Badge className={riskColors.baixo.badge}>Baixo</Badge>
              <Badge className={riskColors.medio.badge}>Médio</Badge>
              <Badge className={riskColors.alto.badge}>Alto</Badge>
            </div>
          </div>

          {/* Badges de Âmbito */}
          <div>
            <h3 className="text-xl font-bold mb-4">Badges de Âmbito</h3>
            <div className="flex flex-wrap gap-3">
              <Badge className={scopeColors[1].badge}>Âmbito 1</Badge>
              <Badge className={scopeColors[2].badge}>Âmbito 2</Badge>
              <Badge className={scopeColors[3].badge}>Âmbito 3</Badge>
            </div>
          </div>

          {/* Badges de Estado de Onboarding */}
          <div>
            <h3 className="text-xl font-bold mb-4">Badges de Estado de Onboarding</h3>
            <p className="text-sm text-muted-foreground mb-4">Estados do processo de adesão de empresas (página Incentivo)</p>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-status-pending/15 text-status-pending border border-status-pending/30 hover:bg-status-pending/25 transition-colors cursor-default">
                Por contactar
              </Badge>
              <Badge className="bg-status-contacted/15 text-status-contacted border border-status-contacted/30 hover:bg-status-contacted/25 transition-colors cursor-default">
                Sem interação
              </Badge>
              <Badge className="bg-status-interested/15 text-status-interested border border-status-interested/30 hover:bg-status-interested/25 transition-colors cursor-default">
                Interessada
              </Badge>
              <Badge className="bg-status-registered/15 text-status-registered border border-status-registered/30 hover:bg-status-registered/25 transition-colors cursor-default">
                Registada
              </Badge>
              <Badge className="bg-status-progress/15 text-status-progress border border-status-progress/30 hover:bg-status-progress/25 transition-colors cursor-default">
                Em progresso
              </Badge>
              <Badge className="bg-status-complete/15 text-status-complete border border-status-complete/30 hover:bg-status-complete/25 transition-colors cursor-default">
                Completo
              </Badge>
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

        {/* === SECÇÃO: DIALOGS === */}
        <SectionHeader
          id="dialogs"
          title="Dialogs"
          icon={MessageSquare}
          description="Modais de confirmação e alertas"
        />

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Alert Dialog</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Modal de confirmação com botão de fechar no canto. O conteúdo fica centrado.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">Abrir Alert Dialog</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar acção</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta é uma mensagem de confirmação. Tem a certeza que deseja continuar com esta acção?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction>Confirmar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Alert Dialog Destructive</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Variante para acções destrutivas como eliminar.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Eliminar item</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar eliminação</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem a certeza que deseja eliminar este item? Esta acção não pode ser revertida.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction variant="destructive">Eliminar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* === SECÇÃO: STEPS === */}
        <SectionHeader
          id="steps"
          title="Steps"
          icon={ListOrdered}
          description="Indicadores de progresso em fluxos multi-etapa"
        />

        <div className="space-y-8">
          {/* Exemplo interactivo */}
          <div>
            <h3 className="text-xl font-bold mb-4">Step Indicator</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Usado em modais e fluxos com várias etapas. Cada step tem um círculo com ícone, label em baixo, e linhas conectoras.
            </p>

            {(() => {
              const [demoStep, setDemoStep] = useState(2);

              const steps = [
                { number: 1, title: 'Análise', icon: BarChart3 },
                { number: 2, title: 'Medidas', icon: Zap },
                { number: 3, title: 'Financiamento', icon: Euro },
                { number: 4, title: 'Resumo', icon: FileText },
              ];

              const getStepState = (stepNumber: number) => {
                if (stepNumber < demoStep) return 'completed';
                if (stepNumber === demoStep) return 'current';
                return 'pending';
              };

              return (
                <Card className="p-6">
                  <div className="flex items-start justify-center gap-2">
                    {steps.map((step, idx) => {
                      const StepIcon = step.icon;
                      const state = getStepState(step.number);

                      return (
                        <div key={step.number} className="flex items-start">
                          {idx > 0 && (
                            <div
                              className={cn(
                                "h-0.5 w-16 mx-2 mt-6 transition-colors",
                                step.number <= demoStep ? "bg-primary/40" : "bg-border"
                              )}
                            />
                          )}

                          <button
                            onClick={() => setDemoStep(step.number)}
                            className="flex flex-col items-center gap-2 transition-all cursor-pointer"
                          >
                            <div
                              className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                                state === 'current'
                                  ? "bg-primary text-primary-foreground"
                                  : state === 'completed'
                                    ? "bg-primary/20 text-primary border-2 border-primary/30"
                                    : "bg-background text-muted-foreground border-2 border-border",
                                state !== 'current' && "hover:border-primary/50 hover:bg-primary/10"
                              )}
                            >
                              <StepIcon className="h-5 w-5" />
                            </div>

                            <span
                              className={cn(
                                "text-sm font-bold transition-colors",
                                state === 'current'
                                  ? "text-primary"
                                  : state === 'completed'
                                    ? "text-primary/70"
                                    : "text-muted-foreground"
                              )}
                            >
                              {step.title}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-xs text-muted-foreground text-center mt-6">
                    Clica nos steps para mudar o estado activo
                  </p>
                </Card>
              );
            })()}
          </div>

          {/* Estados */}
          <div>
            <h3 className="text-xl font-bold mb-4">Estados</h3>
            <div className="grid grid-cols-3 gap-6">
              <Card className="p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3">
                  <User className="h-5 w-5" />
                </div>
                <p className="font-bold text-sm">Current</p>
                <p className="text-xs text-muted-foreground mt-1">bg-primary</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary border-2 border-primary/30 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <p className="font-bold text-sm">Completed</p>
                <p className="text-xs text-muted-foreground mt-1">bg-primary/20 + border</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-background text-muted-foreground border-2 border-border flex items-center justify-center mx-auto mb-3">
                  <Eye className="h-5 w-5" />
                </div>
                <p className="font-bold text-sm">Pending</p>
                <p className="text-xs text-muted-foreground mt-1">bg-background + border</p>
              </Card>
            </div>
          </div>

          {/* Especificações */}
          <div>
            <h3 className="text-xl font-bold mb-4">Especificações</h3>
            <Card className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-bold mb-2">Dimensões</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Círculo: <code className="text-xs bg-muted px-1 rounded">w-12 h-12</code></li>
                    <li>Ícone: <code className="text-xs bg-muted px-1 rounded">h-5 w-5</code></li>
                    <li>Linha: <code className="text-xs bg-muted px-1 rounded">h-0.5 w-16</code></li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold mb-2">Tipografia</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Label: <code className="text-xs bg-muted px-1 rounded">text-sm font-bold</code></li>
                    <li>Gap círculo-label: <code className="text-xs bg-muted px-1 rounded">gap-2</code></li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
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

          {/* Mini Dashboard (exemplo) */}
          <div>
            <h3 className="text-xl font-bold mb-4">Mini Dashboard (exemplo)</h3>
            <Card className="p-6 bg-muted/30 border-dashed">
              <div className="space-y-4">
                {/* Header do mini dashboard */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold">Empresa ABC, Lda.</h4>
                    <p className="text-sm text-muted-foreground">Resumo de emissões 2025</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Indústria</Badge>
                    <Badge variant="outline">Fornecedores</Badge>
                  </div>
                </div>

                <div className="border-b" />

                {/* KPIs em grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-4 bg-card rounded-md border shadow-md">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">Total</p>
                        <div className="p-1.5 rounded bg-primary/10">
                          <Factory className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xl font-bold">8.245</p>
                        <p className="text-xs text-muted-foreground mt-1">t CO₂e</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-md border border-scope-1/30 bg-scope-1/10 shadow-md">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">Âmbito 1</p>
                        <div className="p-1.5 rounded bg-scope-1/20">
                          <Factory className="h-4 w-4 text-scope-1" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-scope-1">2.156</p>
                        <p className="text-xs text-muted-foreground mt-1">t CO₂e (26%)</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-md border border-scope-2/30 bg-scope-2/10 shadow-md">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">Âmbito 2</p>
                        <div className="p-1.5 rounded bg-scope-2/20">
                          <Zap className="h-4 w-4 text-scope-2" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-scope-2">1.489</p>
                        <p className="text-xs text-muted-foreground mt-1">t CO₂e (18%)</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-md border border-scope-3/30 bg-scope-3/10 shadow-md">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">Âmbito 3</p>
                        <div className="p-1.5 rounded bg-scope-3/20">
                          <Truck className="h-4 w-4 text-scope-3" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-scope-3">4.600</p>
                        <p className="text-xs text-muted-foreground mt-1">t CO₂e (56%)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b" />

                {/* Mini gráfico de barras empilhadas (Custom) */}
                <MiniStackedBarChart />

                <div className="border-b" />

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Meta de redução</span>
                    <span>25%</span>
                  </div>
                  <Progress value={25} />
                </div>
              </div>
            </Card>
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
                <p className="text-sm font-normal text-muted-foreground">Emissões por Âmbito</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded border border-scope-1/30 bg-scope-1/10">
                    <p className="text-xs text-muted-foreground mb-0.5">Âmbito 1</p>
                    <p className="text-sm font-bold text-scope-1">2.156 t CO₂e</p>
                  </div>
                  <div className="p-2 rounded border border-scope-2/30 bg-scope-2/10">
                    <p className="text-xs text-muted-foreground mb-0.5">Âmbito 2</p>
                    <p className="text-sm font-bold text-scope-2">1.489 t CO₂e</p>
                  </div>
                  <div className="p-2 rounded border border-scope-3/30 bg-scope-3/10">
                    <p className="text-xs text-muted-foreground mb-0.5">Âmbito 3</p>
                    <p className="text-sm font-bold text-scope-3">4.600 t CO₂e</p>
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
                <TableCell className="font-normal">Empresa A</TableCell>
                <TableCell>Indústria</TableCell>
                <TableCell className="text-right">1.234 t CO₂e</TableCell>
                <TableCell><Badge className={riskColors.alto.badge}>Alto</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-normal">Empresa B</TableCell>
                <TableCell>Serviços</TableCell>
                <TableCell className="text-right">456 t CO₂e</TableCell>
                <TableCell><Badge className={riskColors.medio.badge}>Médio</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-normal">Empresa C</TableCell>
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
            <h3 className="text-xl font-bold mb-4">Area Chart</h3>
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
                  <RechartsTooltip
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
            <h3 className="text-xl font-bold mb-4">Pie Chart</h3>
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
                  <RechartsTooltip
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

        {/* === SECÇÃO: FUNIL ONBOARDING === */}
        <SectionHeader
          id="funil"
          title="Funil Onboarding"
          icon={Users}
          description="Experimentação de visualizações para o fluxo de onboarding com ramificação"
        />

        <div className="space-y-8">
          {(() => {
            // Mock data - empresas por fase
            const preDecision = {
              pending: 45,      // Por contactar
              contacted: 32,   // Sem interação
              interested: 28,  // Interessada
            };
            const postDecision = {
              simple: { registered: 8, progress: 6, complete: 4 },      // Total: 18
              formulario: { progress: 6, complete: 3 },                  // Total: 9
            };

            // Cálculos
            const preTotal = preDecision.pending + preDecision.contacted + preDecision.interested;
            const simpleTotal = postDecision.simple.registered + postDecision.simple.progress + postDecision.simple.complete;
            const formularioTotal = postDecision.formulario.progress + postDecision.formulario.complete;
            const postTotal = simpleTotal + formularioTotal;
            const grandTotal = preTotal + postTotal;

            // Percentagens para layout dinâmico
            const leftPercent = (preTotal / grandTotal) * 100;
            const rightPercent = (postTotal / grandTotal) * 100;

            // Legenda com contagens e tooltips
            const legendItems = [
              { label: 'Por contactar', value: preDecision.pending, color: 'bg-status-pending', borderColor: 'border-status-pending', tooltip: 'Ainda não recebeu nenhum email' },
              { label: 'Sem interação', value: preDecision.contacted, color: 'bg-status-contacted', borderColor: 'border-status-contacted', tooltip: 'Recebeu email mas não clicou no link' },
              { label: 'Interessada', value: preDecision.interested, color: 'bg-status-interested', borderColor: 'border-status-interested', tooltip: 'Clicou no link do email' },
              { label: 'Registada', value: postDecision.simple.registered, color: 'bg-status-registered', borderColor: 'border-status-registered', tooltip: 'Criou conta no Simple' },
              { label: 'Em progresso', value: postDecision.simple.progress + postDecision.formulario.progress, color: 'bg-status-progress', borderColor: 'border-status-progress', tooltip: 'Iniciou o cálculo da pegada' },
              { label: 'Completo', value: postDecision.simple.complete + postDecision.formulario.complete, color: 'bg-status-complete', borderColor: 'border-status-complete', tooltip: 'Pegada calculada com sucesso' },
            ];

            // Segmentos com arredondamento dinâmico baseado na posição
            const preSegments = [
              { key: 'pending', value: preDecision.pending, color: 'bg-status-pending', label: 'Por contactar' },
              { key: 'contacted', value: preDecision.contacted, color: 'bg-status-contacted', label: 'Sem interação' },
              { key: 'interested', value: preDecision.interested, color: 'bg-status-interested', label: 'Interessada' },
            ].filter(s => s.value > 0);

            const simpleSegments = [
              { key: 'registered', value: postDecision.simple.registered, color: 'bg-status-registered', label: 'Registada' },
              { key: 'progress', value: postDecision.simple.progress, color: 'bg-status-progress', label: 'Em progresso' },
              { key: 'complete', value: postDecision.simple.complete, color: 'bg-status-complete', label: 'Completo' },
            ].filter(s => s.value > 0);

            const formularioSegments = [
              { key: 'progress', value: postDecision.formulario.progress, color: 'bg-status-progress', label: 'Em progresso' },
              { key: 'complete', value: postDecision.formulario.complete, color: 'bg-status-complete', label: 'Completo' },
            ].filter(s => s.value > 0);

            return (
              <Card className="p-6">
                <p className="text-xs font-normal text-muted-foreground mb-4">Progresso de onboarding</p>
                <div className="flex items-center gap-2">
                  {/* Fase pré-decisão - largura proporcional */}
                  <div style={{ width: `${leftPercent}%` }}>
                    <div className="h-4 flex gap-px">
                      {preSegments.map((segment, index) => (
                        <div
                          key={segment.key}
                          className={cn(
                            segment.color,
                            "h-full",
                            index === 0 && "rounded-l-md",
                            index === preSegments.length - 1 && "rounded-r-md"
                          )}
                          style={{ width: `${(segment.value / preTotal) * 100}%` }}
                          title={`${segment.label}: ${segment.value}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Conector visual - posição dinâmica */}
                  <div className="flex flex-col items-center gap-1 text-muted-foreground/50 shrink-0">
                    <div className="w-px h-4 bg-current" />
                    <ChevronRight className="h-4 w-4" />
                    <div className="w-px h-4 bg-current" />
                  </div>

                  {/* Fase pós-decisão - largura proporcional */}
                  <div style={{ width: `${rightPercent}%` }} className="space-y-1">
                    {/* Ramo Simple - estende até ao limite direito (100%) */}
                    <div className="space-y-1">
                      <p className="text-xs font-bold">Simple <span className="font-normal text-muted-foreground">({simpleTotal})</span></p>
                      <div className="h-4 flex gap-px w-full">
                        {simpleSegments.map((segment, index) => (
                          <div
                            key={segment.key}
                            className={cn(
                              segment.color,
                              "h-full",
                              index === 0 && "rounded-l-md",
                              index === simpleSegments.length - 1 && "rounded-r-md"
                            )}
                            style={{ width: `${(segment.value / simpleTotal) * 100}%` }}
                            title={`${segment.label}: ${segment.value}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Ramo Formulário - proporcional ao Simple */}
                    <div className="space-y-1">
                      <div className="h-4 flex gap-px" style={{ width: `${(formularioTotal / simpleTotal) * 100}%` }}>
                        {formularioSegments.map((segment, index) => (
                          <div
                            key={segment.key}
                            className={cn(
                              segment.color,
                              "h-full",
                              index === 0 && "rounded-l-md",
                              index === formularioSegments.length - 1 && "rounded-r-md"
                            )}
                            style={{ width: `${(segment.value / formularioTotal) * 100}%` }}
                            title={`${segment.label}: ${segment.value}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs font-bold">Formulário <span className="font-normal text-muted-foreground">({formularioTotal})</span></p>
                    </div>
                  </div>
                </div>

                {/* Separador */}
                <Separator className="my-4" />

                {/* Legenda com contagens e tooltips */}
                <div className="flex flex-wrap justify-center gap-4">
                  {legendItems.map((item) => (
                    <TooltipProvider key={item.label} delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5 text-xs cursor-help">
                            <div className={cn("h-2.5 w-2.5 rounded-full", item.color)} />
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="font-normal">{item.value}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className={cn("border", item.borderColor)}>
                          <p>{item.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </Card>
            );
          })()}
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
            <h3 className="text-xl font-bold mb-4">Ícones Mais Usados</h3>
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
            <h3 className="text-xl font-bold mb-4">Tamanhos (iconSizes)</h3>
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
            <p className="text-foreground font-normal">Get2C · Product Design System {getVersionString()} · {getVersionDate()}</p>
            <p className="mt-2">For a cooler world.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StyleGuide;
