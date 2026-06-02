export type UserRole = "candidate" | "recruiter";

export class User {
  public readonly id: string;
  public readonly email: string;
  public readonly name: string;
  public readonly role: UserRole;
  public readonly cpf?: string;
  public readonly birthDate?: string;
  public readonly picture?: string;

  constructor(data: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    cpf?: string;
    birthDate?: string;
    picture?: string;
  }) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.role = data.role;
    this.cpf = data.cpf;
    this.birthDate = data.birthDate;
    this.picture = data.picture;

    this.validate();
  }

  private validate() {
    if (!this.id) throw new Error("User ID is required.");
    if (!this.email) throw new Error("User email is required.");
    if (!this.name) throw new Error("User name is required.");
  }

  isRecruiter(): boolean {
    return this.role === "recruiter";
  }

  isCandidate(): boolean {
    return this.role === "candidate";
  }
}
