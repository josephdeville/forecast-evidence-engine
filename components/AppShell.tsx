import type { ReactNode } from "react";
import Link from "next/link";
import { AS_OF_DATE } from "@/lib/constants";
import { formatIsoDate } from "@/lib/dates";
import { SyntheticBanner } from "@/components/SyntheticBanner";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full">
      <SyntheticBanner />
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-3">
          <div className="flex min-w-0 items-baseline gap-4">
            <Link href="/" className="truncate text-sm font-medium tracking-tight">
              Forecast Evidence Engine
            </Link>
            <span className="hidden text-xs text-muted sm:inline">
              Weekly CRO pack · as of {formatIsoDate(AS_OF_DATE)}
            </span>
          </div>
          <nav className="flex items-center gap-1 text-sm">
            <Link
              href="/"
              className="rounded px-3 py-1.5 text-muted hover:bg-surface-2 hover:text-foreground"
            >
              CRO view
            </Link>
            <Link
              href="/deals"
              className="rounded px-3 py-1.5 text-muted hover:bg-surface-2 hover:text-foreground"
            >
              Deals
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-6 py-8">{children}</main>
    </div>
  );
}
