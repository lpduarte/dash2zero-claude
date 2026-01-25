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
  TowerControl
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// VERSIONING
// ============================================
const METHODOLOGY_VERSION = {
  major: 1,
  minor: 6,
  patch: 0,
  date: "2026-01-25",
};

const getVersionString = () => `v${METHODOLOGY_VERSION.major}.${METHODOLOGY_VERSION.minor}.${METHODOLOGY_VERSION.patch}`;
const getVersionDate = () => {
  const date = new Date(METHODOLOGY_VERSION.date);
  return date.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });
};

// Sections for navigation
const sections = [
  { id: 'potencial', label: 'Potencial de Melhoria', icon: TrendingDown },
  { id: 'emissoes', label: 'Cálculo de Emissões', icon: Factory },
  { id: 'indicadores', label: 'Indicadores', icon: BarChart3 },
  { id: 'setores', label: 'Setores de Atividade', icon: Briefcase },
  { id: 'intensidades', label: 'Fatores de Intensidade', icon: Scale },
  { id: 'dados', label: 'Dados a Recolher', icon: FileSpreadsheet },
  { id: 'onboarding', label: 'Fluxo de Onboarding', icon: CheckCircle2 },
  { id: 'clusters', label: 'Gestão de Clusters', icon: Layers },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'admin', label: 'Painel de Controlo', icon: TowerControl },
  { id: 'incentivos', label: 'Incentivos', icon: Mail },
  { id: 'email', label: 'Boas Práticas de Email', icon: Send },
  { id: 'bibliografia', label: 'Bibliografia', icon: Library },
];

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
  const [activeSection, setActiveSection] = useState('potencial');

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
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`
                      w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-all duration-200
                      ${isActive
                        ? 'bg-primary/10 text-primary font-normal shadow-md'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1'
                      }
                    `}
                  >
                    <div className={`p-1.5 rounded-md transition-colors shrink-0 ${isActive ? 'bg-primary/20' : 'bg-muted'}`}>
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
                    <h3 className="font-semibold">Vista Empresa: Potencial de Substituição</h3>
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
                    <h3 className="font-semibold">Vista Município: Potencial de Melhoria Setorial</h3>
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
                  <h3 className="font-semibold">Classificação do Nível de Potencial</h3>
                  <p className="text-sm text-muted-foreground">
                    O nível de potencial é determinado pela percentagem de redução possível face às emissões atuais:
                  </p>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg bg-danger/10 border border-danger/20">
                      <p className="font-semibold text-danger">Alto</p>
                      <p className="text-sm text-muted-foreground mt-1">Redução &gt; 20%</p>
                    </div>
                    <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                      <p className="font-semibold text-warning">Médio</p>
                      <p className="text-sm text-muted-foreground mt-1">Redução 10-20%</p>
                    </div>
                    <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                      <p className="font-semibold text-success">Baixo</p>
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
                  <h3 className="font-semibold">Âmbitos de Emissões (Scopes)</h3>

                  <div className="grid gap-4">
                    <div className="border rounded-lg p-4 bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-red-500">Scope 1</Badge>
                        <span className="font-bold">Emissões Diretas</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Emissões de fontes que a empresa possui ou controla diretamente
                        (ex: combustão em caldeiras, veículos da frota própria, processos industriais).
                      </p>
                    </div>

                    <div className="border rounded-lg p-4 bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-orange-500">Scope 2</Badge>
                        <span className="font-bold">Emissões Indiretas - Energia</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Emissões associadas à produção da energia elétrica e térmica adquirida
                        e consumida pela empresa.
                      </p>
                    </div>

                    <div className="border rounded-lg p-4 bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-yellow-500 text-yellow-950">Scope 3</Badge>
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
                  <h3 className="font-semibold">Como é obtido o Setor de Atividade?</h3>
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
                  <h3 className="font-semibold">CAE Principal vs CAEs Secundários</h3>
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
                  <h3 className="font-semibold">Setores Principais (Secções CAE)</h3>
                  <p className="text-sm text-muted-foreground">
                    Os setores principais correspondem às secções da CAE e agrupam atividades económicas com características semelhantes.
                  </p>

                  <div className="grid gap-2">
                    {[
                      { code: "A", name: "Agricultura", desc: "Agricultura, produção animal, caça, floresta e pesca" },
                      { code: "B", name: "Indústrias Extrativas", desc: "Extração de minérios e recursos naturais" },
                      { code: "C", name: "Indústria", desc: "Indústrias transformadoras (ver subsetores abaixo)" },
                      { code: "D", name: "Energia", desc: "Eletricidade, gás, vapor, água quente e fria" },
                      { code: "E", name: "Água e Saneamento", desc: "Captação, tratamento e distribuição de água; gestão de resíduos" },
                      { code: "F", name: "Construção", desc: "Construção de edifícios e engenharia civil" },
                      { code: "G", name: "Comércio", desc: "Comércio por grosso e a retalho; reparação de veículos" },
                      { code: "H", name: "Logística", desc: "Transporte e armazenagem" },
                      { code: "I", name: "Hotelaria e Restauração", desc: "Alojamento, restauração e similares" },
                      { code: "J", name: "Tecnologia", desc: "Informação e comunicação" },
                      { code: "K", name: "Banca e Seguros", desc: "Atividades financeiras e de seguros" },
                      { code: "M", name: "Consultoria", desc: "Atividades de consultoria, científicas e técnicas" },
                      { code: "S", name: "Outros Serviços", desc: "Outras atividades de serviços" },
                    ].map((sector) => (
                      <div key={sector.code} className="flex items-start gap-3 p-2 rounded hover:bg-muted/50">
                        <Badge variant="outline" className="font-mono shrink-0">{sector.code}</Badge>
                        <div>
                          <span className="font-bold">{sector.name}</span>
                          <p className="text-xs text-muted-foreground">{sector.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subsetores da Indústria */}
                <div className="border rounded-lg p-4 space-y-4 bg-card">
                  <h3 className="font-semibold">Subsetores da Indústria (Divisões CAE - Secção C)</h3>
                  <p className="text-sm text-muted-foreground">
                    O setor industrial é subdividido em subsetores mais específicos para permitir
                    comparações mais precisas entre empresas com atividades semelhantes.
                  </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  { code: "10-12", name: "Indústria Alimentar" },
                  { code: "13-14", name: "Têxtil e Vestuário" },
                  { code: "17", name: "Papel e Cartão" },
                  { code: "20", name: "Química" },
                  { code: "21", name: "Farmacêutica" },
                  { code: "22", name: "Borracha e Plásticos" },
                  { code: "23", name: "Cerâmica e Vidro" },
                  { code: "24", name: "Metalurgia" },
                  { code: "25", name: "Metalomecânica" },
                  { code: "26-27", name: "Eletrónica" },
                  { code: "29", name: "Automóvel" },
                  { code: "31", name: "Mobiliário" },
                ].map((sub) => (
                  <div key={sub.code} className="flex items-center gap-2 p-2 rounded bg-muted/30">
                    <Badge variant="secondary" className="font-mono text-xs shrink-0">{sub.code}</Badge>
                    <span className="text-sm">{sub.name}</span>
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
                    <h3 className="font-semibold">Fonte dos Dados</h3>
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
                  <h3 className="font-semibold">Intensidade de Carbono por Setor (2022)</h3>
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
                        {[
                          { name: "Energia e Água", intensity: "2.80", source: "INE" },
                          { name: "Agricultura", intensity: "2.10", source: "INE" },
                          { name: "Indústrias Extrativas", intensity: "1.80", source: "Est." },
                          { name: "Logística/Transportes", intensity: "0.95", source: "Calc." },
                          { name: "Indústria", intensity: "0.85", source: "Calc." },
                          { name: "Construção", intensity: "0.45", source: "Est." },
                          { name: "Hotelaria", intensity: "0.18", source: "Est." },
                          { name: "Comércio", intensity: "0.15", source: "Est." },
                          { name: "Tecnologia", intensity: "0.08", source: "Calc." },
                          { name: "Outros Serviços", intensity: "0.029", source: "Calc." },
                          { name: "Financeiro", intensity: "0.002", source: "Calc." },
                        ].map((row) => (
                          <tr key={row.name}>
                            <td className="py-2 pr-4">{row.name}</td>
                            <td className="py-2 pr-4 text-right font-mono">{row.intensity}</td>
                            <td className="py-2">
                              <Badge variant={row.source === "INE" ? "default" : "outline"} className="text-xs">
                                {row.source}
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
                  <h3 className="font-semibold">Intensidade de Subsetores Industriais (Secção C)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { name: "Cerâmica/Vidro", intensity: "3.70", highlight: true },
                      { name: "Metalurgia", intensity: "2.50", highlight: true },
                      { name: "Química", intensity: "1.80", highlight: false },
                      { name: "Papel/Cartão", intensity: "1.50", highlight: false },
                      { name: "Plásticos", intensity: "0.90", highlight: false },
                      { name: "Metalomecânica", intensity: "0.70", highlight: false },
                      { name: "Alimentar", intensity: "0.65", highlight: false },
                      { name: "Madeira/Cortiça", intensity: "0.55", highlight: false },
                      { name: "Automóvel", intensity: "0.50", highlight: false },
                      { name: "Têxtil", intensity: "0.45", highlight: false },
                      { name: "Mobiliário", intensity: "0.40", highlight: false },
                      { name: "Eletrónica", intensity: "0.35", highlight: false },
                    ].map((sub) => (
                      <div
                        key={sub.name}
                        className={cn(
                          "flex items-center justify-between p-2 rounded",
                          sub.highlight ? "bg-danger/10 border border-danger/30" : "bg-muted/30"
                        )}
                      >
                        <span className="text-sm">{sub.name}</span>
                        <Badge variant={sub.highlight ? "destructive" : "secondary"} className="font-mono text-xs">
                          {sub.intensity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Valores em kg CO₂eq/€. Subsetores a vermelho têm intensidade acima da média industrial.
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
                  <h3 className="font-semibold">Classificação dos Valores</h3>
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
                    <h3 className="font-semibold">Dados Obrigatórios</h3>
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
                    <h3 className="font-semibold">Dados Opcionais (Recomendados)</h3>
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
              <h3 className="font-semibold">Diagrama do Fluxo</h3>
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
              <h3 className="font-semibold">Descrição dos Estados</h3>
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
                  <h3 className="font-semibold">Caminho Simple</h3>
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
                  <h3 className="font-semibold">Caminho Formulário</h3>
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
                <h3 className="font-semibold">Importação de Empresas</h3>
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
                  adicionados ou actualizados, mas nunca eliminados automaticamente.
                </p>
              </div>
            </div>

            {/* Regras de Deduplicação */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-blue-500/10">
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
                <h3 className="font-semibold">Regras de Deduplicação</h3>
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
                      <td className="py-2 text-muted-foreground">Dados são actualizados (nome, email) se diferentes</td>
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
              <h3 className="font-semibold">Operações de Clusters</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-success/10 border border-success/30">
                  <Badge className="bg-success shrink-0">Criar</Badge>
                  <div>
                    <p className="text-sm font-bold">Criar Cluster</p>
                    <p className="text-xs text-muted-foreground">
                      Definir um nome e seleccionar um ícone identificativo.
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

            {/* Protecção de Dados */}
            <div className="border rounded-lg p-4 space-y-4 bg-warning/5 border-warning/20">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <h3 className="font-semibold">Protecção de Dados</h3>
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
                  ao cluster a ser eliminado são efectivamente removidas do sistema.
                </p>
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
              <h3 className="font-semibold">Métricas Principais (KPIs)</h3>

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
                      <td className="py-2 pr-4 text-muted-foreground">Redução possível com optimizações</td>
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
              <h3 className="font-semibold">Separadores do Dashboard</h3>

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
                    <p className="font-bold">Análise por Actividade</p>
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
              <h3 className="font-semibold">Filtros Disponíveis</h3>

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
                  <h3 className="font-semibold">Vista Empresa</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Foco na gestão de fornecedores e cadeia de valor:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Análise de fornecedores por emissões</li>
                  <li>Alternativas mais eficientes</li>
                  <li>Impacto de substituição</li>
                  <li>Optimização de Scope 3</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 space-y-3 bg-purple-500/5 border-purple-500/20">
                <div className="flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-purple-500" />
                  <h3 className="font-semibold">Vista Município</h3>
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
                <h3 className="font-semibold">KPIs de Infraestruturas (Municípios)</h3>
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
              <h3 className="font-semibold">Acesso</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Disponível apenas para utilizadores do tipo <strong>Get2C</strong></li>
                <li>Acessível via menu "Painel de controlo" no header</li>
                <li>Rota protegida: utilizadores não-Get2C são redirecionados</li>
              </ul>
            </div>

            {/* Gestão de Clientes */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-semibold">Gestão de Clientes</h3>
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
                  <p className="font-bold text-sm">Arquivar/Reactivar</p>
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
              <h3 className="font-semibold">Perfis de Permissões</h3>
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
              <h3 className="font-semibold">Permissões Granulares</h3>
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
              <h3 className="font-semibold">Métricas Globais</h3>
              <p className="text-sm text-muted-foreground">
                O painel apresenta métricas agregadas de todos os clientes activos:
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
              <h3 className="font-semibold">Visualizações</h3>
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
                    <p className="font-bold text-sm">Gráfico de Actividade</p>
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
              <h3 className="font-semibold">Cards de Cliente</h3>
              <p className="text-sm text-muted-foreground">
                Cada cliente é apresentado num card com:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Logótipo, nome e tipo (Município/Empresa)</li>
                <li>Mini-métricas: empresas, conversão, última actividade</li>
                <li>Sparkline de actividade semanal</li>
                <li>Mini-funil de onboarding</li>
                <li>Alertas (bounces de email)</li>
                <li>Acções: Editar, Arquivar, Dashboard</li>
              </ul>
            </div>

            {/* Pesquisa e Filtros */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-semibold">Pesquisa e Filtros</h3>
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
                    <li>Por estado: Activos, Arquivados, Todos</li>
                  </ul>
                </div>
              </div>
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
              das empresas no funil de onboarding e optimizar as taxas de conversão.
            </p>

            {/* Funil de Onboarding */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-semibold">Funil de Onboarding (7 Fases)</h3>

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
              <h3 className="font-semibold">Métricas de Campanha</h3>

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
                <h3 className="font-semibold">Envio Inteligente</h3>
              </div>

              <p className="text-sm text-muted-foreground">
                O sistema de envio inteligente optimiza automaticamente as campanhas:
              </p>

              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>Agrupa empresas por template recomendado</li>
                <li>Associação automática baseada no estado de onboarding</li>
                <li>Optimiza taxa de conversão com base em dados históricos</li>
                <li>Evita saturação de contactos</li>
              </ul>
            </div>
          </div>

          {/* === SECTION: Boas Práticas de Email === */}
          <SectionHeader
            id="email"
            title="Boas Práticas de Email"
            icon={Send}
            description="Recomendações para campanhas de email efectivas"
          />

          <div className="space-y-6">
            <p className="text-muted-foreground">
              Seguir estas boas práticas maximiza a eficácia das campanhas de email
              e protege a reputação do domínio de envio.
            </p>

            {/* Templates Disponíveis */}
            <div className="border rounded-lg p-4 space-y-4 bg-card">
              <h3 className="font-semibold">Templates Disponíveis</h3>

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
              <h3 className="font-semibold">Gestão de Bounces</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-bold">Tipo</th>
                      <th className="text-left py-2 pr-4 font-bold">Causa</th>
                      <th className="text-left py-2 font-bold">Acção</th>
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
                <h3 className="font-semibold">Indicadores de Saturação</h3>
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
              <h3 className="font-semibold">Recomendações</h3>

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
                    <strong>Envio Inteligente:</strong> Utilizar para optimização automática baseada em dados
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
              {/* Fonte Principal */}
              <div className="space-y-2 pb-4 border-b">
                <p className="font-semibold">[1] INE - Contas das Emissões Atmosféricas 1995-2022</p>
                <p className="text-muted-foreground text-sm">
                  Instituto Nacional de Estatística. Publicado em 15 de outubro de 2024.
                </p>
                <div className="flex flex-wrap gap-3 mt-2">
                  <a
                    href="https://www.ine.pt/xportal/xmain?xpid=INE&xpgid=ine_destaques&DESTAQUESdest_boui=691765941&DESTAQUESmodo=2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Página INE →
                  </a>
                  <a
                    href="https://www.ine.pt/ngt_server/attachfileu.jsp?look_parentBoui=691766067&att_display=n&att_download=y"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    PDF Completo →
                  </a>
                </div>
              </div>

              {/* Fonte Secundária */}
              <div className="space-y-2 pb-4 border-b">
                <p className="font-semibold">[2] APA - Relatório do Estado do Ambiente</p>
                <p className="text-muted-foreground text-sm">
                  Agência Portuguesa do Ambiente. Indicadores de intensidade energética e de carbono.
                </p>
                <a
                  href="https://rea.apambiente.pt/content/intensidade-energ%C3%A9tica-e-carb%C3%B3nica-da-economia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  Ver indicador →
                </a>
              </div>

              {/* Eurostat */}
              <div className="space-y-2 pb-4 border-b">
                <p className="font-semibold">[3] Eurostat - Air Emissions Accounts by NACE</p>
                <p className="text-muted-foreground text-sm">
                  Base de dados europeia harmonizada de emissões por atividade económica.
                </p>
                <div className="flex flex-wrap gap-3 mt-2">
                  <a
                    href="https://ec.europa.eu/eurostat/databrowser/view/env_ac_ainah_r2/default/table"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Emissões por NACE →
                  </a>
                  <a
                    href="https://ec.europa.eu/eurostat/databrowser/view/env_ac_aeint_r2/default/table"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Intensidades →
                  </a>
                </div>
              </div>

              {/* DEFRA */}
              <div className="space-y-2 pb-4 border-b">
                <p className="font-semibold">[4] DEFRA/DESNZ - UK Carbon Footprint</p>
                <p className="text-muted-foreground text-sm">
                  Fatores de conversão por código SIC do Reino Unido. Usado para comparação internacional.
                </p>
                <a
                  href="https://www.gov.uk/government/statistics/uks-carbon-footprint"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  UK Statistics →
                </a>
              </div>

              {/* GHG Protocol */}
              <div className="space-y-2">
                <p className="font-semibold">[5] GHG Protocol - Corporate Value Chain Standard</p>
                <p className="text-muted-foreground text-sm">
                  Metodologia internacional para cálculo de emissões Scope 1, 2 e 3.
                </p>
                <a
                  href="https://ghgprotocol.org/corporate-value-chain-scope-3-standard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  GHG Protocol →
                </a>
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
            <p className="text-foreground font-normal">Get2C · Documentação Metodológica {getVersionString()} · {getVersionDate()}</p>
            <p className="mt-2">For a cooler world.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
