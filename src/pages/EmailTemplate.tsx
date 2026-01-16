import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Check, 
  Leaf, 
  Copy, 
  TrendingDown, 
  BarChart3, 
  Euro,
  Smartphone,
  Monitor
} from "lucide-react";
import logoCascais from "@/assets/logo-cascais.svg";

const EmailTemplate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [responsibleName, setResponsibleName] = useState("João Silva");
  const [responsibleRole, setResponsibleRole] = useState("Coordenador de Sustentabilidade");
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  const handleCopyHtml = () => {
    const emailContent = document.getElementById("email-content");
    if (emailContent) {
      navigator.clipboard.writeText(emailContent.outerHTML);
      toast({
        description: "HTML do email copiado para a área de transferência",
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <h1 className="text-lg font-semibold">Pré-visualização do Email</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View mode toggle */}
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === "desktop" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 px-3"
                onClick={() => setViewMode("desktop")}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "mobile" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 px-3"
                onClick={() => setViewMode("mobile")}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
            
            <Button onClick={handleCopyHtml} className="gap-2">
              <Copy className="h-4 w-4" />
              Copiar HTML
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Editable fields */}
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do responsável</Label>
              <Input
                id="name"
                value={responsibleName}
                onChange={(e) => setResponsibleName(e.target.value)}
                placeholder="Nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Cargo</Label>
              <Input
                id="role"
                value={responsibleRole}
                onChange={(e) => setResponsibleRole(e.target.value)}
                placeholder="Cargo ou função"
              />
            </div>
          </div>
        </Card>

        {/* Email Preview Container */}
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
                fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                backgroundColor: "#ffffff",
                maxWidth: "600px",
                margin: "0 auto"
              }}
            >
              {/* Header */}
              <div 
                style={{ 
                  background: "linear-gradient(135deg, hsl(168 71% 31% / 0.1) 0%, hsl(168 71% 31% / 0.05) 100%)",
                  padding: "32px 24px",
                  textAlign: "center" as const,
                  borderBottom: "1px solid hsl(168 71% 31% / 0.1)"
                }}
              >
                <div 
                  style={{ 
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    backgroundColor: "hsl(168 71% 31%)",
                    marginBottom: "16px"
                  }}
                >
                  <img 
                    src={logoCascais} 
                    alt="Município de Cascais" 
                    style={{ width: "40px", height: "40px" }}
                  />
                </div>
                <div 
                  style={{ 
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "hsl(168 71% 31%)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase" as const
                  }}
                >
                  Município de Cascais
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: "32px 24px" }}>
                {/* Greeting */}
                <p style={{ fontSize: "16px", color: "#1a1a1a", marginBottom: "24px" }}>
                  Caro/a responsável,
                </p>

                {/* Main text */}
                <p style={{ fontSize: "15px", color: "#4a4a4a", lineHeight: 1.6, marginBottom: "16px" }}>
                  O Município de Cascais está empenhado em cumprir as metas do{" "}
                  <strong style={{ color: "#1a1a1a" }}>Pacto dos Autarcas</strong> para a redução 
                  de emissões de carbono. E precisa da sua ajuda.
                </p>

                <p style={{ fontSize: "15px", color: "#4a4a4a", lineHeight: 1.6, marginBottom: "24px" }}>
                  Disponibilizamos acesso gratuito a uma ferramenta que permite:
                </p>

                {/* Benefits list */}
                <div style={{ marginBottom: "24px" }}>
                  {[
                    { icon: <Leaf className="h-5 w-5" style={{ color: "hsl(168 71% 31%)" }} />, text: "Calcular a pegada de carbono da sua empresa" },
                    { icon: <TrendingDown className="h-5 w-5" style={{ color: "hsl(168 71% 31%)" }} />, text: "Identificar onde pode poupar energia e reduzir custos" },
                    { icon: <BarChart3 className="h-5 w-5" style={{ color: "hsl(168 71% 31%)" }} />, text: "Comparar o seu desempenho com empresas do mesmo sector" },
                    { icon: <Euro className="h-5 w-5" style={{ color: "hsl(168 71% 31%)" }} />, text: "Descobrir oportunidades de financiamento para melhorias" },
                  ].map((item, i) => (
                    <div 
                      key={i}
                      style={{ 
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        padding: "12px 16px",
                        backgroundColor: i % 2 === 0 ? "hsl(168 71% 31% / 0.05)" : "transparent",
                        borderRadius: "8px",
                        marginBottom: "4px"
                      }}
                    >
                      <div 
                        style={{ 
                          flexShrink: 0,
                          width: "24px",
                          height: "24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        {item.icon}
                      </div>
                      <span style={{ fontSize: "15px", color: "#1a1a1a", lineHeight: 1.5 }}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Note for those with data */}
                <div 
                  style={{ 
                    backgroundColor: "hsl(168 71% 31% / 0.08)",
                    borderLeft: "4px solid hsl(168 71% 31%)",
                    padding: "16px",
                    borderRadius: "0 8px 8px 0",
                    marginBottom: "24px"
                  }}
                >
                  <p style={{ fontSize: "14px", color: "#4a4a4a", margin: 0, lineHeight: 1.5 }}>
                    <strong>Já tem a pegada calculada?</strong> Também pode participar — basta 
                    submeter os dados que já tem.
                  </p>
                </div>

                {/* Incentive text */}
                <p style={{ fontSize: "15px", color: "#4a4a4a", lineHeight: 1.6, marginBottom: "32px" }}>
                  Quanto mais empresas participarem, mais o Município consegue planear apoios 
                  concretos: acesso a fundos de descarbonização, programas de eficiência 
                  energética, e assessoria técnica.
                </p>

                {/* CTA Button */}
                <div style={{ textAlign: "center" as const, marginBottom: "24px" }}>
                  <a
                    href="https://dash2zero.lovable.app/onboarding"
                    style={{
                      display: "inline-block",
                      backgroundColor: "hsl(168 71% 31%)",
                      color: "#ffffff",
                      fontSize: "16px",
                      fontWeight: 600,
                      padding: "14px 32px",
                      borderRadius: "8px",
                      textDecoration: "none"
                    }}
                  >
                    Participar agora
                  </a>
                </div>

                {/* Support text */}
                <p style={{ fontSize: "14px", color: "#6a6a6a", textAlign: "center" as const, marginBottom: "32px" }}>
                  O processo demora menos de 30 minutos. Se precisar de ajuda, estamos disponíveis.
                </p>

                {/* Signature */}
                <div style={{ borderTop: "1px solid #e5e5e5", paddingTop: "24px" }}>
                  <p style={{ fontSize: "14px", color: "#4a4a4a", marginBottom: "8px" }}>
                    Com os melhores cumprimentos,
                  </p>
                  <p style={{ fontSize: "15px", color: "#1a1a1a", fontWeight: 600, marginBottom: "4px" }}>
                    {responsibleName}
                  </p>
                  <p style={{ fontSize: "14px", color: "#6a6a6a", marginBottom: "4px" }}>
                    {responsibleRole}
                  </p>
                  <p style={{ fontSize: "14px", color: "#6a6a6a" }}>
                    Município de Cascais
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div 
                style={{ 
                  backgroundColor: "#f5f5f5",
                  padding: "24px",
                  textAlign: "center" as const
                }}
              >
                {/* Powered by */}
                <div style={{ marginBottom: "16px" }}>
                  <span style={{ fontSize: "12px", color: "#8a8a8a" }}>Uma iniciativa</span>
                  <div 
                    style={{ 
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      marginLeft: "8px"
                    }}
                  >
                    <div 
                      style={{ 
                        width: "20px",
                        height: "20px",
                        borderRadius: "4px",
                        backgroundColor: "hsl(168 71% 31% / 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Leaf style={{ width: "12px", height: "12px", color: "hsl(168 71% 31%)" }} />
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a1a" }}>
                      Dash2Zero
                    </span>
                  </div>
                </div>

                {/* Legal links */}
                <div style={{ fontSize: "12px", color: "#8a8a8a" }}>
                  <a href="#" style={{ color: "#8a8a8a", textDecoration: "underline" }}>
                    Política de Privacidade
                  </a>
                  <span style={{ margin: "0 8px" }}>•</span>
                  <a href="#" style={{ color: "#8a8a8a", textDecoration: "underline" }}>
                    Cancelar subscrição
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplate;
