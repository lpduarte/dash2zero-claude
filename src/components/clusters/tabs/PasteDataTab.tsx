import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";
import { NewCompanyData } from "./ManualEntryTab";

interface PasteDataTabProps {
  onAddCompanies: (companies: NewCompanyData[]) => void;
  onClose: () => void;
}

interface ParsedRow {
  name: string;
  nif: string;
  email: string;
  valid: boolean;
  errors: string[];
}

// Validate Portuguese NIF (9 digits)
function isValidNif(nif: string): boolean {
  return /^\d{9}$/.test(nif);
}

// Validate email format
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Detect separator used in pasted data
function detectSeparator(text: string): string {
  const firstLine = text.split("\n")[0];

  // Tab is most common from Excel
  if (firstLine.includes("\t")) return "\t";

  // Semicolon is common in European CSVs
  if (firstLine.includes(";")) return ";";

  // Comma is the fallback
  return ",";
}

// Parse pasted text into structured data
function parseData(text: string): ParsedRow[] {
  const lines = text.trim().split("\n");
  if (lines.length === 0) return [];

  const separator = detectSeparator(text);
  const rows: ParsedRow[] = [];

  // Check if first line is a header
  const firstLineLower = lines[0].toLowerCase();
  const hasHeader = firstLineLower.includes("nome") ||
                   firstLineLower.includes("nif") ||
                   firstLineLower.includes("email");

  const startIndex = hasHeader ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split(separator).map(c => c.trim());

    // Skip if not enough columns
    if (cols.length < 3) continue;

    const errors: string[] = [];
    const name = cols[0];
    const nif = cols[1].replace(/\D/g, ""); // Remove non-digits
    const email = cols[2];

    if (!name) errors.push("Nome em falta");
    if (!nif) errors.push("NIF em falta");
    else if (!isValidNif(nif)) errors.push("NIF inválido");
    if (!email) errors.push("Email em falta");
    else if (!isValidEmail(email)) errors.push("Email inválido");

    rows.push({
      name,
      nif,
      email,
      valid: errors.length === 0,
      errors,
    });
  }

  return rows;
}

export function PasteDataTab({ onAddCompanies, onClose }: PasteDataTabProps) {
  const [rawText, setRawText] = useState("");
  const [parsedData, setParsedData] = useState<ParsedRow[] | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setRawText(text);

    // Auto-parse when enough content is pasted
    if (text.trim().length > 10) {
      const parsed = parseData(text);
      if (parsed.length > 0) {
        setParsedData(parsed);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData("text");
    if (text.trim()) {
      setRawText(text);
      const parsed = parseData(text);
      if (parsed.length > 0) {
        setParsedData(parsed);
      }
    }
  };

  const handleClear = () => {
    setRawText("");
    setParsedData(null);
  };

  const handleImport = () => {
    if (!parsedData) return;

    const validCompanies = parsedData
      .filter(r => r.valid)
      .map(r => ({
        name: r.name,
        nif: r.nif,
        email: r.email,
      }));

    if (validCompanies.length === 0) {
      toast.error("Nenhuma empresa válida para importar");
      return;
    }

    onAddCompanies(validCompanies);
    toast.success(`${validCompanies.length} empresa${validCompanies.length > 1 ? "s" : ""} importada${validCompanies.length > 1 ? "s" : ""} com sucesso`);
    onClose();
  };

  const validCount = parsedData?.filter(r => r.valid).length ?? 0;
  const invalidCount = parsedData ? parsedData.length - validCount : 0;

  if (!parsedData) {
    return (
      <div className="space-y-4 pt-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Copie as linhas do Excel ou Google Sheets e cole abaixo.
            Deve incluir colunas: <strong>Nome</strong>, <strong>NIF/NIPC</strong>, <strong>Email</strong>
          </AlertDescription>
        </Alert>

        <Textarea
          placeholder="Cole aqui os dados copiados do Excel..."
          className="min-h-[200px] font-mono text-sm"
          value={rawText}
          onChange={handleChange}
          onPaste={handlePaste}
        />

        <p className="text-sm text-muted-foreground">
          Separadores suportados: tab, vírgula, ponto e vírgula
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm">
            <span className="text-foreground font-bold">{parsedData.length}</span>
            <span className="text-muted-foreground"> empresa{parsedData.length !== 1 ? "s" : ""} detectada{parsedData.length !== 1 ? "s" : ""}</span>
          </span>
          {invalidCount > 0 && (
            <span className="text-sm text-destructive">
              {invalidCount} com erros
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={handleClear}>
          Limpar e começar de novo
        </Button>
      </div>

      <div className="border rounded-lg max-h-[300px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="w-32">NIF/NIPC</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-16 text-center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parsedData.map((row, i) => (
              <TableRow key={i} className={row.valid ? "" : "bg-destructive/5"}>
                <TableCell className="font-normal">{row.name || <span className="text-muted-foreground italic">—</span>}</TableCell>
                <TableCell>{row.nif || <span className="text-muted-foreground italic">—</span>}</TableCell>
                <TableCell className="text-muted-foreground">{row.email || <span className="italic">—</span>}</TableCell>
                <TableCell className="text-center">
                  {row.valid ? (
                    <CheckCircle className="h-4 w-4 text-green-500 inline-block" />
                  ) : (
                    <span title={row.errors.join(", ")}>
                      <AlertCircle className="h-4 w-4 text-destructive inline-block" />
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleImport} disabled={validCount === 0}>
          Importar {validCount} empresa{validCount !== 1 ? "s" : ""}
        </Button>
      </div>
    </div>
  );
}
