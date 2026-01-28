import { useState, useEffect } from "react";
import { usePageTitle } from "@/lib/usePageTitle";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen, Building2, Factory, TrendingDown,
  Info, BarChart3, Landmark,
  Briefcase, FileSpreadsheet, CheckCircle2,
  Leaf, Scale, Library, Layers, LayoutDashboard,
  Mail, Send, Upload, Users, AlertTriangle, Clock,
  TowerControl, Database, Zap, Bus, Wind, Recycle, Route, Bike,
  PieChart, Target, Euro, Shield, FileText,
  ChevronDown, ChevronRight,
  Car, Droplets, Gift, Receipt,
  Archive, Eye, Settings, ShieldCheck, Pencil, Download,
  MousePointer, MousePointerClick, CircleDot, Hexagon,
  Grid3X3
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  METHODOLOGY_VERSION,
  methodologySections,
  getVersionString,
  getVersionDate,
  userTypes,
  glossary,
} from "@/config/methodology";
import { sectorLabels } from "@/data/sectors";
import {
  sectorEmissionFactors,
  industrySubsectorFactors,
  emissionIntensityMetadata,
  bibliography,
} from "@/data/emissionIntensity";

// Icon string-to-component mapping
const iconMap: Record<string, React.ElementType> = {
  BookOpen, Users, FileText, Factory, BarChart3, TrendingDown,
  Briefcase, Scale, FileSpreadsheet, CheckCircle2, Layers,
  LayoutDashboard, PieChart, Target, Leaf, Euro, Mail, Send,
  TowerControl, Shield, Database, Library,
};

// Flat list of all section IDs for scroll tracking
const allSections = methodologySections.flatMap(g => g.sections);

// Mapeamento de setor para código CAE
const sectorCAEMapping: Record<string, { code: string; description: string }> = {
  agricultura: { code: 'A', description: 'Agricultura, produção animal, caça, floresta e pesca' },
  extracao: { code: 'B', description: 'Indústrias extrativas' },
  industria: { code: 'C', description: 'Indústrias transformadoras' },
  energia: { code: 'D', description: 'Eletricidade, gás, vapor, água quente e fria' },
  agua: { code: 'E', description: 'Captação, tratamento e distribuição de água' },
  construcao: { code: 'F', description: 'Construção' },
  comercio: { code: 'G', description: 'Comércio por grosso e a retalho' },
  logistica: { code: 'H', description: 'Transporte e armazenagem' },
  hotelaria: { code: 'I', description: 'Alojamento, restauração e similares' },
  tecnologia: { code: 'J', description: 'Informação e comunicação' },
  financas: { code: 'K', description: 'Atividades financeiras e de seguros' },
  imobiliario: { code: 'L', description: 'Atividades imobiliárias' },
  consultoria: { code: 'M', description: 'Atividades de consultoria, científicas e técnicas' },
  administrativo: { code: 'N', description: 'Atividades administrativas' },
  educacao: { code: 'P', description: 'Educação' },
  saude: { code: 'Q', description: 'Atividades de saúde humana e apoio social' },
  cultura: { code: 'R', description: 'Atividades artísticas e recreativas' },
  servicos: { code: 'S', description: 'Outras atividades de serviços' },
};

// Subsetores da indústria
const industrySubsectors: Record<string, { code: string; name: string }> = {
  alimentar: { code: '10-12', name: 'Indústria Alimentar' },
  textil: { code: '13-14', name: 'Têxtil e Vestuário' },
  madeira: { code: '16', name: 'Madeira e Cortiça' },
  papel: { code: '17', name: 'Papel e Cartão' },
  quimica: { code: '20', name: 'Química' },
  farmaceutica: { code: '21', name: 'Farmacêutica' },
  plasticos: { code: '22', name: 'Borracha e Plásticos' },
  ceramica: { code: '23', name: 'Cerâmica e Vidro' },
  metalurgia: { code: '24', name: 'Metalurgia' },
  metalomecanica: { code: '25', name: 'Metalomecânica' },
  eletronica: { code: '26-27', name: 'Eletrónica' },
  automovel: { code: '29', name: 'Automóvel' },
  mobiliario: { code: '31', name: 'Mobiliário' },
};

// Section Header Component
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

