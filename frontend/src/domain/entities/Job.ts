import { Question } from "./Question";

export type JobStatus = "open" | "closed";

export class Job {
  public readonly id: string;
  public readonly title: string;
  public readonly area: string;
  public readonly description?: string;
  public readonly contractType: string;
  public readonly schedule: string;
  public readonly workplace: string;
  public readonly requirements: string;
  public readonly assignments: string;
  public readonly status: JobStatus;
  public readonly questions: Question[];
  public readonly createdAt?: string;
  public readonly updatedAt?: string;

  constructor(data: {
    id: string;
    title: string;
    area: string;
    description?: string;
    contractType?: string;
    schedule?: string;
    workplace?: string;
    requirements?: string;
    assignments?: string;
    status: JobStatus;
    questions?: Question[];
    createdAt?: string;
    updatedAt?: string;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.area = data.area;
    this.description = data.description;
    this.contractType = data.contractType || "";
    this.schedule = data.schedule || "";
    this.workplace = data.workplace || "";
    this.requirements = data.requirements || "";
    this.assignments = data.assignments || "";
    this.status = data.status;
    this.questions = data.questions || [];
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;

    this.validate();
  }

  private validate() {
    if (!this.title || this.title.trim() === "") {
      throw new Error("Título é obrigatório.");
    }
    if (!this.area || this.area.trim() === "") {
      throw new Error("Área é obrigatória.");
    }
  }

  calculateScore(answers: (number | null)[]): number {
    if (!this.questions || this.questions.length === 0) return 0;
    let correctCount = 0;
    this.questions.forEach((q, idx) => {
      if (q.isCorrect(answers[idx])) {
        correctCount++;
      }
    });
    return Math.round((correctCount / this.questions.length) * 100);
  }
}
