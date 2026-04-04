import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  const nextPath = redirect && redirect.startsWith("/") ? redirect : "/app";

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-background px-6">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="max-w-sm text-center text-sm text-muted-foreground">
        Wire Firebase Auth (email / Google) here. Until then,{" "}
        <code className="font-mono text-xs">NEXT_PUBLIC_REQUIRE_AUTH</code> defaults off so you can reach{" "}
        <Link href={nextPath} className="text-primary underline-offset-4 hover:underline">
          the app
        </Link>
        .
      </p>
      <div className="flex gap-3">
        <Link
          href={nextPath}
          className="rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground"
        >
          Continue to app
        </Link>
        <Link href="/" className="rounded-md px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
          Home
        </Link>
      </div>
    </div>
  );
}
