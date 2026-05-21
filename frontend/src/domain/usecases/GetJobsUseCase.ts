import { IJobRepository } from "../repositories/IJobRepository";
import { Job } from "../entities/Job";

export class GetJobsUseCase {
  constructor(private jobRepository: IJobRepository) {}

  async execute(page?: number, size?: number): Promise<{ items: Job[]; total: number }> {
    return this.jobRepository.listOpenJobs(page, size);
  }
}
