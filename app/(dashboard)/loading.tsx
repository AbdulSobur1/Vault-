export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-border dark:bg-dark-border rounded" />
        <div className="h-4 w-48 bg-border dark:bg-dark-border rounded" />
      </div>

      <div className="h-40 rounded-lg bg-border dark:bg-dark-border" />

      <div className="grid grid-cols-2 gap-4">
        <div className="h-24 rounded-lg bg-border dark:bg-dark-border" />
        <div className="h-24 rounded-lg bg-border dark:bg-dark-border" />
      </div>

      <div className="grid grid-cols-4 gap-3">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="h-28 rounded-lg bg-border dark:bg-dark-border" />
        ))}
      </div>

      <div className="h-64 rounded-lg bg-border dark:bg-dark-border" />
    </div>
  );
}
