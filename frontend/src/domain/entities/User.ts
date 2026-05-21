export type UserRole = "candidate" | "recruiter";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  cpf?: string;
  birthDate?: string;
  picture?: string;
}
