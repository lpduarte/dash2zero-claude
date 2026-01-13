import { Supplier } from "@/types/supplier";
import type { Measure, FundingSource } from "@/types/actionPlan";

export type SelectionMode = 'sem_plano' | 'acima_media' | 'risco_alto' | 'personalizado' | 'manual';
export type TargetHandling = 'all' | 'only_target' | 'review';

export interface BulkPlanResult {
  empresa: Supplier;
  measures: Measure[];
  funding: FundingSource[];
  totalReduction: number;
  totalInvestment: number;
  reachedTarget: boolean;
}

export interface CustomFilters {
  risco: string;
  estado: string;
  cluster: string;
  setor: string;
  ambitoDominante: string;
}
