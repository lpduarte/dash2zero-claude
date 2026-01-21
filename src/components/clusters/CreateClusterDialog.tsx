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
import { Textarea } from "@/components/ui/textarea";
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
  LucideIcon,
} from "lucide-react";
import { ClusterDefinition, CreateClusterInput, availableClusterColors } from "@/types/clusterNew";
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
  { id: "Building2", icon: Building2, label: "Edifício" },
  { id: "Users", icon: Users, label: "Utilizadores" },
  { id: "Handshake", icon: Handshake, label: "Parceria" },
  { id: "ShieldCheck", icon: ShieldCheck, label: "Protegido" },
  { id: "Eye", icon: Eye, label: "Monitorizado" },
  { id: "Factory", icon: Factory, label: "Fábrica" },
  { id: "Truck", icon: Truck, label: "Transporte" },
  { id: "ShoppingCart", icon: ShoppingCart, label: "Compras" },
  { id: "Briefcase", icon: Briefcase, label: "Negócios" },
  { id: "Heart", icon: Heart, label: "Favoritos" },
  { id: "Leaf", icon: Leaf, label: "Sustentável" },
  { id: "Zap", icon: Zap, label: "Energia" },
  { id: "Home", icon: Home, label: "Sede" },
  { id: "Coffee", icon: Coffee, label: "Restauração" },
  { id: "Bed", icon: Bed, label: "Alojamento" },
  { id: "Store", icon: Store, label: "Loja" },
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
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>("Building2");
  const [selectedColor, setSelectedColor] = useState<string>(availableClusterColors[0].value);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  // Reset form when dialog opens/closes or existingCluster changes
  useEffect(() => {
    if (open) {
      if (existingCluster) {
        setName(existingCluster.name);
        setDescription(existingCluster.description || "");
        setSelectedIcon(existingCluster.icon);
        setSelectedColor(existingCluster.color || availableClusterColors[0].value);
      } else {
        setName("");
        setDescription("");
        setSelectedIcon("Building2");
        setSelectedColor(availableClusterColors[0].value);
      }
      setErrors({});
    }
  }, [open, existingCluster]);

  const validate = (): boolean => {
    const newErrors: { name?: string; description?: string } = {};

    if (!name.trim()) {
      newErrors.name = "O nome é obrigatório";
    } else if (name.length > 50) {
      newErrors.name = "O nome não pode ter mais de 50 caracteres";
    } else if (!isClusterNameUnique(name, ownerType, existingCluster?.id)) {
      newErrors.name = "Já existe um cluster com este nome";
    }

    if (description.length > 200) {
      newErrors.description = "A descrição não pode ter mais de 200 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      icon: selectedIcon,
      color: selectedColor,
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
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder="Ex: Distribuidores, Investidores..."
              maxLength={50}
              className={cn(errors.name && "border-danger focus-visible:ring-danger")}
            />
            <div className="flex justify-between text-xs">
              {errors.name ? (
                <span className="text-danger">{errors.name}</span>
              ) : (
                <span className="text-muted-foreground">&nbsp;</span>
              )}
              <span className="text-muted-foreground">{name.length}/50</span>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors({ ...errors, description: undefined });
              }}
              placeholder="Breve descrição do cluster..."
              maxLength={200}
              rows={3}
              className={cn(errors.description && "border-danger focus-visible:ring-danger")}
            />
            <div className="flex justify-between text-xs">
              {errors.description ? (
                <span className="text-danger">{errors.description}</span>
              ) : (
                <span className="text-muted-foreground">&nbsp;</span>
              )}
              <span className="text-muted-foreground">{description.length}/200</span>
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
                      "hover:bg-primary/10 hover:border-primary/50",
                      selectedIcon === option.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border"
                    )}
                    title={option.label}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cor */}
          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="flex gap-2">
              {availableClusterColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all",
                    selectedColor === color.value
                      ? "border-foreground scale-110"
                      : "border-transparent hover:scale-105"
                  )}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
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
