import { Job } from "../entities/Job";

export interface IJobRepository {
  listOpenJobs(page?: number, size?: number): Promise<{ items: Job[]; total: number }>;
  getJobById(id: string): Promise<Job | null>;
}
