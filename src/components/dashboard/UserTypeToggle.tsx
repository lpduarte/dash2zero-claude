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
      <div className="flex items-center gap-1 bg-primary/10 rounded-lg p-1 border border-primary/20">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => onTypeChange('empresa')}
              className={cn(
                "flex items-center justify-center w-9 h-9 rounded-md transition-all duration-200",
                currentType === 'empresa'
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-primary/60 hover:text-primary hover:bg-primary/10"
              )}
            >
              <Building2 className="h-4 w-4" />
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
                "flex items-center justify-center w-9 h-9 rounded-md transition-all duration-200",
                currentType === 'municipio'
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-primary/60 hover:text-primary hover:bg-primary/10"
              )}
            >
              <Landmark className="h-4 w-4" />
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
