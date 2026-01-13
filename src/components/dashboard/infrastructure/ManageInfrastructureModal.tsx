import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Zap, 
  Recycle, 
  Bike, 
  Leaf, 
  Route, 
  Bus, 
  Wind,
  Settings,
  Link,
  PenLine,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { elements } from '@/lib/styles';

interface ManageInfrastructureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManageInfrastructureModal = ({
  open,
  onOpenChange,
}: ManageInfrastructureModalProps) => {
  // Estados dos inputs manuais
  const [ecopontosCount, setEcopontosCount] = useState('245');
  const [organicosCount, setOrganicosCount] = useState('178');
  const [cicloviasKm, setCicloviasKm] = useState('47.3');
  const [transportesCount, setTransportesCount] = useState('312');
  
  // Fonte seleccionada para bicicletas
  const [bicicletasSource, setBicicletasSource] = useState('gira');

  const handleRefreshData = (type: string) => {
    toast.success(`Dados de ${type} actualizados com sucesso`);
  };

  const handleSaveData = (type: string) => {
    toast.success(`${type} guardado com sucesso`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Settings className="h-5 w-5" />
            Gerir Infraestruturas
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          
          {/* Texto introdutório */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950/30 dark:border-blue-900">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Estes dados influenciam as medidas de descarbonização disponíveis para as empresas do concelho. 
              Infraestruturas existentes permitem recomendar medidas mais eficazes e de menor investimento.
            </p>
          </div>
          
          {/* Lista de infraestruturas */}
          <div className="space-y-4">
            
            {/* POSTOS DE CARREGAMENTO - API */}
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-teal-500" />
                  <span className="font-medium">Postos de Carregamento</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">89</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Fonte: API MOBI.E</span>
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full dark:bg-green-900/30 dark:text-green-400">Recomendada</span>
                  </div>
                  <button
                    onClick={() => handleRefreshData('postos')}
                    className={elements.outlineButtonSm}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Actualizar
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Última actualização: 06/01/2026 · Actualização automática semanal
                </p>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <Info className="h-4 w-4 inline mr-1" />
                    A existência de postos de carregamento permite recomendar a transição para frotas eléctricas 
                    com menor investimento em infraestrutura própria.
                  </p>
                </div>
              </div>
            </div>
            
            {/* ECOPONTOS - Manual */}
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  <Recycle className="h-5 w-5 text-teal-500" />
                  <span className="font-medium">Ecopontos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">245</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PenLine className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">Fonte: Inserção manual</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={ecopontosCount}
                      onChange={(e) => setEcopontosCount(e.target.value)}
                      className={elements.inputSmall}
                    />
                    <button
                      onClick={() => handleSaveData('Ecopontos')}
                      className={elements.primaryButtonSm}
                    >
                      Guardar
                    </button>
                  </div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <Info className="h-4 w-4 inline mr-1" />
                    Ecopontos próximos facilitam a implementação de programas de separação de resíduos 
                    nas empresas, reduzindo emissões do Âmbito 3.
                  </p>
                </div>
              </div>
            </div>
            
            {/* ESTAÇÕES DE BICICLETAS - API com escolha */}
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  <Bike className="h-5 w-5 text-teal-500" />
                  <span className="font-medium">Estações de Bicicletas</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">52</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Fonte:</span>
                    <Select value={bicicletasSource} onValueChange={setBicicletasSource}>
                      <SelectTrigger className="w-40 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gira">API GIRA (Lisboa)</SelectItem>
                        <SelectItem value="manual">Inserção manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <button
                    onClick={() => handleRefreshData('bicicletas')}
                    className={elements.outlineButtonSm}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Actualizar
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Última actualização: 06/01/2026 · Actualização automática semanal
                </p>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <Info className="h-4 w-4 inline mr-1" />
                    Bicicletas partilhadas são alternativa para deslocações de curta distância, 
                    reduzindo emissões de mobilidade (Âmbito 1 e 3).
                  </p>
                </div>
              </div>
            </div>
            
            {/* CONTENTORES ORGÂNICOS - Manual */}
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  <Leaf className="h-5 w-5 text-teal-500" />
                  <span className="font-medium">Contentores Orgânicos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">178</span>
                  {organicosCount ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  )}
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PenLine className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">Fonte: Inserção manual</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={organicosCount}
                      onChange={(e) => setOrganicosCount(e.target.value)}
                      className={elements.inputSmall}
                    />
                    <button
                      onClick={() => handleSaveData('Contentores orgânicos')}
                      className={elements.primaryButtonSm}
                    >
                      Guardar
                    </button>
                  </div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <Info className="h-4 w-4 inline mr-1" />
                    Recolha selectiva de orgânicos permite compostagem e reduz emissões de metano em aterro. 
                    Essencial para empresas de restauração e retalho.
                  </p>
                </div>
              </div>
            </div>
            
            {/* CICLOVIAS - Manual */}
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  <Route className="h-5 w-5 text-teal-500" />
                  <span className="font-medium">Ciclovias</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">47.3</span>
                  <span className="text-sm text-muted-foreground">km</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PenLine className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">Fonte: Inserção manual</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={cicloviasKm}
                      onChange={(e) => setCicloviasKm(e.target.value)}
                      className={elements.inputSmall}
                    />
                    <span className="text-sm text-muted-foreground">km</span>
                    <button
                      onClick={() => handleSaveData('Ciclovias')}
                      className={elements.primaryButtonSm}
                    >
                      Guardar
                    </button>
                  </div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <Info className="h-4 w-4 inline mr-1" />
                    Rede ciclável extensa incentiva deslocações em bicicleta para colaboradores, 
                    reduzindo emissões de mobilidade casa-trabalho.
                  </p>
                </div>
              </div>
            </div>
            
            {/* TRANSPORTES PÚBLICOS - Manual */}
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  <Bus className="h-5 w-5 text-teal-500" />
                  <span className="font-medium">Paragens Transportes Públicos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">312</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PenLine className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">Fonte: Inserção manual</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={transportesCount}
                      onChange={(e) => setTransportesCount(e.target.value)}
                      className={elements.inputSmall}
                    />
                    <button
                      onClick={() => handleSaveData('Paragens de transportes')}
                      className={elements.primaryButtonSm}
                    >
                      Guardar
                    </button>
                  </div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <Info className="h-4 w-4 inline mr-1" />
                    Boa cobertura de transportes públicos facilita programas de mobilidade sustentável 
                    e reduz necessidade de estacionamento nas empresas.
                  </p>
                </div>
              </div>
            </div>
            
            {/* QUALIDADE DO AR - API */}
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  <Wind className="h-5 w-5 text-teal-500" />
                  <span className="font-medium">Qualidade do Ar</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-600">Bom</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Fonte: API QualAr (APA)</span>
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full dark:bg-green-900/30 dark:text-green-400">Recomendada</span>
                  </div>
                  <button
                    onClick={() => handleRefreshData('qualidade do ar')}
                    className={elements.outlineButtonSm}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Actualizar
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Última actualização: 09/01/2026 · Actualização automática semanal · 3 estações de monitorização
                </p>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <Info className="h-4 w-4 inline mr-1" />
                    A qualidade do ar é um indicador do impacto das emissões locais. Concelhos com pior 
                    qualidade devem priorizar mobilidade sustentável e redução de emissões directas.
                  </p>
                </div>
              </div>
            </div>
            
          </div>
          
        </div>
        
        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
          >
            Fechar
          </button>
        </DialogFooter>
        
      </DialogContent>
    </Dialog>
  );
};
