import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { collapsible as collapsibleStyles } from '@/lib/styles';
import { cn } from '@/lib/utils';

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
      <div className={cn(collapsibleStyles.container, highlighted && collapsibleStyles.containerHighlighted)}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className={cn(
              collapsibleStyles.triggerFullWidth,
              highlighted ? collapsibleStyles.triggerHighlighted : collapsibleStyles.triggerDefault
            )}
          >
            <div className="flex items-center gap-3">
              {highlighted ? (
                <div className="p-2 rounded-lg bg-primary/20">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              ) : (
                <Icon className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={`font-normal ${highlighted ? 'font-bold text-primary' : ''}`}>{title}</span>
              {badge !== undefined && (
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-normal">
                  {badge}
                </span>
              )}
            </div>
            <ChevronDown
              className={cn(
                collapsibleStyles.icon,
                highlighted ? 'text-primary' : 'text-muted-foreground',
                isExpanded && collapsibleStyles.iconExpanded
              )}
            />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className={cn(collapsibleStyles.content, highlighted && collapsibleStyles.contentHighlighted)}>
            {children}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
