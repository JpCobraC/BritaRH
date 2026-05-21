"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ApplicationProfile } from "../../domain/entities/Application";
import { ApiApplicationRepository } from "../../data/repositories/ApiApplicationRepository";
import { SubmitApplicationUseCase } from "../../domain/usecases/SubmitApplicationUseCase";

interface WizardProfile {
  fullName: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  portfolioUrl: string;
  cidade: string;
  experiencia: string;
  disponibilidade: string;
  pretensao: string;
}

export interface ApplicationWizardContextType {
  vagaId: string;
  profile: WizardProfile;
  answers: (number | null)[];
  score: number;
  message: string;
  resumeFile: File | null;
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
  
  updateProfile: (profile: Partial<WizardProfile>) => void;
  updateAnswers: (answers: (number | null)[], totalQuestions: number, correctIndices: number[]) => void;
  updateResume: (file: File | null, message: string) => void;
  submitCandidacy: () => Promise<void>;
  resetWizard: () => void;
}

const ApplicationWizardContext = createContext<ApplicationWizardContextType | undefined>(undefined);

const initialProfile = (email: string = "", name: string = ""): WizardProfile => ({
  fullName: name,
  email: email,
  phone: "",
  linkedinUrl: "",
  portfolioUrl: "",
  cidade: "",
  experiencia: "",
  disponibilidade: "",
  pretensao: "",
});

export function ApplicationWizardProvider({
  vagaId,
  userEmail,
  userName,
  children,
}: {
  vagaId: string;
  userEmail?: string;
  userName?: string;
  children: React.ReactNode;
}) {
  const sessionKey = `brita_candidatura_v2_${vagaId}`;
  
  // Estado local para os dados serializáveis
  const [profile, setProfile] = useState<WizardProfile>(() => initialProfile(userEmail, userName));
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [score, setScore] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  
  // Estado local para dados não serializáveis (Arquivo) e status de envio
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Inicializa o estado a partir do sessionStorage (se existir)
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(sessionKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.profile) setProfile(parsed.profile);
          if (parsed.answers) setAnswers(parsed.answers);
          if (parsed.score !== undefined) setScore(parsed.score);
          if (parsed.message) setMessage(parsed.message);
        } else {
          // Se não houver nada no session storage, pré-preenche com a session ativa
          setProfile(initialProfile(userEmail, userName));
        }
      } catch (e) {
        console.error("Failed to load candidatura draft:", e);
      }
    }
  }, [sessionKey, userEmail, userName]);

  // Sincroniza dados serializáveis no sessionStorage a cada alteração
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stateToSave = { profile, answers, score, message };
        sessionStorage.setItem(sessionKey, JSON.stringify(stateToSave));
      } catch (e) {
        console.error("Failed to save candidatura draft:", e);
      }
    }
  }, [sessionKey, profile, answers, score, message]);

  const updateProfile = (fields: Partial<WizardProfile>) => {
    setProfile((prev) => ({ ...prev, ...fields }));
  };

  const updateAnswers = (
    newAnswers: (number | null)[],
    totalQuestions: number,
    correctIndices: number[]
  ) => {
    setAnswers(newAnswers);
    
    // Calcula a pontuação percentual (0 a 100)
    if (totalQuestions > 0 && correctIndices.length === totalQuestions) {
      let correctCount = 0;
      newAnswers.forEach((ans, idx) => {
        if (ans !== null && ans === correctIndices[idx]) {
          correctCount++;
        }
      });
      const finalScore = Math.round((correctCount / totalQuestions) * 100);
      setScore(finalScore);
    }
  };

  const updateResume = (file: File | null, msg: string) => {
    setResumeFile(file);
    setMessage(msg);
  };

  const submitCandidacy = async () => {
    if (!resumeFile) {
      setSubmitError("Por favor, selecione um arquivo de currículo em formato PDF.");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const applicationRepository = new ApiApplicationRepository();
      const usecase = new SubmitApplicationUseCase(applicationRepository);
      
      const appProfile: ApplicationProfile = {
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        linkedinUrl: profile.linkedinUrl || undefined,
        portfolioUrl: profile.portfolioUrl || undefined,
        summary: `Cidade: ${profile.cidade || "Não informada"}. Experiência: ${profile.experiencia || "Não informada"}. Disponibilidade: ${profile.disponibilidade || "Não informada"}. Pretensão salarial: ${profile.pretensao || "Não informada"}.`,
      };

      await usecase.execute(
        vagaId,
        profile.email,
        appProfile,
        score,
        resumeFile,
        message || undefined
      );

      setSubmitSuccess(true);
      
      // Limpa rascunho após submissão de sucesso
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(sessionKey);
      }
    } catch (err: any) {
      console.error("Failed to submit candidacy:", err);
      setSubmitError(err.message || "Erro desconhecido ao enviar a candidatura. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetWizard = () => {
    setProfile(initialProfile(userEmail, userName));
    setAnswers([]);
    setScore(0);
    setMessage("");
    setResumeFile(null);
    setSubmitError(null);
    setSubmitSuccess(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(sessionKey);
    }
  };

  return (
    <ApplicationWizardContext.Provider
      value={{
        vagaId,
        profile,
        answers,
        score,
        message,
        resumeFile,
        isSubmitting,
        submitError,
        submitSuccess,
        updateProfile,
        updateAnswers,
        updateResume,
        submitCandidacy,
        resetWizard,
      }}
    >
      {children}
    </ApplicationWizardContext.Provider>
  );
}

export function useApplicationWizard() {
  const context = useContext(ApplicationWizardContext);
  if (!context) {
    throw new Error("useApplicationWizard must be used within an ApplicationWizardProvider");
  }
  return context;
}
