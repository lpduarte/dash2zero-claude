import { Library } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionHeader from "../SectionHeader";
import { bibliography } from "@/data/emissionIntensity";

export const Bibliografia = () => (
  <>
    <SectionHeader
      id="bibliografia"
      title="Bibliografia e Fontes"
      icon={Library}
      description="Referências e fontes de dados utilizadas"
    />

    <div className="space-y-6">
      <div className="border rounded-lg p-6 space-y-6 bg-card">
        {Object.entries(bibliography).map(([key, source], index) => (
          <div key={key} className={cn("space-y-2", index > 0 && "pt-4 border-t")}>
            <p className="font-bold">[{index + 1}] {source.title}</p>
            <p className="text-muted-foreground text-sm">
              {source.author}.{source.date ? ` Publicado em ${source.date}.` : ''}
            </p>
            {source.description && (
              <p className="text-muted-foreground text-sm">{source.description}</p>
            )}
            <div className="flex flex-wrap gap-3 mt-2">
              {source.url && (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  Ver fonte →
                </a>
              )}
              {source.pdfUrl && (
                <a
                  href={source.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  PDF →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
);