// Text Reveal Animation
const TextReveal = ({ children, className = "" }: { children: string; className?: string }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
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
        const delay = 0.05 + charIndex * 0.04;
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

export default function Methodology() {
  usePageTitle("Metodologia");
  const [activeSection, setActiveSection] = useState('visao-geral');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    () => Object.fromEntries(methodologySections.map(g => [g.id, true]))
  );

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const section of allSections) {
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
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r bg-card fixed h-screen overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6">
            {/* Logo + Title */}
            <div className="flex items-center gap-2 mb-6">
              <Leaf className="h-8 w-8 text-primary" />
              <div>
                <h1 className="font-bold">Dash2Zero</h1>
                <p className="text-xs text-muted-foreground">Metodologia</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              {methodologySections.map((group) => {
                const isExpanded = expandedGroups[group.id];
                const hasActiveChild = group.sections.some(s => s.id === activeSection);
                return (
                  <div key={group.id}>
                    <button
                      onClick={() => toggleGroup(group.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200",
                        hasActiveChild
                          ? "text-primary"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      {group.label}
                      {isExpanded
                        ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        : <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      }
                    </button>
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-200",
                        isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      )}
                    >
                      {group.sections.map((section) => {
                        const Icon = iconMap[section.icon];
                        const isActive = activeSection === section.id;
                        return (
                          <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={cn(
                              "w-full flex items-start gap-3 px-3 py-2 rounded-lg text-sm text-left transition-all duration-200 ml-1",
                              isActive
                                ? "bg-primary/10 text-primary font-normal shadow-md"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1"
                            )}
                          >
                            {Icon && (
                              <div className={cn(
                                "p-1.5 rounded-md transition-colors shrink-0",
                                isActive ? "bg-primary/20" : "bg-muted"
                              )}>
                                <Icon className="h-4 w-4" />
                              </div>
                            )}
                            {section.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
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

      {/* Main Content - bg-grid-pattern provides both gray bg (::before) and grid (::after) */}
      <main className="ml-64 bg-grid-pattern relative z-10">
        {/* Academic Header */}
        <header className="relative bg-background overflow-hidden border-b">
          {/* Subtle pulsing background - academic/scholarly tones */}
          <div className="absolute inset-0 overflow-visible">
            {/* Right side - main concentration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-pulse-slow" style={{ transform: 'translate(20%, -30%)' }} />
            <div className="absolute top-1/3 right-10 w-48 h-48 bg-primary/25 rounded-full blur-3xl animate-pulse-slower" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-accent/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s', transform: 'translateY(30%)' }} />
            {/* Left side - subtle balance */}
            <div className="absolute top-0 left-0 w-36 h-36 bg-primary/15 rounded-full blur-3xl animate-pulse-slower" style={{ animationDelay: '1.5s', transform: 'translate(-30%, -30%)' }} />
            <div className="absolute bottom-0 left-10 w-32 h-32 bg-muted-foreground/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '3s', transform: 'translateY(40%)' }} />
          </div>

          <div className="relative p-8 max-w-5xl">
            {/* Academic Badge */}
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-primary/20">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <Badge variant="outline" className="text-primary border-primary/30 cursor-help" title={`Última atualização: ${METHODOLOGY_VERSION.date}`}>
                {getVersionString()}
              </Badge>
            </div>

            <h1 className="text-4xl font-bold mb-4">
              <TextReveal>Documentação Metodológica</TextReveal>
            </h1>

            {/* Academic-style subtitle */}
            <div className="space-y-2">
              <p className="text-xl text-muted-foreground max-w-3xl">
                Metodologias, fórmulas de cálculo e fontes de dados utilizadas na plataforma Dash2Zero, para análise de emissões de carbono.
              </p>
            </div>
          </div>
        </header>

        {/* Content Sections */}
        <div className="p-8 max-w-5xl">

          {/* === SECTION: Visão Geral === */}
          <SectionHeader
            id="visao-geral"
            title="Visão Geral do Dash2Zero"
            icon={BookOpen}
            description="Plataforma de tracking e gestão de emissões de carbono"
          />

          <div className="space-y-6">
            <p className="text-muted-foreground">
              O Dash2Zero é uma plataforma desenvolvida pela Get2C para ajudar
              organizações a medir, comparar e reduzir a sua pegada de carbono.
            </p>

            {/* Card destacado - O que é */}
            <div className="border rounded-lg p-6 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-primary/20">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Dash2Zero</h3>
                  <p className="text-sm text-muted-foreground">For a cooler world</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                Uma solução completa para organizações que pretendem iniciar ou
                acelerar o seu percurso de descarbonização, com ferramentas de
                análise, comparação e planeamento.
              </p>
            </div>

            {/* 3 Cards: Medir, Comparar, Reduzir */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="border rounded-lg p-4 bg-card">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-scope-1/10">
                    <BarChart3 className="h-5 w-5 text-scope-1" />
                  </div>
                  <h4 className="font-bold">Medir</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Calcular emissões por âmbito (Scope 1, 2, 3) seguindo
                  o GHG Protocol internacional.
                </p>
              </div>

              <div className="border rounded-lg p-4 bg-card">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-scope-2/10">
                    <Scale className="h-5 w-5 text-scope-2" />
                  </div>
                  <h4 className="font-bold">Comparar</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Benchmarking setorial com dados do INE para identificar
                  oportunidades de melhoria.
                </p>
              </div>

              <div className="border rounded-lg p-4 bg-card">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-status-complete/10">
                    <TrendingDown className="h-5 w-5 text-status-complete" />
                  </div>
                  <h4 className="font-bold">Reduzir</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Planos de acção com medidas concretas e fontes de
                  financiamento disponíveis.
                </p>
              </div>
            </div>

            {/* Para quem */}
            <div className="border rounded-lg p-4 bg-card">
              <h3 className="font-bold mb-3">Para quem é o Dash2Zero?</h3>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Landmark className="h-5 w-5 text-purple-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold">Municípios</p>
                    <p className="text-sm text-muted-foreground">
                      Autarquias que pretendem acompanhar e incentivar a
                      descarbonização das empresas do seu território.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold">Empresas</p>
                    <p className="text-sm text-muted-foreground">
                      Organizações que querem gerir a pegada de carbono
                      da sua cadeia de fornecedores.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* === SECTION: Tipos de Utilizador === */}
          <SectionHeader
            id="utilizadores"
            title="Tipos de Utilizador"
            icon={Users}
            description="Perfis de acesso e funcionalidades disponíveis"
          />

          <div className="space-y-6">
            <p className="text-muted-foreground">
              O Dash2Zero suporta três tipos de utilizador, cada um com
              funcionalidades adaptadas às suas necessidades.
            </p>

            <div className="grid gap-4">
              {/* Card Get2C */}
              <div className="border rounded-lg p-4 bg-primary/5 border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <TowerControl className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">{userTypes.get2c.name}</h3>
                    <p className="text-sm text-muted-foreground">Administrador</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {userTypes.get2c.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {userTypes.get2c.capabilities.map((cap, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {cap}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Card Município */}
              <div className="border rounded-lg p-4 bg-purple-500/5 border-purple-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Landmark className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-bold">{userTypes.municipio.name}</h3>
                    <p className="text-sm text-muted-foreground">Autarquia</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {userTypes.municipio.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {userTypes.municipio.capabilities.map((cap, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {cap}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Card Empresa */}
              <div className="border rounded-lg p-4 bg-blue-500/5 border-blue-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Building2 className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold">{userTypes.empresa.name}</h3>
                    <p className="text-sm text-muted-foreground">Organização</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {userTypes.empresa.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {userTypes.empresa.capabilities.map((cap, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {cap}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Nota sobre hierarquia */}
            <div className="flex items-start gap-2 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
              <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                <strong>Hierarquia:</strong> Get2C gere múltiplos Municípios e Empresas.
                Cada Município/Empresa vê apenas os seus próprios dados e funcionalidades
                autorizadas pelo seu perfil de permissões.
              </p>
            </div>
          </div>

          {/* === SECTION: Glossário === */}
          <SectionHeader
            id="glossario"
            title="Glossário"
            icon={FileText}
            description="Termos técnicos utilizados na plataforma"
          />

          <div className="space-y-6">
            <p className="text-muted-foreground">
              Definições dos principais termos técnicos utilizados ao longo
              desta documentação e na plataforma Dash2Zero.
            </p>

            <div className="border rounded-lg bg-card overflow-hidden">
              <div className="grid gap-0 divide-y">
                {glossary
                  .slice()
                  .sort((a, b) => a.term.localeCompare(b.term))
                  .map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[140px_1fr] gap-4 p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="font-mono text-sm font-bold text-primary">
                        {item.term}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.definition}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Nota sobre terminologia */}
            <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                Esta documentação utiliza terminologia técnica do GHG Protocol e
                classificações do INE. Termos em inglês são mantidos quando são
                padrão internacional (ex: Scope 1, 2, 3).
              </p>
            </div>
          </div>

          {/* === SECTION: Potencial de Melhoria === */}
          <SectionHeader
            id="potencial"
            title="Potencial de Melhoria"
            icon={TrendingDown}
            description="Metodologia para cálculo do potencial de redução de emissões"
          />
          <div className="space-y-6">
            <p className="text-muted-foreground">
              O cálculo do potencial de melhoria é diferenciado consoante o tipo de utilizador,
              refletindo as diferentes estratégias disponíveis para redução de emissões.
            </p>

                {/* Vista Empresa */}
                <div className="border rounded-lg p-4 space-y-4 bg-card">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-blue-500/10">
                      <Building2 className="h-4 w-4 text-blue-500" />
                    </div>
                    <h3 className="font-bold">Vista Empresa: Potencial de Substituição</h3>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Uma empresa pode otimizar a sua cadeia de valor substituindo fornecedores ou parceiros
                    com elevada pegada de carbono por alternativas mais eficientes no mesmo setor.
                  </p>

                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <p className="text-sm font-bold">Metodologia:</p>
                    <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                      <li>Para cada fornecedor, identificar alternativas no mesmo setor com menores emissões</li>
                      <li>Calcular a diferença entre as emissões do fornecedor atual e a melhor alternativa</li>
                      <li>Somar todas as reduções potenciais</li>
                    </ol>

                    <div className="mt-4 p-3 bg-background rounded border">
                      <p className="text-xs font-mono text-muted-foreground">
                        Potencial = Σ (Emissões_fornecedor - Emissões_melhor_alternativa)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Este cálculo assume que a empresa pode escolher entre diferentes fornecedores
                      do mesmo setor, priorizando aqueles com menor intensidade de carbono.
                    </p>
                  </div>
                </div>

                {/* Vista Município */}
                <div className="border rounded-lg p-4 space-y-4 bg-card">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-purple-500/10">
                      <Landmark className="h-4 w-4 text-purple-500" />
                    </div>
                    <h3 className="font-bold">Vista Município: Potencial de Melhoria Setorial</h3>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Um município não pode substituir as empresas do seu território. O seu papel é apoiar
                    e incentivar as empresas a implementarem medidas de redução de emissões.
                  </p>

                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <p className="text-sm font-bold">Metodologia:</p>
                    <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                      <li>Calcular a média de emissões por setor de atividade</li>
                      <li>Identificar empresas com emissões acima da média do seu setor</li>
                      <li>Calcular a redução necessária para cada empresa atingir a média setorial</li>
                      <li>Somar todas as reduções potenciais</li>
                    </ol>

                    <div className="mt-4 p-3 bg-background rounded border">
                      <p className="text-xs font-mono text-muted-foreground">
                        Potencial = Σ (Emissões_empresa - Média_setor) para empresas acima da média
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-purple-500/5 rounded-lg border border-purple-500/20">
                    <Info className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      A média setorial serve como benchmark. Empresas acima da média representam
                      oportunidades de melhoria através de medidas de eficiência, eletrificação,
                      ou adoção de energias renováveis.
                    </p>
                  </div>
                </div>

                {/* Níveis de Potencial */}
                <div className="border rounded-lg p-4 space-y-4 bg-card">
                  <h3 className="font-bold">Classificação do Nível de Potencial</h3>
                  <p className="text-sm text-muted-foreground">
                    O nível de potencial é determinado pela percentagem de redução possível face às emissões atuais:
                  </p>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg bg-danger/10 border border-danger/20">
                      <p className="font-bold text-danger">Alto</p>
                      <p className="text-sm text-muted-foreground mt-1">Redução &gt; 20%</p>
                    </div>
                    <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                      <p className="font-bold text-warning">Médio</p>
                      <p className="text-sm text-muted-foreground mt-1">Redução 10-20%</p>
                    </div>
                    <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                      <p className="font-bold text-success">Baixo</p>
                      <p className="text-sm text-muted-foreground mt-1">Redução ≤ 10%</p>
                    </div>
                  </div>
                </div>
          </div>

          {/* === SECTION: Cálculo de Emissões === */}
          <SectionHeader
            id="emissoes"
            title="Cálculo de Emissões"
            icon={Factory}
            description="Metodologia GHG Protocol para cálculo de emissões de gases com efeito de estufa"
          />

          <div className="space-y-6">
            <p className="text-muted-foreground">
              As emissões de gases com efeito de estufa (GEE) são calculadas seguindo o
              GHG Protocol, a metodologia internacional mais utilizada.
            </p>

                {/* Scopes */}
                <div className="space-y-4">
                  <h3 className="font-bold">Âmbitos de Emissões (Scopes)</h3>

                  <div className="grid gap-4">
                    <div className="border rounded-lg p-4 bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-scope-1 text-white">Scope 1</Badge>
                        <span className="font-bold">Emissões Diretas</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Emissões de fontes que a empresa possui ou controla diretamente
                        (ex: combustão em caldeiras, veículos da frota própria, processos industriais).
                      </p>
                    </div>

                    <div className="border rounded-lg p-4 bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-scope-2 text-white">Scope 2</Badge>
                        <span className="font-bold">Emissões Indiretas - Energia</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Emissões associadas à produção da energia elétrica e térmica adquirida
                        e consumida pela empresa.
                      </p>
                    </div>

                    <div className="border rounded-lg p-4 bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-scope-3 text-white">Scope 3</Badge>
                        <span className="font-bold">Outras Emissões Indiretas</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Todas as outras emissões indiretas na cadeia de valor
                        (ex: deslocações de colaboradores, transporte de mercadorias, resíduos).
                      </p>
                    </div>
                  </div>
                </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm font-bold mb-2">Fórmula de Cálculo Total:</p>
              <div className="p-3 bg-background rounded border">
                <p className="text-xs font-mono text-muted-foreground">
                  Emissões Totais (t CO₂e) = Scope 1 + Scope 2 + Scope 3
                </p>
              </div>
            </div>
          </div>

          {/* === SECTION: Indicadores === */}
          <SectionHeader
            id="indicadores"
            title="Indicadores de Intensidade"
            icon={BarChart3}
            description="Métricas normalizadas para comparação entre empresas"
          />

          <div className="space-y-6">
            <p className="text-muted-foreground">
              Os indicadores de intensidade permitem comparar empresas de diferentes dimensões,
              normalizando as emissões por diferentes métricas de atividade.
            </p>

                <div className="grid gap-4">
                  <div className="border rounded-lg p-4 bg-card">
                    <h4 className="font-bold mb-2">Emissões por Faturação</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Mede a eficiência de carbono por unidade de valor económico gerado.
                    </p>
                    <div className="p-3 bg-muted/50 rounded">
                      <p className="text-xs font-mono text-muted-foreground">
                        Intensidade = Emissões Totais (t CO₂e) / Faturação (M€)
                      </p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-card">
                    <h4 className="font-bold mb-2">Emissões por Colaborador</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Mede a pegada de carbono média por pessoa na organização.
                    </p>
                    <div className="p-3 bg-muted/50 rounded">
                      <p className="text-xs font-mono text-muted-foreground">
                        Intensidade = Emissões Totais (t CO₂e) / Nº Colaboradores
                      </p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-card">
                    <h4 className="font-bold mb-2">Emissões por Área</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Mede a intensidade de emissões por unidade de espaço ocupado.
                    </p>
                    <div className="p-3 bg-muted/50 rounded">
                      <p className="text-xs font-mono text-muted-foreground">
                        Intensidade = Emissões Totais (t CO₂e) / Área (m²)
                      </p>
                    </div>
                  </div>
                </div>

            <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                Estes indicadores são úteis para benchmarking setorial, permitindo identificar
                empresas com desempenho acima ou abaixo da média do seu setor.
              </p>
            </div>
          </div>

          {/* === SECTION: Setores de Atividade === */}
          <SectionHeader
            id="setores"
            title="Classificação de Setores"
            icon={Briefcase}
            description="Classificação de atividades económicas segundo a CAE Rev.3"
          />

          <div className="space-y-6">
            <p className="text-muted-foreground">
              Os setores de atividade seguem a <strong>Classificação Portuguesa de Atividades Económicas (CAE Rev.3)</strong>,
              definida pelo INE - Instituto Nacional de Estatística.
            </p>

                {/* Obtenção do Setor */}
                <div className="border rounded-lg p-4 space-y-4 bg-primary/5 border-primary/20">
                  <h3 className="font-bold">Como é obtido o Setor de Atividade?</h3>
                  <div className="space-y-3 text-sm">
                    <p className="text-muted-foreground">
                      O setor de atividade é obtido automaticamente a partir do <strong>NIF/NIPC</strong> da empresa
                      durante o processo de criação de clusters ou onboarding. A informação é consultada
                      nos registos oficiais portugueses.
                    </p>
                    <p className="text-muted-foreground">
                      Caso o NIF/NIPC não esteja disponível ou a informação não possa ser obtida automaticamente,
                      o utilizador pode indicar manualmente o setor durante o processo de registo.
                    </p>
                  </div>
                </div>

                {/* CAE Principal vs Secundário */}
                <div className="border rounded-lg p-4 space-y-4 bg-card">
                  <h3 className="font-bold">CAE Principal vs CAEs Secundários</h3>
                  <p className="text-sm text-muted-foreground">
                    Em Portugal, as empresas podem ter múltiplos códigos CAE:
                  </p>
                  <div className="grid gap-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-success/5 border border-success/20">
                      <Badge className="bg-success shrink-0">Principal</Badge>
                      <div>
                        <p className="text-sm font-bold">CAE Principal</p>
                        <p className="text-xs text-muted-foreground">
                          A atividade económica principal da empresa, que representa mais de 50% do volume de negócios.
                          <strong> É este o setor utilizado para benchmarking e comparações.</strong>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <Badge variant="secondary" className="shrink-0">Secundários</Badge>
                      <div>
                        <p className="text-sm font-bold">CAEs Secundários</p>
                        <p className="text-xs text-muted-foreground">
                          Atividades adicionais da empresa. São guardados para referência mas não são utilizados
                          nas comparações setoriais para manter a consistência das análises.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      Esta abordagem está alinhada com as práticas estatísticas oficiais do INE e permite
                      comparações consistentes entre empresas do mesmo setor.
                    </p>
                  </div>
                </div>

                {/* Setores Principais */}
                <div className="border rounded-lg p-4 space-y-4 bg-card">
                  <h3 className="font-bold">Setores Principais (Secções CAE)</h3>
                  <p className="text-sm text-muted-foreground">
                    Os setores principais correspondem às secções da CAE e agrupam
                    atividades económicas com características semelhantes.
                  </p>

                  <div className="grid gap-2">
                    {Object.entries(sectorCAEMapping).map(([key, { code, description }]) => (
                      <div key={key} className="flex items-start gap-3 p-2 rounded hover:bg-muted/50">
                        <Badge variant="outline" className="font-mono shrink-0">{code}</Badge>
                        <div>
                          <span className="font-bold">{sectorLabels[key] || key}</span>
                          <p className="text-xs text-muted-foreground">{description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subsetores da Indústria */}
                <div className="border rounded-lg p-4 space-y-4 bg-card">
                  <h3 className="font-bold">Subsetores da Indústria (Divisões CAE - Seção C)</h3>
                  <p className="text-sm text-muted-foreground">
                    O setor industrial é subdividido em subsetores mais específicos para permitir
                    comparações mais precisas entre empresas com atividades semelhantes.
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(industrySubsectors).map(([key, { code, name }]) => (
                      <div key={key} className="flex items-center gap-2 p-2 rounded bg-muted/30">
                        <Badge variant="secondary" className="font-mono text-xs shrink-0">{code}</Badge>
                        <span className="text-sm">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
          </div>

          {/* === SECTION: Fatores de Intensidade === */}
          <SectionHeader
            id="intensidades"
            title="Fatores de Intensidade de Carbono"
            icon={Scale}
            description="Benchmarks setoriais de emissões por unidade de valor económico"
          />

          <div className="space-y-6">
            <p className="text-muted-foreground">
              Os fatores de intensidade de carbono permitem comparar empresas do mesmo setor
              e estimar emissões quando dados reais não estão disponíveis.
            </p>

                {/* Fonte dos Dados */}
                <div className="border rounded-lg p-4 space-y-4 bg-card">
                  <div className="flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-primary" />
                    <h3 className="font-bold">Fonte dos Dados</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                      <span className="font-bold">Entidade:</span>
                      <span className="text-muted-foreground">INE - Instituto Nacional de Estatística</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                      <span className="font-bold">Publicação:</span>
                      <span className="text-muted-foreground">Contas das Emissões Atmosféricas 1995-2022</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                      <span className="font-bold">Data:</span>
                      <span className="text-muted-foreground">Outubro 2024</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                      <span className="font-bold">Ano referência:</span>
                      <span className="text-muted-foreground">2022</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                      <span className="font-bold">Unidade:</span>
                      <span className="text-muted-foreground">kg CO₂eq por € de VAB</span>
                    </div>
                  </div>
                </div>

                {/* Tabela de Intensidades */}
                <div className="border rounded-lg p-4 space-y-4 bg-card">
                  <h3 className="font-bold">
                    Intensidade de Carbono por Setor ({emissionIntensityMetadata.referenceYear})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 pr-4 font-bold">Setor</th>
                          <th className="text-right py-2 pr-4 font-bold">Intensidade</th>
                          <th className="text-left py-2 font-bold">Fonte</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {[...sectorEmissionFactors]
                          .sort((a, b) => b.intensity - a.intensity)
                          .map((factor) => (
                            <tr key={factor.sector}>
                              <td className="py-2 pr-4">{sectorLabels[factor.sector] || factor.sector}</td>
                              <td className="py-2 pr-4 text-right font-mono">{factor.intensity.toFixed(2)}</td>
                              <td className="py-2">
                                <Badge
                                  variant={factor.source === 'reported' ? 'default' : 'outline'}
                                  className={cn(
                                    "text-xs",
                                    factor.source === 'reported' && "bg-success/20 text-success border-success/30",
                                    factor.source === 'calculated' && "bg-blue-500/20 text-blue-500 border-blue-500/30",
                                    factor.source === 'estimated' && "bg-warning/20 text-warning border-warning/30"
                                  )}
                                >
                                  {factor.source === 'reported' ? 'INE' :
                                   factor.source === 'calculated' ? 'Calc.' : 'Est.'}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <strong>Legenda:</strong> INE = Valor reportado pelo INE | Calc. = Calculado de VAB/GWP | Est. = Estimado
                  </p>
                </div>

                {/* Subsetores da Indústria */}
                <div className="border rounded-lg p-4 space-y-4 bg-card">
                  <h3 className="font-bold">Intensidade de Subsetores Industriais (Seção C)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[...industrySubsectorFactors]
                      .sort((a, b) => b.intensity - a.intensity)
                      .map((factor) => {
                        const isHighIntensity = factor.intensity > 1.0;
                        return (
                          <div
                            key={factor.subsector}
                            className={cn(
                              "flex items-center justify-between p-2 rounded",
                              isHighIntensity ? "bg-danger/10 border border-danger/30" : "bg-muted/30"
                            )}
                          >
                            <span className="text-sm">{sectorLabels[factor.subsector] || factor.subsector}</span>
                            <Badge
                              variant={isHighIntensity ? "destructive" : "secondary"}
                              className="font-mono text-xs"
                            >
                              {factor.intensity.toFixed(2)}
                            </Badge>
                          </div>
                        );
                      })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Valores em {emissionIntensityMetadata.unit}.
                    Subsetores a vermelho têm intensidade acima de 1.0 kg/€.
                  </p>
                </div>

                {/* Nota metodológica */}
                <div className="flex items-start gap-2 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold">Sobre a Metodologia</p>
                    <p className="text-xs text-muted-foreground">
                      Os fatores de intensidade são calculados pelo INE como GWP/VAB (Potencial de Aquecimento Global
                      dividido pelo Valor Acrescentado Bruto). Refletem a média de emissões por unidade de valor
                      económico gerado em cada setor da economia portuguesa.
                    </p>
                  </div>
                </div>

                {/* Justificação de Valores */}
                <div className="border rounded-lg p-4 space-y-4 bg-card">
                  <h3 className="font-bold">Classificação dos Valores</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-2 rounded bg-success/10 border border-success/30">
                      <Badge className="shrink-0">INE</Badge>
                      <div>
                        <p className="text-sm font-bold">Valores Reportados</p>
                        <p className="text-xs text-muted-foreground">
                          Citados diretamente nas publicações oficiais do INE, páginas 5 e 7 das Contas das Emissões Atmosféricas.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-2 rounded bg-blue-500/10 border border-blue-500/30">
                      <Badge variant="outline" className="shrink-0">Calc.</Badge>
                      <div>
                        <p className="text-sm font-bold">Valores Calculados</p>
                        <p className="text-xs text-muted-foreground">
                          Derivados de relações VAB/GWP publicadas pelo INE. Ex: Financeiro = 1 / 463.8 €/kg = 0.002 kg/€.
                          Confirmados por comparação com dados Eurostat.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-2 rounded bg-warning/10 border border-warning/30">
                      <Badge variant="outline" className="shrink-0">Est.</Badge>
                      <div>
                        <p className="text-sm font-bold">Valores Estimados</p>
                        <p className="text-xs text-muted-foreground">
                          Baseados em médias Eurostat para Portugal, comparação com DEFRA UK, ou interpolação de setores similares.
                          Têm maior incerteza e devem ser usados com cautela.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

            {/* Limitações */}
            <div className="flex items-start gap-2 p-3 bg-warning/5 rounded-lg border border-warning/20">
              <Info className="h-4 w-4 text-warning mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold">Limitações dos Dados</p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1 list-disc list-inside">
                  <li>Valores são médias setoriais; empresas individuais podem variar significativamente</li>
                  <li>Dados de 2022 com metodologia INE, podem haver revisões futuras</li>
                  <li>Valores estimados têm maior incerteza e devem ser usados com cautela</li>
                  <li>Classificação CAE pode não captar especificidades de atividades mistas</li>
                </ul>
              </div>
            </div>
          </div>

          {/* === SECTION: Dados a Recolher === */}
          <SectionHeader
            id="dados"
            title="Dados a Recolher por Empresa"
            icon={FileSpreadsheet}
            description="Informação necessária para cálculo e comparação de emissões"
          />

          <div className="space-y-6">
            <p className="text-muted-foreground">
              Para permitir o cálculo de emissões e a comparação entre empresas, devem ser recolhidos
              os seguintes dados de cada organização:
            </p>

                {/* Dados Obrigatórios */}
                <div className="border rounded-lg p-4 space-y-4 bg-card">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <h3 className="font-bold">Dados Obrigatórios</h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 pr-4 font-bold">Campo</th>
                          <th className="text-left py-2 pr-4 font-bold">Descrição</th>
                          <th className="text-left py-2 font-bold">Unidade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="py-2 pr-4 font-bold">Identificação</td>
                          <td className="py-2 pr-4 text-muted-foreground">Nome da empresa e NIF</td>
                          <td className="py-2 text-muted-foreground">—</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 font-bold">Setor de Atividade</td>
                          <td className="py-2 pr-4 text-muted-foreground">Classificação CAE principal</td>
                          <td className="py-2 text-muted-foreground">Código CAE</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 font-bold">Localização</td>
                          <td className="py-2 pr-4 text-muted-foreground">Distrito, município e freguesia</td>
                          <td className="py-2 text-muted-foreground">—</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 font-bold">Scope 1</td>
                          <td className="py-2 pr-4 text-muted-foreground">Emissões diretas (combustíveis, processos)</td>
                          <td className="py-2 text-muted-foreground">t CO₂e/ano</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 font-bold">Scope 2</td>
                          <td className="py-2 pr-4 text-muted-foreground">Emissões indiretas (energia comprada)</td>
                          <td className="py-2 text-muted-foreground">t CO₂e/ano</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 font-bold">Scope 3</td>
                          <td className="py-2 pr-4 text-muted-foreground">Outras emissões indiretas (cadeia de valor)</td>
                          <td className="py-2 text-muted-foreground">t CO₂e/ano</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 font-bold">Faturação</td>
                          <td className="py-2 pr-4 text-muted-foreground">Volume de negócios anual</td>
                          <td className="py-2 text-muted-foreground">M€</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 font-bold">Colaboradores</td>
                          <td className="py-2 pr-4 text-muted-foreground">Número de funcionários (FTE)</td>
                          <td className="py-2 text-muted-foreground">nº</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 font-bold">Área</td>
                          <td className="py-2 pr-4 text-muted-foreground">Área das instalações</td>
                          <td className="py-2 text-muted-foreground">m²</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Dados Opcionais */}
                <div className="border rounded-lg p-4 space-y-4 bg-card">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-bold">Dados Opcionais (Recomendados)</h3>
                  </div>

                  <div className="grid gap-2">
                    {[
                      { field: "Subsetor", desc: "Detalhe do tipo de atividade industrial (se aplicável)" },
                      { field: "Certificações", desc: "ISO 14001, ISO 50001, certificações ambientais" },
                      { field: "Metas de Redução", desc: "Compromissos de redução de emissões assumidos" },
                      { field: "Fonte de Dados", desc: "Origem dos dados de emissões (calculadora, relatório, estimativa)" },
                      { field: "Ano de Referência", desc: "Ano a que os dados se referem" },
                    ].map((item) => (
                      <div key={item.field} className="flex items-start gap-3 p-2 rounded bg-muted/30">
                        <span className="font-bold text-sm shrink-0">{item.field}</span>
                        <span className="text-sm text-muted-foreground">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

            {/* Nota sobre qualidade dos dados */}
            <div className="flex items-start gap-2 p-3 bg-warning/5 rounded-lg border border-warning/20">
              <Info className="h-4 w-4 text-warning mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold">Qualidade dos Dados</p>
                <p className="text-sm text-muted-foreground">
                  A fiabilidade das análises depende da qualidade dos dados fornecidos. Recomenda-se
                  que as empresas utilizem dados verificados ou provenientes de relatórios de sustentabilidade
                  auditados sempre que possível.
                </p>
              </div>
            </div>
          </div>

          {/* === SECTION: Fluxo de Onboarding === */}
          <SectionHeader
            id="onboarding"
            title="Fluxo de Onboarding"
            icon={CheckCircle2}
            description="Estados e progressão das empresas no processo de cálculo da pegada"
          />

          <div className="space-y-6">
            <p className="text-muted-foreground">
              O fluxo de onboarding representa o percurso de uma empresa desde o primeiro contacto
              até à conclusão do cálculo da sua pegada de carbono. Existem dois caminhos possíveis:
              via plataforma <strong>Simple</strong> ou via <strong>Formulário</strong> manual.
            </p>

            {/* Diagrama do Fluxo */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Diagrama do Fluxo</h3>
              <div className="p-4 bg-muted/30 rounded-lg overflow-x-auto">
                <pre className="text-xs font-mono text-muted-foreground whitespace-pre">
{`┌─────────────────┐
│  Por contactar  │ ← Empresa ainda não foi contactada
└────────┬────────┘
         ▼
┌─────────────────┐
│  Sem interação  │ ← Email enviado, sem resposta
└────────┬────────┘
         ▼
┌─────────────────┐
│   Interessada   │ ← Clicou no link do email
└────────┬────────┘
         │
         ├───────────────────────────┐
         ▼                           ▼
┌─────────────────┐       ┌─────────────────┐
│    Registada    │       │  Em progresso   │
│    (Simple)     │       │  (Formulário)   │
└────────┬────────┘       └────────┬────────┘
         ▼                         │
┌─────────────────┐                │
│  Em progresso   │                │
│    (Simple)     │                │
└────────┬────────┘                │
         │                         │
         └────────────┬────────────┘
                      ▼
           ┌─────────────────┐
           │    Completo     │ ← Pegada calculada
           │ (Simple/Form.)  │
           └─────────────────┘`}
                </pre>
              </div>
            </div>

            {/* Estados */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Descrição dos Estados</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-status-pending/10 border border-status-pending/30">
                  <Badge className="bg-status-pending shrink-0">1</Badge>
                  <div>
                    <p className="font-bold">Por contactar</p>
                    <p className="text-sm text-muted-foreground">
                      Estado inicial. A empresa foi adicionada ao cluster mas ainda não recebeu nenhum email de incentivo.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-status-contacted/10 border border-status-contacted/30">
                  <Badge className="bg-status-contacted shrink-0">2</Badge>
                  <div>
                    <p className="font-bold">Sem interação</p>
                    <p className="text-sm text-muted-foreground">
                      A empresa recebeu pelo menos um email mas não demonstrou interesse (não clicou em nenhum link).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-status-interested/10 border border-status-interested/30">
                  <Badge className="bg-status-interested shrink-0">3</Badge>
                  <div>
                    <p className="font-bold">Interessada</p>
                    <p className="text-sm text-muted-foreground">
                      A empresa clicou no link do email, demonstrando interesse em calcular a sua pegada de carbono.
                      Neste ponto, pode escolher entre o caminho Simple ou Formulário.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-status-registered/10 border border-status-registered/30">
                  <Badge className="bg-status-registered shrink-0">4</Badge>
                  <div>
                    <p className="font-bold">Registada (apenas Simple)</p>
                    <p className="text-sm text-muted-foreground">
                      A empresa criou uma conta na plataforma Simple. Este estado só existe no caminho Simple.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-status-progress/10 border border-status-progress/30">
                  <Badge className="bg-status-progress shrink-0">5</Badge>
                  <div>
                    <p className="font-bold">Em progresso</p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Simple:</strong> A empresa iniciou o preenchimento dos dados na plataforma Simple.<br />
                      <strong>Formulário:</strong> A empresa iniciou o preenchimento do formulário manual.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-status-complete/10 border border-status-complete/30">
                  <Badge className="bg-status-complete shrink-0">6</Badge>
                  <div>
                    <p className="font-bold">Completo</p>
                    <p className="text-sm text-muted-foreground">
                      A pegada de carbono foi calculada com sucesso. O estado indica também o caminho utilizado
                      (Simple ou Formulário) para referência.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Caminhos */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border rounded-lg p-4 space-y-3 bg-card">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-primary/10">
                    <Leaf className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-bold">Caminho Simple</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Plataforma self-service onde a empresa preenche os dados e obtém o cálculo automaticamente.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Requer criação de conta</li>
                  <li>Cálculo automático</li>
                  <li>Resultado imediato</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 space-y-3 bg-card">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-muted">
                    <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h3 className="font-bold">Caminho Formulário</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Formulário manual para empresas que preferem submeter dados sem criar conta.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Não requer registo</li>
                  <li>Processamento manual</li>
                  <li>Validação pela equipa</li>
                </ul>
              </div>
            </div>

            {/* Nota sobre configuração */}
            <div className="flex items-start gap-2 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
              <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold">Configuração Centralizada</p>
                <p className="text-sm text-muted-foreground">
                  A configuração dos estados de onboarding está centralizada em <code className="text-xs bg-muted px-1 py-0.5 rounded">src/config/onboardingStatus.ts</code>.
                  Esta configuração é utilizada em toda a aplicação para garantir consistência visual e descritiva.
                </p>
              </div>
            </div>
          </div>

          {/* === SECTION: Gestão de Clusters === */}
          <SectionHeader
            id="clusters"
            title="Gestão de Clusters"
            icon={Layers}
            description="Organização e gestão de grupos de empresas"
          />

          <div className="space-y-6">
            <p className="text-muted-foreground">
              Os clusters permitem organizar empresas em grupos lógicos para facilitar a gestão,
              análise e comunicação. Cada cluster pode representar uma região, setor, programa ou
              qualquer outro critério de agrupamento.
            </p>

            {/* Importação de Empresas */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-primary/10">
                  <Upload className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-bold">Importação de Empresas</h3>
              </div>

              <p className="text-sm text-muted-foreground">
                Existem 3 métodos para adicionar empresas a um cluster:
              </p>

              <div className="grid gap-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Badge className="shrink-0">1</Badge>
                  <div>
                    <p className="font-bold">Importação CSV</p>
                    <p className="text-sm text-muted-foreground">
                      Carregar um ficheiro CSV com as colunas: Nome, NIF, Email.
                      O sistema valida automaticamente o formato e os dados.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Badge className="shrink-0">2</Badge>
                  <div>
                    <p className="font-bold">Colar Dados</p>
                    <p className="text-sm text-muted-foreground">
                      Copiar dados de uma folha de cálculo (Excel, Google Sheets) e colar
                      directamente na interface. O sistema detecta automaticamente as colunas.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Badge className="shrink-0">3</Badge>
                  <div>
                    <p className="font-bold">Entrada Manual</p>
                    <p className="text-sm text-muted-foreground">
                      Adicionar empresas uma a uma através de um formulário.
                      Útil para pequenas adições ou correções.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-success/5 rounded-lg border border-success/20">
                <Info className="h-4 w-4 text-success mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <strong>Segurança:</strong> A importação nunca é destrutiva. Novos dados são
                  adicionados ou atualizados, mas nunca eliminados automaticamente.
                </p>
              </div>
            </div>

            {/* Regras de Deduplicação */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-blue-500/10">
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
                <h3 className="font-bold">Regras de Deduplicação</h3>
              </div>

              <p className="text-sm text-muted-foreground">
                O sistema utiliza o NIF como identificador único universal para evitar duplicações:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-bold">Cenário</th>
                      <th className="text-left py-2 font-bold">Comportamento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-2 pr-4">NIF não existe no sistema</td>
                      <td className="py-2 text-muted-foreground">Nova empresa é criada e associada ao cluster</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">NIF já existe noutro cluster</td>
                      <td className="py-2 text-muted-foreground">Empresa é adicionada ao novo cluster (pertence a ambos)</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">NIF já existe no mesmo cluster</td>
                      <td className="py-2 text-muted-foreground">Dados são atualizados (nome, email) se diferentes</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex items-start gap-2 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <strong>Multi-cluster:</strong> Uma empresa pode pertencer a múltiplos clusters
                  simultaneamente. As contagens são sempre por NIF único, evitando dupla contagem
                  nas estatísticas globais.
                </p>
              </div>
            </div>

            {/* Operações de Clusters */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Operações de Clusters</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-success/10 border border-success/30">
                  <Badge className="bg-success shrink-0">Criar</Badge>
                  <div>
                    <p className="text-sm font-bold">Criar Cluster</p>
                    <p className="text-xs text-muted-foreground">
                      Definir um nome e selecionar um ícone identificativo.
                      O cluster fica imediatamente disponível para receber empresas.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <Badge className="bg-blue-500 shrink-0">Mover</Badge>
                  <div>
                    <p className="text-sm font-bold">Mover Empresas</p>
                    <p className="text-xs text-muted-foreground">
                      Transferir empresas entre clusters. Opção "manter cópia" permite
                      que a empresa permaneça no cluster original e seja adicionada ao destino.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-danger/10 border border-danger/30">
                  <Badge variant="destructive" className="shrink-0">Eliminar</Badge>
                  <div>
                    <p className="text-sm font-bold">Eliminar Cluster</p>
                    <p className="text-xs text-muted-foreground">
                      Duas opções disponíveis:<br />
                      <strong>Opção 1:</strong> Mover todas as empresas para outro cluster antes de eliminar.<br />
                      <strong>Opção 2:</strong> Eliminar referências (apenas empresas "órfãs" são removidas do sistema).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Proteção de Dados */}
            <div className="border rounded-lg p-4 space-y-4 bg-warning/5 border-warning/20">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <h3 className="font-bold">Proteção de Dados</h3>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>Empresas com pegada calculada são imutáveis:</strong> Não podem ser
                  eliminadas nem ter os seus dados de emissões alterados para garantir a
                  integridade histórica.
                </p>
                <p>
                  <strong>Eliminação de cluster não apaga empresas partilhadas:</strong> Empresas
                  que pertencem a múltiplos clusters mantêm-se no sistema através das outras associações.
                </p>
                <p>
                  <strong>Apenas empresas "órfãs" são removidas:</strong> Empresas que só pertencem
                  ao cluster a ser eliminado são efetivamente removidas do sistema.
                </p>
              </div>
            </div>

            {/* Workflow de Criação */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Workflow de Criação de Cluster</h3>
              <p className="text-sm text-muted-foreground">
                Criar um cluster é o primeiro passo para organizar empresas na plataforma.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Badge className="shrink-0 bg-primary">1</Badge>
                  <div>
                    <p className="font-bold text-sm">Iniciar criação</p>
                    <p className="text-xs text-muted-foreground">
                      Clicar no botão "Novo Cluster" no topo da página de Clusters.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Badge className="shrink-0 bg-primary">2</Badge>
                  <div>
                    <p className="font-bold text-sm">Definir identidade</p>
                    <p className="text-xs text-muted-foreground">
                      Escolher um nome descritivo e seleccionar um ícone identificativo
                      (ex: 🏭 para fornecedores industriais).
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Badge className="shrink-0 bg-primary">3</Badge>
                  <div>
                    <p className="font-bold text-sm">Cluster criado</p>
                    <p className="text-xs text-muted-foreground">
                      O cluster fica imediatamente disponível para receber empresas
                      através de importação CSV, colar dados ou entrada manual.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Validação de Dados */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Validação de Dados na Importação</h3>
              <p className="text-sm text-muted-foreground">
                O sistema valida automaticamente os dados durante a importação:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-bold">Campo</th>
                      <th className="text-left py-2 pr-4 font-bold">Regra</th>
                      <th className="text-left py-2 font-bold">Exemplo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-2 pr-4 font-bold">NIF</td>
                      <td className="py-2 pr-4 text-muted-foreground">9 dígitos, check-digit válido</td>
                      <td className="py-2 font-mono text-xs">501234567</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-bold">Email</td>
                      <td className="py-2 pr-4 text-muted-foreground">Formato válido com @</td>
                      <td className="py-2 font-mono text-xs">info@empresa.pt</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-bold">Nome</td>
                      <td className="py-2 pr-4 text-muted-foreground">Mínimo 2 caracteres</td>
                      <td className="py-2 font-mono text-xs">Empresa, Lda</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex items-start gap-2 p-3 bg-warning/5 rounded-lg border border-warning/20">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <strong>Linhas inválidas:</strong> São sinalizadas mas não bloqueiam a importação.
                  Pode corrigir os dados e reimportar posteriormente.
                </p>
              </div>
            </div>

            {/* Casos de Uso */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Casos de Uso Típicos</h3>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <Building2 className="h-5 w-5 text-blue-500 mb-2" />
                  <p className="font-bold text-sm">Fornecedores</p>
                  <p className="text-xs text-muted-foreground">
                    Empresa agrupa os seus fornecedores para análise de Scope 3.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                  <Landmark className="h-5 w-5 text-purple-500 mb-2" />
                  <p className="font-bold text-sm">Programa Municipal</p>
                  <p className="text-xs text-muted-foreground">
                    Município cria cluster para empresas de um programa específico.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <Briefcase className="h-5 w-5 text-muted-foreground mb-2" />
                  <p className="font-bold text-sm">Setor Específico</p>
                  <p className="text-xs text-muted-foreground">
                    Agrupar empresas do mesmo setor para benchmarking dedicado.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* === SECTION: Dashboard === */}
          <SectionHeader
            id="dashboard"
            title="Dashboard"
            icon={LayoutDashboard}
            description="Análise e monitorização de emissões de carbono"
          />

          <div className="space-y-6">
            <p className="text-muted-foreground">
              O Dashboard oferece uma visão consolidada das emissões de carbono
              do seu portfolio de empresas, com métricas, gráficos e ferramentas de análise.
            </p>

            {/* Métricas Principais */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Métricas Principais (KPIs)</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-bold">Métrica</th>
                      <th className="text-left py-2 pr-4 font-bold">Descrição</th>
                      <th className="text-left py-2 font-bold">Unidade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-2 pr-4 font-bold">Emissões Totais</td>
                      <td className="py-2 pr-4 text-muted-foreground">Soma de todas as emissões das empresas</td>
                      <td className="py-2 text-muted-foreground">t CO₂e</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-bold">Potencial de Melhoria</td>
                      <td className="py-2 pr-4 text-muted-foreground">Redução possível com otimizações</td>
                      <td className="py-2 text-muted-foreground">Alto/Médio/Baixo</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-bold">Média por Facturação</td>
                      <td className="py-2 pr-4 text-muted-foreground">Intensidade de carbono por euro gerado</td>
                      <td className="py-2 text-muted-foreground">t CO₂e/€</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-bold">Média por Colaborador</td>
                      <td className="py-2 pr-4 text-muted-foreground">Intensidade de carbono por pessoa</td>
                      <td className="py-2 text-muted-foreground">t CO₂e/colaborador</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-bold">Média por Área</td>
                      <td className="py-2 pr-4 text-muted-foreground">Intensidade de carbono por metro quadrado</td>
                      <td className="py-2 text-muted-foreground">t CO₂e/m²</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5 Separadores */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Separadores do Dashboard</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <Badge className="shrink-0">1</Badge>
                  <div>
                    <p className="font-bold">Visão Geral</p>
                    <p className="text-sm text-muted-foreground">
                      KPIs principais, cobertura de dados, lista de empresas críticas (acima da média)
                      e top performers (mais eficientes).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Badge variant="secondary" className="shrink-0">2</Badge>
                  <div>
                    <p className="font-bold">Empresas</p>
                    <p className="text-sm text-muted-foreground">
                      Lista completa de empresas com filtros avançados, pesquisa por nome/NIF,
                      ordenação por múltiplos critérios, e visualização em grid ou tabela.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Badge variant="secondary" className="shrink-0">3</Badge>
                  <div>
                    <p className="font-bold">Detalhes de Emissões</p>
                    <p className="text-sm text-muted-foreground">
                      Gráficos de distribuição por âmbito (Scope 1, 2, 3), comparações
                      temporais e análise de evolução das emissões.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Badge variant="secondary" className="shrink-0">4</Badge>
                  <div>
                    <p className="font-bold">Análise por Atividade</p>
                    <p className="text-sm text-muted-foreground">
                      Heatmap região×sector para identificar concentrações de emissões,
                      benchmarking sectorial comparando com médias nacionais.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Badge variant="secondary" className="shrink-0">5</Badge>
                  <div>
                    <p className="font-bold">Análise Financeira</p>
                    <p className="text-sm text-muted-foreground">
                      Ranking por eficiência financeira (FE = emissões/facturação),
                      gráfico Pareto 80/20 identificando empresas responsáveis pela maioria das emissões.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtros Disponíveis */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Filtros Disponíveis</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <p className="font-bold text-sm">Cluster</p>
                  <p className="text-xs text-muted-foreground">Grupo de empresas</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <p className="font-bold text-sm">Dimensão</p>
                  <p className="text-xs text-muted-foreground">Micro, Pequena, Média, Grande</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <p className="font-bold text-sm">Sector</p>
                  <p className="text-xs text-muted-foreground">Código CAE</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <p className="font-bold text-sm">Região</p>
                  <p className="text-xs text-muted-foreground">Distrito, Município, Freguesia</p>
                </div>
              </div>
            </div>

            {/* Diferenças por Tipo de Utilizador */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border rounded-lg p-4 space-y-3 bg-blue-500/5 border-blue-500/20">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-500" />
                  <h3 className="font-bold">Vista Empresa</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Foco na gestão de fornecedores e cadeia de valor:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Análise de fornecedores por emissões</li>
                  <li>Alternativas mais eficientes</li>
                  <li>Impacto de substituição</li>
                  <li>Otimização de Scope 3</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 space-y-3 bg-purple-500/5 border-purple-500/20">
                <div className="flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-purple-500" />
                  <h3 className="font-bold">Vista Município</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Foco na gestão territorial e políticas públicas:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Empresas de risco no território</li>
                  <li>Emissões acima da média sectorial</li>
                  <li>Infraestruturas de descarbonização</li>
                  <li>Programas de incentivo</li>
                </ul>
              </div>
            </div>

            {/* KPIs de Infraestruturas (Municípios) */}
            <div className="border rounded-lg p-4 space-y-4 bg-purple-500/5 border-purple-500/20">
              <div className="flex items-center gap-2">
                <Landmark className="h-4 w-4 text-purple-500" />
                <h3 className="font-bold">KPIs de Infraestruturas (Municípios)</h3>
              </div>

              <p className="text-sm text-muted-foreground">
                Indicadores de infraestruturas de apoio à descarbonização no território:
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "Postos de carregamento",
                  "Ecopontos",
                  "Estações de bicicletas",
                  "Contentores orgânicos",
                  "Ciclovias (km)",
                  "Paragens de transporte público",
                  "Qualidade do ar",
                ].map((item) => (
                  <div key={item} className="p-2 rounded bg-muted/30">
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detalhes dos Separadores */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Detalhes dos Separadores</h3>

              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-muted/30 space-y-2">
                  <p className="font-bold text-sm">Visão Geral</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Cards de KPI com valores agregados e tendências</li>
                    <li>Barra de cobertura de dados (percentagem de empresas com pegada calculada)</li>
                    <li>Top 5 empresas com maior emissão absoluta</li>
                    <li>Top 5 empresas mais eficientes por intensidade de carbono</li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-muted/30 space-y-2">
                  <p className="font-bold text-sm">Empresas</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Listagem completa com pesquisa, filtros e ordenação</li>
                    <li>Vista em cards ou tabela (toggle de visualização)</li>
                    <li>Exportação de dados em CSV</li>
                    <li>Acesso directo ao detalhe de cada empresa</li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-muted/30 space-y-2">
                  <p className="font-bold text-sm">Detalhes de Emissões</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Distribuição por Scope (1, 2, 3) em gráfico circular</li>
                    <li>Evolução temporal das emissões</li>
                    <li>Breakdown por categoria de actividade</li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-muted/30 space-y-2">
                  <p className="font-bold text-sm">Análise por Actividade</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Heatmap região × sector para identificar concentrações</li>
                    <li>Benchmarking sectorial com médias nacionais</li>
                    <li>Ranking de sectores por intensidade de carbono</li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-muted/30 space-y-2">
                  <p className="font-bold text-sm">Análise Financeira</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Financial Efficiency (FE) = emissões / facturação</li>
                    <li>Gráfico Pareto 80/20 para priorização</li>
                    <li>Comparação de eficiência entre empresas</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sistema de Filtros Avançado */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Sistema de Filtros Avançado</h3>
              <p className="text-sm text-muted-foreground">
                Todos os separadores partilham um sistema de filtros persistente que permite
                refinar a análise em tempo real.
              </p>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="font-bold text-sm">Filtros de Segmentação</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Por cluster (grupo de empresas)</li>
                    <li>Por dimensão (Micro, PME, Grande)</li>
                    <li>Por sector de actividade (CAE)</li>
                    <li>Por região geográfica</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-sm">Filtros de Performance</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Empresas acima/abaixo da média</li>
                    <li>Com/sem pegada calculada</li>
                    <li>Por nível de potencial de melhoria</li>
                    <li>Por intervalo de emissões</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* === SECTION: Gráficos e Análises === */}
          <SectionHeader
            id="graficos"
            title="Gráficos e Análises"
            icon={PieChart}
            description="Visualizações interactivas para análise de emissões"
          />

          <div className="space-y-6">
            <p className="text-muted-foreground">
              A plataforma disponibiliza múltiplos tipos de gráficos para análise visual das emissões,
              acessíveis nos diferentes separadores do Dashboard.
            </p>

            {/* Tipos de Gráficos */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Tipos de Gráficos Disponíveis</h3>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <BarChart3 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Gráficos de Barras</p>
                    <p className="text-xs text-muted-foreground">
                      Comparação de emissões entre empresas, sectores ou regiões.
                      Suportam empilhamento por Scope.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <PieChart className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Gráficos Circulares</p>
                    <p className="text-xs text-muted-foreground">
                      Distribuição proporcional de emissões por Scope,
                      sector ou categoria de actividade.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Grid3X3 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Heatmaps</p>
                    <p className="text-xs text-muted-foreground">
                      Matrizes região × sector para identificar concentrações
                      de emissões no território.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <CircleDot className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Gráficos de Dispersão</p>
                    <p className="text-xs text-muted-foreground">
                      Correlação entre variáveis como emissões vs. facturação
                      ou emissões vs. colaboradores.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Hexagon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Gráficos Radar</p>
                    <p className="text-xs text-muted-foreground">
                      Perfil multidimensional de empresas comparando múltiplos
                      indicadores simultaneamente.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <TrendingDown className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Gráficos Pareto</p>
                    <p className="text-xs text-muted-foreground">
                      Análise 80/20 para identificar as empresas responsáveis
                      pela maioria das emissões.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactividade */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Interactividade</h3>
              <p className="text-sm text-muted-foreground">
                Todos os gráficos são interactivos e oferecem:
              </p>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                  <MousePointer className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Hover</p>
                    <p className="text-xs text-muted-foreground">
                      Tooltips com valores detalhados ao passar o rato.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                  <MousePointerClick className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Click</p>
                    <p className="text-xs text-muted-foreground">
                      Navegação para detalhe da empresa ou sector clicado.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                  <Download className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Exportar</p>
                    <p className="text-xs text-muted-foreground">
                      Exportação de dados em formato CSV para análise externa.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Métricas Visuais */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Escalas e Codificação Visual</h3>
              <p className="text-sm text-muted-foreground">
                A plataforma utiliza codificação consistente em todas as visualizações:
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-success shrink-0" />
                  <p className="text-sm"><span className="font-bold">Verde:</span> <span className="text-muted-foreground">Emissões abaixo da média ou potencial baixo</span></p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-warning shrink-0" />
                  <p className="text-sm"><span className="font-bold">Amarelo:</span> <span className="text-muted-foreground">Emissões próximas da média ou potencial médio</span></p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-danger shrink-0" />
                  <p className="text-sm"><span className="font-bold">Vermelho:</span> <span className="text-muted-foreground">Emissões acima da média ou potencial alto</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* === SECTION: Planos de Acção === */}
          <SectionHeader
            id="planos"
            title="Planos de Acção"
            icon={Target}
            description="Definição de objectivos e estratégias de descarbonização"
          />

          <div className="space-y-6">
            <p className="text-muted-foreground">
              Os Planos de Acção permitem definir objectivos concretos de redução de emissões
              e acompanhar o progresso ao longo do tempo, tanto a nível individual como territorial.
            </p>

            {/* Tipos de Planos */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Tipos de Planos</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    <p className="font-bold text-sm">Plano Empresarial</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Plano individual para uma empresa com metas específicas de redução,
                    medidas concretas e cronograma de implementação.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Metas por Scope (1, 2, 3)</li>
                    <li>Cronograma com milestones</li>
                    <li>Estimativa de investimento</li>
                    <li>ROI esperado</li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-purple-500" />
                    <p className="font-bold text-sm">Plano Territorial</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Plano para um município ou região com objectivos agregados,
                    políticas públicas e incentivos à descarbonização.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Metas territoriais agregadas</li>
                    <li>Políticas públicas de suporte</li>
                    <li>Programas de incentivo</li>
                    <li>Monitorização de progresso</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Estados do Plano */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Estados do Plano</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Badge className="shrink-0 bg-muted text-muted-foreground">Rascunho</Badge>
                  <p className="text-sm text-muted-foreground">
                    Em preparação. Pode ser editado livremente antes de ser activado.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Badge className="shrink-0 bg-primary">Activo</Badge>
                  <p className="text-sm text-muted-foreground">
                    Em execução. As medidas estão a ser implementadas e monitorizadas.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Badge className="shrink-0 bg-success text-success-foreground">Concluído</Badge>
                  <p className="text-sm text-muted-foreground">
                    Todas as metas foram atingidas ou o prazo terminou.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* === SECTION: Medidas === */}
          <SectionHeader
            id="medidas"
            title="Medidas de Descarbonização"
            icon={Leaf}
            description="Catálogo de medidas para redução de emissões"
          />

          <div className="space-y-6">
            <p className="text-muted-foreground">
              A plataforma disponibiliza um catálogo de medidas de descarbonização organizadas
              por categoria, com estimativa de impacto e custo de implementação.
            </p>

            {/* Categorias de Medidas */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Categorias de Medidas</h3>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Zap className="h-5 w-5 text-yellow-500 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">Energia</p>
                    <p className="text-xs text-muted-foreground">
                      Eficiência energética, energias renováveis, iluminação LED,
                      painéis solares, bombas de calor.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Car className="h-5 w-5 text-blue-500 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">Mobilidade</p>
                    <p className="text-xs text-muted-foreground">
                      Frota eléctrica, car sharing, teletrabalho,
                      incentivo ao transporte público.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Droplets className="h-5 w-5 text-cyan-500 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">Água e Resíduos</p>
                    <p className="text-xs text-muted-foreground">
                      Redução de consumo de água, reciclagem, economia circular,
                      compostagem.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Factory className="h-5 w-5 text-orange-500 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">Processos</p>
                    <p className="text-xs text-muted-foreground">
                      Optimização de processos produtivos, substituição de matérias-primas,
                      digitalização.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informação por Medida */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Informação por Medida</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-bold">Campo</th>
                      <th className="text-left py-2 font-bold">Descrição</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-2 pr-4 font-bold">Nome</td>
                      <td className="py-2 text-muted-foreground">Designação da medida</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-bold">Categoria</td>
                      <td className="py-2 text-muted-foreground">Energia, Mobilidade, Água/Resíduos ou Processos</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-bold">Impacto estimado</td>
                      <td className="py-2 text-muted-foreground">Redução esperada em t CO₂e/ano</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-bold">Custo</td>
                      <td className="py-2 text-muted-foreground">Investimento estimado em euros</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-bold">Payback</td>
                      <td className="py-2 text-muted-foreground">Tempo estimado de retorno do investimento</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-bold">Complexidade</td>
                      <td className="py-2 text-muted-foreground">Baixa, Média ou Alta</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* === SECTION: Financiamento === */}
          <SectionHeader
            id="financiamento"
            title="Financiamento"
            icon={Euro}
            description="Fontes de financiamento para a descarbonização"
          />

          <div className="space-y-6">
            <p className="text-muted-foreground">
              A secção de financiamento agrega informação sobre programas de apoio,
              incentivos fiscais e fontes de financiamento disponíveis para projectos
              de descarbonização.
            </p>

            {/* Tipos de Financiamento */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Tipos de Financiamento</h3>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="p-3 rounded-lg bg-muted/30 space-y-2">
                  <Gift className="h-5 w-5 text-green-500 mb-1" />
                  <p className="font-bold text-sm">Subsídios</p>
                  <p className="text-xs text-muted-foreground">
                    Fundos europeus (PRR, PT2030), programas nacionais
                    e apoios municipais a fundo perdido.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-muted/30 space-y-2">
                  <Receipt className="h-5 w-5 text-blue-500 mb-1" />
                  <p className="font-bold text-sm">Incentivos Fiscais</p>
                  <p className="text-xs text-muted-foreground">
                    Deduções em IRC, benefícios fiscais para investimentos
                    verdes e créditos de carbono.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-muted/30 space-y-2">
                  <Euro className="h-5 w-5 text-purple-500 mb-1" />
                  <p className="font-bold text-sm">Linhas de Crédito</p>
                  <p className="text-xs text-muted-foreground">
                    Linhas de crédito bonificado para projectos de eficiência
                    energética e transição verde.
                  </p>
                </div>
              </div>
            </div>

            {/* Informação por Programa */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Informação por Programa</h3>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li><strong>Nome do programa</strong> e entidade promotora</li>
                <li><strong>Elegibilidade:</strong> Tipos de empresa, sectores, dimensão</li>
                <li><strong>Montantes:</strong> Valor mínimo e máximo de apoio</li>
                <li><strong>Prazos:</strong> Datas de candidatura e execução</li>
                <li><strong>Documentação:</strong> Links para regulamentos e formulários</li>
              </ul>
            </div>

            {/* Nota */}
            <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                A informação de financiamento é actualizada periodicamente pela equipa Get2C.
                Consulte sempre as fontes oficiais para confirmar elegibilidade e prazos.
              </p>
            </div>
          </div>

          {/* === SECTION: Painel de Controlo === */}
          <SectionHeader
            id="admin"
            title="Painel de Controlo"
            icon={TowerControl}
            description="Gestão de clientes, permissões e métricas globais (apenas Get2C)"
          />

          <div className="space-y-6">
            <p className="text-muted-foreground">
              O Painel de Controlo é a área de administração exclusiva para utilizadores Get2C.
              Permite gerir clientes, definir permissões de acesso e monitorizar métricas agregadas
              de toda a plataforma.
            </p>

            {/* Acesso */}
            <div className="border rounded-lg p-4 space-y-3 bg-card">
              <h3 className="font-bold">Acesso</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Disponível apenas para utilizadores do tipo <strong>Get2C</strong></li>
                <li>Acessível via menu "Painel de controlo" no header</li>
                <li>Rota protegida: utilizadores não-Get2C são redirecionados</li>
              </ul>
            </div>

            {/* Gestão de Clientes */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Gestão de Clientes</h3>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="font-bold text-sm">Criar Cliente</p>
                  <p className="text-xs text-muted-foreground">Nome, email, tipo (Município/Empresa), logótipo</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="font-bold text-sm">Editar Cliente</p>
                  <p className="text-xs text-muted-foreground">Alterar dados e permissões existentes</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="font-bold text-sm">Arquivar/Reativar</p>
                  <p className="text-xs text-muted-foreground">Ocultar clientes sem eliminar dados</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="font-bold text-sm">Eliminar</p>
                  <p className="text-xs text-muted-foreground">Remover permanentemente (apenas arquivados)</p>
                </div>
              </div>
            </div>

            {/* Perfis de Permissões */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Perfis de Permissões</h3>
              <p className="text-sm text-muted-foreground">
                Três perfis pré-definidos para configuração rápida:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <Badge className="shrink-0 bg-blue-500">1</Badge>
                  <div>
                    <p className="font-bold">Visualização</p>
                    <p className="text-sm text-muted-foreground">
                      Apenas consulta. Dashboard completo, clusters e incentivos só leitura, sem pipeline.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                  <Badge className="shrink-0 bg-amber-500">2</Badge>
                  <div>
                    <p className="font-bold">Gestão Parcial</p>
                    <p className="text-sm text-muted-foreground">
                      Pode criar/editar clusters, enviar emails. Não pode eliminar nem gerir templates.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                  <Badge className="shrink-0 bg-green-500">3</Badge>
                  <div>
                    <p className="font-bold">Gestão Completa</p>
                    <p className="text-sm text-muted-foreground">
                      Acesso total a todas as funcionalidades, incluindo eliminação e gestão de templates.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Permissões Granulares */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Permissões Granulares</h3>
              <p className="text-sm text-muted-foreground">
                Além dos perfis, cada permissão pode ser configurada individualmente:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-bold">Módulo</th>
                      <th className="text-left py-2 font-bold">Permissões Disponíveis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-2 pr-4 font-bold">Dashboard</td>
                      <td className="py-2 text-muted-foreground">Ver KPIs, gráficos, detalhes, usar filtros</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-bold">Clusters</td>
                      <td className="py-2 text-muted-foreground">Ver KPIs/lista, criar, editar, eliminar, gerir empresas</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-bold">Incentivos</td>
                      <td className="py-2 text-muted-foreground">Ver KPIs/funil/lista, enviar emails, gerir templates</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-bold">Pipeline</td>
                      <td className="py-2 text-muted-foreground">Ver, editar</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Métricas Globais */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Métricas Globais</h3>
              <p className="text-sm text-muted-foreground">
                O painel apresenta métricas agregadas de todos os clientes ativos:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <p className="font-bold text-sm">Total Clientes</p>
                  <p className="text-xs text-muted-foreground">Municípios + Empresas</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <p className="font-bold text-sm">Empresas Registadas</p>
                  <p className="text-xs text-muted-foreground">Todas as empresas</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <p className="font-bold text-sm">Taxa de Conversão</p>
                  <p className="text-xs text-muted-foreground">% cálculos completos</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <p className="font-bold text-sm">Por Contactar</p>
                  <p className="text-xs text-muted-foreground">Aguardam 1º email</p>
                </div>
              </div>
            </div>

            {/* Visualizações */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Visualizações</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="shrink-0">1</Badge>
                  <div>
                    <p className="font-bold text-sm">Funil Global de Onboarding</p>
                    <p className="text-xs text-muted-foreground">
                      Visualização ramificada: Por Contactar → Sem Interação → Interessada,
                      depois bifurca para Simple e Formulário.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="shrink-0">2</Badge>
                  <div>
                    <p className="font-bold text-sm">Gráfico de Atividade</p>
                    <p className="text-xs text-muted-foreground">
                      Pegadas concluídas por semana (últimas 12 semanas) em todos os clientes.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="shrink-0">3</Badge>
                  <div>
                    <p className="font-bold text-sm">Distribuição Simple/Formulário</p>
                    <p className="text-xs text-muted-foreground">
                      Gráfico circular mostrando proporção de cada tipo de cálculo.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cards de Cliente */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Cards de Cliente</h3>
              <p className="text-sm text-muted-foreground">
                Cada cliente é apresentado num card com:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Logótipo, nome e tipo (Município/Empresa)</li>
                <li>Mini-métricas: empresas, conversão, última atividade</li>
                <li>Sparkline de atividade semanal</li>
                <li>Mini-funil de onboarding</li>
                <li>Alertas (bounces de email)</li>
                <li>Acções: Editar, Arquivar, Dashboard</li>
              </ul>
            </div>

            {/* Pesquisa e Filtros */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Pesquisa e Filtros</h3>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <p className="font-bold text-sm mb-2">Pesquisa</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Por nome do cliente</li>
                    <li>Por email de contacto</li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-sm mb-2">Filtros</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Por tipo: Todos, Municípios, Empresas</li>
                    <li>Por estado: Ativos, Arquivados, Todos</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Gestão de Clientes */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Gestão de Clientes</h3>
              <p className="text-sm text-muted-foreground">
                Operações disponíveis para cada cliente na plataforma:
              </p>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                  <Eye className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Visualizar</p>
                    <p className="text-xs text-muted-foreground">
                      Aceder ao dashboard e dados do cliente como se fosse o próprio utilizador.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                  <Settings className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Configurar</p>
                    <p className="text-xs text-muted-foreground">
                      Alterar dados do cliente, tipo de conta e permissões de acesso.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                  <Archive className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Arquivar</p>
                    <p className="text-xs text-muted-foreground">
                      Desactivar temporariamente o acesso sem perder dados históricos.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                  <BarChart3 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Métricas</p>
                    <p className="text-xs text-muted-foreground">
                      Ver estatísticas de utilização, número de empresas e clusters.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Métricas Globais */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Métricas Globais</h3>
              <p className="text-sm text-muted-foreground">
                O painel apresenta métricas agregadas de toda a plataforma:
              </p>

              <div className="grid gap-2 md:grid-cols-3">
                {[
                  "Total de clientes activos",
                  "Total de empresas na plataforma",
                  "Total de clusters",
                  "Pegadas calculadas",
                  "Emissões totais agregadas",
                  "Taxa média de onboarding",
                ].map((metric) => (
                  <div key={metric} className="p-2 rounded bg-muted/30">
                    <span className="text-sm">{metric}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* === SECTION: Permissões === */}
          <SectionHeader
            id="permissoes"
            title="Permissões"
            icon={Shield}
            description="Sistema de controlo de acesso e permissões"
          />

          <div className="space-y-6">
            <p className="text-muted-foreground">
              O sistema de permissões controla o acesso às diferentes funcionalidades
              da plataforma com base no tipo de utilizador e no papel atribuído.
            </p>

            {/* Níveis de Acesso */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Níveis de Acesso</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-danger/5 border border-danger/20">
                  <ShieldCheck className="h-5 w-5 text-danger shrink-0" />
                  <div>
                    <p className="font-bold text-sm">Administrador (Get2C)</p>
                    <p className="text-xs text-muted-foreground">
                      Acesso total à plataforma. Pode gerir clientes, configurar permissões,
                      aceder ao painel de controlo e a todas as funcionalidades.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <Building2 className="h-5 w-5 text-blue-500 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">Cliente Empresa</p>
                    <p className="text-xs text-muted-foreground">
                      Acesso ao dashboard, clusters e dados dos seus fornecedores.
                      Pode criar clusters, importar empresas e enviar campanhas.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                  <Landmark className="h-5 w-5 text-purple-500 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">Cliente Município</p>
                    <p className="text-xs text-muted-foreground">
                      Acesso ao dashboard territorial, gestão de programas de incentivo,
                      infraestruturas municipais e dados das empresas do concelho.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Matriz de Permissões */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Matriz de Permissões</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-bold">Funcionalidade</th>
                      <th className="text-center py-2 pr-4 font-bold">Admin</th>
                      <th className="text-center py-2 pr-4 font-bold">Empresa</th>
                      <th className="text-center py-2 font-bold">Município</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { feat: "Painel de Controlo", admin: true, empresa: false, municipio: false },
                      { feat: "Dashboard", admin: true, empresa: true, municipio: true },
                      { feat: "Gestão de Clusters", admin: true, empresa: true, municipio: true },
                      { feat: "Importar Empresas", admin: true, empresa: true, municipio: true },
                      { feat: "Campanhas de Email", admin: true, empresa: true, municipio: true },
                      { feat: "Infraestruturas", admin: true, empresa: false, municipio: true },
                      { feat: "Planos de Acção", admin: true, empresa: true, municipio: true },
                      { feat: "Gerir Clientes", admin: true, empresa: false, municipio: false },
                    ].map((row) => (
                      <tr key={row.feat}>
                        <td className="py-2 pr-4">{row.feat}</td>
                        <td className="py-2 pr-4 text-center">{row.admin ? <CheckCircle2 className="h-4 w-4 text-success inline" /> : <span className="text-muted-foreground">—</span>}</td>
                        <td className="py-2 pr-4 text-center">{row.empresa ? <CheckCircle2 className="h-4 w-4 text-success inline" /> : <span className="text-muted-foreground">—</span>}</td>
                        <td className="py-2 text-center">{row.municipio ? <CheckCircle2 className="h-4 w-4 text-success inline" /> : <span className="text-muted-foreground">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* === SECTION: Infraestruturas Municipais === */}
          <SectionHeader
            id="infraestruturas"
            title="Infraestruturas Municipais"
            icon={Database}
            description="Dados de infraestruturas públicas para municípios"
          />

          <div className="space-y-6">
            <p className="text-muted-foreground">
              O sistema permite pré-popular dados de infraestruturas municipais através de APIs públicas.
              Quando um novo município é criado, os dados disponíveis são sincronizados automaticamente,
              reduzindo o tempo de configuração inicial.
            </p>

            {/* Sincronização Automática */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Sincronização Automática</h3>
              <p className="text-sm text-muted-foreground">
                Ao criar um cliente do tipo <strong>Município</strong>, o sistema executa automaticamente:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Consulta a todas as APIs configuradas</li>
                <li>Filtra dados pelo nome do município</li>
                <li>Armazena os resultados para pré-preenchimento</li>
                <li>Regista a data e estado de cada sincronização</li>
              </ul>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-primary">
                  <strong>Nota:</strong> A sincronização pode ser executada manualmente a qualquer momento
                  através da tab "Infraestruturas" no Painel de Controlo.
                </p>
              </div>
            </div>

            {/* Fontes de Dados */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Fontes de Dados Públicas</h3>
              <p className="text-sm text-muted-foreground mb-4">
                As seguintes APIs públicas são utilizadas para obter dados de infraestruturas:
              </p>

              <div className="space-y-4">
                {/* Open Charge Map */}
                <div className="p-4 rounded-lg bg-muted/30 border">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-status-complete/10">
                      <Zap className="h-5 w-5 text-status-complete" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold">Postos de Carregamento Elétrico</p>
                        <Badge className="bg-status-complete/10 text-status-complete border-status-complete/20">
                          Disponível
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Fonte:</strong> Open Charge Map (openchargemap.io)
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Base de dados global colaborativa</li>
                        <li>Cobertura: Nacional (Portugal)</li>
                        <li>Dados: localização, operador, conectores, potência</li>
                        <li>Endpoint: <code className="bg-muted px-1 rounded">api.openchargemap.io/v3/poi/</code></li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Carris Metropolitana */}
                <div className="p-4 rounded-lg bg-muted/30 border">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-warning/10">
                      <Bus className="h-5 w-5 text-warning" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold">Paragens de Transporte Público</p>
                        <Badge className="bg-warning/10 text-warning border-warning/20">
                          Parcial
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Fonte:</strong> Carris Metropolitana API
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Cobertura: Área Metropolitana de Lisboa (18 municípios)</li>
                        <li>Dados: paragens, linhas, rotas</li>
                        <li>Endpoint: <code className="bg-muted px-1 rounded">api.carrismetropolitana.pt/v2/</code></li>
                        <li className="text-warning">Limitação: não cobre restante país</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Ciclovias */}
                <div className="p-4 rounded-lg bg-muted/30 border">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-status-complete/10">
                      <Route className="h-5 w-5 text-status-complete" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold">Ciclovias</p>
                        <Badge className="bg-status-complete/10 text-status-complete border-status-complete/20">
                          Disponível
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Fonte:</strong> Ciclovias.pt
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Mapeamento colaborativo de ciclovias</li>
                        <li>Cobertura: Nacional</li>
                        <li>Dados: percursos, extensão, tipo (dedicada/partilhada)</li>
                        <li>Formato: GeoJSON</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* QualAr */}
                <div className="p-4 rounded-lg bg-muted/30 border">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-warning/10">
                      <Wind className="h-5 w-5 text-warning" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold">Estações de Qualidade do Ar</p>
                        <Badge className="bg-warning/10 text-warning border-warning/20">
                          Parcial
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Fonte:</strong> QualAr - Agência Portuguesa do Ambiente
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Rede nacional de monitorização</li>
                        <li>Dados: estações, poluentes medidos, índice de qualidade</li>
                        <li>Formato: WFS/WMS (serviços geográficos)</li>
                        <li className="text-warning">Requer cliente WFS para integração completa</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Ecopontos */}
                <div className="p-4 rounded-lg bg-muted/30 border">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Recycle className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold">Ecopontos</p>
                        <Badge variant="secondary" className="bg-muted text-muted-foreground">
                          Indisponível
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Fonte:</strong> Dados municipais fragmentados
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Não existe API nacional centralizada</li>
                        <li>Dados disponíveis por município/empresa de resíduos</li>
                        <li>Requer integração manual por região</li>
                        <li className="text-muted-foreground">Exemplos: Valorsul, Lipor, Amarsul (APIs próprias)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Bike Sharing */}
                <div className="p-4 rounded-lg bg-muted/30 border">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-warning/10">
                      <Bike className="h-5 w-5 text-warning" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold">Bike Sharing</p>
                        <Badge className="bg-warning/10 text-warning border-warning/20">
                          Parcial
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Fonte:</strong> GIRA (Lisboa) / Sistemas municipais
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                        <li>GIRA: sistema de bicicletas partilhadas de Lisboa</li>
                        <li>Outros sistemas variam por município</li>
                        <li>Cobertura: Lisboa, Porto, Cascais (principais)</li>
                        <li className="text-warning">Não existe API unificada nacional</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Estados de Disponibilidade */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Estados de Disponibilidade</h3>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="p-3 rounded-lg bg-status-complete/5 border border-status-complete/20">
                  <Badge className="mb-2 bg-status-complete/10 text-status-complete border-status-complete/20">
                    Disponível
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    API funcional com cobertura nacional. Sincronização automática ativa.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-warning/5 border border-warning/20">
                  <Badge className="mb-2 bg-warning/10 text-warning border-warning/20">
                    Parcial
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    API disponível mas com limitações geográficas ou técnicas.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border">
                  <Badge variant="secondary" className="mb-2 bg-muted text-muted-foreground">
                    Indisponível
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Sem API pública centralizada. Requer configuração manual.
                  </p>
                </div>
              </div>
            </div>

            {/* Configuração no Painel de Controlo */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Configuração no Painel de Controlo</h3>
              <p className="text-sm text-muted-foreground">
                A tab "Infraestruturas" no Painel de Controlo permite:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Visualizar estado de cada fonte de dados</li>
                <li>Testar conectividade com as APIs</li>
                <li>Executar sincronização manual por API</li>
                <li>Ver última data de sincronização</li>
                <li>Aceder à documentação de cada API</li>
              </ul>
            </div>
          </div>

          {/* === SECTION: Incentivos === */}
          <SectionHeader
            id="incentivos"
            title="Incentivos"
            icon={Mail}
            description="Sistema de campanhas e acompanhamento de empresas"
          />

          <div className="space-y-6">
            <p className="text-muted-foreground">
              O módulo de Incentivos permite criar campanhas de email, acompanhar o progresso
              das empresas no funil de onboarding e otimizar as taxas de conversão.
            </p>

            {/* Funil de Onboarding */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Funil de Onboarding (7 Fases)</h3>

              <div className="space-y-2">
                {[
                  { num: "1", name: "Por Contactar", desc: "Nunca recebeu email", color: "bg-status-pending" },
                  { num: "2", name: "Sem Interação", desc: "Recebeu mas não clicou", color: "bg-status-contacted" },
                  { num: "3", name: "Interessada", desc: "Clicou no link", color: "bg-status-interested" },
                  { num: "4", name: "Registada/Simple", desc: "Criou conta na plataforma", color: "bg-status-registered" },
                  { num: "5", name: "Em Progresso/Simple", desc: "Iniciou cálculo no Simple", color: "bg-status-progress" },
                  { num: "6", name: "Em Progresso/Formulário", desc: "Iniciou formulário manual", color: "bg-status-progress" },
                  { num: "7", name: "Completo", desc: "Pegada calculada com sucesso", color: "bg-status-complete" },
                ].map((phase) => (
                  <div key={phase.num} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                    <Badge className={cn("shrink-0", phase.color)}>{phase.num}</Badge>
                    <div className="flex-1">
                      <span className="font-bold text-sm">{phase.name}</span>
                      <span className="text-muted-foreground text-sm ml-2">— {phase.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Métricas de Campanha */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Métricas de Campanha</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-bold">Métrica</th>
                      <th className="text-left py-2 pr-4 font-bold">Benchmark</th>
                      <th className="text-left py-2 font-bold">Significado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-2 pr-4 font-bold">Taxa de Conversão</td>
                      <td className="py-2 pr-4 text-muted-foreground">—</td>
                      <td className="py-2 text-muted-foreground">% que completou cálculo</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-bold">Time to Value</td>
                      <td className="py-2 pr-4 text-muted-foreground">~12 dias</td>
                      <td className="py-2 text-muted-foreground">Dias até conclusão</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-bold">Open Rate</td>
                      <td className="py-2 pr-4 text-muted-foreground">&gt;20%</td>
                      <td className="py-2 text-muted-foreground">% emails abertos</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-bold">Click-to-Open (CTOR)</td>
                      <td className="py-2 pr-4 text-muted-foreground">&gt;30%</td>
                      <td className="py-2 text-muted-foreground">% cliques entre aberturas</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-bold">Bounce Rate</td>
                      <td className="py-2 pr-4 text-muted-foreground">&lt;2%</td>
                      <td className="py-2 text-muted-foreground">% não entregues</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-bold">Spam Rate</td>
                      <td className="py-2 pr-4 text-muted-foreground">&lt;0.1%</td>
                      <td className="py-2 text-muted-foreground">% marcados como spam</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Envio Inteligente */}
            <div className="border rounded-lg p-4 space-y-4 bg-success/5 border-success/20">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <h3 className="font-bold">Envio Inteligente</h3>
              </div>

              <p className="text-sm text-muted-foreground">
                O sistema de envio inteligente otimiza automaticamente as campanhas:
              </p>

              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>Agrupa empresas por template recomendado</li>
                <li>Associação automática baseada no estado de onboarding</li>
                <li>Otimiza taxa de conversão com base em dados históricos</li>
                <li>Evita saturação de contactos</li>
              </ul>
            </div>

            {/* Métricas de Campanha */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Métricas de Campanha</h3>
              <p className="text-sm text-muted-foreground">
                Cada campanha de incentivos regista as seguintes métricas:
              </p>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="font-bold text-sm">Taxa de Abertura</p>
                  <p className="text-xs text-muted-foreground">
                    Percentagem de emails abertos sobre o total enviado.
                    Benchmark: &gt;25% é considerado bom.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="font-bold text-sm">Taxa de Conversão</p>
                  <p className="text-xs text-muted-foreground">
                    Percentagem de empresas que iniciaram o processo de onboarding
                    após receberem a campanha.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="font-bold text-sm">Taxa de Bounce</p>
                  <p className="text-xs text-muted-foreground">
                    Emails que não foram entregues. Manter abaixo de 5%
                    para proteger a reputação do domínio.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="font-bold text-sm">Taxa de Spam</p>
                  <p className="text-xs text-muted-foreground">
                    Emails marcados como spam pelos destinatários.
                    Crítico: &gt;0.5% representa risco de bloqueio.
                  </p>
                </div>
              </div>
            </div>

            {/* Segmentação */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Segmentação de Campanhas</h3>
              <p className="text-sm text-muted-foreground">
                As campanhas podem ser segmentadas por múltiplos critérios:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Estado no funil de onboarding (fase 1-7)</li>
                <li>Cluster de pertença</li>
                <li>Sector de actividade</li>
                <li>Dimensão da empresa</li>
                <li>Tempo desde último contacto</li>
              </ul>
            </div>
          </div>

          {/* === SECTION: Templates de Email === */}
          <SectionHeader
            id="templates"
            title="Templates de Email"
            icon={FileText}
            description="Modelos de email pré-configurados para campanhas"
          />

          <div className="space-y-6">
            <p className="text-muted-foreground">
              A plataforma disponibiliza templates de email optimizados para cada fase
              do funil de onboarding, com personalização automática de conteúdo.
            </p>

            {/* Templates Disponíveis */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Templates Disponíveis</h3>

              <div className="space-y-3">
                {[
                  { num: "1", name: "Convite Inicial", desc: "Primeiro contacto. Apresenta a plataforma e convida à participação.", phase: "Por Contactar" },
                  { num: "2", name: "Lembrete", desc: "Follow-up para empresas que não responderam ao primeiro contacto.", phase: "Contactada" },
                  { num: "3", name: "Benefícios", desc: "Destaca vantagens competitivas da descarbonização e casos de sucesso.", phase: "Contactada" },
                  { num: "4", name: "Dados Pendentes", desc: "Solicita o envio de dados em falta para completar a pegada.", phase: "Em Progresso" },
                  { num: "5", name: "Resultados", desc: "Partilha os resultados da pegada calculada e próximos passos.", phase: "Calculada" },
                ].map((t) => (
                  <div key={t.num} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <Badge variant="secondary" className="shrink-0">{t.num}</Badge>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-sm">{t.name}</p>
                        <Badge variant="outline" className="text-xs shrink-0">{t.phase}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personalização */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Personalização Automática</h3>
              <p className="text-sm text-muted-foreground">
                Os templates utilizam variáveis dinâmicas que são substituídas automaticamente:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-bold">Variável</th>
                      <th className="text-left py-2 font-bold">Descrição</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-2 pr-4 font-mono text-xs">{"{{empresa}}"}</td>
                      <td className="py-2 text-muted-foreground">Nome da empresa</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-mono text-xs">{"{{contacto}}"}</td>
                      <td className="py-2 text-muted-foreground">Nome do contacto principal</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-mono text-xs">{"{{cluster}}"}</td>
                      <td className="py-2 text-muted-foreground">Nome do cluster de origem</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-mono text-xs">{"{{link}}"}</td>
                      <td className="py-2 text-muted-foreground">Link de acesso ao formulário</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Gestão de Templates */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Gestão de Templates</h3>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                  <Eye className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Pré-visualizar</p>
                    <p className="text-xs text-muted-foreground">
                      Ver como o email ficará com dados reais antes de enviar.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                  <Pencil className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Editar</p>
                    <p className="text-xs text-muted-foreground">
                      Personalizar assunto, corpo e variáveis do template.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                  <BarChart3 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Métricas</p>
                    <p className="text-xs text-muted-foreground">
                      Ver taxas de abertura e conversão por template.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* === SECTION: Boas Práticas de Email === */}
          <SectionHeader
            id="email"
            title="Boas Práticas de Email"
            icon={Send}
            description="Recomendações para campanhas de email efetivas"
          />

          <div className="space-y-6">
            <p className="text-muted-foreground">
              Seguir estas boas práticas maximiza a eficácia das campanhas de email
              e protege a reputação do domínio de envio.
            </p>

            {/* Templates Disponíveis */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Templates Disponíveis</h3>

              <div className="grid gap-3">
                {[
                  { num: "1", name: "Convite Inicial", desc: "Primeiro contacto, explica benefícios do cálculo da pegada" },
                  { num: "2", name: "Lembrete", desc: "Follow-up amigável para empresas sem interação" },
                  { num: "3", name: "Benefícios", desc: "Detalha vantagens competitivas da descarbonização" },
                  { num: "4", name: "Urgente", desc: "Foco em requisitos regulamentares e prazos" },
                  { num: "5", name: "Personalizado", desc: "Template em branco para mensagens customizadas" },
                ].map((template) => (
                  <div key={template.num} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <Badge variant="secondary" className="shrink-0">{template.num}</Badge>
                    <div>
                      <p className="font-bold text-sm">{template.name}</p>
                      <p className="text-xs text-muted-foreground">{template.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gestão de Bounces */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-bold">Gestão de Bounces</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-bold">Tipo</th>
                      <th className="text-left py-2 pr-4 font-bold">Causa</th>
                      <th className="text-left py-2 font-bold">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-2 pr-4">
                        <Badge variant="destructive">Hard Bounce</Badge>
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground">Email inválido, domínio inexistente</td>
                      <td className="py-2 text-muted-foreground">Remover da lista imediatamente</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">
                        <Badge className="bg-warning text-warning-foreground">Soft Bounce</Badge>
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground">Caixa cheia, servidor temporariamente indisponível</td>
                      <td className="py-2 text-muted-foreground">Retry em 24-48h (máx. 3 tentativas)</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">
                        <Badge variant="outline">Spam</Badge>
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground">Marcado como spam pelo destinatário</td>
                      <td className="py-2 text-muted-foreground">Remover imediatamente da lista</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Indicadores de Saturação */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-bold">Indicadores de Saturação</h3>
              </div>

              <p className="text-sm text-muted-foreground">
                O sistema indica visualmente o nível de saturação de cada contacto:
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <div className="w-3 h-3 rounded-full bg-gray-400 mx-auto mb-2" />
                  <p className="font-bold text-sm">0 emails</p>
                  <p className="text-xs text-muted-foreground">Por contactar</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10 text-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mx-auto mb-2" />
                  <p className="font-bold text-sm">1 email</p>
                  <p className="text-xs text-muted-foreground">Contactado</p>
                </div>
                <div className="p-3 rounded-lg bg-warning/10 text-center">
                  <div className="w-3 h-3 rounded-full bg-warning mx-auto mb-2" />
                  <p className="font-bold text-sm">2 emails</p>
                  <p className="text-xs text-muted-foreground">Atenção</p>
                </div>
                <div className="p-3 rounded-lg bg-danger/10 text-center">
                  <div className="w-3 h-3 rounded-full bg-danger mx-auto mb-2" />
                  <p className="font-bold text-sm">3+ emails</p>
                  <p className="text-xs text-muted-foreground">Saturado</p>
                </div>
              </div>
            </div>

            {/* Recomendações */}
            <div className="border rounded-lg p-4 space-y-4 bg-primary/5 border-primary/20">
              <h3 className="font-bold">Recomendações</h3>

              <div className="grid gap-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <strong>Espaçamento:</strong> Manter ~25 dias entre envios para o mesmo destinatário
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <strong>Bounce rate:</strong> Monitorizar e manter abaixo de 5%
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-danger mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <strong>Spam rate crítico:</strong> &gt;0.5% representa risco de bloqueio do domínio
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <strong>Envio Inteligente:</strong> Utilizar para otimização automática baseada em dados
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* === SECTION: Bibliografia === */}
          <SectionHeader
            id="bibliografia"
            title="Bibliografia e Fontes"
            icon={Library}
            description="Referências e fontes de dados utilizadas"
          />

          <div className="space-y-6">
            <div className="border rounded-lg p-6 space-y-6 bg-card">
              {Object.entries(bibliography).map(([key, source], index) => (
                <div key={key} className={cn("space-y-2", index > 0 && "pt-4 border-t")}>
                  <p className="font-bold">[{index + 1}] {source.title}</p>
                  <p className="text-muted-foreground text-sm">
                    {source.author}.{source.date ? ` Publicado em ${source.date}.` : ''}
                  </p>
                  {source.description && (
                    <p className="text-muted-foreground text-sm">{source.description}</p>
                  )}
                  <div className="flex flex-wrap gap-3 mt-2">
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Ver fonte →
                      </a>
                    )}
                    {source.pdfUrl && (
                      <a
                        href={source.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      >
                        PDF →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Footer with gradient */}
      <footer className="footer-gradient ml-64 border-t">
        <div className="footer-gradient-grain" />
        <div className="relative z-10 max-w-5xl px-8 pt-16 pb-[40rem]">
          <div className="text-muted-foreground text-sm">
            <p className="text-foreground font-normal">Get2C · Documentação Metodológica {getVersionString()} · {getVersionDate()}</p>
            <p className="mt-2">For a cooler world.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
