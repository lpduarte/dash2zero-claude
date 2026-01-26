import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { MunicipioCombobox } from '@/components/ui/municipio-combobox';
import {
  Building2,
  MapPin,
  Mail,
  User,
  Eye,
  SquareDashedKanban,
  ImageIcon,
  PenLine,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Client, ClientPermissions, PermissionProfile } from '@/types/user';
import { PERMISSION_PROFILES, detectPermissionProfile } from '@/types/permissions';

export interface ClientFormData {
  name: string;
  type: 'municipio' | 'empresa' | undefined;
  contactEmail: string;
  contactName: string;
  permissions: ClientPermissions;
  icon?: string;
  /** Signals that infrastructure sync should be triggered (for municipalities) */
  shouldSyncInfrastructure?: boolean;
}

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client; // Se definido, modo edição
  onSave: (data: ClientFormData) => void;
  existingMunicipios?: string[]; // Lista de municípios já existentes (para validação de unicidade)
}

export const ClientFormDialog = ({
  open,
  onOpenChange,
  client,
  onSave,
  existingMunicipios = [],
}: ClientFormDialogProps) => {
  const isEditing = !!client;
  const dialogRef = useRef<HTMLDivElement>(null);

  // Permissões vazias (nenhum checkmark ativo)
  const emptyPermissions: ClientPermissions = {
    dashboard: {
      viewKPIs: false,
      viewCharts: false,
      viewSupplierDetails: false,
      useFilters: false,
    },
    clusters: {
      viewKPIs: false,
      viewList: false,
      createCluster: false,
      editCluster: false,
      deleteCluster: false,
      manageCompanies: false,
    },
    incentives: {
      viewKPIs: false,
      viewFunnel: false,
      viewCompanyList: false,
      sendEmails: false,
      manageTemplates: false,
    },
    pipeline: {
      view: false,
      edit: false,
    },
  };

  // Estado do formulário
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    type: undefined,
    contactEmail: '',
    contactName: '',
    permissions: emptyPermissions,
  });

  const [selectedProfile, setSelectedProfile] = useState<PermissionProfile | 'personalizado' | null>(null);
  const [activeTab, setActiveTab] = useState('dados');
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  // Preencher dados quando em modo edição
  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        type: client.type,
        contactEmail: client.contactEmail,
        contactName: client.contactName || '',
        permissions: client.permissions,
      });
      setSelectedProfile(detectPermissionProfile(client.permissions));
    } else {
      // Reset para valores default ao criar
      setFormData({
        name: '',
        type: undefined,
        contactEmail: '',
        contactName: '',
        permissions: emptyPermissions,
      });
      setSelectedProfile(null);
      setIconPreview(null);
    }
    setActiveTab('dados');
  }, [client, open]);

  // Aplicar perfil de permissões (toggle)
  const handleProfileChange = (profile: PermissionProfile) => {
    if (selectedProfile === profile) {
      // Desselecionar e limpar permissões
      setSelectedProfile(null);
      setFormData(prev => ({
        ...prev,
        permissions: emptyPermissions,
      }));
    } else {
      // Selecionar perfil
      setSelectedProfile(profile);
      setFormData(prev => ({
        ...prev,
        permissions: PERMISSION_PROFILES[profile],
      }));
    }
  };

  // Atualizar permissão individual
  const handlePermissionChange = (
    module: keyof ClientPermissions,
    permission: string,
    value: boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: {
          ...prev.permissions[module],
          [permission]: value,
        },
      },
    }));
    setSelectedProfile('personalizado');
  };

  // Validação de email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validação do step 1
  const isStep1Valid =
    formData.type !== undefined &&
    formData.name.trim() !== '' &&
    formData.contactEmail.trim() !== '' &&
    isValidEmail(formData.contactEmail);

  // Validação completa
  const isValid = isStep1Valid;

  // Handler do ícone
  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setIconPreview(result);
        setFormData(prev => ({ ...prev, icon: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submeter
  const handleSubmit = () => {
    if (!isValid) return;
    // If creating a municipality, signal that infrastructure should be synced
    const dataToSave: ClientFormData = {
      ...formData,
      shouldSyncInfrastructure: !isEditing && formData.type === 'municipio',
    };
    onSave(dataToSave);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent ref={dialogRef} className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar cliente' : 'Novo cliente'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Atualize os dados e permissões do cliente.'
              : 'Preencha os dados do novo cliente e configure as suas permissões.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Step Indicator */}
          <div className="flex items-start justify-center gap-2 py-4">
            <button
              type="button"
              onClick={() => setActiveTab('dados')}
              className="flex flex-col items-center gap-2"
            >
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                activeTab === 'dados'
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground border-2 border-border hover:border-primary/50 hover:bg-primary/10"
              )}>
                <User className="h-5 w-5" />
              </div>
              <span className={cn(
                "text-sm font-bold",
                activeTab === 'dados' ? "text-primary" : "text-muted-foreground"
              )}>Dados</span>
            </button>

            <div className={cn(
              "h-0.5 w-16 mx-2 mt-6 transition-colors",
              activeTab === 'permissoes' ? "bg-primary/40" : "bg-border"
            )} />

            <button
              type="button"
              onClick={() => isStep1Valid && setActiveTab('permissoes')}
              disabled={!isStep1Valid}
              className="flex flex-col items-center gap-2"
            >
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                activeTab === 'permissoes'
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground border-2 border-border hover:border-primary/50 hover:bg-primary/10",
                !isStep1Valid && "opacity-50 cursor-not-allowed hover:border-border hover:bg-background"
              )}>
                <Eye className="h-5 w-5" />
              </div>
              <span className={cn(
                "text-sm font-bold",
                activeTab === 'permissoes' ? "text-primary" : "text-muted-foreground",
                !isStep1Valid && "opacity-50"
              )}>Permissões</span>
            </button>
          </div>

          {/* Step: Dados Básicos */}
          {activeTab === 'dados' && (
          <div className="flex-1 overflow-auto space-y-4">
            {/* Tipo de cliente */}
            <div className="space-y-2">
              <Label>Tipo de cliente *</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    type: 'municipio',
                    name: prev.type !== 'municipio' ? '' : prev.name
                  }))}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border-2 transition-all",
                    formData.type === 'municipio'
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    formData.type === 'municipio' ? "bg-primary/10" : "bg-muted"
                  )}>
                    <MapPin className={cn(
                      "h-5 w-5",
                      formData.type === 'municipio' ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Município</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    type: 'empresa',
                    name: prev.type !== 'empresa' ? '' : prev.name
                  }))}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border-2 transition-all",
                    formData.type === 'empresa'
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    formData.type === 'empresa' ? "bg-primary/10" : "bg-muted"
                  )}>
                    <Building2 className={cn(
                      "h-5 w-5",
                      formData.type === 'empresa' ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Empresa</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Nome - diferente para município vs empresa */}
            {formData.type === 'municipio' ? (
              <div className="space-y-2">
                <Label>Município *</Label>
                <MunicipioCombobox
                  value={formData.name}
                  onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                  placeholder="Selecionar município..."
                  disabledMunicipios={existingMunicipios.filter(m => m !== client?.name)}
                  portalContainer={dialogRef.current}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="name">Nome do cliente *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Ex: Iberotejo"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {/* Email de acesso */}
            <div className="space-y-2">
              <Label htmlFor="email">Email de acesso *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.pt"
                  className="pl-10"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                />
              </div>
            </div>

            {/* Logótipo */}
            <div className="space-y-2">
              <Label>Logótipo (opcional)</Label>
              <div className="flex items-start gap-4">
                {/* Preview */}
                <div className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/50 shrink-0">
                  {iconPreview ? (
                    <img src={iconPreview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    type="file"
                    accept=".png,.svg,.jpg,.jpeg"
                    onChange={handleIconChange}
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    PNG, SVG ou JPG. Recomendado: 200×200px, formato quadrado.
                  </p>
                </div>
              </div>
            </div>

            {/* Nota sobre Get2Zero Pro */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-dashed">
              <SquareDashedKanban className="h-5 w-5 text-muted-foreground shrink-0" />
              <p className="text-sm text-muted-foreground">
                Em breve — ligação com o Get2Zero Pro para sincronização de dados de Âmbito 3
              </p>
            </div>
          </div>
          )}

          {/* Step: Permissões */}
          {activeTab === 'permissoes' && (
          <div className="flex-1 overflow-auto space-y-6">
            {/* Quick select de perfil */}
            <div className="space-y-3">
              <Label>Perfil de acesso</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'visualizacao' as const, label: 'Visualização', desc: 'Apenas ver KPIs', icon: Eye },
                  { id: 'gestao-parcial' as const, label: 'Gestão parcial', desc: 'Ver + algumas ações', icon: PenLine },
                  { id: 'gestao-completa' as const, label: 'Gestão completa', desc: 'Acesso total', icon: ShieldCheck },
                ].map(profile => (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => handleProfileChange(profile.id)}
                    className={cn(
                      "p-4 rounded-lg border-2 text-center transition-all flex flex-col items-center gap-2",
                      selectedProfile === profile.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <profile.icon className={cn(
                      "h-6 w-6",
                      selectedProfile === profile.id ? "text-primary" : "text-muted-foreground"
                    )} />
                    <div>
                      <p className="font-bold text-sm">{profile.label}</p>
                      <p className="text-xs text-muted-foreground">{profile.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              {selectedProfile === 'personalizado' && (
                <Badge variant="outline" className="mt-2">
                  Permissões personalizadas
                </Badge>
              )}
            </div>

            {/* Permissões granulares */}
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Ou personalize as permissões individualmente:
              </p>

              {/* Dashboard */}
              <PermissionGroup
                title="Dashboard"
                permissions={formData.permissions.dashboard}
                labels={{
                  viewKPIs: 'Ver KPIs',
                  viewCharts: 'Ver gráficos',
                  viewSupplierDetails: 'Ver detalhes de fornecedores',
                  useFilters: 'Usar filtros',
                }}
                onChange={(key, value) => handlePermissionChange('dashboard', key, value)}
              />

              {/* Clusters */}
              <PermissionGroup
                title="Clusters"
                permissions={formData.permissions.clusters}
                labels={{
                  viewKPIs: 'Ver KPIs',
                  viewList: 'Ver lista de clusters',
                  createCluster: 'Criar clusters',
                  editCluster: 'Editar clusters',
                  deleteCluster: 'Eliminar clusters',
                  manageCompanies: 'Gerir empresas',
                }}
                onChange={(key, value) => handlePermissionChange('clusters', key, value)}
              />

              {/* Incentivos */}
              <PermissionGroup
                title="Incentivos"
                permissions={formData.permissions.incentives}
                labels={{
                  viewKPIs: 'Ver KPIs',
                  viewFunnel: 'Ver funil de onboarding',
                  viewCompanyList: 'Ver lista de empresas',
                  sendEmails: 'Enviar emails',
                  manageTemplates: 'Gerir templates',
                }}
                onChange={(key, value) => handlePermissionChange('incentives', key, value)}
              />
            </div>
          </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          {activeTab === 'dados' ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setActiveTab('permissoes')} disabled={!isStep1Valid}>
                Seguinte
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setActiveTab('dados')}>
                Anterior
              </Button>
              <Button onClick={handleSubmit} disabled={!isValid}>
                {isEditing ? 'Guardar alterações' : 'Criar cliente'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Componente auxiliar: Grupo de permissões
interface PermissionGroupProps {
  title: string;
  permissions: Record<string, boolean>;
  labels: Record<string, string>;
  onChange: (key: string, value: boolean) => void;
}

const PermissionGroup = ({ title, permissions, labels, onChange }: PermissionGroupProps) => {
  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-bold text-sm mb-3">{title}</h4>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(labels).map(([key, label]) => (
          <div key={key} className="flex items-center space-x-2">
            <Checkbox
              id={`${title}-${key}`}
              checked={permissions[key] ?? false}
              onCheckedChange={(checked) => onChange(key, checked === true)}
            />
            <Label
              htmlFor={`${title}-${key}`}
              className="text-sm font-normal cursor-pointer"
            >
              {label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientFormDialog;
