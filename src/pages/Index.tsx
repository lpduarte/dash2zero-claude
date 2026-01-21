import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  CircleDot,
  Megaphone,
  UserPlus,
  FileSpreadsheet,
  Mail,
  Eye,
  BookOpen,
  Leaf,
  ArrowRight,
  ListTodo
} from 'lucide-react';

interface PageLink {
  path: string;
  title: string;
  description: string;
  icon: typeof BarChart3;
}

const dashboardPages: PageLink[] = [
  {
    path: '/',
    title: 'Dashboard',
    description: 'Visão geral de emissões, KPIs e análise de risco de carbono',
    icon: BarChart3,
  },
  {
    path: '/clusters',
    title: 'Gestão de Clusters',
    description: 'Configuração e gestão de grupos de empresas',
    icon: CircleDot,
  },
];

const featurePages: PageLink[] = [
  {
    path: '/incentivo',
    title: 'Incentivo',
    description: 'Ferramenta de envio de emails pré-onboarding',
    icon: Megaphone,
  },
  {
    path: '/onboarding',
    title: 'Onboarding',
    description: 'Processo de adesão de empresas',
    icon: UserPlus,
  },
  {
    path: '/formulario-totais',
    title: 'Formulário de Totais',
    description: 'Introdução simplificada de dados de emissões',
    icon: FileSpreadsheet,
  },
  {
    path: '/email-template',
    title: 'Template de Email',
    description: 'Modelo de comunicação para convite de empresas',
    icon: Mail,
  },
];

const documentationPages: PageLink[] = [
  {
    path: '/style-guide',
    title: 'Product Design System',
    description: 'Guia visual de componentes, cores e tipografia',
    icon: Eye,
  },
  {
    path: '/metodologia',
    title: 'Metodologia',
    description: 'Documentação técnica e fontes de dados',
    icon: BookOpen,
  },
  {
    path: '/pipeline',
    title: 'Pipeline',
    description: 'Progresso das funcionalidades em desenvolvimento',
    icon: ListTodo,
  },
];

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
        const delay = 0.05 + charIndex * 0.05;
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

const PageCard = ({ page }: { page: PageLink }) => (
  <Link
    to={page.path}
    className="group relative flex flex-col p-6 bg-card/80 backdrop-blur-sm border border-primary/20 rounded-xl hover:border-primary/40 hover:bg-card transition-all duration-300"
  >
    <div className="mb-4">
      <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 inline-block">
        <page.icon className="h-6 w-6" />
      </div>
    </div>
    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{page.title}</h3>
    <p className="text-sm text-muted-foreground flex-1">{page.description}</p>
    <div className="flex items-center gap-2 mt-4 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
      <span>Abrir</span>
      <ArrowRight className="h-4 w-4" />
    </div>
  </Link>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-diagonal-pattern relative overflow-hidden">
      {/* Pulsing background - full page */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Large central pulse */}
        <div
          className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-primary/30 rounded-full blur-3xl animate-pulse-slow"
          style={{ transform: 'translate(-50%, -50%)' }}
        />
        {/* Top right cluster */}
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-primary/40 rounded-full blur-3xl animate-pulse-slow"
          style={{ transform: 'translate(30%, -40%)' }}
        />
        <div
          className="absolute top-20 right-40 w-72 h-72 bg-primary/35 rounded-full blur-3xl animate-pulse-slower"
          style={{ animationDelay: '1s' }}
        />
        {/* Bottom left cluster */}
        <div
          className="absolute bottom-0 left-0 w-80 h-80 bg-primary/35 rounded-full blur-3xl animate-pulse-slower"
          style={{ transform: 'translate(-30%, 40%)', animationDelay: '0.5s' }}
        />
        <div
          className="absolute bottom-20 left-40 w-64 h-64 bg-primary/25 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: '2s' }}
        />
        {/* Extra accents */}
        <div
          className="absolute top-1/4 left-20 w-48 h-48 bg-primary/20 rounded-full blur-3xl animate-pulse-slower"
          style={{ animationDelay: '1.5s' }}
        />
        <div
          className="absolute bottom-1/4 right-20 w-56 h-56 bg-primary/25 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: '0.8s' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-4">
            <Leaf className="h-12 w-12 text-primary" />
            <TextReveal>Dash2Zero</TextReveal>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Plataforma de análise e gestão de emissões de carbono
          </p>
        </header>

        {/* Dashboard Section */}
        <section className="mb-12">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardPages.map(page => (
              <PageCard key={page.path} page={page} />
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-12">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Funcionalidades</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featurePages.map(page => (
              <PageCard key={page.path} page={page} />
            ))}
          </div>
        </section>

        {/* Documentation Section */}
        <section className="mb-12">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Documentação</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documentationPages.map(page => (
              <PageCard key={page.path} page={page} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-primary/10">
          <p className="text-sm text-muted-foreground">
            Get2C · For a cooler world
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
