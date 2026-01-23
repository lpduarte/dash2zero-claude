import { useMemo, useState, useRef, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SupplierAny, hasFootprint } from "@/types/supplierNew";
import { onboardingStatusConfig, getStatusLabel, getStatusOrder, OnboardingStatus, CompletedVia } from "@/config/onboardingStatus";
import { cn } from "@/lib/utils";
import { Search, Filter, ChevronUp, ChevronDown, ChevronsUpDown, X, Trash2, Mail, Plus, CircleDot, UserPlus, ClipboardPaste, FileSpreadsheet, ArrowRightLeft } from "lucide-react";
import { MoveCompaniesDialog } from "./MoveCompaniesDialog";
import { ClusterDefinition } from "@/types/clusterNew";
import { ManualEntryTab, NewCompanyData } from "./tabs/ManualEntryTab";
import { PasteDataTab } from "./tabs/PasteDataTab";
import { FileImportTab } from "./tabs/FileImportTab";

interface ProvidersTableProps {
  companies: SupplierAny[];
  onUpdateCompany?: (companyId: string, field: 'name' | 'nif' | 'email', value: string) => void;
  onDeleteCompanies?: (companyIds: string[]) => void;
  onMoveCompanies?: (companyIds: string[], targetClusterId: string, keepCopy: boolean) => void;
  onAddCompanies?: () => void;
  onAddCompaniesInline?: (companies: NewCompanyData[]) => void;
  onIncentivize?: () => void;
  hasNoClusters?: boolean;
  selectedClusterId?: string | null;
  clusters?: ClusterDefinition[];
}

type EditableField = 'name' | 'nif' | 'email';

interface EditingCell {
  companyId: string;
  field: EditableField;
}

// EditableCell component for inline editing
interface EditableCellProps {
  value: string;
  companyId: string;
  field: EditableField;
  isEditing: boolean;
  onStartEdit: (companyId: string, field: EditableField) => void;
  onSave: (value: string) => void;
  onCancel: () => void;
  className?: string;
}

function EditableCell({
  value,
  companyId,
  field,
  isEditing,
  onStartEdit,
  onSave,
  onCancel,
  className = '',
}: EditableCellProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    if (isEditing) {
      setEditValue(value);
    }
  }, [isEditing, value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue) {
      onSave(trimmedValue);
    } else {
      onCancel();
    }
  };

  if (!isEditing) {
    return (
      <span
        onClick={() => onStartEdit(companyId, field)}
        className={cn(
          "cursor-text block h-8 flex items-center",
          className
        )}
      >
        {value}
      </span>
    );
  }

  return (
    <input
      ref={inputRef}
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onBlur={handleSave}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSave();
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          onCancel();
        }
      }}
      className={cn(
        "h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-sm",
        "focus-visible:outline-none focus-visible:border-ring",
        className
      )}
    />
  );
}

type SortField = 'name' | 'nif' | 'email' | 'status';
type SortDirection = 'asc' | 'desc';

interface SortState {
  field: SortField;
  direction: SortDirection;
}

// Helper to get status info from a company (handles both types)
function getCompanyStatus(company: SupplierAny): { status: OnboardingStatus; completedVia?: CompletedVia } {
  if (hasFootprint(company)) {
    // Empresas com pegada são "completo"
    const completedVia = company.dataSource === 'get2zero' ? 'simple' : 'formulario';
    return { status: 'completo', completedVia };
  }
  // Empresas sem pegada usam o onboardingStatus
  return { status: company.onboardingStatus as OnboardingStatus, completedVia: company.completedVia };
}

// Filter status includes completo split by completedVia
type FilterStatus = OnboardingStatus | 'completo_simple' | 'completo_formulario';

// All possible filter values (completo split into two)
const allFilterStatuses: { value: FilterStatus; label: string }[] = [
  { value: 'por_contactar', label: 'Por contactar' },
  { value: 'sem_interacao', label: 'Sem interação' },
  { value: 'interessada', label: 'Interessada' },
  { value: 'registada_simple', label: 'Registada / Simple' },
  { value: 'em_progresso_simple', label: 'Em progresso / Simple' },
  { value: 'em_progresso_formulario', label: 'Em progresso / Formulário' },
  { value: 'completo_simple', label: 'Completo / Simple' },
  { value: 'completo_formulario', label: 'Completo / Formulário' },
];

