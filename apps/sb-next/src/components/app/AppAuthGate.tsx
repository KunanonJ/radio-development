"use client";

import { onAuthStateChanged } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase/client";

function authRequired(): boolean {
  const v = process.env.NEXT_PUBLIC_REQUIRE_AUTH;
  return v === "true" || v === "1";
}

export function AppAuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [state, setState] = useState<"loading" | "ok" | "unauthed">(() =>
    authRequired() ? "loading" : "ok",
  );

  useEffect(() => {
    if (!authRequired()) {
      setState("ok");
      return;
    }
    if (!isFirebaseConfigured()) {
      setState("ok");
      return;
    }
    const auth = getFirebaseAuth();
    if (!auth) {
      setState("ok");
      return;
    }
    const unsub = onAuthStateChanged(auth, (user) => {
      setState(user ? "ok" : "unauthed");
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (state !== "unauthed") return;
    const path =
      typeof window !== "undefined"
        ? `${window.location.pathname}${window.location.search}`
        : pathname;
    router.replace(`/login?redirect=${encodeURIComponent(path)}`);
  }, [state, pathname, router]);

  if (state === "ok") return <>{children}</>;
  if (state === "unauthed") return null;

  return (
    <div
      className="flex min-h-[100dvh] items-center justify-center bg-background"
      role="status"
      aria-busy
    >
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden />
    </div>
  );
}
