import { Calculator, FileText, Check, HelpCircle, Leaf } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
const Onboarding = () => {
  const {
    toast
  } = useToast();
  const handleSimpleClick = () => {
    toast({
      title: "Redirecionar para Simple",
      description: "A abrir plataforma de cálculo guiado..."
    });
  };
  const handleFormClick = () => {
    toast({
      title: "Formulário de Totais",
      description: "A abrir formulário de submissão..."
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex flex-col">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent [background-size:24px_24px] pointer-events-none" />
      
      <main className="flex-1 flex items-center justify-center p-6 relative">
        <div className="w-full max-w-[900px] animate-fade-in">
          {/* Logo & Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-8">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-semibold">Dash2Zero</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Calcule a Pegada de Carbono
              <br />
              <span className="text-primary">da sua empresa</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Escolha a opção que melhor se adequa à sua situação
            </p>
          </div>

          {/* Option Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Option 1: Simple (Recommended) */}
            <Card className="relative p-8 flex flex-col border-2 border-primary/20 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300 group">
              <Badge className="absolute -top-3 right-6 bg-primary text-primary-foreground">
                Recomendado
              </Badge>
              
              <div className="flex-1">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                  <Calculator className="h-8 w-8 text-primary" />
                </div>
                
                <h2 className="text-xl font-semibold mb-2">
                  Quero calcular do zero
                </h2>
                
                <p className="text-muted-foreground mb-6">
                  Ainda não tenho dados de emissões organizados. Preciso de ajuda para começar.
                </p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm">
                    <div className="h-5 w-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span>Processo passo a passo</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="h-5 w-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span>Totalmente guiado</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="h-5 w-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span>Análise completa e detalhada</span>
                  </li>
                </ul>
              </div>
              
              <Button size="lg" className="w-full" onClick={handleSimpleClick}>
                Começar
              </Button>
            </Card>

            {/* Option 2: Form */}
            <Card className="relative p-8 flex flex-col border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
              <div className="flex-1">
                <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-6 group-hover:bg-muted/80 transition-colors">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                
                <h2 className="text-xl font-semibold mb-2">
                  Já tenho dados calculados
                </h2>
                
                <p className="text-muted-foreground mb-6">
                  Já calculei a minha pegada de carbono noutra plataforma ou consultoria.
                </p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm">
                    <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <span>Processo rápido</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <span>Submissão direta</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <span>Inserção única de totais</span>
                  </li>
                </ul>
              </div>
              
              <Button size="lg" variant="outline" className="w-full" onClick={handleFormClick}>
                Avançar
              </Button>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Mais de <span className="font-semibold text-foreground">500 empresas</span> já calcularam a sua pegada
            </p>
            
            <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors" onClick={() => toast({
            title: "Contacto",
            description: "suporte@get2zero.pt"
          })}>
              <HelpCircle className="h-4 w-4" />
              Tem dúvidas? Contacte-nos
            </button>
          </div>
        </div>
      </main>
    </div>;
};
export default Onboarding;