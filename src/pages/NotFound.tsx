import { useLocation, Link } from "react-router-dom";
import { usePageTitle } from "@/lib/usePageTitle";
import { useEffect, useState } from "react";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  usePageTitle("Página não encontrada");
  const location = useLocation();
  const [isOrange, setIsOrange] = useState(false);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  // Trigger color change when leaf lands
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOrange(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Background pulsing elements - clustered organic spread */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Main central cluster */}
        <div
          className="absolute w-[700px] h-[700px] rounded-full blur-3xl animate-pulse-slow bg-primary/[0.18]"
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        />
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl animate-pulse-slower bg-primary/[0.22]"
          style={{ top: "40%", left: "45%", transform: "translate(-50%, -50%)" }}
        />
        <div
          className="absolute w-72 h-72 rounded-full blur-3xl animate-pulse-slow bg-primary/20"
          style={{ top: "55%", left: "58%", transform: "translate(-50%, -50%)" }}
        />

        {/* Upper cluster */}
        <div
          className="absolute w-80 h-80 rounded-full blur-3xl animate-pulse-slower bg-primary/25"
          style={{ top: "5%", left: "35%" }}
        />
        <div
          className="absolute w-64 h-64 rounded-full blur-3xl animate-pulse-slow bg-primary/20"
          style={{ top: "12%", left: "50%" }}
        />
        <div
          className="absolute w-48 h-48 rounded-full blur-3xl animate-pulse-slower bg-primary/[0.18]"
          style={{ top: "8%", left: "62%" }}
        />

        {/* Right cluster */}
        <div
          className="absolute w-72 h-72 rounded-full blur-3xl animate-pulse-slow bg-primary/[0.22]"
          style={{ top: "35%", right: "5%" }}
        />
        <div
          className="absolute w-56 h-56 rounded-full blur-3xl animate-pulse-slower bg-primary/[0.18]"
          style={{ top: "50%", right: "12%" }}
        />

        {/* Left cluster */}
        <div
          className="absolute w-80 h-80 rounded-full blur-3xl animate-pulse-slower bg-primary/[0.24]"
          style={{ top: "30%", left: "2%" }}
        />
        <div
          className="absolute w-52 h-52 rounded-full blur-3xl animate-pulse-slow bg-primary/[0.18]"
          style={{ top: "48%", left: "15%" }}
        />

        {/* Lower cluster */}
        <div
          className="absolute w-72 h-72 rounded-full blur-3xl animate-pulse-slow bg-primary/[0.22]"
          style={{ bottom: "5%", left: "40%" }}
        />
        <div
          className="absolute w-60 h-60 rounded-full blur-3xl animate-pulse-slower bg-primary/20"
          style={{ bottom: "10%", left: "55%" }}
        />
        <div
          className="absolute w-44 h-44 rounded-full blur-3xl animate-pulse-slow bg-primary/[0.16]"
          style={{ bottom: "15%", right: "20%" }}
        />
      </div>

      {/* Orange overlay - fades in when leaf lands */}
      <div
        className="absolute inset-0 pointer-events-none bg-autumn/15"
        style={{
          opacity: isOrange ? 1 : 0,
          transition: "opacity 8s ease-in-out",
        }}
      />

      {/* Falling leaf */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="falling-leaf">
          <Leaf className="w-14 h-14 text-autumn" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 mt-24">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
          Não conseguimos encontrar esta página
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Pode ter sido movida ou não existe.
        </p>
        <Link to="/">
          <Button variant="ghost" className="gap-2">
            Voltar ao Dashboard
          </Button>
        </Link>
      </div>

      {/* Falling leaf animation styles */}
      <style>{`
        .falling-leaf {
          position: absolute;
          left: 50%;
          top: -80px;
          transform: translateX(-50%);
          animation:
            fallVertical 10s cubic-bezier(0.15, 0, 0.4, 1) forwards,
            swayHorizontal 10s ease-in-out forwards,
            leafRotate 10s ease-out forwards;
        }

        @keyframes fallVertical {
          0% {
            top: -80px;
            opacity: 0;
          }
          3% {
            opacity: 1;
          }
          100% {
            top: calc(50% - 110px);
            opacity: 1;
          }
        }

        /* Pendulum-like sway with damping - wide arcs that diminish */
        @keyframes swayHorizontal {
          0% {
            margin-left: 0px;
          }
          12% {
            margin-left: 120px;
          }
          28% {
            margin-left: -90px;
          }
          44% {
            margin-left: 60px;
          }
          60% {
            margin-left: -35px;
          }
          76% {
            margin-left: 18px;
          }
          88% {
            margin-left: -8px;
          }
          100% {
            margin-left: 0px;
          }
        }

        /* Gentle rotation following the arc direction, ending at 45° */
        @keyframes leafRotate {
          0% {
            transform: translateX(-50%) rotate(-10deg);
          }
          12% {
            transform: translateX(-50%) rotate(15deg);
          }
          28% {
            transform: translateX(-50%) rotate(-5deg);
          }
          44% {
            transform: translateX(-50%) rotate(20deg);
          }
          60% {
            transform: translateX(-50%) rotate(30deg);
          }
          76% {
            transform: translateX(-50%) rotate(38deg);
          }
          88% {
            transform: translateX(-50%) rotate(43deg);
          }
          100% {
            transform: translateX(-50%) rotate(45deg);
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
