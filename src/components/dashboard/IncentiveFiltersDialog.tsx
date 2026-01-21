import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Filter, X, MailX, ShieldAlert } from "lucide-react";

export interface IncentiveFilters {
  onboardingStatus: string[];
  emailCount: "all" | "0" | "1" | "2" | "3+";
  deliveryIssues: ("bounced" | "spam" | "none")[];
}

interface IncentiveFiltersDialogProps {
  filters: IncentiveFilters;
  onFiltersChange: (filters: IncentiveFilters) => void;
  companies: {
    onboardingStatus?: string;
    emailsSent?: number;
    hasDeliveryIssues?: boolean;
    lastDeliveryIssue?: { type: 'bounced' | 'spam' };
  }[];
}

const onboardingStatusOptions = [
  { value: "por_contactar", label: "Por contactar" },
  { value: "sem_interacao", label: "Sem interação" },
  { value: "interessada", label: "Interessada" },
  { value: "interessada_simple", label: "Interessada / Simple" },
  { value: "interessada_formulario", label: "Interessada / Formulário" },
  { value: "registada_simple", label: "Registada" },
  { value: "em_progresso_simple", label: "Em progresso / Simple" },
  { value: "em_progresso_formulario", label: "Em progresso / Formulário" },
  { value: "completo", label: "Completo" },
];

const emailCountOptions = [
  { value: "all", label: "Todos" },
  { value: "0", label: "Nunca contactadas" },
  { value: "1", label: "1 email" },
  { value: "2", label: "2 emails" },
  { value: "3+", label: "3+ emails (saturadas)" },
];

const deliveryIssueOptions = [
  { value: "bounced", label: "Bounce (não entregue)", icon: MailX },
  { value: "spam", label: "Spam", icon: ShieldAlert },
  { value: "none", label: "Sem problemas", icon: null },
];

export const IncentiveFiltersDialog = ({
  filters,
  onFiltersChange,
  companies,
}: IncentiveFiltersDialogProps) => {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<IncentiveFilters>(filters);

  // Calculate onboarding status counts
  const onboardingStatusWithCounts = useMemo(() => {
    const statusCounts = companies.reduce((acc, c) => {
      const status = c.onboardingStatus || "por_contactar";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return onboardingStatusOptions.map(opt => ({
      ...opt,
      count: statusCounts[opt.value] || 0,
    })).filter(opt => opt.count > 0);
  }, [companies]);

  // Calculate delivery issues counts
  const deliveryIssuesWithCounts = useMemo(() => {
    const counts = {
      bounced: 0,
      spam: 0,
      none: 0,
    };

    companies.forEach(c => {
      if (c.hasDeliveryIssues && c.lastDeliveryIssue?.type === 'bounced') {
        counts.bounced++;
      } else if (c.hasDeliveryIssues && c.lastDeliveryIssue?.type === 'spam') {
        counts.spam++;
      } else {
        counts.none++;
      }
    });

    return deliveryIssueOptions.map(opt => ({
      ...opt,
      count: counts[opt.value as keyof typeof counts] || 0,
    }));
  }, [companies]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.onboardingStatus.length > 0) count++;
    if (filters.emailCount !== "all") count++;
    if (filters.deliveryIssues.length > 0) count++;
    return count;
  }, [filters]);

  const handleOnboardingStatusToggle = (status: string) => {
    setLocalFilters(prev => ({
      ...prev,
      onboardingStatus: prev.onboardingStatus.includes(status)
        ? prev.onboardingStatus.filter(s => s !== status)
        : [...prev.onboardingStatus, status],
    }));
  };

  const handleEmailCountChange = (value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      emailCount: value as IncentiveFilters["emailCount"],
    }));
  };

  const handleDeliveryIssueToggle = (issue: "bounced" | "spam" | "none") => {
    setLocalFilters(prev => ({
      ...prev,
      deliveryIssues: prev.deliveryIssues.includes(issue)
        ? prev.deliveryIssues.filter(i => i !== issue)
        : [...prev.deliveryIssues, issue],
    }));
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    const resetFilters: IncentiveFilters = {
      onboardingStatus: [],
      emailCount: "all",
      deliveryIssues: [],
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setLocalFilters(filters);
    }
    setOpen(isOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 border-muted-foreground/30 hover:border-muted-foreground/50 hover:bg-muted">
          <Filter className="h-4 w-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="text-xs px-1.5 py-0 h-5">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:max-w-[400px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Filtros Avançados</SheetTitle>
          <SheetDescription>
            Refine a lista de empresas a contactar
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 py-4">
            {/* Onboarding Status Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-normal">Status de onboarding</Label>
              <div className="space-y-2">
                {onboardingStatusWithCounts.map(({ value, label, count }) => (
                  <label
                    key={value}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Checkbox
                      checked={localFilters.onboardingStatus.includes(value)}
                      onCheckedChange={() => handleOnboardingStatusToggle(value)}
                    />
                    <span className="text-sm flex-1">{label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </label>
                ))}
              </div>
            </div>

            {/* Email Count Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-normal">Nº de emails enviados</Label>
              <div className="space-y-2">
                {emailCountOptions.map(option => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Checkbox
                      checked={localFilters.emailCount === option.value}
                      onCheckedChange={() => handleEmailCountChange(option.value)}
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Delivery Issues Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-normal">Problemas de entrega</Label>
              <div className="space-y-2">
                {deliveryIssuesWithCounts.map(({ value, label, icon: Icon, count }) => (
                  <label
                    key={value}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Checkbox
                      checked={localFilters.deliveryIssues.includes(value as "bounced" | "spam" | "none")}
                      onCheckedChange={() => handleDeliveryIssueToggle(value as "bounced" | "spam" | "none")}
                    />
                    <span className="text-sm flex-1 flex items-center gap-2">
                      {Icon && <Icon className="h-3.5 w-3.5 text-danger" />}
                      {label}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <SheetFooter className="flex-row gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            <X className="h-4 w-4 mr-2" />
            Limpar
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Aplicar filtros
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
