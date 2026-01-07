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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmailTemplate, ClusterProvider } from "@/types/cluster";
import { toast } from "sonner";

interface EmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: EmailTemplate[];
  provider?: ClusterProvider;
  providers?: ClusterProvider[];
}

export function EmailDialog({
  open,
  onOpenChange,
  templates,
  provider,
  providers,
}: EmailDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const isMultiple = !provider && providers && providers.length > 0;
  const recipientCount = isMultiple ? providers.length : 1;

  const availableTemplates = provider
    ? templates.filter((t) => t.applicableStatus.includes(provider.status))
    : templates;

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setSubject(template.subject);
      setBody(template.body);
    }
  };

  const handleSend = () => {
    if (!subject || !body) {
      toast.error("Preencha o assunto e corpo do email");
      return;
    }

    // Simulate sending email
    toast.success(
      `Email enviado com sucesso para ${recipientCount} ${
        recipientCount === 1 ? "fornecedor" : "fornecedores"
      }!`
    );
    onOpenChange(false);
    setSelectedTemplate("");
    setSubject("");
    setBody("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enviar Email</DialogTitle>
          <DialogDescription>
            {isMultiple
              ? `Enviar email para ${recipientCount} fornecedores`
              : `Enviar email para ${provider?.name}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="template">Template</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
              <SelectTrigger id="template">
                <SelectValue placeholder="Selecione um template" />
              </SelectTrigger>
              <SelectContent>
                {availableTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Assunto</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Assunto do email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Mensagem</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Corpo do email"
              className="min-h-[300px] font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Use {`{{nome}}`} para personalizar com o nome do fornecedor
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSend}>
            Enviar para {recipientCount} {recipientCount === 1 ? "fornecedor" : "fornecedores"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
