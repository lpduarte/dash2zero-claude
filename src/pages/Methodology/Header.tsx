import { BookOpen, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  METHODOLOGY_VERSION,
  getVersionString,
} from "@/config/methodology";
import TextReveal from "./TextReveal";

const Header = () => (
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.print()}
          className="print:hidden"
          title="Imprimir documentação"
        >
          <Printer className="h-4 w-4" />
        </Button>
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
);

export default Header;
