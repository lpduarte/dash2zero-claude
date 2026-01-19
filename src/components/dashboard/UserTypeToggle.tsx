import { Building2, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserType } from "@/types/user";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UserTypeToggleProps {
  currentType: UserType;
  onTypeChange: (type: UserType) => void;
}

export const UserTypeToggle = ({ currentType, onTypeChange }: UserTypeToggleProps) => {
  return (
    <TooltipProvider>
      <div className="liquid-glass-container flex items-center gap-1 p-1.5 rounded-full backdrop-blur-xl">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => onTypeChange('empresa')}
              className={cn(
                "liquid-glass-btn relative flex items-center justify-center w-9 h-9 rounded-full text-sm font-medium overflow-hidden border border-transparent",
                currentType === 'empresa' ? "active border-primary/25" : "inactive"
              )}
            >
              <Building2 className="h-4 w-4 relative z-10" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Visão Empresa</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => onTypeChange('municipio')}
              className={cn(
                "liquid-glass-btn relative flex items-center justify-center w-9 h-9 rounded-full text-sm font-medium overflow-hidden border border-transparent",
                currentType === 'municipio' ? "active border-primary/25" : "inactive"
              )}
            >
              <Landmark className="h-4 w-4 relative z-10" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Visão Município</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
