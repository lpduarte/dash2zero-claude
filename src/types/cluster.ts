export type ProviderStatus = 'not-registered' | 'in-progress' | 'completed';

export interface ClusterProvider {
  id: string;
  name: string;
  nif: string;
  email: string;
  status: ProviderStatus;
  emailsSent: number;
  lastContact?: Date;
}

export interface Cluster {
  id: string;
  name: string;
  providers: ClusterProvider[];
  createdAt: Date;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  applicableStatus: ProviderStatus[];
}
