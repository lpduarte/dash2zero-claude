import { useState, useMemo, useEffect } from "react";
import { Building2, MapPin, Landmark, ChevronDown, Filter, Briefcase } from "lucide-react";
import { getSectorsWithCounts } from "@/data/sectors";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Supplier, UniversalFilterState } from "@/types/supplier";
import { useUser } from "@/contexts/UserContext";

interface FilterModalProps {
  suppliers: Supplier[];
  currentFilters: UniversalFilterState;
  onFilterChange: (filters: UniversalFilterState) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const companySizeLabels: Record<string, string> = {
  micro: "Micro empresas",
  pequena: "Pequenas empresas",
  media: "Médias empresas",
  grande: "Grandes empresas",
};

export function FilterModal({
  suppliers,
  currentFilters,
  onFilterChange,
  open,
  onOpenChange,
}: FilterModalProps) {
  const { user, isMunicipio } = useUser();
  const [localFilters, setLocalFilters] = useState<UniversalFilterState>(currentFilters);

  // Município fixo quando userType === 'municipio'
  const fixedMunicipality = isMunicipio ? user.municipality : undefined;

  // Filtrar suppliers por município fixo para utilizadores município
  const effectiveSuppliers = useMemo(() => {
    if (fixedMunicipality) {
      return suppliers.filter(s => s.municipality === fixedMunicipality);
    }
    return suppliers;
  }, [suppliers, fixedMunicipality]);

  // Reset local state when modal opens
  useEffect(() => {
    if (open) {
      setLocalFilters(currentFilters);
    }
  }, [open, currentFilters]);

  // Calculate counts with applied other filters
  const countBySize = (size: string) => {
    return effectiveSuppliers.filter(s => {
      let matches = true;
      if (!isMunicipio && localFilters.district.length > 0) {
        matches = matches && localFilters.district.includes(s.district);
      }
      if (!isMunicipio && localFilters.municipality.length > 0) {
        matches = matches && localFilters.municipality.includes(s.municipality);
      }
      if (localFilters.parish.length > 0) {
        matches = matches && localFilters.parish.includes(s.parish);
      }
      return matches && s.companySize === size;
    }).length;
  };

  const countByDistrict = (district: string) => {
    return effectiveSuppliers.filter(s => {
      let matches = true;
      if (localFilters.companySize.length > 0) {
        matches = matches && localFilters.companySize.includes(s.companySize);
      }
      return matches && s.district === district;
    }).length;
  };

  const countByMunicipality = (municipality: string) => {
    return effectiveSuppliers.filter(s => {
      let matches = true;
      if (localFilters.companySize.length > 0) {
        matches = matches && localFilters.companySize.includes(s.companySize);
      }
      if (localFilters.district.length > 0) {
        matches = matches && localFilters.district.includes(s.district);
      }
      return matches && s.municipality === municipality;
    }).length;
  };

  const countByParish = (parish: string) => {
    return effectiveSuppliers.filter(s => {
      let matches = true;
      if (localFilters.companySize.length > 0) {
        matches = matches && localFilters.companySize.includes(s.companySize);
      }
      if (!isMunicipio && localFilters.district.length > 0) {
        matches = matches && localFilters.district.includes(s.district);
      }
      if (!isMunicipio && localFilters.municipality.length > 0) {
        matches = matches && localFilters.municipality.includes(s.municipality);
      }
      return matches && s.parish === parish;
    }).length;
  };

  const countBySector = (sector: string) => {
    return effectiveSuppliers.filter(s => {
      let matches = true;
      if (localFilters.companySize.length > 0) {
        matches = matches && localFilters.companySize.includes(s.companySize);
      }
      if (!isMunicipio && localFilters.district.length > 0) {
        matches = matches && localFilters.district.includes(s.district);
      }
      if (!isMunicipio && localFilters.municipality.length > 0) {
        matches = matches && localFilters.municipality.includes(s.municipality);
      }
      if (localFilters.parish.length > 0) {
        matches = matches && localFilters.parish.includes(s.parish);
      }
      return matches && s.sector === sector;
    }).length;
  };

  // Size options
  const sizeOptions = useMemo(() => [
    { value: 'micro', label: 'Micro empresas', count: countBySize('micro') },
    { value: 'pequena', label: 'Pequenas empresas', count: countBySize('pequena') },
    { value: 'media', label: 'Médias empresas', count: countBySize('media') },
    { value: 'grande', label: 'Grandes empresas', count: countBySize('grande') },
  ], [effectiveSuppliers, localFilters.district, localFilters.municipality, localFilters.parish, isMunicipio]);

  // Get unique districts (apenas para empresa)
  const districtOptions = useMemo(() => {
    if (isMunicipio) return [];
    const unique = [...new Set(effectiveSuppliers.map((s) => s.district))].sort();
    return unique.map(d => ({ value: d, label: d, count: countByDistrict(d) }));
  }, [effectiveSuppliers, localFilters.companySize, isMunicipio]);

  // Get municipalities filtered by selected districts (apenas para empresa)
  const municipalityOptions = useMemo(() => {
    if (isMunicipio) return [];
    if (localFilters.district.length === 0) return [];
    const filtered = effectiveSuppliers.filter((s) => localFilters.district.includes(s.district));
    const unique = [...new Set(filtered.map((s) => s.municipality))].sort();
    return unique.map(m => ({ value: m, label: m, count: countByMunicipality(m) }));
  }, [effectiveSuppliers, localFilters.district, localFilters.companySize, isMunicipio]);

  // Get parishes - para município: todas as do município fixo, para empresa: filtrado
  const parishOptions = useMemo(() => {
    if (isMunicipio) {
      // Para município: mostrar todas as freguesias do município fixo
      const unique = [...new Set(effectiveSuppliers.map((s) => s.parish))].sort();
      return unique.map(p => ({ value: p, label: p, count: countByParish(p) }));
    }
    // Para empresa: comportamento normal
    if (localFilters.municipality.length === 0) return [];
    const filtered = effectiveSuppliers.filter((s) => localFilters.municipality.includes(s.municipality));
    const unique = [...new Set(filtered.map((s) => s.parish))].sort();
    return unique.map(p => ({ value: p, label: p, count: countByParish(p) }));
  }, [effectiveSuppliers, localFilters.municipality, localFilters.companySize, localFilters.district, isMunicipio]);

  // Sector options - usar os setores da config centralizada
  const sectorOptions = useMemo(() => {
    const sectors = getSectorsWithCounts(effectiveSuppliers);
    return sectors.map(s => ({
      value: s.sector,
      label: s.name,
      count: countBySector(s.sector)
    }));
  }, [effectiveSuppliers, localFilters.companySize, localFilters.district, localFilters.municipality, localFilters.parish, isMunicipio]);

  // Count matching suppliers
  const matchingCount = useMemo(() => {
    let filtered = effectiveSuppliers;

    if (localFilters.companySize.length > 0) {
      filtered = filtered.filter((s) => localFilters.companySize.includes(s.companySize));
    }
    if (localFilters.sector.length > 0) {
      filtered = filtered.filter((s) => localFilters.sector.includes(s.sector));
    }
    if (!isMunicipio && localFilters.district.length > 0) {
      filtered = filtered.filter((s) => localFilters.district.includes(s.district));
    }
    if (!isMunicipio && localFilters.municipality.length > 0) {
      filtered = filtered.filter((s) => localFilters.municipality.includes(s.municipality));
    }
    if (localFilters.parish.length > 0) {
      filtered = filtered.filter((s) => localFilters.parish.includes(s.parish));
    }

    return filtered.length;
  }, [effectiveSuppliers, localFilters, isMunicipio]);

  const toggleSize = (value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      companySize: prev.companySize.includes(value)
        ? prev.companySize.filter(v => v !== value)
        : [...prev.companySize, value]
    }));
  };

  const toggleDistrict = (value: string) => {
    const newDistricts = localFilters.district.includes(value)
      ? localFilters.district.filter(v => v !== value)
      : [...localFilters.district, value];
    
    // Reset municipality and parish when district changes
    setLocalFilters(prev => ({
      ...prev,
      district: newDistricts,
      municipality: [],
      parish: [],
    }));
  };

  const toggleMunicipality = (value: string) => {
    const newMunicipalities = localFilters.municipality.includes(value)
      ? localFilters.municipality.filter(v => v !== value)
      : [...localFilters.municipality, value];
    
    // Reset parish when municipality changes
    setLocalFilters(prev => ({
      ...prev,
      municipality: newMunicipalities,
      parish: [],
    }));
  };

  const toggleParish = (value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      parish: prev.parish.includes(value)
        ? prev.parish.filter(v => v !== value)
        : [...prev.parish, value]
    }));
  };

  const toggleSector = (value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      sector: prev.sector.includes(value)
        ? prev.sector.filter(v => v !== value)
        : [...prev.sector, value]
    }));
  };

  const handleClearFilters = () => {
    setLocalFilters({
      companySize: [],
      district: [],
      municipality: [],
      parish: [],
      sector: [],
    });
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onOpenChange(false);
  };

  const getSizeLabel = () => {
    if (localFilters.companySize.length === 0) return "Todas as dimensões";
    if (localFilters.companySize.length === 1) return companySizeLabels[localFilters.companySize[0]];
    return `${localFilters.companySize.length} selecionadas`;
  };

  const getDistrictLabel = () => {
    if (localFilters.district.length === 0) return "Todos os distritos";
    if (localFilters.district.length === 1) return localFilters.district[0];
    return `${localFilters.district.length} selecionados`;
  };

  const getMunicipalityLabel = () => {
    if (localFilters.municipality.length === 0) return "Todos os municípios";
    if (localFilters.municipality.length === 1) return localFilters.municipality[0];
    return `${localFilters.municipality.length} selecionados`;
  };

  const getParishLabel = () => {
    if (localFilters.parish.length === 0) {
      return isMunicipio ? `Todas em ${fixedMunicipality}` : "Todas as freguesias";
    }
    if (localFilters.parish.length === 1) return localFilters.parish[0];
    return `${localFilters.parish.length} selecionadas`;
  };

  const getSectorLabel = () => {
    if (localFilters.sector.length === 0) return "Todas as atividades";
    if (localFilters.sector.length === 1) {
      const sector = sectorOptions.find(s => s.value === localFilters.sector[0]);
      return sector?.label || localFilters.sector[0];
    }
    return `${localFilters.sector.length} selecionadas`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[90vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Filter className="h-5 w-5 text-muted-foreground" />
            </div>
            Outros filtros
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Dimensão da Empresa */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Building2 className="h-4 w-4 text-primary" />
              Dimensão da empresa
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="text-sm">{getSizeLabel()}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-4rem)] sm:w-[380px] p-2" align="start">
                <div className="space-y-1">
                  {sizeOptions.map(option => (
                    <div
                      key={option.value}
                      className="flex items-center gap-3 px-2 py-2 hover:bg-muted rounded-md cursor-pointer"
                      onClick={() => toggleSize(option.value)}
                    >
                      <Checkbox
                        checked={localFilters.companySize.includes(option.value)}
                        onCheckedChange={() => toggleSize(option.value)}
                      />
                      <span className="text-sm flex-1">{option.label}</span>
                      <span className="bg-muted text-muted-foreground text-xs font-bold px-2 py-0.5 rounded-full min-w-[28px] text-center">
                        {option.count}
                      </span>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Atividade da Empresa */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Briefcase className="h-4 w-4 text-primary" />
              Atividade da empresa
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="text-sm">{getSectorLabel()}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-4rem)] sm:w-[380px] p-2 max-h-[300px] overflow-y-auto" align="start">
                <div className="space-y-1">
                  {sectorOptions.map(option => (
                    <div
                      key={option.value}
                      className="flex items-center gap-3 px-2 py-2 hover:bg-muted rounded-md cursor-pointer"
                      onClick={() => toggleSector(option.value)}
                    >
                      <Checkbox
                        checked={localFilters.sector.includes(option.value)}
                        onCheckedChange={() => toggleSector(option.value)}
                      />
                      <span className="text-sm flex-1">{option.label}</span>
                      <span className="bg-muted text-muted-foreground text-xs font-bold px-2 py-0.5 rounded-full min-w-[28px] text-center">
                        {option.count}
                      </span>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Localização */}
          <div className="rounded-lg border p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-primary" />
              {isMunicipio ? `Localização em ${fixedMunicipality}` : "Localização"}
            </div>

            {/* Para Empresa: Distrito > Município > Freguesia */}
            {!isMunicipio && (
              <div className="space-y-3">
                {/* Distrito */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Distrito</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        <span className="text-sm">{getDistrictLabel()}</span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[calc(100vw-4rem)] sm:w-[380px] p-2 max-h-[250px] overflow-y-auto" align="start">
                      <div className="space-y-1">
                        {districtOptions.map(option => (
                          <div
                            key={option.value}
                            className="flex items-center gap-3 px-2 py-2 hover:bg-muted rounded-md cursor-pointer"
                            onClick={() => toggleDistrict(option.value)}
                          >
                            <Checkbox
                              checked={localFilters.district.includes(option.value)}
                              onCheckedChange={() => toggleDistrict(option.value)}
                            />
                            <span className="text-sm flex-1">{option.label}</span>
                            <span className="bg-muted text-muted-foreground text-xs font-bold px-2 py-0.5 rounded-full min-w-[28px] text-center">
                              {option.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Município */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Município</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                        disabled={localFilters.district.length === 0}
                      >
                        <span className="text-sm">{getMunicipalityLabel()}</span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[calc(100vw-4rem)] sm:w-[380px] p-2 max-h-[250px] overflow-y-auto" align="start">
                      <div className="space-y-1">
                        {municipalityOptions.map(option => (
                          <div
                            key={option.value}
                            className="flex items-center gap-3 px-2 py-2 hover:bg-muted rounded-md cursor-pointer"
                            onClick={() => toggleMunicipality(option.value)}
                          >
                            <Checkbox
                              checked={localFilters.municipality.includes(option.value)}
                              onCheckedChange={() => toggleMunicipality(option.value)}
                            />
                            <span className="text-sm flex-1">{option.label}</span>
                            <span className="bg-muted text-muted-foreground text-xs font-bold px-2 py-0.5 rounded-full min-w-[28px] text-center">
                              {option.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Freguesia */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Freguesia</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                        disabled={localFilters.municipality.length === 0}
                      >
                        <span className="text-sm">{getParishLabel()}</span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[calc(100vw-4rem)] sm:w-[380px] p-2 max-h-[250px] overflow-y-auto" align="start">
                      <div className="space-y-1">
                        {parishOptions.map(option => (
                          <div
                            key={option.value}
                            className="flex items-center gap-3 px-2 py-2 hover:bg-muted rounded-md cursor-pointer"
                            onClick={() => toggleParish(option.value)}
                          >
                            <Checkbox
                              checked={localFilters.parish.includes(option.value)}
                              onCheckedChange={() => toggleParish(option.value)}
                            />
                            <span className="text-sm flex-1">{option.label}</span>
                            <span className="bg-muted text-muted-foreground text-xs font-bold px-2 py-0.5 rounded-full min-w-[28px] text-center">
                              {option.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}

            {/* Para Município: só Freguesia */}
            {isMunicipio && (
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Freguesia</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span className="text-sm">{getParishLabel()}</span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[calc(100vw-4rem)] sm:w-[380px] p-2 max-h-[250px] overflow-y-auto" align="start">
                    <div className="space-y-1">
                      {parishOptions.map(option => (
                        <div
                          key={option.value}
                          className="flex items-center gap-3 px-2 py-2 hover:bg-muted rounded-md cursor-pointer"
                          onClick={() => toggleParish(option.value)}
                        >
                          <Checkbox
                            checked={localFilters.parish.includes(option.value)}
                            onCheckedChange={() => toggleParish(option.value)}
                          />
                          <span className="text-sm flex-1">{option.label}</span>
                          <span className="bg-muted text-muted-foreground text-xs font-bold px-2 py-0.5 rounded-full min-w-[28px] text-center">
                            {option.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          {/* Results counter */}
          <div className="text-center pt-2">
            <span className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">{matchingCount.toLocaleString("pt-PT")}</span> empresas encontradas
            </span>
          </div>
        </div>

        <DialogFooter className="flex-row gap-2">
          <Button variant="outline" onClick={handleClearFilters} className="flex-1">
            Limpar
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Aplicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
