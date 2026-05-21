"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { ApplicationWizardProvider } from "@/presentation/contexts/ApplicationWizardContext";

export default function CandidaturaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const vagaId = params.vagaId as string;
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Preenche dados iniciais se autenticado
  const userEmail = session?.user?.email || "";
  const userName = session?.user?.name || "";

  return (
    <ApplicationWizardProvider
      vagaId={vagaId}
      userEmail={userEmail}
      userName={userName}
    >
      {children}
    </ApplicationWizardProvider>
  );
}
