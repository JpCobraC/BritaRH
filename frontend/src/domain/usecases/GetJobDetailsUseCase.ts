import { IJobRepository } from "../repositories/IJobRepository";
import { Job } from "../entities/Job";

export class GetJobDetailsUseCase {
  constructor(private jobRepository: IJobRepository) {}

  async execute(id: string): Promise<Job | null> {
    if (!id) {
      throw new Error("Job ID must be provided");
    }
    return this.jobRepository.getJobById(id);
  }
}
