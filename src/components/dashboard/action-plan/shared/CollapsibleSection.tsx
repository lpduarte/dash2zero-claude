import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface CollapsibleSectionProps {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children: React.ReactNode;
  highlighted?: boolean;
  isExpanded: boolean;
  onToggle: (id: string, event?: React.MouseEvent) => void;
}

export const CollapsibleSection = ({
  id,
  title,
  icon: Icon,
  badge,
  children,
  highlighted = false,
  isExpanded,
  onToggle,
}: CollapsibleSectionProps) => {
  return (
    <Collapsible open={isExpanded} onOpenChange={() => onToggle(id)}>
      <div className={`border rounded-lg overflow-hidden ${highlighted ? 'border-2 border-primary/30 bg-primary/5' : ''}`}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className={`w-full flex items-center justify-between p-4 transition-colors ${
              highlighted
                ? 'bg-primary/10 hover:bg-primary/20'
                : 'bg-muted/30 hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center gap-3">
              {highlighted ? (
                <div className="p-2 rounded-lg bg-primary/20">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              ) : (
                <Icon className="h-5 w-5 text-muted-foreground" />
              )}
              <span className={`font-medium ${highlighted ? 'font-semibold text-primary' : ''}`}>{title}</span>
              {badge !== undefined && (
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                  {badge}
                </span>
              )}
            </div>
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-[400ms] ${
                highlighted ? 'text-primary' : 'text-muted-foreground'
              } ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className={`p-4 border-t ${highlighted ? 'border-primary/20' : ''}`}>
            {children}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
