import { Fragment } from "react";
import { Shield, ShieldCheck, Building2, Landmark, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "../SectionHeader";
import { PERMISSION_PROFILES } from '@/types/permissions';

const permissionLabels: Record<string, string> = {
  viewKPIs: 'Ver KPIs e gráficos',
  viewCharts: 'Ver gráficos',
  viewSupplierDetails: 'Ver detalhes de empresas',
  useFilters: 'Usar filtros avançados',
  viewList: 'Ver lista',
  createCluster: 'Criar clusters',
  editCluster: 'Editar clusters',
  deleteCluster: 'Eliminar clusters',
  manageCompanies: 'Gerir empresas em clusters',
  viewFunnel: 'Ver funil e KPIs',
  viewCompanyList: 'Ver lista de empresas',
  sendEmails: 'Enviar emails',
  manageTemplates: 'Gerir templates',
  view: 'Ver pipeline',
  edit: 'Editar pipeline',
};

const moduleLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  clusters: 'Clusters',
  incentives: 'Incentivos',
  pipeline: 'Pipeline',
};

const profiles = ['visualizacao', 'gestao-parcial', 'gestao-completa'] as const;
const profileLabels: Record<string, string> = {
  'visualizacao': 'Visualização',
  'gestao-parcial': 'Gestão Parcial',
  'gestao-completa': 'Gestão Completa',
};

export const Permissoes = () => (
  <>
    <SectionHeader
      id="permissoes"
      title="Permissões"
      icon={Shield}
      description="Sistema de controlo de acesso e permissões"
    />

    <div className="space-y-6">
      <p className="text-muted-foreground">
        O sistema de permissões controla o acesso às diferentes funcionalidades
        da plataforma com base no tipo de utilizador e no papel atribuído.
      </p>

      {/* Níveis de Acesso */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Níveis de Acesso</h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-danger/5 border border-danger/20">
            <ShieldCheck className="h-5 w-5 text-danger shrink-0" />
            <div>
              <p className="font-bold text-sm">Administrador (Get2C)</p>
              <p className="text-xs text-muted-foreground">
                Acesso total à plataforma. Pode gerir clientes, configurar permissões,
                aceder ao painel de controlo e a todas as funcionalidades.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <Building2 className="h-5 w-5 text-blue-500 shrink-0" />
            <div>
              <p className="font-bold text-sm">Cliente Empresa</p>
              <p className="text-xs text-muted-foreground">
                Acesso ao dashboard, clusters e dados dos seus fornecedores.
                Pode criar clusters, importar empresas e enviar campanhas.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
            <Landmark className="h-5 w-5 text-purple-500 shrink-0" />
            <div>
              <p className="font-bold text-sm">Cliente Município</p>
              <p className="text-xs text-muted-foreground">
                Acesso ao dashboard territorial, gestão de programas de incentivo,
                infraestruturas municipais e dados das empresas do concelho.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Matriz de Permissões - Dynamic */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Matriz de Permissões por Módulo</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Matriz de permissões por perfil</caption>
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-bold">Funcionalidade</th>
                {profiles.map(p => (
                  <th key={p} className="text-center py-2 pr-4 font-bold">{profileLabels[p]}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {Object.entries(PERMISSION_PROFILES['visualizacao']).map(([mod, perms]) => (
                <Fragment key={`mod-${mod}`}>
                  <tr className="bg-muted/20">
                    <td colSpan={4} className="py-2 pr-4 font-bold text-xs uppercase text-muted-foreground">
                      {moduleLabels[mod] || mod}
                    </td>
                  </tr>
                  {Object.keys(perms).map(key => (
                    <tr key={`${mod}-${key}`}>
                      <td className="py-2 pr-4">{permissionLabels[key] || key}</td>
                      {profiles.map(profile => {
                        const modulePerms = PERMISSION_PROFILES[profile][mod as keyof typeof PERMISSION_PROFILES[typeof profile]] as Record<string, boolean>;
                        return (
                          <td key={profile} className="py-2 pr-4 text-center">
                            {modulePerms[key]
                              ? <CheckCircle2 className="h-4 w-4 text-status-complete inline" />
                              : <span className="text-muted-foreground">—</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          Permissões podem ser personalizadas individualmente por cliente.
        </p>
      </div>
    </div>
  </>
);
