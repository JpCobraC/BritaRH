import { IApplicationRepository } from "../repositories/IApplicationRepository";
import { Application, ApplicationProfile } from "../entities/Application";

export class SubmitApplicationUseCase {
  constructor(private applicationRepository: IApplicationRepository) {}

  async execute(
    jobId: string,
    candidateEmail: string,
    profileData: ApplicationProfile,
    score: number,
    file: File,
    message?: string
  ): Promise<Application> {
    if (!jobId) {
      throw new Error("O ID da vaga é obrigatório.");
    }
    if (!candidateEmail) {
      throw new Error("O e-mail do candidato é obrigatório.");
    }
    if (!profileData.fullName || profileData.fullName.length < 3) {
      throw new Error("O nome completo deve conter pelo menos 3 caracteres.");
    }
    if (!profileData.phone) {
      throw new Error("O telefone é obrigatório.");
    }
    if (!file) {
      throw new Error("O arquivo do currículo é obrigatório.");
    }
    if (file.type !== "application/pdf") {
      throw new Error("Apenas arquivos PDF são aceitos.");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("O currículo deve ter no máximo 5MB.");
    }

    return this.applicationRepository.submitApplication(
      jobId,
      candidateEmail,
      profileData,
      score,
      file,
      message
    );
  }
}
