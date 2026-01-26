import * as React from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { municipiosPorDistrito } from '@/data/municipios';

interface MunicipioComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  disabledMunicipios?: string[];
  portalContainer?: Element | null;
}

export const MunicipioCombobox = ({
  value,
  onChange,
  placeholder = 'Selecionar município...',
  disabled = false,
  disabledMunicipios = [],
  portalContainer,
}: MunicipioComboboxProps) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  // Filter municipalities based on search
  const filteredDistritos = React.useMemo(() => {
    if (!search) return municipiosPorDistrito;

    const searchLower = search.toLowerCase();
    return municipiosPorDistrito
      .map(distrito => ({
        ...distrito,
        municipios: distrito.municipios.filter(m =>
          m.toLowerCase().includes(searchLower)
        )
      }))
      .filter(distrito => distrito.municipios.length > 0);
  }, [search]);

  const handleSelect = (municipio: string) => {
    onChange(municipio);
    setOpen(false);
    setSearch('');
  };

  const isDisabled = (municipio: string) => {
    return disabledMunicipios.some(m => m.toLowerCase() === municipio.toLowerCase());
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between font-normal"
        >
          {value || <span className="text-muted-foreground">{placeholder}</span>}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
        portalContainer={portalContainer}
      >
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar município..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <ScrollArea className="h-[300px]">
          {filteredDistritos.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Nenhum município encontrado.
            </div>
          ) : (
            <div className="p-1">
              {filteredDistritos.map((distrito) => (
                <div key={distrito.distrito}>
                  <div className="px-2 py-1.5 text-xs font-bold text-muted-foreground sticky top-0 bg-popover">
                    {distrito.distrito}
                  </div>
                  {distrito.municipios.map((municipio) => {
                    const municipioDisabled = isDisabled(municipio);
                    return (
                      <button
                        key={municipio}
                        onClick={() => !municipioDisabled && handleSelect(municipio)}
                        disabled={municipioDisabled}
                        className={cn(
                          'relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none',
                          'hover:bg-accent hover:text-accent-foreground',
                          'focus:bg-accent focus:text-accent-foreground',
                          value === municipio && 'bg-accent text-accent-foreground',
                          municipioDisabled && 'opacity-50 cursor-not-allowed hover:bg-transparent'
                        )}
                      >
                        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                          {value === municipio && <Check className="h-4 w-4" />}
                        </span>
                        {municipio}
                        {municipioDisabled && (
                          <span className="ml-auto text-xs text-muted-foreground">(já existe)</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
