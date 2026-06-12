import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface dark:bg-dark-surface">
      <Suspense fallback={
        <div className="w-full max-w-sm animate-pulse">
          <div className="rounded-lg border border-border bg-white dark:bg-dark-card dark:border-dark-border p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="h-8 w-24 bg-border dark:bg-dark-border rounded mx-auto" />
              <div className="h-5 w-32 bg-border dark:bg-dark-border rounded mx-auto" />
              <div className="h-4 w-48 bg-border dark:bg-dark-border rounded mx-auto" />
            </div>
            <div className="space-y-4">
              <div className="h-9 rounded-md bg-border dark:bg-dark-border" />
              <div className="h-9 rounded-md bg-border dark:bg-dark-border" />
              <div className="h-9 rounded-md bg-accent/50" />
            </div>
          </div>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
