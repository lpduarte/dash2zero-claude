import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Supplier } from "@/types/supplier";
import { Leaf, Users, Building } from "lucide-react";

interface ESGScoreCardProps {
  suppliers: Supplier[];
}

export const ESGScoreCard = ({ suppliers }: ESGScoreCardProps) => {
  // Calculate aggregate ESG scores
  const sbtiPercentage = (suppliers.filter(s => s.hasSBTi).length / suppliers.length) * 100;
  const certPercentage = (suppliers.filter(s => s.certifications.length > 0).length / suppliers.length) * 100;
  
  // Environmental score (based on SBTi and certifications)
  const environmentalScore = sbtiPercentage * 0.5 + certPercentage * 0.5;
  
  // Social score (mock - in real scenario, would come from supplier data)
  const socialScore = 72;
  
  // Governance score (based on certifications and SBTi)
  const governanceScore = sbtiPercentage * 0.5 + (suppliers.filter(s => s.certifications.length > 0).length / suppliers.length) * 50;

  const overallScore = (environmentalScore + socialScore + governanceScore) / 3;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-danger";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-success">Excelente</Badge>;
    if (score >= 60) return <Badge className="bg-warning">Bom</Badge>;
    return <Badge className="bg-danger">Precisa Melhorar</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score ESG Agregado</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className={`text-6xl font-bold ${getScoreColor(overallScore)}`}>
            {overallScore.toFixed(0)}
          </div>
          <div className="text-sm text-muted-foreground mt-2">Score ESG Global</div>
          <div className="mt-2">{getScoreBadge(overallScore)}</div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">Ambiental (E)</span>
              </div>
              <span className={`font-bold ${getScoreColor(environmentalScore)}`}>
                {environmentalScore.toFixed(0)}
              </span>
            </div>
            <Progress value={environmentalScore} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium">Social (S)</span>
              </div>
              <span className={`font-bold ${getScoreColor(socialScore)}`}>
                {socialScore}
              </span>
            </div>
            <Progress value={socialScore} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Governança (G)</span>
              </div>
              <span className={`font-bold ${getScoreColor(governanceScore)}`}>
                {governanceScore.toFixed(0)}
              </span>
            </div>
            <Progress value={governanceScore} className="h-2" />
          </div>
        </div>

        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span>Fornecedores com SBTi</span>
            <span className="font-medium">{sbtiPercentage.toFixed(0)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Com Certificações</span>
            <span className="font-medium">
              {((suppliers.filter(s => s.certifications.length > 0).length / suppliers.length) * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
