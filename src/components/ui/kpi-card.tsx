import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  /** Título do KPI (ex: "Emissões totais") */
  title: string;
  /** Valor principal (ex: "15 749" ou "Médio" ou "Bom") */
  value: string | number;
  /** Unidade ou subtítulo abaixo do valor (ex: "t CO₂e") */
  unit?: string;
  /** Texto inline após o valor (ex: "· 3 estações") */
  inlineSubtitle?: string;
  /** Ícone Lucide */
  icon: LucideIcon;
  /** Cor do ícone (default: text-muted-foreground) */
  iconColor?: string;
  /** Cor de fundo do ícone (default: bg-muted) */
  iconBgColor?: string;
  /** Cor do valor (default: inherit) */
  valueColor?: string;
  /** Classes adicionais para o container */
  className?: string;
  /** Conteúdo extra (ex: botão de info) */
  extra?: React.ReactNode;
  /** Handler de click (opcional) */
  onClick?: () => void;
}

export const KPICard = ({
  title,
  value,
  unit,
  inlineSubtitle,
  icon: Icon,
  iconColor = 'text-muted-foreground',
  iconBgColor = 'bg-muted',
  valueColor,
  className,
  extra,
  onClick,
}: KPICardProps) => {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      className={cn(
        "p-4 border rounded-lg shadow-sm text-left relative",
        onClick && "cursor-pointer hover:bg-muted/50 transition-colors",
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <div className={cn("p-1.5 rounded", iconBgColor)}>
            <Icon className={cn("h-4 w-4", iconColor)} />
          </div>
        </div>

        {inlineSubtitle ? (
          <div className="flex items-baseline gap-2">
            <p className={cn("text-2xl font-bold", valueColor)}>{value}</p>
            <span className="text-sm text-muted-foreground">· {inlineSubtitle}</span>
          </div>
        ) : (
          <div>
            <p className={cn("text-2xl font-bold", valueColor)}>{value}</p>
            {unit && <p className="text-xs text-muted-foreground mt-1">{unit}</p>}
          </div>
        )}
      </div>
      {extra}
    </Component>
  );
};
