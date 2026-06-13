"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SignOutButtonProps {
  variant?: "sidebar" | "settings";
}

export function SignOutButton({ variant = "settings" }: SignOutButtonProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {variant === "sidebar" ? (
          // Sidebar: full-width row with icon
          <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm text-text-secondary hover:text-[#E05252] hover:bg-[#E05252]/10 transition-colors group">
            <LogOut size={16} className="group-hover:text-[#E05252] transition-colors" />
            Sign Out
          </button>
        ) : (
          // Settings page: outlined danger button
          <button className="shrink-0 h-9 px-5 rounded-md border border-[#E05252]/40 text-[#E05252] text-sm font-medium whitespace-nowrap hover:bg-[#E05252]/10 hover:border-[#E05252] transition-colors">
            Sign Out
          </button>
        )}
      </AlertDialogTrigger>

      {/* Confirmation dialog */}
      <AlertDialogContent className="bg-[#161616] border border-[#2A2A2A] rounded-xl max-w-sm w-[calc(100%-2rem)] mx-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white text-base font-semibold">
            Sign out of Vaulté?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-text-secondary text-sm leading-relaxed">
            You will be returned to the login screen. Any unsaved changes will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex flex-row gap-3 mt-2">
          <AlertDialogCancel className="flex-1 h-9 rounded-md bg-transparent border border-border text-text-secondary text-sm hover:bg-bg-elevated hover:text-white transition-colors mt-0">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex-1 h-9 rounded-md bg-[#E05252] text-white text-sm font-medium hover:bg-[#c94444] disabled:opacity-60 transition-colors"
          >
            {isSigningOut ? "Signing out..." : "Yes, sign out"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
