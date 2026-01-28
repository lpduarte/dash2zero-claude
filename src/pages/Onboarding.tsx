import { Calculator, FileText, Check, X, HelpCircle, Leaf, ChevronDown, CheckCircle } from "lucide-react";
import { usePageTitle } from "@/lib/usePageTitle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

// Abstract Analytics Illustration Component
const AbstractIllustration = () => (
  <div className="relative w-full max-w-md aspect-[4/3] bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-8 flex items-end justify-center gap-4">
    {/* Abstract bars */}
    <div className="w-12 h-[40%] bg-primary/20 rounded-lg" />
    <div className="w-12 h-[65%] bg-primary/40 rounded-lg" />
    <div className="w-12 h-[85%] bg-primary rounded-lg" />
    <div className="w-12 h-[55%] bg-primary/30 rounded-lg" />
    
    {/* Decorative circle (progress indicator style) */}
    <div className="absolute top-6 right-6 w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary" />
    
    {/* Trend line */}
    <svg className="absolute top-1/3 left-8 w-24 h-12 opacity-40" viewBox="0 0 100 50">
      <path 
        d="M 0 40 Q 25 35, 50 20 T 100 10" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3"
        strokeLinecap="round"
        className="text-primary"
      />
    </svg>
    
    {/* Small decorative dots */}
    <div className="absolute top-8 left-12 w-2 h-2 rounded-full bg-primary/40" />
    <div className="absolute top-14 left-16 w-1.5 h-1.5 rounded-full bg-primary/30" />
    <div className="absolute bottom-12 right-20 w-2.5 h-2.5 rounded-full bg-primary/50" />
  </div>
);

const Onboarding = () => {
  usePageTitle("Onboarding");
  const navigate = useNavigate();

  const handleSimpleClick = () => {
    navigate("/");
  };

  const handleFormClick = () => {
    navigate("/formulario-totais");
  };

  const scrollToVantagens = () => {
    document.getElementById('vantagens')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-diagonal-pattern relative z-10 overflow-hidden">
      {/* Pulsing background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-primary/30 rounded-full blur-3xl animate-pulse-slow" style={{ transform: 'translate(-50%, -50%)' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/40 rounded-full blur-3xl animate-pulse-slow" style={{ transform: 'translate(30%, -40%)' }} />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/35 rounded-full blur-3xl animate-pulse-slower" style={{ transform: 'translate(20%, -20%)', animationDelay: '0.5s' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/35 rounded-full blur-3xl animate-pulse-slow" style={{ transform: 'translate(-30%, 40%)', animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/30 rounded-full blur-3xl animate-pulse-slower" style={{ transform: 'translate(-10%, 20%)', animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-primary/25 rounded-full blur-2xl animate-pulse-slower" style={{ animationDelay: '0.8s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-primary/25 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Section 1: Choice */}
      <section className="min-h-screen flex items-center justify-center p-6 relative">
        <div className="w-full max-w-[1000px] animate-fade-in">
          {/* Logo & Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-8">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Dash2Zero</span>
            </div>
            
            <h1 className="text-4xl md:text-4xl font-bold tracking-tight mb-4">
              Calcule ou partilhe
              <br />
              a Pegada de Carbono <span className="text-primary">da sua empresa</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-lg mx-auto">
              Escolha a opção que melhor se adequa à sua situação
            </p>
          </div>

          {/* Option Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Option 1: Simple (Recommended) */}
            <Card className="relative p-8 flex flex-col border-2 border-primary/50 bg-card shadow-lg hover:border-primary hover:shadow-xl transition-all duration-300 group rounded-lg">
              <Badge className="absolute -top-3 right-6 bg-primary text-primary-foreground">
                Recomendado
              </Badge>
              
              <div className="flex-1">
                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                  <Calculator className="h-8 w-8 text-primary" />
                </div>
                
                <h2 className="text-xl font-bold mb-2">
                  Quero calcular com o Get2Zero Simple
                </h2>
                
                <p className="text-muted-foreground mb-6">
                  Ainda não tenho dados de emissões organizados.
                </p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm">
                    <div className="h-5 w-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span>Cálculo assistido</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="h-5 w-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span>Cenários de mitigação</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="h-5 w-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span>Oportunidades de poupança</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="h-5 w-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span>Relatório detalhado</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button size="lg" className="flex-1" onClick={handleSimpleClick}>
                  Começar
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="flex-1 border-primary text-primary hover:bg-primary/10"
                  onClick={scrollToVantagens}
                >
                  Saber mais
                </Button>
              </div>
            </Card>

            {/* Option 2: Form */}
            <Card className="relative p-8 flex flex-col border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group rounded-lg">
              <div className="flex-1">
                <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center mb-6 group-hover:bg-muted/80 transition-colors">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                
                <h2 className="text-xl font-bold mb-2">
                  Já tenho dados calculados
                </h2>
                
                <p className="text-muted-foreground mb-6">
                  Já calculei a pegada noutra plataforma.
                </p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm">
                    <div className="h-5 w-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span>Submissão rápida</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="h-5 w-5 rounded-full bg-danger/10 flex items-center justify-center flex-shrink-0">
                      <X className="h-3 w-3 text-danger" />
                    </div>
                    <span className="text-muted-foreground">Sem cálculo automático</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="h-5 w-5 rounded-full bg-danger/10 flex items-center justify-center flex-shrink-0">
                      <X className="h-3 w-3 text-danger" />
                    </div>
                    <span className="text-muted-foreground">Sem cenários de redução</span>
                  </li>
                </ul>
              </div>
              
              <Button size="lg" variant="outline" className="w-full" onClick={handleFormClick}>
                Partilhar a pegada calculada
              </Button>
            </Card>
          </div>

          {/* Scroll indicator */}
          <div className="text-center">
            <button 
              onClick={scrollToVantagens}
              className="inline-flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors animate-bounce"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: Benefits */}
      <section id="vantagens" className="py-24 px-6 bg-muted/30 relative shadow-[0_-8px_20px_-8px_rgba(0,0,0,0.08)]">
        <div className="w-full max-w-[1000px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
              Porquê calcular a pegada de carbono?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Entenda o impacto da sua empresa e descubra oportunidades de melhoria
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            {/* Left: Abstract illustration */}
            <div className="order-2 md:order-1 flex justify-center">
              <AbstractIllustration />
            </div>

            {/* Right: Benefits list */}
            <div className="order-1 md:order-2 space-y-6">
              {[
                "Cumprir requisitos de reporte ESG",
                "Antecipar exigências legais e regulatórias",
                "Responder a pedidos de clientes e parceiros",
                "Identificar oportunidades de redução de custos",
                "Melhorar a imagem corporativa"
              ].map((benefit, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-4 bg-card rounded-lg border hover:border-success/30 hover:shadow-md transition-all"
                >
                  <div className="h-6 w-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button size="lg" className="px-8" onClick={handleSimpleClick}>
              Começar agora →
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center border-t bg-background">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Mais de <span className="font-bold text-foreground">500 empresas</span> já calcularam a sua pegada
          </p>
          
          <a 
            href="mailto:suporte@get2zero.pt"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            Tem dúvidas? Contacte-nos
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Onboarding;
