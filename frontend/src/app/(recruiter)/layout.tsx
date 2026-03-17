import RecruiterSidebar from "@/components/ui/RecruiterSidebar";

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <RecruiterSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
