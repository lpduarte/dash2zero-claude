import { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  MapPin,
  Mail,
  User,
  Shield,
  Settings,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Client, ClientPermissions, PermissionProfile } from '@/types/user';
import { PERMISSION_PROFILES, detectPermissionProfile } from '@/types/permissions';

export interface ClientFormData {
  name: string;
  type: 'municipio' | 'empresa';
  contactEmail: string;
  contactName: string;
  permissions: ClientPermissions;
}

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client; // Se definido, modo edição
  onSave: (data: ClientFormData) => void;
}

export const ClientFormDialog = ({
  open,
  onOpenChange,
  client,
  onSave,
}: ClientFormDialogProps) => {
  const isEditing = !!client;

  // Estado do formulário
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    type: 'municipio',
    contactEmail: '',
    contactName: '',
    permissions: PERMISSION_PROFILES['gestao-completa'],
  });

  const [selectedProfile, setSelectedProfile] = useState<PermissionProfile | 'personalizado'>('gestao-completa');
  const [activeTab, setActiveTab] = useState('dados');

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
        type: 'municipio',
        contactEmail: '',
        contactName: '',
        permissions: PERMISSION_PROFILES['gestao-completa'],
      });
      setSelectedProfile('gestao-completa');
    }
    setActiveTab('dados');
  }, [client, open]);

  // Aplicar perfil de permissões
  const handleProfileChange = (profile: PermissionProfile) => {
    setSelectedProfile(profile);
    setFormData(prev => ({
      ...prev,
      permissions: PERMISSION_PROFILES[profile],
    }));
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

  // Validação básica
  const isValid = formData.name.trim() !== '' && formData.contactEmail.trim() !== '';

  // Submeter
  const handleSubmit = () => {
    if (!isValid) return;
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dados" className="gap-2">
              <Settings className="h-4 w-4" />
              Dados
            </TabsTrigger>
            <TabsTrigger value="permissoes" className="gap-2">
              <Shield className="h-4 w-4" />
              Permissões
            </TabsTrigger>
          </TabsList>

          {/* Tab: Dados Básicos */}
          <TabsContent value="dados" className="flex-1 overflow-auto mt-4 space-y-4">
            {/* Tipo de cliente */}
            <div className="space-y-2">
              <Label>Tipo de cliente</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'municipio' }))}
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
                    <p className="text-sm text-muted-foreground">Câmara Municipal</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'empresa' }))}
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
                    <p className="text-sm text-muted-foreground">Organização parceira</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome do cliente *</Label>
              <Input
                id="name"
                placeholder={formData.type === 'municipio' ? 'Ex: Câmara Municipal de Lisboa' : 'Ex: Montepio'}
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            {/* Email de contacto */}
            <div className="space-y-2">
              <Label htmlFor="email">Email de contacto *</Label>
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

            {/* Nome do contacto */}
            <div className="space-y-2">
              <Label htmlFor="contactName">Nome do contacto</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactName"
                  placeholder="Nome da pessoa responsável"
                  className="pl-10"
                  value={formData.contactName}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                />
              </div>
            </div>

            {/* Nota sobre ZeroPro */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-dashed">
              <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-foreground">Integração ZeroPro</p>
                <p className="text-sm text-muted-foreground">
                  Em breve: sincronização de dados de âmbito 3 com o ZeroPro.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Tab: Permissões */}
          <TabsContent value="permissoes" className="flex-1 overflow-auto mt-4 space-y-6">
            {/* Quick select de perfil */}
            <div className="space-y-3">
              <Label>Perfil de acesso</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'visualizacao' as const, label: 'Visualização', desc: 'Apenas ver KPIs' },
                  { id: 'gestao-parcial' as const, label: 'Gestão parcial', desc: 'Ver + algumas ações' },
                  { id: 'gestao-completa' as const, label: 'Gestão completa', desc: 'Acesso total' },
                ].map(profile => (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => handleProfileChange(profile.id)}
                    className={cn(
                      "p-3 rounded-lg border-2 text-left transition-all",
                      selectedProfile === profile.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <p className="font-bold text-sm">{profile.label}</p>
                    <p className="text-xs text-muted-foreground">{profile.desc}</p>
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

              {/* Pipeline */}
              <PermissionGroup
                title="Pipeline"
                permissions={formData.permissions.pipeline}
                labels={{
                  view: 'Ver pipeline',
                  edit: 'Editar pipeline',
                }}
                onChange={(key, value) => handlePermissionChange('pipeline', key, value)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            {isEditing ? 'Guardar alterações' : 'Criar cliente'}
          </Button>
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
