import {
  Users, TowerControl, Landmark, Building2, Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "../SectionHeader";
import { userTypes } from "@/config/methodology";

export const TiposUtilizador = () => (
  <>
    <SectionHeader
      id="utilizadores"
      title="Tipos de Utilizador"
      icon={Users}
      description="Perfis de acesso e funcionalidades disponíveis"
    />

    <div className="space-y-6">
      <p className="text-muted-foreground">
        O Dash2Zero suporta três tipos de utilizador, cada um com
        funcionalidades adaptadas às suas necessidades.
      </p>

      <div className="grid gap-4">
        {/* Card Get2C */}
        <div className="border rounded-lg p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <TowerControl className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">{userTypes.get2c.name}</h3>
              <p className="text-sm text-muted-foreground">Administrador</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {userTypes.get2c.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {userTypes.get2c.capabilities.map((cap, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {cap}
              </Badge>
            ))}
          </div>
        </div>

        {/* Card Município */}
        <div className="border rounded-lg p-4 bg-purple-500/5 border-purple-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Landmark className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h3 className="font-bold">{userTypes.municipio.name}</h3>
              <p className="text-sm text-muted-foreground">Autarquia</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {userTypes.municipio.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {userTypes.municipio.capabilities.map((cap, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {cap}
              </Badge>
            ))}
          </div>
        </div>

        {/* Card Empresa */}
        <div className="border rounded-lg p-4 bg-blue-500/5 border-blue-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Building2 className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-bold">{userTypes.empresa.name}</h3>
              <p className="text-sm text-muted-foreground">Organização</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {userTypes.empresa.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {userTypes.empresa.capabilities.map((cap, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {cap}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Nota sobre hierarquia */}
      <div className="flex items-start gap-2 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
        <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground">
          <strong>Hierarquia:</strong> Get2C gere múltiplos Municípios e Empresas.
          Cada Município/Empresa vê apenas os seus próprios dados e funcionalidades
          autorizadas pelo seu perfil de permissões.
        </p>
      </div>
    </div>
  </>
);
