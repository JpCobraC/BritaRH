import { apiClient } from "@/lib/api/client";
import { IJobRepository } from "../../domain/repositories/IJobRepository";
import { Job } from "../../domain/entities/Job";
import { Question } from "../../domain/entities/Question";

export class ApiJobRepository implements IJobRepository {
  async listOpenJobs(page: number = 1, size: number = 100): Promise<{ items: Job[]; total: number }> {
    try {
      const response = await apiClient.GET("/api/v1/jobs", {
        params: {
          query: {
            page,
            size,
          },
        },
        // Força buscar os dados sem cache agressivo no Next.js
        next: { revalidate: 0 },
      } as any);

      if (response.error || !response.data) {
        console.error("Failed to fetch jobs:", response.error);
        return { items: [], total: 0 };
      }

      const items: Job[] = (response.data.items || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        area: item.area,
        workplace: item.workplace || "",
        status: item.status,
        contractType: "",
        schedule: "",
        requirements: "",
        assignments: "",
        createdAt: item.created_at,
      }));

      return {
        items,
        total: response.data.total || 0,
      };
    } catch (err) {
      console.error("Error listing open jobs:", err);
      return { items: [], total: 0 };
    }
  }

  async getJobById(id: string): Promise<Job | null> {
    try {
      const response = await apiClient.GET("/api/v1/jobs/{job_id}", {
        params: {
          path: {
            job_id: id,
          },
        },
        next: { revalidate: 0 },
      } as any);

      if (response.error || !response.data) {
        console.error(`Failed to fetch job ${id}:`, response.error);
        return null;
      }

      const rawJob = response.data;
      const questions: Question[] = (rawJob.questions || []).map((q: any) => ({
        id: q.id,
        text: q.text,
        options: q.options as [string, string, string, string],
        correctIndex: q.correct_index,
      }));

      return {
        id: rawJob.id,
        title: rawJob.title,
        area: rawJob.area,
        description: rawJob.description || "",
        contractType: rawJob.contract_type || "",
        schedule: rawJob.schedule || "",
        workplace: rawJob.workplace || "",
        requirements: rawJob.requirements || "",
        assignments: rawJob.assignments || "",
        status: rawJob.status as any,
        questions,
        createdAt: rawJob.created_at,
      };
    } catch (err) {
      console.error(`Error fetching job details for ${id}:`, err);
      return null;
    }
  }
}
