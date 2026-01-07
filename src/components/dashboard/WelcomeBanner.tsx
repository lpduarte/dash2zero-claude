import { useState } from "react";
import { X } from "lucide-react";

export const WelcomeBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="mb-6 p-6 bg-primary/10 text-foreground rounded-lg shadow-sm border border-primary/20 relative">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-3 right-3 p-1 rounded-md hover:bg-primary/10 transition-colors"
        aria-label="Fechar"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>
      <p className="text-sm leading-relaxed pr-8">
        Visualize as métricas de sustentabilidade do seu grupo de empresas. Utilize o seletor de clusters para filtrar por tipo de relação comercial e acompanhe a evolução das emissões de carbono.
      </p>
    </div>
  );
};
