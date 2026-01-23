import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Building2,
  Users,
  Handshake,
  ShieldCheck,
  Eye,
  Factory,
  Truck,
  ShoppingCart,
  Briefcase,
  Heart,
  Leaf,
  Zap,
  Home,
  Coffee,
  Bed,
  Store,
  Globe,
  MapPin,
  Package,
  Plane,
  Car,
  Ship,
  Train,
  Warehouse,
  Wrench,
  HardHat,
  Stethoscope,
  GraduationCap,
  Landmark,
  TreePine,
  Wheat,
  Fish,
  LucideIcon,
} from "lucide-react";
import { ClusterDefinition, CreateClusterInput } from "@/types/clusterNew";
import { isClusterNameUnique } from "@/data/clusters";
import { useUser } from "@/contexts/UserContext";

interface CreateClusterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (input: CreateClusterInput) => void;
  existingCluster?: ClusterDefinition;
}

interface IconOption {
  id: string;
  icon: LucideIcon;
  label: string;
}

const iconOptions: IconOption[] = [
  // Linha 1
  { id: "Building2", icon: Building2, label: "Edifício" },
  { id: "Users", icon: Users, label: "Utilizadores" },
  { id: "Handshake", icon: Handshake, label: "Parceria" },
  { id: "ShieldCheck", icon: ShieldCheck, label: "Protegido" },
  { id: "Eye", icon: Eye, label: "Monitorizado" },
  { id: "Factory", icon: Factory, label: "Fábrica" },
  { id: "Truck", icon: Truck, label: "Transporte" },
  { id: "ShoppingCart", icon: ShoppingCart, label: "Compras" },
  // Linha 2
  { id: "Briefcase", icon: Briefcase, label: "Negócios" },
  { id: "Heart", icon: Heart, label: "Favoritos" },
  { id: "Leaf", icon: Leaf, label: "Sustentável" },
  { id: "Zap", icon: Zap, label: "Energia" },
  { id: "Home", icon: Home, label: "Sede" },
  { id: "Coffee", icon: Coffee, label: "Restauração" },
  { id: "Bed", icon: Bed, label: "Alojamento" },
  { id: "Store", icon: Store, label: "Loja" },
  // Linha 3
  { id: "Globe", icon: Globe, label: "Global" },
  { id: "MapPin", icon: MapPin, label: "Localização" },
  { id: "Package", icon: Package, label: "Logística" },
  { id: "Plane", icon: Plane, label: "Aviação" },
  { id: "Car", icon: Car, label: "Automóvel" },
  { id: "Ship", icon: Ship, label: "Marítimo" },
  { id: "Train", icon: Train, label: "Ferroviário" },
  { id: "Warehouse", icon: Warehouse, label: "Armazém" },
  // Linha 4
  { id: "Wrench", icon: Wrench, label: "Manutenção" },
  { id: "HardHat", icon: HardHat, label: "Construção" },
  { id: "Stethoscope", icon: Stethoscope, label: "Saúde" },
  { id: "GraduationCap", icon: GraduationCap, label: "Educação" },
  { id: "Landmark", icon: Landmark, label: "Instituição" },
  { id: "TreePine", icon: TreePine, label: "Florestal" },
  { id: "Wheat", icon: Wheat, label: "Agricultura" },
  { id: "Fish", icon: Fish, label: "Pesca" },
];

export function CreateClusterDialog({
  open,
  onOpenChange,
  onSave,
  existingCluster,
}: CreateClusterDialogProps) {
  const { isMunicipio } = useUser();
  const ownerType = isMunicipio ? 'municipio' : 'empresa';
  const isEditMode = !!existingCluster;

  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>("Building2");
  const [nameError, setNameError] = useState<string>();

  // Reset form when dialog opens/closes or existingCluster changes
  useEffect(() => {
    if (open) {
      if (existingCluster) {
        setName(existingCluster.name);
        setSelectedIcon(existingCluster.icon);
      } else {
        setName("");
        setSelectedIcon("Building2");
      }
      setNameError(undefined);
    }
  }, [open, existingCluster]);

  const validate = (): boolean => {
    if (!name.trim()) {
      setNameError("O nome é obrigatório");
      return false;
    } else if (name.length > 50) {
      setNameError("O nome não pode ter mais de 50 caracteres");
      return false;
    } else if (!isClusterNameUnique(name, ownerType, existingCluster?.id)) {
      setNameError("Já existe um cluster com este nome");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;

    onSave({
      name: name.trim(),
      icon: selectedIcon,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Cluster" : "Criar Novo Cluster"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Altere as propriedades do cluster"
              : "Crie um novo cluster para organizar as suas empresas"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nome do Cluster <span className="text-danger">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(undefined);
              }}
              placeholder="Ex: Distribuidores, Investidores..."
              maxLength={50}
              className={cn(nameError && "border-danger focus-visible:ring-danger")}
            />
            <div className="flex justify-between text-xs">
              {nameError ? (
                <span className="text-danger">{nameError}</span>
              ) : (
                <span className="text-muted-foreground">&nbsp;</span>
              )}
              <span className="text-muted-foreground">{name.length}/50</span>
            </div>
          </div>

          {/* Ícone */}
          <div className="space-y-2">
            <Label>Ícone</Label>
            <div className="grid grid-cols-8 gap-2">
              {iconOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedIcon(option.id)}
                    className={cn(
                      "flex items-center justify-center p-2.5 rounded-lg border transition-all",
                      selectedIcon === option.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:bg-primary/10 hover:border-primary/50 hover:text-primary"
                    )}
                    title={option.label}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {isEditMode ? "Guardar Alterações" : "Criar Cluster"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { iconOptions };
