import { IApplicationRepository } from "../../domain/repositories/IApplicationRepository";
import { Application, ApplicationProfile } from "../../domain/entities/Application";

export class ApiApplicationRepository implements IApplicationRepository {
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
  }

  async submitApplication(
    jobId: string,
    candidateEmail: string,
    profileData: ApplicationProfile,
    score: number,
    file: File,
    message?: string
  ): Promise<Application> {
    const formData = new FormData();
    formData.append("job_id", jobId);
    formData.append("candidate_email", candidateEmail);
    
    // Mapeia os dados do formulário frontend para o esquema esperado pelo Pydantic ApplicationProfile:
    // full_name, email, phone, linkedin_url, portfolio_url, summary
    const backendProfile = {
      full_name: profileData.fullName,
      email: profileData.email,
      phone: profileData.phone,
      linkedin_url: profileData.linkedinUrl || null,
      portfolio_url: profileData.portfolioUrl || null,
      summary: profileData.summary || null,
    };
    
    formData.append("profile_data", JSON.stringify(backendProfile));
    formData.append("score", score.toString());
    formData.append("file", file);
    
    if (message) {
      formData.append("message", message);
    }

    const response = await fetch(`${this.apiBaseUrl}/applications/submit`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = "Erro ao submeter candidatura.";
      try {
        const errorJson = await response.json();
        errorMessage = errorJson.detail || errorMessage;
      } catch {
        // Fallback para erros genéricos
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    const profile = new ApplicationProfile({
      fullName: data.profile_data?.full_name || "",
      email: data.profile_data?.email || "",
      phone: data.profile_data?.phone || "",
      linkedinUrl: data.profile_data?.linkedin_url,
      portfolioUrl: data.profile_data?.portfolio_url,
      summary: data.profile_data?.summary,
    });

    return new Application({
      id: data.id,
      jobId: data.job_id,
      candidateEmail: data.candidate_email,
      profileData: profile,
      score: data.score,
      message: data.message,
      resumeUrl: data.resume_url,
      createdAt: data.created_at,
    });
  }
}
