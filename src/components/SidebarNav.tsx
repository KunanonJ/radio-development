import { useMemo, type ReactNode, type ComponentType } from 'react';
import { NavLink } from '@/components/NavLink';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Search,
  Library,
  ListMusic,
  Settings,
  Music2,
  Disc3,
  Users,
  Radio,
  Sparkles,
  CalendarClock,
  ShoppingCart,
  Mic2,
  Megaphone,
  CircleHelp,
  Clock,
} from 'lucide-react';

const navBtn = (iconOnly: boolean) =>
  cn(
    'flex items-center rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors min-h-[44px]',
    iconOnly ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'
  );

function NavSection({
  labelKey,
  iconOnly,
  children,
}: {
  labelKey: string;
  iconOnly: boolean;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <div>
      {!iconOnly && (
        <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          {t(labelKey)}
        </p>
      )}
      {iconOnly && <div className="mx-2 mb-2 h-px bg-border" aria-hidden />}
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export type SidebarNavProps = {
  iconOnly: boolean;
  /** Close mobile sheet after navigation */
  onNavigate?: () => void;
  className?: string;
};

export function SidebarNav({ iconOnly, onNavigate, className }: SidebarNavProps) {
  const { t } = useTranslation();

  const stationNav = useMemo(
    () => [{ titleKey: 'nav.stationDashboard' as const, url: '/app', icon: LayoutDashboard }],
    []
  );

  const playbackNav = useMemo(
    () =>
      [
        { titleKey: 'nav.search' as const, url: '/app/search', icon: Search },
        { titleKey: 'nav.queue' as const, url: '/app/queue', icon: ListMusic },
        { titleKey: 'nav.nowPlaying' as const, url: '/app/now-playing', icon: Radio },
      ] as const,
    []
  );

  const libraryNav = useMemo(
    () =>
      [
        { titleKey: 'nav.recentlyAdded' as const, url: '/app/library/recently-added', icon: Clock },
        { titleKey: 'nav.tracks' as const, url: '/app/library/tracks', icon: Music2 },
        { titleKey: 'nav.albums' as const, url: '/app/library/albums', icon: Disc3 },
        { titleKey: 'nav.artists' as const, url: '/app/library/artists', icon: Users },
        { titleKey: 'nav.playlists' as const, url: '/app/library/playlists', icon: Library },
      ] as const,
    []
  );

  const spotsNav = useMemo(
    () => [{ titleKey: 'nav.spotSchedule' as const, url: '/app/spot-schedule', icon: Megaphone }],
    []
  );

  const toolsNav = useMemo(
    () =>
      [
        { titleKey: 'nav.automation' as const, url: '/app/automation', icon: CalendarClock },
        { titleKey: 'nav.cart' as const, url: '/app/cart', icon: ShoppingCart },
        { titleKey: 'nav.broadcast' as const, url: '/app/broadcast', icon: Mic2 },
        { titleKey: 'nav.generator' as const, url: '/app/library/generator', icon: Sparkles },
      ] as const,
    []
  );

  const wrapNavigate = onNavigate ?? (() => {});

  const renderLinks = (
    items: readonly { titleKey: string; url: string; icon: ComponentType<{ className?: string }> }[]
  ) =>
    items.map((item) => {
      const title = t(item.titleKey);
      return (
        <NavLink
          key={item.url}
          to={item.url}
          end={item.url === '/app'}
          title={iconOnly ? title : undefined}
          aria-label={iconOnly ? title : undefined}
          className={navBtn(iconOnly)}
          activeClassName="!text-foreground !bg-secondary font-medium"
          onClick={wrapNavigate}
        >
          <item.icon className="w-4 h-4 shrink-0" />
          {!iconOnly && <span>{title}</span>}
        </NavLink>
      );
    });

  return (
    <nav className={cn('flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-6', className)}>
      <NavSection labelKey="nav.sectionStation" iconOnly={iconOnly}>
        {renderLinks(stationNav)}
      </NavSection>

      <NavSection labelKey="nav.sectionPlayback" iconOnly={iconOnly}>
        {renderLinks(playbackNav)}
      </NavSection>

      <NavSection labelKey="nav.sectionLibrary" iconOnly={iconOnly}>
        {renderLinks(libraryNav)}
      </NavSection>

      <NavSection labelKey="nav.sectionSpots" iconOnly={iconOnly}>
        {renderLinks(spotsNav)}
      </NavSection>

      <NavSection labelKey="nav.sectionTools" iconOnly={iconOnly}>
        {renderLinks(toolsNav)}
      </NavSection>

      <NavSection labelKey="nav.sectionHelp" iconOnly={iconOnly}>
        <NavLink
          to="/app/how-to-use"
          title={iconOnly ? t('nav.howToUse') : undefined}
          aria-label={iconOnly ? t('nav.howToUse') : undefined}
          className={navBtn(iconOnly)}
          activeClassName="!text-foreground !bg-secondary font-medium"
          onClick={wrapNavigate}
        >
          <CircleHelp className="w-4 h-4 shrink-0" />
          {!iconOnly && <span>{t('nav.howToUse')}</span>}
        </NavLink>
        <NavLink
          to="/app/settings"
          title={iconOnly ? t('nav.settings') : undefined}
          aria-label={iconOnly ? t('nav.settings') : undefined}
          className={navBtn(iconOnly)}
          activeClassName="!text-foreground !bg-secondary font-medium"
          onClick={wrapNavigate}
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!iconOnly && <span>{t('nav.settings')}</span>}
        </NavLink>
      </NavSection>
    </nav>
  );
}
