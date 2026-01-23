import { useState, useEffect } from "react";
import { usePageTitle } from "@/lib/usePageTitle";
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Calendar,
  ListTodo,
  Check,
  Eye,
  EyeOff
} from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import pipelineData from "@/data/pipeline.json";

const STORAGE_KEY = "pipeline-hide-completed";

type Status = "completed" | "in-progress" | "pending" | "blocked";
type Category = "critical" | "important" | "normal";

interface Criterion {
  text: string;
  done: boolean;
}

interface PipelineItem {
  id: string;
  title: string;
  description: string;
  category: Category;
  status: Status;
  priority: number;
  criteria: Criterion[];
  dependencies: string[];
}

const statusConfig: Record<Status, { label: string; icon: typeof CheckCircle2; className: string }> = {
  completed: { label: "Concluído", icon: CheckCircle2, className: "text-success" },
  "in-progress": { label: "Em progresso", icon: Clock, className: "text-warning" },
  pending: { label: "WIP", icon: Circle, className: "text-muted-foreground" },
  blocked: { label: "Bloqueado", icon: AlertCircle, className: "text-destructive" }
};

const categoryConfig: Record<Category, { label: string; variant: "destructive" | "warning" | "secondary" }> = {
  critical: { label: "Crítico", variant: "destructive" },
  important: { label: "Importante", variant: "warning" },
  normal: { label: "Normal", variant: "secondary" }
};

function PipelineItemCard({ item }: { item: PipelineItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const status = statusConfig[item.status];
  const category = categoryConfig[item.category];
  const StatusIcon = status.icon;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className={cn(
        "border rounded-lg transition-colors bg-card",
        item.status === "completed" && "bg-success/5 border-success/20",
        item.status === "in-progress" && "bg-warning/5 border-warning/20"
      )}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors rounded-lg">
            <div className="flex items-center gap-2">
              {isOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <StatusIcon className={cn("h-5 w-5", status.className)} />
            </div>

            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-mono">#{item.id}</span>
                <span className="font-medium">{item.title}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={category.variant}>{category.label}</Badge>
              <Badge variant="outline">{status.label}</Badge>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 pt-0 ml-11 space-y-3">
            <div>
              <h4 className="text-sm font-medium mb-2">Critérios de conclusão:</h4>
              <ul className="space-y-1">
                {item.criteria.map((criterion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    {criterion.done ? (
                      <Check className="h-3 w-3 mt-1.5 text-success flex-shrink-0" />
                    ) : (
                      <Circle className="h-3 w-3 mt-1.5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className={cn(
                      criterion.done ? "text-success" : "text-muted-foreground"
                    )}>{criterion.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {item.dependencies.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Dependências:</h4>
                <div className="flex gap-1">
                  {item.dependencies.map((dep) => (
                    <Badge key={dep} variant="outline" className="text-xs">
                      #{dep}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export default function Pipeline() {
  usePageTitle("Pipeline");
  const { metadata, summary, items } = pipelineData;

  const [hideCompleted, setHideCompleted] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "true";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(hideCompleted));
  }, [hideCompleted]);

  // Counts for the chart (based on all items, not filtered)
  const completedCount = items.filter(i => i.status === "completed").length;
  const criticalWipCount = items.filter(i => i.category === "critical" && i.status !== "completed").length;
  const importantWipCount = items.filter(i => i.category === "important" && i.status !== "completed").length;
  const normalWipCount = items.filter(i => i.category === "normal" && i.status !== "completed").length;
  const totalItems = items.length;

  // Percentages for stacked bar
  const completedPct = totalItems > 0 ? (completedCount / totalItems) * 100 : 0;
  const criticalPct = totalItems > 0 ? (criticalWipCount / totalItems) * 100 : 0;
  const importantPct = totalItems > 0 ? (importantWipCount / totalItems) * 100 : 0;
  const normalPct = totalItems > 0 ? (normalWipCount / totalItems) * 100 : 0;

  const filteredItems = hideCompleted
    ? items.filter(i => i.status !== "completed")
    : items;

  const criticalItems = filteredItems.filter(i => i.category === "critical");
  const importantItems = filteredItems.filter(i => i.category === "important");
  const normalItems = filteredItems.filter(i => i.category === "normal");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="relative z-10 max-w-[1400px] mx-auto px-8 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ListTodo className="h-6 w-6 text-primary" />
            Pipeline de Desenvolvimento
          </h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe o progresso das funcionalidades em desenvolvimento
          </p>
        </div>

        {/* Metadata and Filters */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Atualizado: {new Date(metadata.lastUpdated).toLocaleDateString('pt-PT')}</span>
          </div>
          <div className="flex items-center gap-2">
            {hideCompleted ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <Label htmlFor="hide-completed" className="text-sm cursor-pointer">
              Ocultar concluídos
            </Label>
            <Switch
              id="hide-completed"
              checked={hideCompleted}
              onCheckedChange={setHideCompleted}
            />
          </div>
        </div>

        {/* Progress Summary */}
        <Card className="mb-8 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Progresso Geral</CardTitle>
            <CardDescription>
              {completedCount} de {totalItems} itens concluídos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Stacked Progress Bar */}
            <div className="h-3 w-full rounded-full overflow-hidden flex bg-muted">
              {completedPct > 0 && (
                <div
                  className="h-full bg-success transition-all"
                  style={{ width: `${completedPct}%` }}
                />
              )}
              {criticalPct > 0 && (
                <div
                  className="h-full bg-danger transition-all"
                  style={{ width: `${criticalPct}%` }}
                />
              )}
              {importantPct > 0 && (
                <div
                  className="h-full bg-warning transition-all"
                  style={{ width: `${importantPct}%` }}
                />
              )}
              {normalPct > 0 && (
                <div
                  className="h-full bg-secondary transition-all"
                  style={{ width: `${normalPct}%` }}
                />
              )}
            </div>

            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-success">{completedCount}</div>
                <div className="text-xs text-muted-foreground">Concluídos</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-danger">{criticalWipCount}</div>
                <div className="text-xs text-muted-foreground">Críticos</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-warning">{importantWipCount}</div>
                <div className="text-xs text-muted-foreground">Importantes</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-muted-foreground">{normalWipCount}</div>
                <div className="text-xs text-muted-foreground">Normais</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Items */}
        {criticalItems.length > 0 && (
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-2">
              <Badge variant="destructive">Crítico</Badge>
              <span className="text-sm text-muted-foreground">
                {criticalItems.filter(i => i.status === "completed").length}/{criticalItems.length} concluídos
              </span>
            </div>
            <div className="space-y-2">
              {criticalItems.map((item) => (
                <PipelineItemCard key={item.id} item={item as PipelineItem} />
              ))}
            </div>
          </div>
        )}

        {/* Important Items */}
        {importantItems.length > 0 && (
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-2">
              <Badge variant="warning">Importante</Badge>
              <span className="text-sm text-muted-foreground">
                {importantItems.filter(i => i.status === "completed").length}/{importantItems.length} concluídos
              </span>
            </div>
            <div className="space-y-2">
              {importantItems.map((item) => (
                <PipelineItemCard key={item.id} item={item as PipelineItem} />
              ))}
            </div>
          </div>
        )}

        {/* Normal Items */}
        {normalItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Normal</Badge>
              <span className="text-sm text-muted-foreground">
                {normalItems.filter(i => i.status === "completed").length}/{normalItems.length} concluídos
              </span>
            </div>
            <div className="space-y-2">
              {normalItems.map((item) => (
                <PipelineItemCard key={item.id} item={item as PipelineItem} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
