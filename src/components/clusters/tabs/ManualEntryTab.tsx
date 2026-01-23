import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export interface NewCompanyData {
  name: string;
  nif: string;
  email: string;
}

interface ManualEntryTabProps {
  onAddCompanies: (companies: NewCompanyData[]) => void;
  onClose: () => void;
}

// Validate Portuguese NIF (9 digits)
function isValidNif(nif: string): boolean {
  return /^\d{9}$/.test(nif);
}

// Validate email format
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function ManualEntryTab({ onAddCompanies, onClose }: ManualEntryTabProps) {
  const [name, setName] = useState("");
  const [nif, setNif] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; nif?: string; email?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { name?: string; nif?: string; email?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!nif.trim()) {
      newErrors.nif = "NIF é obrigatório";
    } else if (!isValidNif(nif.trim())) {
      newErrors.nif = "NIF deve ter 9 dígitos";
    }

    if (!email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!isValidEmail(email.trim())) {
      newErrors.email = "Email inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearForm = () => {
    setName("");
    setNif("");
    setEmail("");
    setErrors({});
  };

  const handleAddAnother = () => {
    if (!validateForm()) return;

    const company: NewCompanyData = {
      name: name.trim(),
      nif: nif.trim(),
      email: email.trim(),
    };

    onAddCompanies([company]);
    toast.success(`${company.name} adicionada com sucesso`);
    clearForm();
  };

  const handleAddAndClose = () => {
    if (!validateForm()) return;

    const company: NewCompanyData = {
      name: name.trim(),
      nif: nif.trim(),
      email: email.trim(),
    };

    onAddCompanies([company]);
    toast.success(`${company.name} adicionada com sucesso`);
    onClose();
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da empresa *</Label>
        <Input
          id="name"
          placeholder="Ex: Empresa ABC, Lda"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="nif">NIF/NIPC *</Label>
        <Input
          id="nif"
          placeholder="123456789"
          maxLength={9}
          value={nif}
          onChange={(e) => setNif(e.target.value.replace(/\D/g, ""))}
          className={errors.nif ? "border-destructive" : ""}
        />
        {errors.nif && (
          <p className="text-sm text-destructive">{errors.nif}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="contacto@empresa.pt"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={handleAddAnother}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar outra
        </Button>
        <Button onClick={handleAddAndClose}>
          Adicionar e fechar
        </Button>
      </div>
    </div>
  );
}
