import { Application, ApplicationProfile } from "../entities/Application";

export interface IApplicationRepository {
  submitApplication(
    jobId: string,
    candidateEmail: string,
    profileData: ApplicationProfile,
    score: number,
    file: File,
    message?: string
  ): Promise<Application>;
}
