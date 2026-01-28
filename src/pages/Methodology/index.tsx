import { useState, useEffect } from "react";
import { usePageTitle } from "@/lib/usePageTitle";
import {
  methodologySections,
  getVersionString,
  getVersionDate,
} from "@/config/methodology";

import Sidebar from "./Sidebar";
import Header from "./Header";
import {
  VisaoGeral,
  TiposUtilizador,
  Glossario,
  CalculoEmissoes,
  Indicadores,
  PotencialMelhoria,
  SetoresActividade,
  FatoresIntensidade,
  DadosRecolher,
  FluxoOnboarding,
  GestaoClusters,
  Dashboard,
  GraficosAnalises,
  PlanosAccao,
  Medidas,
  Financiamento,
  Incentivos,
  TemplatesEmail,
  BoasPraticasEmail,
  PainelControlo,
  Permissoes,
  Infraestruturas,
  Bibliografia,
} from "./sections";

// Flat list of all section IDs for scroll tracking
const allSections = methodologySections.flatMap(g => g.sections);

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
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const id = visible[0].target.id;
          setActiveSection(id);
          window.history.replaceState(null, '', `#${id}`);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    allSections.forEach(section => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const timer = setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveSection(hash);
        const group = methodologySections.find(g => g.sections.some(s => s.id === hash));
        if (group) {
          setExpandedGroups(prev => ({ ...prev, [group.id]: true }));
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  const scrollToSection = (id: string) => {
    window.history.replaceState(null, '', `#${id}`);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
      >
        Saltar para conteúdo principal
      </a>

      <Sidebar
        activeSection={activeSection}
        expandedGroups={expandedGroups}
        onToggleGroup={toggleGroup}
        onNavigate={scrollToSection}
      />

      {/* Main Content - bg-grid-pattern provides both gray bg (::before) and grid (::after) */}
      <main id="main-content" className="flex-1 lg:ml-64 bg-grid-pattern relative z-10">
        <Header />

        {/* Content Sections */}
        <div className="p-4 lg:p-8 max-w-5xl">
          <VisaoGeral />
          <TiposUtilizador />
          <Glossario />
          <CalculoEmissoes />
          <Indicadores />
          <PotencialMelhoria />
          <SetoresActividade />
          <FatoresIntensidade />
          <DadosRecolher />
          <FluxoOnboarding />
          <GestaoClusters />
          <Dashboard />
          <GraficosAnalises />
          <PlanosAccao />
          <Medidas />
          <Financiamento />
          <Incentivos />
          <TemplatesEmail />
          <BoasPraticasEmail />
          <PainelControlo />
          <Permissoes />
          <Infraestruturas />
          <Bibliografia />
        </div>
      </main>

      {/* Footer with gradient */}
      <footer className="footer-gradient lg:ml-64 border-t">
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