// Helper to get the filter status (handles completo split)
function getCompanyFilterStatus(company: SupplierAny): FilterStatus {
  const { status, completedVia } = getCompanyStatus(company);
  if (status === 'completo') {
    return completedVia === 'simple' ? 'completo_simple' : 'completo_formulario';
  }
  return status;
}

// SortableHeader component
interface SortableHeaderProps {
  field: SortField;
  label: string;
  sortState: SortState;
  onSort: (field: SortField) => void;
  children?: React.ReactNode;
  className?: string;
}

function SortableHeader({ field, label, sortState, onSort, children, className }: SortableHeaderProps) {
  const isActive = sortState.field === field;

  return (
    <TableHead className={className}>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onSort(field)}
          className={cn(
            "flex items-center gap-1 hover:text-foreground transition-colors -ml-2 px-2 py-1 rounded",
            isActive ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {label}
          {isActive ? (
            sortState.direction === 'asc' ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )
          ) : (
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          )}
        </button>
        {children}
      </div>
    </TableHead>
  );
}

// StatusFilter component
interface StatusFilterProps {
  statusFilters: FilterStatus[];
  setStatusFilters: (filters: FilterStatus[]) => void;
  statusCounts: Record<FilterStatus, number>;
}

function StatusFilter({ statusFilters, setStatusFilters, statusCounts }: StatusFilterProps) {
  const activeCount = statusFilters.length;

  const toggleStatus = (status: FilterStatus) => {
    if (statusFilters.includes(status)) {
      setStatusFilters(statusFilters.filter(s => s !== status));
    } else {
      setStatusFilters([...statusFilters, status]);
    }
  };

  const clearFilters = () => {
    setStatusFilters([]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "relative p-1 rounded hover:bg-muted transition-colors",
            activeCount > 0 && "text-primary"
          )}
        >
          <Filter className="h-4 w-4" />
          {activeCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="end">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold">Filtrar por estado</span>
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 px-2 text-xs"
            >
              Limpar
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {allFilterStatuses.map(({ value, label }) => {
            const count = statusCounts[value] || 0;

            return (
              <label
                key={value}
                className="flex items-center gap-2 cursor-pointer hover:bg-muted p-1 rounded -mx-1"
              >
                <Checkbox
                  checked={statusFilters.includes(value)}
                  onCheckedChange={() => toggleStatus(value)}
                />
                <span className="flex-1 text-sm">{label}</span>
                <span className="text-xs text-muted-foreground">{count}</span>
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Type for local edits storage
type EditedValues = Record<string, { name?: string; nif?: string; email?: string }>;

export function ProvidersTable({ companies, onUpdateCompany, onDeleteCompanies, onMoveCompanies, onAddCompanies, onAddCompaniesInline, onIncentivize, hasNoClusters, selectedClusterId, clusters = [] }: ProvidersTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortState, setSortState] = useState<SortState>({
    field: 'status',
    direction: 'asc'
  });
  const [statusFilters, setStatusFilters] = useState<FilterStatus[]>([]);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [editedValues, setEditedValues] = useState<EditedValues>({});

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<string | 'bulk' | null>(null);

  // Move dialog state
  const [moveTarget, setMoveTarget] = useState<SupplierAny | 'bulk' | null>(null);

  // State to control inline add tabs visibility
  const [showInlineAdd, setShowInlineAdd] = useState(true);

  // Reset inline add visibility when cluster changes
  useEffect(() => {
    setShowInlineAdd(true);
  }, [selectedClusterId]);

  // Reset inline add visibility when cluster becomes empty
  useEffect(() => {
    if (companies.length === 0) {
      setShowInlineAdd(true);
    }
  }, [companies.length]);

  // Handler for inline add that hides tabs after success
  const handleInlineAddCompanies = (newCompanies: NewCompanyData[]) => {
    onAddCompaniesInline?.(newCompanies);
    setShowInlineAdd(false);
  };

  const handleStartEdit = (companyId: string, field: EditableField) => {
    setEditingCell({ companyId, field });
  };

  const handleSaveEdit = (companyId: string, field: EditableField, value: string) => {
    // Update local state
    setEditedValues(prev => ({
      ...prev,
      [companyId]: {
        ...prev[companyId],
        [field]: value
      }
    }));
    // Notify parent if callback provided
    if (onUpdateCompany) {
      onUpdateCompany(companyId, field, value);
    }
    setEditingCell(null);
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
  };

  // Get the display value for a field (edited or original)
  const getDisplayValue = (company: SupplierAny, field: EditableField): string => {
    const edited = editedValues[company.id];
    if (edited && edited[field] !== undefined) {
      return edited[field]!;
    }
    switch (field) {
      case 'name': return company.name;
      case 'nif': return company.contact.nif;
      case 'email': return company.contact.email;
    }
  };

  // Handle checkbox click with shift+click support
  const handleCheckboxClick = (e: React.MouseEvent, companyId: string, index: number, visibleCompanies: SupplierAny[]) => {
    const isShiftClick = e.shiftKey;
    const isSelected = selectedIds.has(companyId);

    if (isShiftClick && lastClickedIndex !== null) {
      // Select range from last clicked to current
      const start = Math.min(lastClickedIndex, index);
      const end = Math.max(lastClickedIndex, index);
      const newSelectedIds = new Set(selectedIds);

      for (let i = start; i <= end; i++) {
        newSelectedIds.add(visibleCompanies[i].id);
      }

      setSelectedIds(newSelectedIds);
    } else {
      // Toggle single selection
      const newSelectedIds = new Set(selectedIds);
      if (isSelected) {
        newSelectedIds.delete(companyId);
      } else {
        newSelectedIds.add(companyId);
      }
      setSelectedIds(newSelectedIds);
    }

    setLastClickedIndex(index);
  };

  // Handle select all checkbox
  const handleSelectAll = (visibleCompanies: SupplierAny[]) => {
    const visibleIds = visibleCompanies.map(c => c.id);
    const allVisibleSelected = visibleIds.every(id => selectedIds.has(id));

    if (allVisibleSelected) {
      // Deselect all visible
      const newSelectedIds = new Set(selectedIds);
      visibleIds.forEach(id => newSelectedIds.delete(id));
      setSelectedIds(newSelectedIds);
    } else {
      // Select all visible
      const newSelectedIds = new Set(selectedIds);
      visibleIds.forEach(id => newSelectedIds.add(id));
      setSelectedIds(newSelectedIds);
    }
  };

  // Handle delete confirmation
  const handleConfirmDelete = () => {
    if (!onDeleteCompanies || !deleteTarget) return;

    if (deleteTarget === 'bulk') {
      onDeleteCompanies(Array.from(selectedIds));
      setSelectedIds(new Set());
    } else {
      onDeleteCompanies([deleteTarget]);
      // Remove from selection if it was selected
      const newSelectedIds = new Set(selectedIds);
      newSelectedIds.delete(deleteTarget);
      setSelectedIds(newSelectedIds);
    }

    setDeleteTarget(null);
  };

  // Get company name for delete confirmation message
  const getCompanyNameForDelete = (companyId: string): string => {
    const company = companies.find(c => c.id === companyId);
    if (!company) return '';
    const edited = editedValues[companyId];
    return edited?.name ?? company.name;
  };

  // Handle move dialog
  const handleMove = (companyIds: string[], targetClusterId: string, keepCopy: boolean) => {
    if (!onMoveCompanies) return;
    onMoveCompanies(companyIds, targetClusterId, keepCopy);
    setSelectedIds(new Set()); // Clear selection after move
    setMoveTarget(null);
  };

  // Get companies for move dialog
  const getCompaniesForMove = (): SupplierAny[] => {
    if (moveTarget === 'bulk') {
      return companies.filter(c => selectedIds.has(c.id));
    }
    if (moveTarget) {
      return [moveTarget];
    }
    return [];
  };

  // Count companies by filter status (for filter display)
  const statusCounts = useMemo(() => {
    const counts: Record<FilterStatus, number> = {} as Record<FilterStatus, number>;
    allFilterStatuses.forEach(({ value }) => counts[value] = 0);

    companies.forEach(company => {
      const filterStatus = getCompanyFilterStatus(company);
      counts[filterStatus] = (counts[filterStatus] || 0) + 1;
    });

    return counts;
  }, [companies]);

  // Filter and sort companies
  const filteredAndSortedCompanies = useMemo(() => {
    let result = [...companies];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(company =>
        company.name.toLowerCase().includes(query) ||
        company.contact.nif.toLowerCase().includes(query) ||
        company.contact.email.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilters.length > 0) {
      result = result.filter(company => {
        const filterStatus = getCompanyFilterStatus(company);
        return statusFilters.includes(filterStatus);
      });
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortState.field) {
        case 'name':
          comparison = a.name.localeCompare(b.name, 'pt');
          break;
        case 'nif':
          comparison = a.contact.nif.localeCompare(b.contact.nif);
          break;
        case 'email':
          comparison = a.contact.email.localeCompare(b.contact.email, 'pt');
          break;
        case 'status':
          const statusA = getCompanyStatus(a);
          const statusB = getCompanyStatus(b);
          comparison = getStatusOrder(statusA.status) - getStatusOrder(statusB.status);
          break;
      }

      return sortState.direction === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [companies, searchQuery, statusFilters, sortState]);

  const handleSort = (field: SortField) => {
    setSortState(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilters([]);
  };

  // Empty state 1: No clusters created at all
  if (hasNoClusters) {
    return (
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10 text-muted-foreground/50">
              <Checkbox disabled />
            </TableHead>
            <TableHead className="text-muted-foreground/50">Nome</TableHead>
            <TableHead className="w-40 text-muted-foreground/50">NIF/NIPC</TableHead>
            <TableHead className="text-muted-foreground/50">Email</TableHead>
            <TableHead className="text-muted-foreground/50">Estado</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
      </Table>
    );
  }

  // Empty state 2: "Todas" view with no companies
  if (companies.length === 0 && !selectedClusterId) {
    return (
      <Card className="border-2 border-dashed border-muted-foreground/30">
        <div className="py-16 text-center">
          <CircleDot className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground">
            Seleccione um cluster para adicionar empresas
          </p>
        </div>
      </Card>
    );
  }

  // Empty state 3: Cluster selected but no companies - show inline tabs
  if (companies.length === 0 && selectedClusterId && onAddCompaniesInline && showInlineAdd) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">Adicione empresas a este cluster</h3>
        </div>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manual" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Manual
            </TabsTrigger>
            <TabsTrigger value="paste" className="gap-2">
              <ClipboardPaste className="h-4 w-4" />
              Colar dados
            </TabsTrigger>
            <TabsTrigger value="file" className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Importar ficheiro
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual">
            <ManualEntryTab onAddCompanies={handleInlineAddCompanies} onClose={() => setShowInlineAdd(false)} />
          </TabsContent>
          <TabsContent value="paste">
            <PasteDataTab onAddCompanies={handleInlineAddCompanies} onClose={() => setShowInlineAdd(false)} />
          </TabsContent>
          <TabsContent value="file">
            <FileImportTab onAddCompanies={handleInlineAddCompanies} onClose={() => setShowInlineAdd(false)} />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and actions row */}
      <div className="flex items-center gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome, NIF/NIPC ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Action buttons */}
        {(onAddCompanies || onIncentivize) && (
          <div className="flex gap-2 shrink-0">
            {onIncentivize && (
              <Button onClick={onIncentivize}>
                <Mail className="h-4 w-4 mr-2" />
                Incentivar cálculo da pegada
              </Button>
            )}
            {onAddCompanies && (
              <Button variant="outline" onClick={onAddCompanies}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar empresas
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Table or empty state */}
      {filteredAndSortedCompanies.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-3">
            Nenhuma empresa encontrada com os filtros actuais.
          </p>
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
            Limpar filtros
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {/* Checkbox column */}
              <TableHead className="w-10 align-middle">
                <Checkbox
                  checked={
                    filteredAndSortedCompanies.length > 0 &&
                    filteredAndSortedCompanies.every(c => selectedIds.has(c.id))
                      ? true
                      : filteredAndSortedCompanies.some(c => selectedIds.has(c.id))
                        ? "indeterminate"
                        : false
                  }
                  onCheckedChange={() => handleSelectAll(filteredAndSortedCompanies)}
                />
              </TableHead>
              <SortableHeader
                field="name"
                label="Nome"
                sortState={sortState}
                onSort={handleSort}
              />
              <SortableHeader
                field="nif"
                label="NIF/NIPC"
                sortState={sortState}
                onSort={handleSort}
                className="w-40"
              />
              <SortableHeader
                field="email"
                label="Email"
                sortState={sortState}
                onSort={handleSort}
              />
              <SortableHeader
                field="status"
                label="Estado"
                sortState={sortState}
                onSort={handleSort}
              >
                <StatusFilter
                  statusFilters={statusFilters}
                  setStatusFilters={setStatusFilters}
                  statusCounts={statusCounts}
                />
              </SortableHeader>
              {/* Actions column */}
              <TableHead className="w-20">
                {selectedIds.size >= 2 && (
                  <div className="flex items-center gap-1">
                    {onMoveCompanies && clusters.length > 1 && selectedClusterId && (
                      <button
                        onClick={() => setMoveTarget('bulk')}
                        className="p-1 rounded hover:bg-muted transition-colors"
                        title="Mover para outro cluster"
                      >
                        <ArrowRightLeft className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteTarget('bulk')}
                      className="p-1 rounded hover:bg-muted transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedCompanies.map((company, index) => {
              const { status, completedVia } = getCompanyStatus(company);
              const config = onboardingStatusConfig[status];
              const label = getStatusLabel(status, completedVia);
              const isRowEditing = editingCell?.companyId === company.id;
              const isSelected = selectedIds.has(company.id);

              return (
                <TableRow
                  key={company.id}
                  className={cn(
                    "group",
                    isRowEditing && "hover:bg-transparent",
                    isSelected && "bg-muted/50"
                  )}
                >
                  {/* Checkbox cell */}
                  <TableCell className="w-10 align-middle">
                    <Checkbox
                      checked={isSelected}
                      onClick={(e) => handleCheckboxClick(e, company.id, index, filteredAndSortedCompanies)}
                    />
                  </TableCell>
                  <TableCell className="font-normal">
                    <EditableCell
                      value={getDisplayValue(company, 'name')}
                      companyId={company.id}
                      field="name"
                      isEditing={isRowEditing && editingCell?.field === 'name'}
                      onStartEdit={handleStartEdit}
                      onSave={(value) => handleSaveEdit(company.id, 'name', value)}
                      onCancel={handleCancelEdit}
                    />
                  </TableCell>
                  <TableCell className="w-40">
                    <EditableCell
                      value={getDisplayValue(company, 'nif')}
                      companyId={company.id}
                      field="nif"
                      isEditing={isRowEditing && editingCell?.field === 'nif'}
                      onStartEdit={handleStartEdit}
                      onSave={(value) => handleSaveEdit(company.id, 'nif', value)}
                      onCancel={handleCancelEdit}
                    />
                  </TableCell>
                  <TableCell>
                    <EditableCell
                      value={getDisplayValue(company, 'email')}
                      companyId={company.id}
                      field="email"
                      isEditing={isRowEditing && editingCell?.field === 'email'}
                      onStartEdit={handleStartEdit}
                      onSave={(value) => handleSaveEdit(company.id, 'email', value)}
                      onCancel={handleCancelEdit}
                      className="text-muted-foreground"
                    />
                  </TableCell>
                  <TableCell>
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help">
                            <Badge className={`text-xs py-0 ${config?.color || 'bg-muted text-muted-foreground'}`}>
                              {label}
                            </Badge>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className={cn("border", config?.borderColor)}>
                          {config?.tooltip || ''}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  {/* Actions cell */}
                  <TableCell className="w-20">
                    <div className="flex items-center gap-1">
                      {onMoveCompanies && clusters.length > 1 && selectedClusterId && (
                        <button
                          onClick={() => setMoveTarget(company)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
                          title="Mover para outro cluster"
                        >
                          <ArrowRightLeft className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteTarget(company.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminação</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget === 'bulk'
                ? `Tem a certeza que deseja eliminar ${selectedIds.size} empresas? Esta acção não pode ser revertida.`
                : deleteTarget
                  ? `Tem a certeza que deseja eliminar "${getCompanyNameForDelete(deleteTarget)}"? Esta acção não pode ser revertida.`
                  : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              variant="destructive"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Move companies dialog */}
      <MoveCompaniesDialog
        open={moveTarget !== null}
        onOpenChange={(open) => !open && setMoveTarget(null)}
        companies={getCompaniesForMove()}
        currentClusterId={selectedClusterId ?? null}
        clusters={clusters}
        onMove={handleMove}
      />
    </div>
  );
}
