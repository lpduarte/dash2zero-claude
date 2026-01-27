import { useState } from "react";
import { usePageTitle } from "@/lib/usePageTitle";
import { Header } from "@/components/dashboard/Header";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Leaf,
  TrendingDown,
  BarChart3,
  Euro,
  Smartphone,
  Monitor,
  Clock,
  AlertTriangle,
  Zap,
  PiggyBank,
  FileCheck,
  Building2,
  Calculator,
  Target,
  Shield,
  Banknote,
  Award,
  Mail,
  SearchAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { header } from "@/lib/styles";
import { emailColors, withOpacity } from "@/lib/colors";
import headerImage from "/img/header.jpg";

type TemplateId = "t1" | "t2" | "t3" | "t4";

interface EmailTemplateData {
  id: TemplateId;
  name: string;
  subject: string;
  description: string;
}

const templates: EmailTemplateData[] = [
  { id: "t1", name: "Convite Inicial", subject: "Convite: Calcule a pegada de carbono da sua empresa (gratuito)", description: "Primeiro contacto" },
  { id: "t2", name: "Lembrete", subject: "Ainda a tempo: ferramenta gratuita de poupança energética", description: "Follow-up amigável" },
  { id: "t3", name: "Benefícios", subject: "Empresas em Cascais já pouparam milhares de euros com esta ferramenta", description: "Foco em poupança" },
  { id: "t4", name: "Urgente", subject: "Ação necessária: Novos requisitos de reporte de emissões", description: "Prazos e regulamentação" },
];

