export interface ApplicationProfile {
  fullName: string;
  email: string;
  phone: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  summary?: string;
}

export interface Application {
  id?: string;
  jobId: string;
  candidateEmail: string;
  profileData: ApplicationProfile;
  score: number;
  message?: string;
  resumeUrl?: string;
  createdAt?: string;
}
