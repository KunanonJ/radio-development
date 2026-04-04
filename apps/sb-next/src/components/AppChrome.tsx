"use client";

import { useState } from "react";
import { Menu, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppSidebar } from "@/components/AppSidebar";
import { GlobalSearch } from "@/components/GlobalSearch";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileNavSheet } from "@/components/MobileNavSheet";
import { NowPlayingFullscreen } from "@/components/NowPlayingFullscreen";
import { PlaybackEngine } from "@/components/PlaybackEngine";
import { PlayerBar } from "@/components/PlayerBar";
import { SidebarWidthBridge } from "@/components/SidebarWidthBridge";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/lib/store";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const setSearchOpen = usePlayerStore((s) => s.setSearchOpen);
  const { t } = useTranslation();

  return (
    <div className="min-h-[100dvh] bg-background">
      <PlaybackEngine />
      <GlobalSearch />
      <NowPlayingFullscreen />
      <SidebarWidthBridge />
      <AppSidebar />
      <MobileNavSheet open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

      <div className="ml-0 md:ml-[var(--sidebar-width)] pb-[var(--player-bar-total)] transition-[margin-left] duration-200 ease-out">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border glass px-4 md:gap-3 md:px-6 lg:px-8 xl:px-10 2xl:px-14">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="min-h-[44px] min-w-[44px] shrink-0 md:hidden"
            aria-label={t("layout.openMenu")}
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex min-h-[44px] max-w-md flex-1 items-center gap-2 rounded-lg border border-border bg-[hsl(var(--surface-3))] px-3 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:text-foreground lg:max-w-lg xl:max-w-xl"
          >
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{t("layout.searchPlaceholder")}</span>
            <kbd className="ml-auto hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] sm:inline-flex">
              {t("layout.searchKbd")}
            </kbd>
          </button>
          <div className="ml-auto flex shrink-0 items-center">
            <LanguageSwitcher compact />
          </div>
        </header>

        <main className="app-shell-main">{children}</main>
      </div>

      <PlayerBar />
    </div>
  );
}
