import { IApplicationRepository } from "../repositories/IApplicationRepository";
import { Application, ApplicationProfile } from "../entities/Application";

export class SubmitApplicationUseCase {
  constructor(private applicationRepository: IApplicationRepository) {}

  async execute(
    jobId: string,
    candidateEmail: string,
    profileData: {
      fullName: string;
      email: string;
      phone: string;
      linkedinUrl?: string;
      portfolioUrl?: string;
      summary?: string;
    },
    score: number,
    file: File,
    message?: string
  ): Promise<Application> {
    if (!file) {
      throw new Error("O arquivo do currículo é obrigatório.");
    }
    if (file.type !== "application/pdf") {
      throw new Error("Apenas arquivos PDF são aceitos.");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("O currículo deve ter no máximo 5MB.");
    }

    const profile = new ApplicationProfile({
      fullName: profileData.fullName,
      email: profileData.email,
      phone: profileData.phone,
      linkedinUrl: profileData.linkedinUrl,
      portfolioUrl: profileData.portfolioUrl,
      summary: profileData.summary,
    });

    const application = new Application({
      jobId,
      candidateEmail,
      profileData: profile,
      score,
      message,
    });

    return this.applicationRepository.submitApplication(
      application.jobId,
      application.candidateEmail,
      application.profileData,
      application.score,
      file,
      application.message
    );
  }
}
