import { mockArtists, mockPlaylists } from '@/lib/mock-data';
import { useCatalogArtists, useCatalogPlaylists } from '@/lib/catalog-queries';
import { useMergedAlbums, useMergedTracks } from '@/lib/library';
import { TrackRow } from '@/components/TrackRow';
import { AlbumCard } from '@/components/AlbumCard';
import { ArtistCard } from '@/components/ArtistCard';
import { PlaylistCard } from '@/components/PlaylistCard';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SearchPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const hasQuery = query.length > 0;
  const allTracks = useMergedTracks();
  const allAlbums = useMergedAlbums();
  const { data: apiArtists } = useCatalogArtists();
  const { data: apiPlaylists } = useCatalogPlaylists();
  const artists = apiArtists && apiArtists.length > 0 ? apiArtists : mockArtists;
  const playlists = apiPlaylists && apiPlaylists.length > 0 ? apiPlaylists : mockPlaylists;

  const filteredTracks = allTracks.filter(
    (tr) =>
      tr.title.toLowerCase().includes(query.toLowerCase()) ||
      tr.artist.toLowerCase().includes(query.toLowerCase())
  );
  const filteredAlbums = allAlbums.filter((a) => a.title.toLowerCase().includes(query.toLowerCase()));
  const filteredArtists = artists.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()));
  const filteredPlaylists = playlists.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="max-w-[1200px] space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-6">{t('search.title')}</h1>
        <div className="relative max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full pl-11 pr-4 py-3 rounded-xl surface-2 border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-1 focus:ring-primary transition-shadow"
          />
        </div>
      </div>

      {!hasQuery && (
        <div className="surface-2 border border-border rounded-xl p-12 text-center">
          <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">{t('search.emptyHint')}</p>
        </div>
      )}

      {hasQuery && (
        <>
          {filteredTracks.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">{t('search.sectionTracks')}</h2>
              <div className="surface-2 border border-border rounded-xl overflow-hidden">
                {filteredTracks.slice(0, 5).map((tr, i) => (
                  <TrackRow key={tr.id} track={tr} index={i} />
                ))}
              </div>
            </div>
          )}
          {filteredAlbums.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">{t('search.sectionAlbums')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                {filteredAlbums.map((a, i) => (
                  <AlbumCard key={a.id} album={a} index={i} />
                ))}
              </div>
            </div>
          )}
          {filteredArtists.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">{t('search.sectionArtists')}</h2>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-5">
                {filteredArtists.map((a, i) => (
                  <ArtistCard key={a.id} artist={a} index={i} />
                ))}
              </div>
            </div>
          )}
          {filteredPlaylists.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">{t('search.sectionPlaylists')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                {filteredPlaylists.map((p, i) => (
                  <PlaylistCard key={p.id} playlist={p} index={i} />
                ))}
              </div>
            </div>
          )}
          {filteredTracks.length === 0 && filteredAlbums.length === 0 && filteredArtists.length === 0 && filteredPlaylists.length === 0 && (
            <div className="surface-2 border border-border rounded-xl p-12 text-center">
              <p className="text-muted-foreground">{t('search.noResults', { query })}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
