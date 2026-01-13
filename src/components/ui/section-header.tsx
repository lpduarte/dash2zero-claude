import { LucideIcon, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  /** Ícone do header */
  icon: LucideIcon;
  /** Classe adicional para o ícone */
  iconClassName?: string;
  /** Título da secção */
  title: string;
  /** Conteúdo adicional à direita (botões, badges, etc.) */
  actions?: React.ReactNode;
  /** Se a secção é colapsável */
  collapsible?: boolean;
  /** Estado expandido (apenas se collapsible=true) */
  expanded?: boolean;
  /** Handler para toggle (apenas se collapsible=true) */
  onToggle?: () => void;
  /** Classes adicionais */
  className?: string;
}

export const SectionHeader = ({
  icon: Icon,
  iconClassName,
  title,
  actions,
  collapsible = false,
  expanded = true,
  onToggle,
  className,
}: SectionHeaderProps) => {
  // Se é colapsável, a margem inferior depende do estado expanded
  // Se não é colapsável, tem sempre margem (mb-4)
  const marginClass = collapsible 
    ? (expanded ? "mb-4" : "mb-0")
    : "mb-4";

  return (
    <div className={cn("flex items-center justify-between", marginClass, className)}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-muted">
          <Icon className={cn("h-5 w-5 text-muted-foreground", iconClassName)} />
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      
      <div className="flex items-center gap-2">
        {actions}
        
        {collapsible && (
          <button
            type="button"
            onClick={onToggle}
            className="w-9 h-9 rounded-full border border-input bg-background hover:bg-muted/50 flex items-center justify-center transition-colors shrink-0"
          >
            <ChevronDown 
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-[400ms]",
                !expanded && "-rotate-90"
              )}
            />
          </button>
        )}
      </div>
    </div>
  );
};
