interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

const steps = [
  { number: 1, label: "Perfil" },
  { number: 2, label: "Teste" },
  { number: 3, label: "Currículo" },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full">
      {steps.map((step, index) => {
        const isCompleted = step.number < currentStep;
        const isActive = step.number === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  isCompleted
                    ? "bg-primary text-white"
                    : isActive
                    ? "bg-primary text-white ring-4 ring-primary/20"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {isCompleted ? (
                  <span className="material-symbols-outlined text-base">check</span>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`text-xs font-medium ${
                  isActive ? "text-primary" : isCompleted ? "text-slate-600" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`h-0.5 w-16 mx-2 mb-5 ${isCompleted ? "bg-primary" : "bg-slate-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
