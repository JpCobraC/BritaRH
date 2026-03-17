interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
}

export default function ProgressBar({ value, label }: ProgressBarProps) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>{label}</span>
          <span>{value}%</span>
        </div>
      )}
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
