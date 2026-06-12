"use client";

interface SpendingData {
  label: string;
  amount: number;
  isCurrentMonth?: boolean;
}

interface SpendingChartProps {
  data: SpendingData[];
  title?: string;
}

export function SpendingChart({ data, title = "Monthly Spending" }: SpendingChartProps) {
  const maxAmount = Math.max(...data.map((d) => d.amount), 1);

  return (
    <div className="rounded-lg border border-border bg-white dark:bg-dark-card dark:border-dark-border p-6">
      <h3 className="text-sm font-medium mb-6">{title}</h3>
      <div className="flex items-end justify-between gap-2 h-32">
        {data.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-2 flex-1">
            <span className="text-xs text-muted">
              ₦{(item.amount / 1000).toFixed(0)}k
            </span>
            <div
              className={`w-full rounded-sm transition-all ${
                item.isCurrentMonth
                  ? "bg-accent"
                  : "bg-border dark:bg-dark-border"
              }`}
              style={{
                height: `${Math.max((item.amount / maxAmount) * 100, 4)}%`,
              }}
            />
            <span className="text-xs text-muted">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
