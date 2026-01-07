export type UserType = 'empresa' | 'municipio';

export interface User {
  id: string;
  name: string;
  email: string;
  userType: UserType;
  municipality?: string; // Apenas para userType='municipio'
  createdAt: Date;
}
