import { Question } from "./Question";

export type JobStatus = "open" | "closed";

export interface Job {
  id: string;
  title: string;
  area: string;
  description?: string;
  contractType: "CLT" | "PJ" | "Temporário" | string;
  schedule: string;
  workplace: string;
  requirements: string;
  assignments: string;
  status: JobStatus;
  questions?: Question[];
  createdAt?: string;
  updatedAt?: string;
}
