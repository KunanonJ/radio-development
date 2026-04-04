import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeAttributeBridge } from "@/components/ThemeAttributeBridge";
import { I18nLangBridge } from "@/components/I18nLangBridge";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "./pages/LandingPage";
import { AppLayout } from "./components/AppLayout";
import HomePage from "./pages/app/HomePage";
import SearchPage from "./pages/app/SearchPage";
import TracksPage from "./pages/app/TracksPage";
import RecentlyAddedPage from "./pages/app/RecentlyAddedPage";
import AlbumsPage from "./pages/app/AlbumsPage";
import ArtistsPage from "./pages/app/ArtistsPage";
import PlaylistsPage from "./pages/app/PlaylistsPage";
import PlaylistDetailPage from "./pages/app/PlaylistDetailPage";
import AlbumDetailPage from "./pages/app/AlbumDetailPage";
import ArtistDetailPage from "./pages/app/ArtistDetailPage";
import QueuePage from "./pages/app/QueuePage";
import NowPlayingPage from "./pages/app/NowPlayingPage";
import PlaylistGeneratorPage from "./pages/app/PlaylistGeneratorPage";
import AutomationPage from "./pages/app/AutomationPage";
import CartPage from "./pages/app/CartPage";
import BroadcastPage from "./pages/app/BroadcastPage";
import SpotSchedulePage from "./pages/app/SpotSchedulePage";
import HowToUsePage from "./pages/app/HowToUsePage";
import { SettingsPlayback } from "./pages/app/SettingsPlayback";
import SettingsPage, { SettingsIntegrations, SettingsAppearance } from "./pages/app/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeAttributeBridge />
      <I18nLangBridge />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="library/recently-added" element={<RecentlyAddedPage />} />
            <Route path="library/tracks" element={<TracksPage />} />
            <Route path="library/albums" element={<AlbumsPage />} />
            <Route path="library/artists" element={<ArtistsPage />} />
            <Route path="library/playlists" element={<PlaylistsPage />} />
            <Route path="library/generator" element={<PlaylistGeneratorPage />} />
            <Route path="automation" element={<AutomationPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="broadcast" element={<BroadcastPage />} />
            <Route path="spot-schedule" element={<SpotSchedulePage />} />
            <Route path="playlist/:id" element={<PlaylistDetailPage />} />
            <Route path="album/:id" element={<AlbumDetailPage />} />
            <Route path="artist/:id" element={<ArtistDetailPage />} />
            <Route path="queue" element={<QueuePage />} />
            <Route path="now-playing" element={<NowPlayingPage />} />
            <Route path="how-to-use" element={<HowToUsePage />} />
            <Route path="settings" element={<SettingsPage />}>
              <Route path="integrations" element={<SettingsIntegrations />} />
              <Route path="playback" element={<SettingsPlayback />} />
              <Route path="appearance" element={<SettingsAppearance />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
