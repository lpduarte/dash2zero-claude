import { useState } from "react";
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Building2,
  Users,
  Handshake,
  Factory,
  Truck,
  ShoppingCart,
  Landmark,
  Globe,
  Leaf,
  Box,
  MapPin,
  Compass,
  Map,
  Navigation,
  Mountain,
  Waves,
  Sun,
  Snowflake,
  Palmtree,
  Anchor,
  LucideIcon,
} from "lucide-react";

interface CreateClusterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string, icon: string) => void;
}

interface IconOption {
  id: string;
  icon: LucideIcon;
  label: string;
}

const iconOptions: IconOption[] = [
  // Business icons
  { id: "building", icon: Building2, label: "Edifício" },
  { id: "users", icon: Users, label: "Utilizadores" },
  { id: "handshake", icon: Handshake, label: "Parceria" },
  { id: "factory", icon: Factory, label: "Fábrica" },
  { id: "truck", icon: Truck, label: "Transporte" },
  { id: "cart", icon: ShoppingCart, label: "Compras" },
  { id: "landmark", icon: Landmark, label: "Instituição" },
  { id: "globe", icon: Globe, label: "Global" },
  { id: "leaf", icon: Leaf, label: "Sustentável" },
  { id: "box", icon: Box, label: "Logística" },
  // Geographic icons
  { id: "mappin", icon: MapPin, label: "Localização" },
  { id: "compass", icon: Compass, label: "Norte/Sul" },
  { id: "map", icon: Map, label: "Região" },
  { id: "navigation", icon: Navigation, label: "Direção" },
  { id: "mountain", icon: Mountain, label: "Interior" },
  { id: "waves", icon: Waves, label: "Litoral" },
  { id: "sun", icon: Sun, label: "Sul" },
  { id: "snowflake", icon: Snowflake, label: "Norte" },
  { id: "palmtree", icon: Palmtree, label: "Ilhas" },
  { id: "anchor", icon: Anchor, label: "Porto" },
];

export function CreateClusterDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateClusterDialogProps) {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>("building");

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("Por favor, insira um nome para o cluster");
      return;
    }

    onCreate(name, selectedIcon);
    toast.success("Cluster criado com sucesso!");
    onOpenChange(false);
    setName("");
    setSelectedIcon("building");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Cluster</DialogTitle>
          <DialogDescription>
            Crie um novo cluster para organizar as suas empresas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Cluster</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Distribuidores, Investidores..."
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleCreate();
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Ícone</Label>
            <div className="grid grid-cols-5 gap-2">
              {iconOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedIcon(option.id)}
                    className={cn(
                      "flex items-center justify-center p-3 rounded-lg border transition-all",
                      "hover:bg-primary/10 hover:border-primary/50",
                      selectedIcon === option.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border"
                    )}
                    title={option.label}
                  >
                    <Icon className="h-5 w-5" />
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
          <Button onClick={handleCreate}>Criar Cluster</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { iconOptions };
