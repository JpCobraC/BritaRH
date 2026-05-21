import { describe, it, expect, vi } from "vitest";
import { GetJobsUseCase } from "../domain/usecases/GetJobsUseCase";
import { GetJobDetailsUseCase } from "../domain/usecases/GetJobDetailsUseCase";
import { SubmitApplicationUseCase } from "../domain/usecases/SubmitApplicationUseCase";
import { IJobRepository } from "../domain/repositories/IJobRepository";
import { IApplicationRepository } from "../domain/repositories/IApplicationRepository";
import { Job } from "../domain/entities/Job";
import { ApplicationProfile } from "../domain/entities/Application";

describe("GetJobsUseCase", () => {
  it("should call listOpenJobs on repository", async () => {
    const mockJobs: Job[] = [
      { id: "1", title: "Job 1", area: "Area 1", status: "open", contractType: "CLT", schedule: "Fulltime", workplace: "Remote", requirements: "", assignments: "" }
    ];
    const mockRepo: IJobRepository = {
      listOpenJobs: vi.fn().mockResolvedValue({ items: mockJobs, total: 1 }),
      getJobById: vi.fn(),
    };

    const usecase = new GetJobsUseCase(mockRepo);
    const result = await usecase.execute(1, 10);

    expect(mockRepo.listOpenJobs).toHaveBeenCalledWith(1, 10);
    expect(result.items).toEqual(mockJobs);
    expect(result.total).toBe(1);
  });
});

describe("GetJobDetailsUseCase", () => {
  it("should call getJobById on repository", async () => {
    const mockJob: Job = {
      id: "vaga-123",
      title: "Job 1",
      area: "Area 1",
      status: "open",
      contractType: "CLT",
      schedule: "Fulltime",
      workplace: "Remote",
      requirements: "",
      assignments: "",
    };
    const mockRepo: IJobRepository = {
      listOpenJobs: vi.fn(),
      getJobById: vi.fn().mockResolvedValue(mockJob),
    };

    const usecase = new GetJobDetailsUseCase(mockRepo);
    const result = await usecase.execute("vaga-123");

    expect(mockRepo.getJobById).toHaveBeenCalledWith("vaga-123");
    expect(result).toEqual(mockJob);
  });

  it("should throw an error if no ID is provided", async () => {
    const mockRepo: IJobRepository = {
      listOpenJobs: vi.fn(),
      getJobById: vi.fn(),
    };
    const usecase = new GetJobDetailsUseCase(mockRepo);
    await expect(usecase.execute("")).rejects.toThrow("Job ID must be provided");
  });
});

describe("SubmitApplicationUseCase", () => {
  const profile: ApplicationProfile = {
    fullName: "Jane Doe",
    email: "jane@doe.com",
    phone: "(31) 99999-9999",
  };

  const createMockFile = (name: string, size: number, type: string): File => {
    const file = new File(["dummy content"], name, { type });
    Object.defineProperty(file, "size", { value: size });
    return file;
  };

  it("should validate and submit successfully", async () => {
    const mockFile = createMockFile("curriculo.pdf", 1024, "application/pdf");
    const mockRepo: IApplicationRepository = {
      submitApplication: vi.fn().mockResolvedValue({ id: "app-123" }),
    };

    const usecase = new SubmitApplicationUseCase(mockRepo);
    const result = await usecase.execute("vaga-123", "jane@doe.com", profile, 80, mockFile, "Hello!");

    expect(mockRepo.submitApplication).toHaveBeenCalledWith("vaga-123", "jane@doe.com", profile, 80, mockFile, "Hello!");
    expect(result.id).toBe("app-123");
  });

  it("should throw error if jobId is missing", async () => {
    const mockFile = createMockFile("curriculo.pdf", 1024, "application/pdf");
    const mockRepo: IApplicationRepository = { submitApplication: vi.fn() };
    const usecase = new SubmitApplicationUseCase(mockRepo);

    await expect(usecase.execute("", "jane@doe.com", profile, 80, mockFile)).rejects.toThrow("O ID da vaga é obrigatório.");
  });

  it("should throw error if email is missing", async () => {
    const mockFile = createMockFile("curriculo.pdf", 1024, "application/pdf");
    const mockRepo: IApplicationRepository = { submitApplication: vi.fn() };
    const usecase = new SubmitApplicationUseCase(mockRepo);

    await expect(usecase.execute("vaga-123", "", profile, 80, mockFile)).rejects.toThrow("O e-mail do candidato é obrigatório.");
  });

  it("should throw error if name is too short", async () => {
    const mockFile = createMockFile("curriculo.pdf", 1024, "application/pdf");
    const mockRepo: IApplicationRepository = { submitApplication: vi.fn() };
    const usecase = new SubmitApplicationUseCase(mockRepo);
    const badProfile = { ...profile, fullName: "Jo" };

    await expect(usecase.execute("vaga-123", "jane@doe.com", badProfile, 80, mockFile)).rejects.toThrow("O nome completo deve conter pelo menos 3 caracteres.");
  });

  it("should throw error if phone is missing", async () => {
    const mockFile = createMockFile("curriculo.pdf", 1024, "application/pdf");
    const mockRepo: IApplicationRepository = { submitApplication: vi.fn() };
    const usecase = new SubmitApplicationUseCase(mockRepo);
    const badProfile = { ...profile, phone: "" };

    await expect(usecase.execute("vaga-123", "jane@doe.com", badProfile, 80, mockFile)).rejects.toThrow("O telefone é obrigatório.");
  });

  it("should throw error if file is not PDF", async () => {
    const mockFile = createMockFile("curriculo.docx", 1024, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    const mockRepo: IApplicationRepository = { submitApplication: vi.fn() };
    const usecase = new SubmitApplicationUseCase(mockRepo);

    await expect(usecase.execute("vaga-123", "jane@doe.com", profile, 80, mockFile)).rejects.toThrow("Apenas arquivos PDF são aceitos.");
  });

  it("should throw error if file size is over 5MB", async () => {
    const mockFile = createMockFile("curriculo.pdf", 6 * 1024 * 1024, "application/pdf");
    const mockRepo: IApplicationRepository = { submitApplication: vi.fn() };
    const usecase = new SubmitApplicationUseCase(mockRepo);

    await expect(usecase.execute("vaga-123", "jane@doe.com", profile, 80, mockFile)).rejects.toThrow("O currículo deve ter no máximo 5MB.");
  });
});
