export class ApplicationProfile {
  public readonly fullName: string;
  public readonly email: string;
  public readonly phone: string;
  public readonly linkedinUrl?: string;
  public readonly portfolioUrl?: string;
  public readonly summary?: string;

  constructor(data: {
    fullName: string;
    email: string;
    phone: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    summary?: string;
  }) {
    this.fullName = data.fullName;
    this.email = data.email;
    this.phone = data.phone;
    this.linkedinUrl = data.linkedinUrl;
    this.portfolioUrl = data.portfolioUrl;
    this.summary = data.summary;

    this.validate();
  }

  private validate() {
    if (!this.fullName || this.fullName.trim().length < 3) {
      throw new Error("O nome completo deve conter pelo menos 3 caracteres.");
    }
    if (!this.email || !this.email.includes("@")) {
      throw new Error("O e-mail do candidato é obrigatório.");
    }
    if (!this.phone) {
      throw new Error("O telefone é obrigatório.");
    }
  }
}

export class Application {
  public readonly id?: string;
  public readonly jobId: string;
  public readonly candidateEmail: string;
  public readonly profileData: ApplicationProfile;
  public readonly score: number;
  public readonly message?: string;
  public readonly resumeUrl?: string;
  public readonly createdAt?: string;

  constructor(data: {
    id?: string;
    jobId: string;
    candidateEmail: string;
    profileData: ApplicationProfile;
    score: number;
    message?: string;
    resumeUrl?: string;
    createdAt?: string;
  }) {
    this.id = data.id;
    this.jobId = data.jobId;
    this.candidateEmail = data.candidateEmail;
    this.profileData = data.profileData;
    this.score = data.score;
    this.message = data.message;
    this.resumeUrl = data.resumeUrl;
    this.createdAt = data.createdAt;

    this.validate();
  }

  private validate() {
    if (!this.jobId) {
      throw new Error("O ID da vaga é obrigatório.");
    }
    if (!this.candidateEmail) {
      throw new Error("O e-mail do candidato é obrigatório.");
    }
    if (this.score < 0 || this.score > 100) {
      throw new Error("A pontuação deve estar entre 0 e 100.");
    }
  }
}
