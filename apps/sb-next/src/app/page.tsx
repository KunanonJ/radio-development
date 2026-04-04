import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gradient md:text-5xl">Sonic Bloom</h1>
      <p className="max-w-md text-muted-foreground">
        Next.js App Router + Firebase scaffold. Vite SPA remains the default production app until cutover (
        <code className="font-mono text-xs">docs/MIGRATION-NEXT-FIREBASE.md</code>).
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/app"
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground glow-sm"
        >
          Open app
        </Link>
        <Link href="/login" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
