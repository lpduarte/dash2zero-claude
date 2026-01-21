import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClusterProvider } from "@/types/cluster";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface ProvidersTableProps {
  providers: ClusterProvider[];
}

const statusConfig = {
  "not-registered": {
    label: "Não Registado",
    variant: "destructive" as const,
  },
  "in-progress": {
    label: "Em Progresso",
    variant: "default" as const,
  },
  completed: {
    label: "Concluído",
    variant: "secondary" as const,
  },
};

export function ProvidersTable({ providers }: ProvidersTableProps) {
  if (providers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhuma empresa neste cluster. Importe empresas para começar.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>NIF</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-center">Emails Enviados</TableHead>
          <TableHead>Último Contacto</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {providers.map((provider) => (
          <TableRow key={provider.id}>
            <TableCell className="font-normal">{provider.name}</TableCell>
            <TableCell>{provider.nif}</TableCell>
            <TableCell className="text-muted-foreground">{provider.email}</TableCell>
            <TableCell>
              <Badge variant={statusConfig[provider.status].variant}>
                {statusConfig[provider.status].label}
              </Badge>
            </TableCell>
            <TableCell className="text-center">{provider.emailsSent}</TableCell>
            <TableCell>
              {provider.lastContact
                ? format(provider.lastContact, "dd MMM yyyy", { locale: pt })
                : "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
