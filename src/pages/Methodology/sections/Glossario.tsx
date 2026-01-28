import { useState, useMemo } from "react";
import { Search, X, Info, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SectionHeader from "../SectionHeader";
import { glossary } from "@/config/methodology";

export const Glossario = () => {
  const [search, setSearch] = useState("");

  const filteredGlossary = useMemo(() => {
    const sorted = [...glossary].sort((a, b) => a.term.localeCompare(b.term));
    if (!search.trim()) return sorted;

    const query = search.trim().toLowerCase();
    // Prioritize term matches over definition matches
    const termMatches = sorted.filter((item) =>
      item.term.toLowerCase().includes(query)
    );
    const definitionOnly = sorted.filter(
      (item) =>
        !item.term.toLowerCase().includes(query) &&
        item.definition.toLowerCase().includes(query)
    );
    return [...termMatches, ...definitionOnly];
  }, [search]);

  return (
    <>
      <SectionHeader
        id="glossario"
        title="Glossário"
        icon={FileText}
        description="Termos técnicos utilizados na plataforma"
      />

      <div className="space-y-6">
        <p className="text-muted-foreground">
          Definições dos principais termos técnicos utilizados ao longo
          desta documentação e na plataforma Dash2Zero.
        </p>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Pesquisar termos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-9"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Result count */}
        {search.trim() && (
          <p className="text-sm text-muted-foreground">
            {filteredGlossary.length}{" "}
            {filteredGlossary.length === 1 ? "resultado" : "resultados"} para
            &ldquo;{search.trim()}&rdquo;
          </p>
        )}

        {/* Glossary list */}
        {filteredGlossary.length > 0 ? (
          <div className="border rounded-lg bg-card overflow-hidden">
            <div className="grid gap-0 divide-y">
              {filteredGlossary.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[140px_1fr] gap-4 p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="font-mono text-sm font-bold text-primary">
                    <HighlightMatch text={item.term} search={search} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <HighlightMatch text={item.definition} search={search} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="border rounded-lg bg-card p-8 text-center space-y-3">
            <p className="text-muted-foreground">
              Nenhum termo encontrado para &ldquo;{search.trim()}&rdquo;
            </p>
            <Button variant="outline" size="sm" onClick={() => setSearch("")}>
              Limpar pesquisa
            </Button>
          </div>
        )}

        {/* Nota sobre terminologia */}
        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            Esta documentação utiliza terminologia técnica do GHG Protocol e
            classificações do INE. Termos em inglês são mantidos quando são
            padrão internacional (ex: Scope 1, 2, 3).
          </p>
        </div>
      </div>
    </>
  );
};

const HighlightMatch = ({ text, search }: { text: string; search: string }) => {
  if (!search.trim()) return <>{text}</>;
  const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-warning/30 text-foreground rounded px-0.5">{part}</mark>
        ) : (part)
      )}
    </>
  );
};
