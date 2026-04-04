import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarWidthBridge } from '@/components/SidebarWidthBridge';
import { MobileNavSheet } from '@/components/MobileNavSheet';
import { PlaybackEngine } from '@/components/PlaybackEngine';
import { PlaybackRecoveryBridge } from '@/components/PlaybackRecoveryBridge';
import { SchedulerBridge } from '@/components/SchedulerBridge';
import { SpotScheduleBridge } from '@/components/SpotScheduleBridge';
import { BroadcastMetadataBridge } from '@/components/BroadcastMetadataBridge';
import { CartHotkeysBridge } from '@/components/CartHotkeysBridge';
import { PlayerBar } from '@/components/PlayerBar';
import { GlobalSearch } from '@/components/GlobalSearch';
import { Menu, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePlayerStore } from '@/lib/store';
import { NowPlayingFullscreen } from '@/components/NowPlayingFullscreen';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';

export function AppLayout() {
  const { t } = useTranslation();
  const { setSearchOpen, isFullscreenPlayer } = usePlayerStore();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-background">
      <PlaybackEngine />
      <PlaybackRecoveryBridge />
      <SchedulerBridge />
      <SpotScheduleBridge />
      <BroadcastMetadataBridge />
      <CartHotkeysBridge />
      <SidebarWidthBridge />
      <AppSidebar />
      <MobileNavSheet open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
      <GlobalSearch />
      {isFullscreenPlayer && <NowPlayingFullscreen />}

      <div className="ml-0 md:ml-[var(--sidebar-width)] pb-[var(--player-bar-total)] transition-[margin-left] duration-200 ease-out">
        <header className="sticky top-0 z-30 h-14 glass border-b border-border flex items-center px-4 md:px-6 gap-2 md:gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden shrink-0 min-h-[44px] min-w-[44px]"
            aria-label={t('layout.openMenu')}
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg surface-3 border border-border text-sm text-muted-foreground hover:text-foreground transition-colors flex-1 max-w-md min-h-[44px]"
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate text-left">{t('layout.searchPlaceholder')}</span>
            <kbd className="ml-auto hidden sm:inline-flex text-[10px] px-1.5 py-0.5 rounded border border-border bg-muted">
              {t('layout.searchKbd')}
            </kbd>
          </button>
          <LanguageSwitcher />
        </header>

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      <PlayerBar />
    </div>
  );
}