const EmailTemplate = () => {
  usePageTitle("Template Email");
  const { isGet2C, activeClient } = useUser();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("t1");
  const [subject, setSubject] = useState(templates[0].subject);
  const [responsibleName, setResponsibleName] = useState("João Silva");
  const [responsibleRole, setResponsibleRole] = useState("Coordenador de Sustentabilidade");
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [showHeaderImage, setShowHeaderImage] = useState(true);
  const [customHeaderImage, setCustomHeaderImage] = useState<string | null>(null);

  const handleTemplateChange = (templateId: TemplateId) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomHeaderImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentTemplate = templates.find(t => t.id === selectedTemplate)!;

  // Render email body based on selected template
  const renderEmailBody = () => {
    switch (selectedTemplate) {
      case "t1":
        return <ConviteInicialBody />;
      case "t2":
        return <LembreteBody />;
      case "t3":
        return <BeneficiosBody />;
      case "t4":
        return <UrgenteBody />;
      default:
        return <ConviteInicialBody />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className={cn("relative z-10 max-w-[1400px] mx-auto px-8", isGet2C && activeClient ? "pt-4 pb-8" : "py-8")}>
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            Templates de Email
          </h1>
          <p className="text-muted-foreground mt-1">
            Pré-visualize e personalize os templates de comunicação
          </p>
        </div>

        {/* Editable fields - full width */}
        <Card className="p-6 mb-6 shadow-md space-y-4">
          {/* 1ª linha: Template + Toggle de pré-visualização */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
            <div className="space-y-2">
              <Label htmlFor="template" className="text-sm font-bold">Template</Label>
              <Select value={selectedTemplate} onValueChange={(v) => handleTemplateChange(v as TemplateId)}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(t => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold">Pré-visualização</Label>
              <div className={header.navContainer}>
                <button
                  className={`flex-1 ${viewMode === "desktop" ? header.navItemSmallActive : header.navItemSmallInactive}`}
                  onClick={() => setViewMode("desktop")}
                >
                  <Monitor className="h-4 w-4" />
                  Desktop
                </button>
                <button
                  className={`flex-1 ${viewMode === "mobile" ? header.navItemSmallActive : header.navItemSmallInactive}`}
                  onClick={() => setViewMode("mobile")}
                >
                  <Smartphone className="h-4 w-4" />
                  Mobile
                </button>
              </div>
            </div>
          </div>

          {/* 2ª linha: Assunto do email */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-bold">Assunto do email</Label>
            <Input
              id="subject"
              className="h-10"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Assunto do email"
            />
          </div>

          {/* 3ª linha: Imagem do header */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 items-center">
            <div className="space-y-2">
              <Label htmlFor="headerImage" className="text-sm font-bold">Imagem de cabeçalho</Label>
              <Input
                id="headerImage"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={!showHeaderImage}
                onChange={handleImageUpload}
                className="h-10"
              />
              <p className="text-xs text-muted-foreground">JPG, PNG ou WebP. Máx. 2MB. Recomendado: 600×200px</p>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="showHeader"
                checked={showHeaderImage}
                onCheckedChange={(checked) => setShowHeaderImage(checked as boolean)}
              />
              <Label htmlFor="showHeader" className="text-sm font-normal cursor-pointer">
                Incluir imagem
              </Label>
            </div>
          </div>

          {/* 4ª linha: Responsável + Cargo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-bold">Nome do responsável</Label>
              <Input
                id="name"
                className="h-10"
                value={responsibleName}
                onChange={(e) => setResponsibleName(e.target.value)}
                placeholder="Nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-bold">Cargo</Label>
              <Input
                id="role"
                className="h-10"
                value={responsibleRole}
                onChange={(e) => setResponsibleRole(e.target.value)}
                placeholder="Cargo ou função"
              />
            </div>
          </div>
        </Card>

        {/* Email Preview Container - centered */}
        <div className="max-w-4xl mx-auto">
        <div
          className={`mx-auto transition-all duration-300 ${
            viewMode === "mobile" ? "max-w-[375px]" : "max-w-[600px]"
          }`}
        >
          <Card className="shadow-lg overflow-hidden">
            {/* Email Content */}
            <div
              id="email-content"
              style={{
                fontFamily: "'Plus Jakarta Sans', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                backgroundColor: emailColors.background,
                maxWidth: "600px",
                margin: "0 auto"
              }}
            >
              {/* Google Fonts import for email clients that support it */}
              <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
              `}} />

              {/* Header with dash2zero + Cascais branding */}
              {showHeaderImage && (
                <div
                  style={{
                    borderRadius: "8px 8px 0 0",
                    overflow: "hidden" as const
                  }}
                >
                  <img
                    src={customHeaderImage || headerImage}
                    alt="dash2zero + Cascais"
                    style={{
                      display: "block",
                      width: "100%",
                      height: "auto",
                      maxWidth: "600px"
                    }}
                  />
                </div>
              )}

              {/* Body - changes based on template */}
              <div style={{ padding: "32px 24px" }}>
                {renderEmailBody()}

                {/* CTA Button - same for all */}
                <div style={{ textAlign: "center" as const, marginBottom: "24px" }}>
                  <a
                    href="/onboarding"
                    style={{
                      display: "inline-block",
                      backgroundColor: emailColors.primary,
                      color: emailColors.background,
                      fontSize: "16px",
                      fontWeight: 700,
                      padding: "14px 32px",
                      borderRadius: "8px",
                      textDecoration: "none"
                    }}
                  >
                    {selectedTemplate === "t4" ? "Calcular a pegada de carbono" : "Calcular a pegada de carbono"}
                  </a>
                </div>

                {/* Support text */}
                <p style={{ fontSize: "14px", color: emailColors.textLight, textAlign: "center" as const, marginBottom: "32px" }}>
                  {selectedTemplate === "t1" && "O processo demora menos de 30 minutos. Se precisar de ajuda, estamos disponíveis."}
                  {selectedTemplate === "t2" && "Responda a este email se precisar de ajuda. Temos uma equipa pronta para apoiar."}
                  {selectedTemplate === "t3" && "Sem custos, sem compromissos. A ferramenta é 100% gratuita."}
                  {selectedTemplate === "t4" && "A nossa equipa está disponível para apoio. Responda para agendar."}
                </p>

                {/* Signature */}
                <div style={{ borderTop: `1px solid ${emailColors.borderLight}`, paddingTop: "24px" }}>
                  <p style={{ fontSize: "14px", color: emailColors.textSecondary, marginBottom: "8px" }}>
                    Com os melhores cumprimentos,
                  </p>
                  <p style={{ fontSize: "14px", color: emailColors.text, fontWeight: 700, marginBottom: "4px" }}>
                    {responsibleName}
                  </p>
                  <p style={{ fontSize: "14px", color: emailColors.textSecondary, marginBottom: "4px" }}>
                    {responsibleRole}
                  </p>
                  <p style={{ fontSize: "14px", color: emailColors.textSecondary }}>
                    Município de Cascais
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  backgroundColor: emailColors.backgroundSubtle,
                  padding: "24px",
                  textAlign: "center" as const
                }}
              >
                {/* Logo dash2zero - como no header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    marginBottom: "16px"
                  }}
                >
                  <Leaf style={{ width: "24px", height: "24px", color: emailColors.primary }} />
                  <span style={{ fontSize: "16px", fontWeight: 700, color: emailColors.text }}>
                    dash2zero
                  </span>
                </div>

                {/* Disclaimer com link de unsubscribe */}
                <p
                  style={{
                    fontSize: "12px",
                    color: emailColors.textLighter,
                    lineHeight: 1.5,
                    margin: 0
                  }}
                >
                  Está a receber este email porque a sua empresa está registada no Município de Cascais.
                  <br />
                  Se não deseja receber mais comunicações,{" "}
                  <a href="#" style={{ color: emailColors.textLighter, textDecoration: "underline" }}>
                    clique aqui para deixar de receber
                  </a>.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      </main>
    </div>
  );
};

// ============================================================================
// TEMPLATE 1: CONVITE INICIAL
// ============================================================================
const ConviteInicialBody = () => (
  <>
    <p style={{ fontSize: "14px", color: emailColors.textSecondary, marginBottom: "24px" }}>
      Caro/a responsável,
    </p>

    <p style={{ fontSize: "14px", color: emailColors.textSecondary, lineHeight: 1.6, marginBottom: "16px" }}>
      O Município de Cascais está a disponibilizar <strong style={{ color: emailColors.text }}>acesso gratuito</strong> a
      uma ferramenta que ajuda empresas a reduzir custos energéticos e a prepararem-se para os novos
      requisitos de sustentabilidade.
    </p>

    <p style={{ fontSize: "14px", color: emailColors.textSecondary, lineHeight: 1.6, marginBottom: "24px" }}>
      Com a plataforma <strong style={{ color: emailColors.text }}>Get2Zero Simple</strong>, pode:
    </p>

    {/* Benefits list */}
    <div style={{ marginBottom: "24px" }}>
      {[
        { icon: <PiggyBank className="h-5 w-5" style={{ color: emailColors.primary }} />, text: "Identificar onde está a gastar mais em energia e como poupar" },
        { icon: <Calculator className="h-5 w-5" style={{ color: emailColors.primary }} />, text: "Calcular a pegada de carbono da sua empresa em menos de 30 minutos" },
        { icon: <BarChart3 className="h-5 w-5" style={{ color: emailColors.primary }} />, text: "Comparar o seu desempenho com outras empresas do mesmo sector" },
        { icon: <Euro className="h-5 w-5" style={{ color: emailColors.primary }} />, text: "Descobrir financiamentos e apoios disponíveis para melhorias" },
      ].map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            padding: "12px 16px",
            backgroundColor: i % 2 === 0 ? withOpacity("primaryDark", 0.05) : "transparent",
            borderRadius: "8px",
            marginBottom: "4px"
          }}
        >
          <div style={{ flexShrink: 0, width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {item.icon}
          </div>
          <span style={{ fontSize: "14px", color: emailColors.text, lineHeight: 1.5 }}>
            {item.text}
          </span>
        </div>
      ))}
    </div>

    {/* Note */}
    <div
      style={{
        backgroundColor: withOpacity("primaryDark", 0.08),
        borderLeft: `4px solid ${emailColors.primary}`,
        padding: "16px",
        borderRadius: "0 8px 8px 0",
        marginBottom: "24px"
      }}
    >
      <p style={{ fontSize: "14px", color: emailColors.text, margin: 0, lineHeight: 1.5 }}>
        <strong>Já tem dados de emissões?</strong><br />Pode submeter diretamente — a ferramenta aceita dados existentes.
      </p>
    </div>

    <p style={{ fontSize: "14px", color: emailColors.textSecondary, lineHeight: 1.6, marginBottom: "32px" }}>
      Esta iniciativa faz parte do compromisso do Município com o <strong style={{ color: emailColors.text }}>Pacto dos Autarcas</strong>.
      Quanto mais empresas participarem, mais conseguimos planear apoios concretos para a região.
    </p>
  </>
);

// ============================================================================
// TEMPLATE 2: LEMBRETE
// ============================================================================
const LembreteBody = () => (
  <>
    <p style={{ fontSize: "14px", color: emailColors.textSecondary, marginBottom: "24px" }}>
      Caro/a responsável,
    </p>

    <p style={{ fontSize: "14px", color: emailColors.textSecondary, lineHeight: 1.6, marginBottom: "16px" }}>
      Há algumas semanas convidámo-lo a utilizar a plataforma <strong style={{ color: emailColors.text }}>Get2Zero Simple</strong> —
      e gostaríamos de saber se ainda tem interesse.
    </p>

    <p style={{ fontSize: "14px", color: emailColors.textSecondary, lineHeight: 1.6, marginBottom: "24px" }}>
      Sabemos que o dia-a-dia de uma empresa é exigente. Por isso, simplificámos ao máximo o processo:
    </p>

    {/* Quick facts */}
    <div style={{ marginBottom: "24px" }}>
      {[
        { icon: <Clock className="h-5 w-5" style={{ color: emailColors.primary }} />, title: "Menos de 30 minutos", text: "para completar o cálculo da pegada" },
        { icon: <Euro className="h-5 w-5" style={{ color: emailColors.primary }} />, title: "100% gratuito", text: "sem custos nem compromissos" },
        { icon: <TrendingDown className="h-5 w-5" style={{ color: emailColors.primary }} />, title: "Resultados imediatos", text: "com indicações de poupança personalizadas" },
      ].map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            padding: "14px 16px",
            backgroundColor: withOpacity("primaryDark", 0.05),
            borderRadius: "8px",
            marginBottom: "8px"
          }}
        >
          <div style={{ flexShrink: 0, width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {item.icon}
          </div>
          <div>
            <span style={{ fontSize: "14px", color: emailColors.text, fontWeight: 700 }}>{item.title}</span>
            <span style={{ fontSize: "14px", color: emailColors.textLight }}> — {item.text}</span>
          </div>
        </div>
      ))}
    </div>

    {/* Social proof */}
    <div
      style={{
        backgroundColor: emailColors.backgroundAlt,
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "24px",
        textAlign: "center" as const
      }}
    >
      <p style={{ fontSize: "24px", fontWeight: 700, color: emailColors.primary, marginBottom: "4px" }}>
        47 empresas
      </p>
      <p style={{ fontSize: "14px", color: emailColors.textLight, margin: 0 }}>
        do Município já estão a usar o Get2Zero Simple
      </p>
    </div>
  </>
);

// ============================================================================
// TEMPLATE 3: BENEFÍCIOS (foco em poupança)
// ============================================================================
const BeneficiosBody = () => (
  <>
    <p style={{ fontSize: "14px", color: emailColors.textSecondary, marginBottom: "24px" }}>
      Caro/a responsável,
    </p>

    <p style={{ fontSize: "14px", color: emailColors.textSecondary, lineHeight: 1.6, marginBottom: "16px" }}>
      Sabia que empresas que analisam o seu consumo energético conseguem <strong style={{ color: emailColors.text }}>poupar
      entre 10% a 25%</strong> nos custos de energia?
    </p>

    <p style={{ fontSize: "14px", color: emailColors.textSecondary, lineHeight: 1.6, marginBottom: "24px" }}>
      A plataforma <strong style={{ color: emailColors.text }}>Get2Zero Simple</strong>, disponibilizada gratuitamente pelo Município,
      já ajudou dezenas de empresas anualmente a:
    </p>

    {/* Benefits with numbers */}
    <div style={{ marginBottom: "24px" }}>
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "12px"
        }}
      >
        <div style={{ flex: 1, backgroundColor: withOpacity("primaryDark", 0.08), padding: "16px", borderRadius: "8px", textAlign: "center" as const }}>
          <PiggyBank className="h-6 w-6" style={{ color: emailColors.primary, margin: "0 auto 8px" }} />
          <p style={{ fontSize: "20px", fontWeight: 700, color: emailColors.text, marginBottom: "4px" }}>€2.400</p>
          <p style={{ fontSize: "12px", color: emailColors.textLight, margin: 0 }}>poupar na média de custos energéticos</p>
        </div>
        <div style={{ flex: 1, backgroundColor: withOpacity("primaryDark", 0.08), padding: "16px", borderRadius: "8px", textAlign: "center" as const }}>
          <TrendingDown className="h-6 w-6" style={{ color: emailColors.primary, margin: "0 auto 8px" }} />
          <p style={{ fontSize: "20px", fontWeight: 700, color: emailColors.text, marginBottom: "4px" }}>18%</p>
          <p style={{ fontSize: "12px", color: emailColors.textLight, margin: 0 }}>reduzir a média de emissões</p>
        </div>
      </div>
    </div>

    {/* Key benefits */}
    <p style={{ fontSize: "14px", fontWeight: 700, color: emailColors.text, marginBottom: "12px" }}>
      O que ganha ao participar:
    </p>
    <div style={{ marginBottom: "24px" }}>
      {[
        { icon: <SearchAlert className="h-5 w-5" style={{ color: emailColors.primary }} />, text: "Diagnóstico completo dos seus maiores custos energéticos" },
        { icon: <Zap className="h-5 w-5" style={{ color: emailColors.primary }} />, text: "Recomendações práticas de poupança, ordenadas por impacto" },
        { icon: <Euro className="h-5 w-5" style={{ color: emailColors.primary }} />, text: "Acesso prioritário a fundos de eficiência energética" },
        { icon: <Award className="h-5 w-5" style={{ color: emailColors.primary }} />, text: "Selo de empresa sustentável para usar na comunicação" },
      ].map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 0",
            borderBottom: i < 3 ? `1px solid ${emailColors.borderLighter}` : "none"
          }}
        >
          <div style={{ flexShrink: 0, width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {item.icon}
          </div>
          <span style={{ fontSize: "14px", color: emailColors.textSecondary, lineHeight: 1.4 }}>
            {item.text}
          </span>
        </div>
      ))}
    </div>

    {/* Testimonial style */}
    <div
      style={{
        backgroundColor: emailColors.backgroundAlt,
        borderLeft: `4px solid ${emailColors.primary}`,
        padding: "16px 20px",
        borderRadius: "0 8px 8px 0",
        marginBottom: "32px"
      }}
    >
      <p style={{ fontSize: "14px", color: emailColors.textSecondary, fontStyle: "italic", marginBottom: "8px", lineHeight: 1.5 }}>
        Descobrimos que estávamos a gastar 30% mais em climatização do que o necessário.
        Com pequenos ajustes, poupámos mais de €3.000 no primeiro ano.
      </p>
      <p style={{ fontSize: "12px", color: emailColors.textLight, margin: 0 }}>
        — Marco Gonçalves, Iberdomus
      </p>
    </div>
  </>
);

// ============================================================================
// TEMPLATE 4: URGENTE (regulamentação e prazos)
// ============================================================================
const UrgenteBody = () => (
  <>
    <p style={{ fontSize: "14px", color: emailColors.textSecondary, marginBottom: "24px" }}>
      Caro/a responsável,
    </p>

    {/* Alert box */}
    <div
      style={{
        backgroundColor: withOpacity("warning", 0.1),
        border: `1px solid ${withOpacity("warning", 0.3)}`,
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px"
      }}
    >
      <AlertTriangle className="h-5 w-5" style={{ color: emailColors.warning, flexShrink: 0, marginTop: "2px" }} />
      <div>
        <p style={{ fontSize: "14px", fontWeight: 700, color: emailColors.text, marginBottom: "4px" }}>
          Novos requisitos de reporte em vigor
        </p>
        <p style={{ fontSize: "12px", color: emailColors.textSecondary, margin: 0, lineHeight: 1.4 }}>
          A diretiva CSRD da UE exige que cada vez mais empresas reportem as suas emissões de carbono.
          Muitos parceiros já estão a pedir estes dados aos fornecedores.
        </p>
      </div>
    </div>

    <p style={{ fontSize: "14px", color: emailColors.textSecondary, lineHeight: 1.6, marginBottom: "16px" }}>
      Se a sua empresa ainda não tem os dados de pegada de carbono organizados, é importante começar agora.
      Empresas que se prepararem com antecedência:
    </p>

    {/* Benefits of acting now */}
    <div style={{ marginBottom: "24px" }}>
      {[
        { icon: <Shield className="h-5 w-5" style={{ color: emailColors.primary }} />, text: "Evitam multas e penalizações futuras" },
        { icon: <Building2 className="h-5 w-5" style={{ color: emailColors.primary }} />, text: "Mantêm contratos com grandes clientes que exigem dados ESG" },
        { icon: <Euro className="h-5 w-5" style={{ color: emailColors.primary }} />, text: "Acedem a taxas de juro mais baixas em financiamento verde" },
        { icon: <FileCheck className="h-5 w-5" style={{ color: emailColors.primary }} />, text: "Qualificam-se para concursos públicos como sustentáveis" },
      ].map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            padding: "12px 16px",
            backgroundColor: i % 2 === 0 ? withOpacity("primaryDark", 0.05) : "transparent",
            borderRadius: "8px",
            marginBottom: "4px"
          }}
        >
          <div style={{ flexShrink: 0, width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {item.icon}
          </div>
          <span style={{ fontSize: "14px", color: emailColors.text, lineHeight: 1.5 }}>
            {item.text}
          </span>
        </div>
      ))}
    </div>

    {/* Timeline box */}
    <div
      style={{
        backgroundColor: withOpacity("primaryDark", 0.08),
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "24px"
      }}
    >
      <p style={{ fontSize: "14px", fontWeight: 700, color: emailColors.text, marginBottom: "12px" }}>
        Próximos passos (menos de 30 minutos):
      </p>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
        {[
          "Aceda à plataforma Get2Zero Simple",
          "Preencha o questionário com os dados da empresa",
          "Receba o relatório de pegada de carbono",
          "Obtenha recomendações de melhoria e acesso a apoios"
        ].map((step, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor: emailColors.primary,
                color: emailColors.background,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 700,
                flexShrink: 0
              }}
            >
              {i + 1}
            </div>
            <span style={{ fontSize: "14px", color: emailColors.textSecondary }}>{step}</span>
          </div>
        ))}
      </div>
    </div>

    <p style={{ fontSize: "14px", color: emailColors.textSecondary, lineHeight: 1.6, marginBottom: "32px" }}>
      O Município de Cascais oferece esta plataforma gratuitamente.
      <strong style={{ color: emailColors.text }}> Não deixe para a última hora.</strong>
    </p>
  </>
);

export default EmailTemplate;
