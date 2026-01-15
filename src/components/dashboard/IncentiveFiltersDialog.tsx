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
import { Filter, X } from "lucide-react";

export interface IncentiveFilters {
  onboardingStatus: string[];
  emailCount: "all" | "0" | "1" | "2" | "3+";
}

interface IncentiveFiltersDialogProps {
  filters: IncentiveFilters;
  onFiltersChange: (filters: IncentiveFilters) => void;
  companies: { onboardingStatus?: string; emailsSent?: number }[];
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

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.onboardingStatus.length > 0) count++;
    if (filters.emailCount !== "all") count++;
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

  const handleApply = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    const resetFilters: IncentiveFilters = {
      onboardingStatus: [],
      emailCount: "all",
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
        <Button variant="outline" size="sm" className="gap-1.5">
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
              <Label className="text-sm font-medium">Status de onboarding</Label>
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
              <Label className="text-sm font-medium">Nº de emails enviados</Label>
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
