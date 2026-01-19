import { useState, useMemo, useEffect } from "react";
import { Supplier } from "@/types/supplier";
import { SupplierCard } from "./SupplierCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, MapPin, ArrowUpDown, LayoutGrid, List, Info } from "lucide-react";
import { formatPercentage } from "@/lib/formatters";
import { getSectorName } from "@/data/sectors";

type SortOption = 'name-asc' | 'name-desc' | 'emissions-asc' | 'emissions-desc' | 'region-asc' | 'region-desc' | 'sector-asc' | 'sector-desc' | 'sector-diff-asc' | 'sector-diff-desc';
type ViewMode = 'cards' | 'table';

interface CompaniesTabProps {
  suppliers: Supplier[];
}

const getRegionLabel = (region: string) => {
  const labels: Record<string, string> = {
    north: 'Norte',
    center: 'Centro',
    south: 'Sul',
    islands: 'Ilhas',
  };
  return labels[region] || region;
};

export const CompaniesTab = ({ suppliers }: CompaniesTabProps) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(12);
  }, [selectedRegion, searchTerm, sortBy, suppliers]);

  // Get unique regions and sectors with counts
  const regions = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    suppliers.forEach(s => {
      regionCounts[s.region] = (regionCounts[s.region] || 0) + 1;
    });
    return Object.entries(regionCounts).map(([region, count]) => ({
      value: region,
      label: getRegionLabel(region),
      count
    }));
  }, [suppliers]);

  // Calculate sector averages for sorting
  const sectorAverages = useMemo(() => {
    const sectorTotals: Record<string, { total: number; count: number }> = {};
    suppliers.forEach(s => {
      if (!sectorTotals[s.sector]) {
        sectorTotals[s.sector] = { total: 0, count: 0 };
      }
      sectorTotals[s.sector].total += s.totalEmissions;
      sectorTotals[s.sector].count += 1;
    });
    const averages: Record<string, number> = {};
    Object.entries(sectorTotals).forEach(([sector, data]) => {
      averages[sector] = data.total / data.count;
    });
    return averages;
  }, [suppliers]);

  // Filter and sort suppliers
  const filteredSuppliers = useMemo(() => {
    let filtered = suppliers;
    
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(s => s.region === selectedRegion);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(search) ||
        s.contact.nif.toLowerCase().includes(search) ||
        s.contact.email.toLowerCase().includes(search)
      );
    }
    
    // Apply sorting
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'emissions-asc':
          return a.totalEmissions - b.totalEmissions;
        case 'emissions-desc':
          return b.totalEmissions - a.totalEmissions;
        case 'region-asc':
          return getRegionLabel(a.region).localeCompare(getRegionLabel(b.region));
        case 'region-desc':
          return getRegionLabel(b.region).localeCompare(getRegionLabel(a.region));
        case 'sector-asc':
          return getSectorName(a.sector).localeCompare(getSectorName(b.sector));
        case 'sector-desc':
          return getSectorName(b.sector).localeCompare(getSectorName(a.sector));
        case 'sector-diff-asc': {
          const diffA = ((a.totalEmissions - sectorAverages[a.sector]) / sectorAverages[a.sector]) * 100;
          const diffB = ((b.totalEmissions - sectorAverages[b.sector]) / sectorAverages[b.sector]) * 100;
          return diffA - diffB;
        }
        case 'sector-diff-desc': {
          const diffA = ((a.totalEmissions - sectorAverages[a.sector]) / sectorAverages[a.sector]) * 100;
          const diffB = ((b.totalEmissions - sectorAverages[b.sector]) / sectorAverages[b.sector]) * 100;
          return diffB - diffA;
        }
        default:
          return 0;
      }
    });
  }, [suppliers, selectedRegion, searchTerm, sortBy, sectorAverages]);

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-fit">
        <Button
          variant={viewMode === 'cards' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('cards')}
          className="gap-1.5"
        >
          <LayoutGrid className="h-4 w-4" />
          Cartões
        </Button>
        <Button
          variant={viewMode === 'table' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('table')}
          className="gap-1.5"
        >
          <List className="h-4 w-4" />
          Lista
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome, NIF ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-[220px]">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Região" />
              </div>
            </SelectTrigger>
            <SelectContent className="w-[220px]">
              <SelectItem value="all">
                <div className="flex items-center justify-between w-[150px]">
                  <span>Todas as regiões</span>
                  <span className="bg-muted text-muted-foreground text-xs font-bold px-2 py-0.5 rounded-full min-w-[28px] text-center">{suppliers.length}</span>
                </div>
              </SelectItem>
              {regions.map(r => (
                <SelectItem key={r.value} value={r.value}>
                  <div className="flex items-center justify-between w-[150px]">
                    <span>{r.label}</span>
                    <span className="bg-muted text-muted-foreground text-xs font-bold px-2 py-0.5 rounded-full min-w-[28px] text-center">{r.count}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-[230px]">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Ordenar por" />
              </div>
            </SelectTrigger>
            <SelectContent className="w-[230px]">
              <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
              <SelectItem value="name-desc">Nome (Z-A)</SelectItem>
              <SelectItem value="emissions-asc">Emissões (menor)</SelectItem>
              <SelectItem value="emissions-desc">Emissões (maior)</SelectItem>
              <SelectItem value="sector-asc">Atividade (A-Z)</SelectItem>
              <SelectItem value="sector-desc">Atividade (Z-A)</SelectItem>
              <SelectItem value="sector-diff-asc">vs Média setor (melhor)</SelectItem>
              <SelectItem value="sector-diff-desc">vs Média setor (pior)</SelectItem>
              <SelectItem value="region-asc">Região (A-Z)</SelectItem>
              <SelectItem value="region-desc">Região (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-muted-foreground ml-auto">
          {filteredSuppliers.length} empresa{filteredSuppliers.length !== 1 ? 's' : ''} encontrada{filteredSuppliers.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Card View */}
      {viewMode === 'cards' && (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {filteredSuppliers.slice(0, visibleCount).map((supplier) => (
              <SupplierCard
                key={supplier.id}
                supplier={supplier}
                sectorAverage={sectorAverages[supplier.sector]}
              />
            ))}
          </div>
          {visibleCount < filteredSuppliers.length && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => setVisibleCount(prev => prev + 12)}
                className="px-8"
              >
                Mostrar mais ({filteredSuppliers.length - visibleCount} restantes)
              </Button>
            </div>
          )}
        </>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="rounded-md border overflow-x-auto shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>NIF</TableHead>
                <TableHead>Atividade</TableHead>
                <TableHead>Região</TableHead>
                <TableHead className="text-right">Emissões totais</TableHead>
                <TableHead className="text-right">vs Média setor</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => {
                const sectorAvg = sectorAverages[supplier.sector];
                const diff = ((supplier.totalEmissions - sectorAvg) / sectorAvg) * 100;
                return (
                  <TableRow 
                    key={supplier.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedSupplier(supplier)}
                  >
                    <TableCell className="font-normal">{supplier.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{supplier.contact.nif}</TableCell>
                    <TableCell>{getSectorName(supplier.sector)}</TableCell>
                    <TableCell>{getRegionLabel(supplier.region)}</TableCell>
                    <TableCell className="text-right">
                      {supplier.totalEmissions.toLocaleString('pt-PT')} t CO₂e
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant="outline" 
                        className={diff < 0 ? 'text-success border-success/50' : diff > 20 ? 'text-danger border-danger/50' : 'text-warning border-warning/50'}
                      >
                        {diff > 0 ? '+' : ''}{formatPercentage(diff, 0)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSupplier(supplier);
                        }}
                        className="h-7 w-7 rounded-full"
                      >
                        <Info className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Nenhuma empresa encontrada com os filtros selecionados.</p>
        </div>
      )}

      {/* Supplier Details Modal */}
      <Dialog open={!!selectedSupplier} onOpenChange={(open) => !open && setSelectedSupplier(null)}>
        <DialogContent className="max-w-2xl p-0 border-0 bg-transparent shadow-none [&>button]:top-4 [&>button]:right-4 [&>button]:z-10">
          {selectedSupplier && (
            <SupplierCard
              supplier={selectedSupplier}
              sectorAverage={sectorAverages[selectedSupplier.sector]}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
