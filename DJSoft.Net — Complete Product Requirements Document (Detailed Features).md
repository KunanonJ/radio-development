# DJSoft.Net — Complete Product Requirements Document (PRD)

## Executive Summary

DJSoft.Net (www.djsoft.net) develops a suite of professional radio automation and broadcasting software: **RadioBOSS**, **RadioLogger**, **RadioCaster**, **RadioBOSS.FM (Stream Hosting)**, and **RadioBOSS Cloud**. This PRD catalogs every feature across all products with detailed descriptions, organized by functional module. A proposed **Thai Language (ภาษาไทย)** localization requirement is included as a new feature request.[^1]

***

# PRODUCT 1: RadioBOSS — Radio Automation Software

RadioBOSS is the flagship product designed for terrestrial and internet radio stations, clubs, hotels, shops, casinos, restaurants, and gyms. It provides professional radio programming and automation at an affordable cost.[^2]

***

## 1. Player (Core Playback Engine)

The Player is the central component of RadioBOSS, controlling when and how playlists are played.[^2]

### 1.1 Audio Playback

| # | Feature | Detailed Description |
|---|---------|---------------------|
| 1.1.1 | Multi-Format Audio Playback | Native support for MP3, WMA, WAV, OGG, AAC, FLAC, OPUS, DSD, and CD audio. Extensible via plugins for SPX, Musepack, AC3, ALAC, OptimFROG, TTA, MIDI[^3] |
| 1.1.2 | Video Files Playback | Supports playback of video files directly within the player[^4] |
| 1.1.3 | Internet Streams in Playlists | Include HTTP, MMS, and FTP streams and podcasts directly in playlists for relay or rebroadcast[^2] |
| 1.1.4 | Automatic Crossfading | Smooth, configurable crossfade transitions between tracks with adjustable overlap duration and curve[^2] |
| 1.1.5 | Automatic Volume Leveling | EBUR128-based normalization ensures all music plays at the same perceived volume level. Includes advanced option to prevent clipping[^2][^5] |
| 1.1.6 | Silence Trimming | Automatically trims silence at the start and end of audio tracks to eliminate dead air[^2] |
| 1.1.7 | Time Stretch | Change playback speed of tracks to align with hour-end markers (Ultimate edition). Ensures tracks end precisely at hour boundaries for seamless transitions[^6][^7] |
| 1.1.8 | 12-Band Equalizer | Built-in 12-band graphic equalizer for tone shaping and audio quality improvement on any audio asset[^2] |
| 1.1.9 | Sound Compressor | Built-in audio compressor for dynamic range control, limiting peaks and boosting quiet passages[^2] |
| 1.1.10 | Multichannel Output | Support for multichannel sound cards: 4.0, 5.1, 7.1 and other configurations[^2] |

### 1.2 Input & Live Features

| # | Feature | Detailed Description |
|---|---------|---------------------|
| 1.2.1 | Microphone Input | Direct microphone input control for live announcements, talkover, and broadcasting. Includes Microphone DSP window[^2][^5] |
| 1.2.2 | Line Input | Line-in support for external audio sources (mixers, CD players, etc.). Can add Line Input items to playlists[^2][^8] |
| 1.2.3 | Cart Wall | Instant audio playback via configurable on-screen cart buttons. Supports hot keys, progress bar display, grid resizing, and drag-and-drop[^2][^9] |
| 1.2.4 | Live Assist Mode | Play tracks manually or switch between manual and automatic playback modes. Ideal for live DJ sessions with automation fallback[^4] |
| 1.2.5 | DTMF Signal Support | Events can be triggered via DTMF (Dual-Tone Multi-Frequency) signals for remote control via telephone[^2] |
| 1.2.6 | DTMF Tone Generator | Generate DTMF tones within playlists for signaling purposes[^8] |

### 1.3 Voice & Announcements

| # | Feature | Detailed Description |
|---|---------|---------------------|
| 1.3.1 | Voice Tracking | Create playlists with prerecorded voice tracks to simulate live DJ presence. Insert and record voice tracks directly from the playlist menu. Recordings saved in FLAC format[^2][^6] |
| 1.3.2 | Remote Voice Tracking | Record voice tracks remotely from any location without being physically in the studio (Ultimate edition only). Includes fade in/fade out for voice track bed[^6][^7] |
| 1.3.3 | Text-to-Speech (TTS) | Add text-to-speech items to playlists for automatic spoken announcements (time, station IDs, etc.)[^8] |
| 1.3.4 | Time Announcements | Schedule automatic time announcements at configured intervals[^8] |
| 1.3.5 | Automatic Teasers | Automatically create teasers/previews from songs with configurable duration and track exclusion limits[^2][^5] |
| 1.3.6 | Auto Intro / Auto Jingles | Automatically insert jingles before music tracks. Condition-aware: takes into account start/end track markers[^2][^5] |

### 1.4 Audio Processing & Plugin Support

| # | Feature | Detailed Description |
|---|---------|---------------------|
| 1.4.1 | ASIO Support | Low-latency ASIO input and output for professional audio interfaces[^2] |
| 1.4.2 | WASAPI Support | Low-latency WASAPI (Windows Audio Session API) input and output for modern Windows audio[^2] |
| 1.4.3 | WinAMP DSP Plugins | Use WinAMP DSP plugins for additional audio processing (32-bit version only)[^2][^5] |
| 1.4.4 | VST Plugins | Use VST audio processing plugins for effects, dynamics, and mastering[^2] |
| 1.4.5 | Sound Processing Plugins | Compatible with professional broadcast processors: Stereo Tool, JB Broadcast, and other VST/Winamp DSP processors[^3] |
| 1.4.6 | File Type DSP Control | Option to disable DSP processing for specific file types (e.g., pre-processed commercials)[^5] |
| 1.4.7 | Render Playlist to File | Export/render an entire playlist to a single audio file. Can be triggered via scheduler command (`renderplaylist`)[^2][^5] |

### 1.5 Playback Controls

| # | Feature | Detailed Description |
|---|---------|---------------------|
| 1.5.1 | Queue Mode | Delete played tracks automatically from playlist. Works in both main and AUX playlists[^5] |
| 1.5.2 | AUX Playlists | Additional auxiliary playlist players for overlay, background, or secondary content playback[^5] |
| 1.5.3 | Overlay Playback | Play content on top of the main playlist with configurable mute level and pause options[^10] |
| 1.5.4 | Track Seeking | Keyboard shortcuts (Ctrl+,/Ctrl+.) to seek within a playing track[^5] |
| 1.5.5 | End Track Beep | Configurable audio beep before a track ends for live assist operators. Volume control available in settings[^11][^5] |
| 1.5.6 | Segue Editor | Visual waveform editor for fine-tuning crossfade points between tracks[^5] |
| 1.5.7 | Track Tool | Detailed track analysis tool with extended zoom range and improved waveform drawing[^5] |
| 1.5.8 | Intro Countdown | Visual countdown display for track intro duration. Can be hidden or resized via advanced options[^5] |

***

## 2. Playlist Generator

The Playlist Generator creates sophisticated, multi-hour playlists automatically with professional radio programming rules.[^2]

| # | Feature | Detailed Description |
|---|---------|---------------------|
| 2.1 | Automatic Playlist Generation | Generate playlists for a specified duration automatically based on configured rules and categories[^2] |
| 2.2 | Playlist Generator Pro | Advanced version accessible from the playlist menu with enhanced configuration options[^8] |
| 2.3 | Playlist Templates | Create, save, and reuse playlist templates for rapid playlist generation. Load Preset window includes search (Ctrl+F)[^2][^5] |
| 2.4 | Random Playlists | Easily create randomized playlists with "Random (fast)" track selection option[^2][^5] |
| 2.5 | Rotation Support | Create playlists with block-based rotations for structured programming[^2] |
| 2.6 | Proportional Selection | Special category type that selects tracks from different categories based on configurable weights[^5] |
| 2.7 | Jingle Integration | Automatically include jingles within generated playlists at configurable intervals[^2] |
| 2.8 | Hour Markers & Commercials | Generate playlists with hour markers and commercial break insertion points[^2] |
| 2.9 | Constraints | Specify rules for which tracks can follow which tracks (e.g., no two slow songs in a row)[^5] |
| 2.10 | Repeat Protection (Track/Artist/Title) | Track, artist, and title separation rules to prevent repetitive programming[^5] |
| 2.11 | Repeat Protection (Tags) | Tag-based repeat protection rules for genre, mood, or custom tag separation[^5] |
| 2.12 | Remix Detection | Option to detect track remixes for repeat protection, preventing original and remix playing back-to-back[^5] |
| 2.13 | Dayparting | Set when a track can play based on hours and days of the week[^5] |
| 2.14 | Priority Rules | Rules based on Tags, Language, Date Added, and Last Played with support for fractional values[^5] |
| 2.15 | Global Categories | Categories that can be used across all presets, with import/clone capability[^5] |
| 2.16 | Improved Duration Precision | Enhanced total playlist duration accuracy for precise programming[^5] |
| 2.17 | Duplicate Detection | Show duplicate tracks in the playlist to avoid accidental repeats[^8] |
| 2.18 | Nonexistent File Detection | Identify and show files that no longer exist on disk[^8] |
| 2.19 | Shuffle | Shuffle playlist order after generation[^8] |
| 2.20 | Sweeper Repeat Protection | Protection rules specifically for sweeper/jingle elements[^8] |
| 2.21 | Track List with Repeat Protection | Add track lists to playlists with built-in repeat protection[^8] |
| 2.22 | Command-Line Playlist Generation | Specify the number of playlists to create per preset via command line. Error checking with logging for scheduler-triggered generation[^5] |

***

## 3. Music Library

The Music Library organizes, indexes, and manages all audio assets.[^2]

| # | Feature | Detailed Description |
|---|---------|---------------------|
| 3.1 | Audio Asset Management | Locate, track, annotate, and manage all audio assets in a centralized library[^2] |
| 3.2 | Batch Processing | Batch normalize, detect BPM, and trim silence across multiple tracks simultaneously[^2] |
| 3.3 | Track Tags | Tag any audio asset (regardless of format) for filtering, search, and playlist generation. Redesigned tag window with filter and improved editor[^2][^5] |
| 3.4 | Multi-Tag Support | Tag multiple audio assets at once for efficient library management[^2] |
| 3.5 | Automatic Indexing | Quick search via automatic library indexing[^2] |
| 3.6 | Filter & Sort | Filter and sort to work with specific records. Option to show only enabled tracks[^2][^5] |
| 3.7 | Usage Statistics | Automatically tracks play statistics including last played history with "days ago" display[^2][^5] |
| 3.8 | Comments | Add comments to any audio asset for notes and annotations[^2] |
| 3.9 | File Tag Read/Write | Supports reading and writing ID3v2, ID3v1, OGG Vorbis, WMA, APEv2, FLAC tags[^4] |
| 3.10 | Artwork Management | Edit, remove, save, and display album artwork. Read artwork from WAV files. Artwork editable from Track Information panel and Music Library[^5] |
| 3.11 | BPM Detection | BPM tag field is read automatically when a track is added to the library[^5] |
| 3.12 | Process Tracks with Error Reporting | Batch processing tracks with error tracking if some tracks were not properly updated or loaded[^5] |
| 3.13 | CSV Export | Export music library data to CSV format with extended field support[^5] |
| 3.14 | Prelisten | Preview/prelisten tracks directly from the library list (Alt+click) and Track Properties window[^5] |
| 3.15 | Dangling File Cleanup | Tool to remove orphaned `.rbdata` files when using file-based additional information storage[^5] |
| 3.16 | Library Toolbar Update | Dedicated Update Library button on the toolbar to reload the current library[^5] |

***

## 4. Scheduler

The Scheduler automates event execution at precise times or based on triggers.[^4]

| # | Feature | Detailed Description |
|---|---------|---------------------|
| 4.1 | Event Scheduling | Schedule tracks, playlists, hour markers, commercials, and commands at precise times[^4] |
| 4.2 | Post-Song Execution | Optionally trigger events after the current song finishes playing for seamless transitions[^4] |
| 4.3 | Command Execution | Automated playlist generation, start/stop playback, relay control, and many other commands[^4] |
| 4.4 | DTMF-Triggered Events | Launch scheduled events via DTMF signal for telephone-based control[^4] |
| 4.5 | Manual Mode | Toggle Manual mode on/off; all manual mode changes are logged[^11] |
| 4.6 | Recurring Events | Support for repeating events with configurable recurrence patterns[^12] |
| 4.7 | Multiple Start Times | Additional start times per event with proper weekday display in the event list[^11] |
| 4.8 | Event Expiration | "Expires" column in the scheduled events list for time-limited events[^5] |
| 4.9 | Upcoming Event Indication | Improved visual indication of upcoming events with configurable blinking speed[^5] |
| 4.10 | Override Artwork for Streaming | Override track artwork for streaming and export for scheduled items[^5] |
| 4.11 | Advertising Volume Enhancement | Specify volume increase for advertising/commercial playback[^2] |
| 4.12 | Queue Options | Various queue modes: start at exact time, wait for current track, insert after current block[^12] |

***

## 5. Advertisement Scheduler

Dedicated module for managing commercial content and ad breaks.[^2]

| # | Feature | Detailed Description |
|---|---------|---------------------|
| 5.1 | Commercial Break Scheduling | Create and schedule commercial breaks with flexible timing options[^2] |
| 5.2 | Automatic Event Generation | Auto-generate playlist events to schedule commercial breaks within RadioBOSS[^2] |
| 5.3 | Remote Ads Management | Manage advertisements remotely over a network for multi-location setups[^2] |
| 5.4 | Custom Intros & Outros | Use custom intro and outro clips to wrap commercial breaks professionally[^2] |
| 5.5 | Start/End Date Control | Specify start and end dates for each commercial for campaign management[^2] |
| 5.6 | Ads Groups | Organize ads into groups with preserved expanded/collapsed state[^11] |
| 5.7 | Improved Event Configuration | Enhanced ads scheduler event configuration window[^13] |
| 5.8 | Skip Options Processing | Skip options in file types are processed in advance to correctly display next track[^13] |

***

## 6. Internet Streaming (Built-in Broadcasting)

Native internet streaming engine without third-party plugins.[^4]

| # | Feature | Detailed Description |
|---|---------|---------------------|
| 6.1 | Multi-Codec Simultaneous Streaming | Stream in multiple codecs and bitrates simultaneously: MP3, AAC, AAC+, OGG, WMA, FLAC, OPUS[^4] |
| 6.2 | Icecast Server Support | Stream to Icecast 2 servers with TLS/SSL encryption support[^4][^14] |
| 6.3 | Shoutcast Server Support | Compatible with Shoutcast v1 and v2 servers[^4] |
| 6.4 | Windows Media Services | Stream to Windows Media Server for enterprise broadcasting[^4] |
| 6.5 | RTMP Streaming | Broadcast live audio to RTMP-based platforms (YouTube Live, Facebook Live, etc.) with configurable RTMP output URL and stream key. Supports background image/video[^15][^6] |
| 6.6 | Integrated Streaming Server | Built-in streaming server for direct listener connections without external server software. Supports HTTPS[^4][^5] |
| 6.7 | Now Playing Metadata Export | Send track metadata to websites via HTTP request, FTP file upload, or text/XML file export. Supports %filetype variable[^4][^6] |
| 6.8 | Broadcasting Statistics | Real-time statistics showing current listeners and peak listeners. Includes listener number chart[^9] |
| 6.9 | Stream Archive | Archive the broadcast stream with configurable on/off control via API[^10] |
| 6.10 | Custom Encoders | Configurable custom encoders for specialized streaming setups[^15] |
| 6.11 | Cast Title Override | Set custom titles on streaming servers via API (`setcasttitle` command)[^10] |
| 6.12 | Relay Support | Relay external network streams into the broadcast. Includes fade out when relay turns off and improved silence detection for relays[^5] |

***

## 7. Report Generator

Reporting module for airplay tracking and compliance documentation.[^2]

| # | Feature | Detailed Description |
|---|---------|---------------------|
| 7.1 | Custom Date Range Reports | View and print reports for any custom date range[^2] |
| 7.2 | Customizable Fields | Choose which fields appear in reports. Command-line support for specifying report fields[^2][^5] |
| 7.3 | Filters | Apply filters to exclude unneeded items from reports[^2] |
| 7.4 | Export Formats | Export reports to XLS, PDF, and other formats with improved performance[^2][^5] |
| 7.5 | Improved Accessibility | Enhanced accessibility features in the Report Viewer[^11] |

***

## 8. User Interface & Customization

| # | Feature | Detailed Description |
|---|---------|---------------------|
| 8.1 | Customizable User Interface | Personalize the UI layout, toolbar button groups, and work zones[^4][^5] |
| 8.2 | Additional Work Zones | Customizable work zone on the left side of the main window with hotkey support and Tab navigation (F7 hotkey)[^5] |
| 8.3 | UI Styles / Themes | Multiple UI styles including "Dark" color scheme and "Black" style. Configurable fonts for Previous/Current/Next track boxes. Waveform color option[^9][^5] |
| 8.4 | VU Meter Placement | VU meter can be positioned on the right side of the playlist window[^5] |
| 8.5 | Station Logo | Display station logo in the main window (can be hidden via advanced option)[^5] |
| 8.6 | Window Title Bar | Show currently playing track in window title bar and taskbar hint[^5] |
| 8.7 | Now Playing Bar | Displays current, next, and following track information. Correctly shows emojis and surrogates[^5] |
| 8.8 | Logs Window | Searchable logs window (Ctrl+F) for monitoring system activity[^5] |
| 8.9 | Notepad | Built-in notepad accessible from the playlist menu for quick notes[^8] |
| 8.10 | Find / Search | Search functionality (Ctrl+F) in playlists, Logs window, and Load Preset window[^8][^5] |

***

## 9. Administration & Security

| # | Feature | Detailed Description |
|---|---------|---------------------|
| 9.1 | User Profiles | Individual user profiles for personalized settings and preferences[^2] |
| 9.2 | User Access Control | Role-based access control to restrict functionality by user[^4] |
| 9.3 | Remote Control API | HTTP/HTTPS REST API for programmatic control of RadioBOSS. Supports TLS 1.0/1.1/1.2. Password-protected. Can enable/disable via `set api` command[^16][^10] |
| 9.4 | Remote API User Management | Create API users with limited rights for granular remote access control (v7.1+)[^6] |
| 9.5 | Song Request API | API endpoint to receive automated song requests from listeners with message support[^9][^10] |
| 9.6 | Multiple Station Broadcast | Broadcast several independent stations from a single PC installation[^17] |
| 9.7 | Prevent Sleep Mode | Option to prevent the computer from entering sleep mode during automation[^5] |
| 9.8 | Logarithmic/Linear Volume | Configurable volume mode applied to both main and AUX players[^6] |

### 9.9 Remote Control API — Supported Actions

The API provides comprehensive programmatic control:[^10]

- **Playback control**: play, pause, stop, next, previous, seek
- **Playlist management**: get playlist contents (`getplaylist2`), add/delete tracks, insert playlists
- **Scheduler control**: list, add, delete, run, update events; turn scheduler on/off
- **Music Library**: download library files, edit library entries (add/delete tracks)
- **Tag management**: read/write track tags (`readtag`/`writetag`), update artwork (`writeartwork`)
- **Broadcasting**: get encoder status (`encoderstatus`), stream archive status, set cast title
- **Song Requests**: add song requests, view request list (`songrequestlist`)
- **System status**: get RadioBOSS version and uptime

***

## 10. Accessibility Features

| # | Feature | Detailed Description |
|---|---------|---------------------|
| 10.1 | Screen Reader Support | Improved screen reader accessibility across scheduler, category windows, waveform, and library update dialogs[^5] |
| 10.2 | Keyboard Navigation | Tab-based navigation between work zones, F7 hotkey for zone switching, keyboard control for playback buttons[^5] |
| 10.3 | Global Hot Keys | Configurable global hot key fields in Hot Keys window[^5] |
| 10.4 | End Track Beep | Audible beep before track ends for visually impaired operators[^5] |

***

## 11. RadioBOSS Editions Comparison

| Feature | Standard ($199) | Advanced ($249) | Ultimate ($299) |
|---------|:-:|:-:|:-:|
| Audio Files Playback | ✅ | ✅ | ✅ |
| Video Files Playback | ✅ | ✅ | ✅ |
| User Access Control | ✅ | ✅ | ✅ |
| Scheduler | ✅ | ✅ | ✅ |
| Playlist Generator | ✅ | ✅ | ✅ |
| Automatic Crossfading | ✅ | ✅ | ✅ |
| Internet Streaming (all codecs) | ✅ | ✅ | ✅ |
| RTMP Streaming | ✅ | ✅ | ✅ |
| Report Generator | ✅ | ✅ | ✅ |
| Advertisement Scheduler | ✅ | ✅ | ✅ |
| Remote Control API | ✅ | ✅ | ✅ |
| Live Assist Mode | ✅ | ✅ | ✅ |
| Microphone & Line Input | ✅ | ✅ | ✅ |
| User Profiles | ✅ | ✅ | ✅ |
| Customizable UI | ✅ | ✅ | ✅ |
| 12 Months Updates & Support | ✅ | ✅ | ✅ |
| **Time Stretch** | ❌ | ❌ | ✅ |
| **Remote Voice Tracking** | ❌ | ❌ | ✅ |

[^6][^4]

***

## 12. System Requirements — RadioBOSS

| Component | Minimum |
|-----------|---------|
| CPU | 2 GHz, 2 cores |
| RAM | 1 GB |
| Disk | 1 GB free space |
| OS | Windows 7 SP1+, 8.1, 10, 11, Server 2012 R2 / 2016 / 2019 (32-bit or 64-bit) |

[^2]

***

## 13. Supported Languages (Current)

RadioBOSS currently supports: English, Arabic, Chinese, Dutch, French, German, Greek, Hungarian, Italian, Korean, Norwegian, Polish, Portuguese, Russian, Romanian, Spanish, Turkish, Ukrainian, and others. Community translations are welcomed.[^3]

***

# PRODUCT 2: RadioLogger — Radio Recording & Logging Software

RadioLogger records and archives radio station broadcasts to the computer hard drive. Archiving is useful for disputes with advertisers, regulatory compliance, and quality monitoring.[^18]

## 14. RadioLogger Features

| # | Feature | Detailed Description |
|---|---------|---------------------|
| 14.1 | Scheduled Recording | Automatic start/stop of recording at specified hours using a built-in scheduler[^18] |
| 14.2 | On-the-Fly Encoding | Encode directly to MP3, OGG, or other codecs without creating intermediate WAV files, saving disk space[^18] |
| 14.3 | Direct Playback Recording | Record directly from the playback device — no need for Stereo Mix input. Works with modern audio drivers[^18] |
| 14.4 | Record Splitting | Split recordings into configurable time-based parts (e.g., hourly, 30-minute segments) for easy navigation[^18] |
| 14.5 | Low CPU Usage | Optimized for minimal system resource consumption, suitable for running alongside other applications[^18] |
| 14.6 | Recording History | Maintains a complete running history of all recordings with timestamps and metadata[^18] |
| 14.7 | Automatic Old Record Deletion | Automatically delete old recordings based on age or disk space thresholds to manage storage[^18] |
| 14.8 | Flexible Configuration | Comprehensive configuration options for recording quality, scheduling, and file management[^18] |
| 14.9 | Multilingual User Interface | Supports multiple UI languages[^18] |
| 14.10 | ASIO Sound Card Support | Compatible with professional ASIO audio interfaces for high-quality input[^18] |
| 14.11 | Silence Detection | Detect periods of silence in recordings to flag dead air or technical issues[^18] |
| 14.12 | Email Notifications | Automated email alerts triggered by events such as silence detection for immediate operator awareness[^18] |
| 14.13 | Minimize to System Tray | Runs unobtrusively in the Windows system notification area to minimize desktop clutter[^19] |
| 14.14 | Windows Auto-Start | Automatically start with Windows boot for unattended 24/7 recording[^19] |

### System Requirements — RadioLogger

| Component | Minimum |
|-----------|---------|
| CPU | 2 GHz, 2 cores |
| RAM | 1 GB |
| Disk | 1 GB free space |
| OS | Windows 7 SP1+, 8.1, 10, 11, Server 2012 R2 / 2016 / 2019 (32-bit or 64-bit) |

[^18]

***

# PRODUCT 3: RadioCaster — Live Audio Encoder & Streaming Software

RadioCaster captures any audio input from a computer and broadcasts it online as an internet stream.[^20]

## 15. RadioCaster Features

| # | Feature | Detailed Description |
|---|---------|---------------------|
| 15.1 | Audio Capture | Capture audio from any computer input device or playback device (soundcard loopback)[^20] |
| 15.2 | Network Stream Transcoding | Capture and transcode existing network streams to a different format or server[^20] |
| 15.3 | Multi-Format Encoding | Broadcast simultaneously in MP3, AAC+, FLAC, OGG, OPUS, WMA formats[^20] |
| 15.4 | Icecast 2 Server Support | Full compatibility with Icecast 2 streaming servers[^20] |
| 15.5 | Shoutcast v1/v2 Support | Compatible with Shoutcast version 1 and version 2 servers[^20] |
| 15.6 | Windows Media Services | Stream to Windows Media server infrastructure[^20] |
| 15.7 | Integrated Streaming Server | Built-in streaming server for direct listener connections[^20] |
| 15.8 | Integrated DSP | Built-in equalizer and audio compressor for real-time sound processing[^20] |
| 15.9 | VST Plugin Support | Use VST audio processing plugins for advanced effects and mastering[^20] |
| 15.10 | Winamp DSP Plugin Support | Compatible with Winamp DSP plugins for additional audio processing[^20] |
| 15.11 | Broadcasting Statistics | Real-time statistics showing current listener count and peak listeners[^20] |
| 15.12 | Easy Configuration | Simple, user-friendly interface with quick setup wizard[^20] |

### System Requirements — RadioCaster

| Component | Minimum |
|-----------|---------|
| CPU | 2 GHz, 2 cores |
| RAM | 1 GB |
| Disk | 1 GB free space |
| OS | Windows 7 SP1+, 8.1, 10, 11, Server 2012 R2 / 2016 / 2019 (32-bit or 64-bit) |

[^20]

***

# PRODUCT 4: RadioBOSS.FM — Stream Hosting Service

RadioBOSS.FM is a cloud-based stream hosting service for internet radio stations, starting at $12/month.[^1]

## 16. RadioBOSS.FM Features

| # | Feature | Detailed Description |
|---|---------|---------------------|
| 16.1 | Feature-Rich Control Panel | Web-based station management panel for all hosting operations[^1] |
| 16.2 | Statistic Reports | Detailed audience and streaming statistics for monitoring[^1] |
| 16.3 | Live Streaming | Real-time live audio streaming capability[^1] |
| 16.4 | 24/7 Automation | Unattended 24/7 radio automation with automatic recovery[^1] |
| 16.5 | Port 80 & HTTPS Streaming | Stream on standard web port 80 and secure HTTPS for maximum compatibility[^1] |
| 16.6 | Scalability | Scale listener capacity dynamically as audience grows[^1] |
| 16.7 | Instant Setup | Immediate station provisioning with no waiting time[^1] |
| 16.8 | Customer Support | Quality customer support included with all plans[^1] |

***

# PRODUCT 5: RadioBOSS Cloud — Online Radio Automation

RadioBOSS Cloud is a full-featured, web-based radio automation platform for internet radio stations.[^12]

## 17. RadioBOSS Cloud Features

| # | Feature | Detailed Description |
|---|---------|---------------------|
| 17.1 | Web-Based Control Panel | Mobile-friendly, responsive online management interface accessible from any device[^12] |
| 17.2 | Live Streaming & AutoDJ | Seamless automatic transition between live streaming and AutoDJ modes[^12] |
| 17.3 | Unlimited Playlists | Support for any number of playlists with custom folder structures[^12] |
| 17.4 | Drag-and-Drop Media Management | Intuitive drag-and-drop interface for media organization. FTP upload support for bulk transfers[^12] |
| 17.5 | Multi-User Accounts | Create and manage additional user accounts for team collaboration[^12] |
| 17.6 | Rotation Builder | Build unlimited rotations with configurable repeat protection rules (track, artist, title separation)[^12] |
| 17.7 | Powerful Scheduler | Schedule events by time, day, day of week, and week number. Supports recurring events, advanced actions, queue options (exact time, wait for track end, insert after block), and local time zone[^12] |
| 17.8 | Automatic Crossfading | Configurable crossfading with per-file-type settings (adverts, station IDs, relays, etc.)[^12] |
| 17.9 | Listener Reports | Up to 1-year listener reports with period comparison. TLH (Total Listening Hours) and country statistics[^12] |
| 17.10 | Queue Monitoring | View current, past, and upcoming track titles. View and modify the playback queue in real-time[^12] |
| 17.11 | Multi-Format Audio Support | Supports MP3, AAC, WMA, OGG, FLAC, ALAC, M4A, OPUS, and others[^12] |
| 17.12 | Network Stream Relay | Relay external network streams with scheduled start/end times[^12] |
| 17.13 | Automatic Silence Trimmer | Remove silence from the beginning and end of music tracks automatically[^12] |
| 17.14 | Volume Normalization | Automatic volume leveling to ensure consistent playback levels[^12] |
| 17.15 | Multi-Codec Broadcasting | Broadcast in MP3, AAC/AAC+, OGG, FLAC, OPUS. Any bitrate, sample rate, mono/stereo. HTTP and HTTPS tune-in links[^12] |
| 17.16 | External Server Broadcasting | Broadcast to any third-party Icecast or Shoutcast streaming servers[^12] |
| 17.17 | Website Widgets | Embeddable widgets: player, now playing title, recently played tracks, album cover[^12] |
| 17.18 | Third-Party Integrations | Integration with TuneIn, Twitter, and custom HTTP hooks for automation[^12] |
| 17.19 | Text-to-Speech Engine | Automatic spoken announcements for time and weather[^12] |
| 17.20 | High Reliability | Multiple automatic monitoring and recovery levels ensure 24/7 uptime[^12] |

***

# NEW FEATURE REQUIREMENT: Thai Language Support (ภาษาไทย)

## 18. Background & Justification

RadioBOSS currently supports 18+ languages but does not include Thai (ภาษาไทย). DJSoft.Net welcomes community translations for additional languages. Thailand has a growing internet radio and streaming market, and adding Thai language support would unlock a significant new user base across Southeast Asia, particularly in Thailand where radio broadcasting and streaming services are expanding rapidly.[^3]

***

## 19. Scope of Thai Language Feature

Thai language localization applies to all DJSoft.Net products:

- **RadioBOSS** (Standard, Advanced, and Ultimate editions)
- **RadioLogger**
- **RadioCaster**
- **RadioBOSS Cloud** web-based control panel
- **RadioBOSS.FM** hosting control panel
- **User documentation and manuals** (PDF and online)

***

## 20. Thai Language Feature Requirements

| Req ID | Requirement | Description | Priority |
|--------|-------------|-------------|----------|
| TH-001 | RadioBOSS UI Translation | Full Thai translation of all menus, dialogs, context menus, tooltips, status messages, and error messages across all RadioBOSS modules (Player, Playlist Generator, Music Library, Scheduler, Ads Scheduler, Report Generator, Settings) | **High** |
| TH-002 | RadioLogger UI Translation | Full Thai translation of RadioLogger's interface including recording controls, scheduler, settings dialogs, and notification messages | **High** |
| TH-003 | RadioCaster UI Translation | Full Thai translation of RadioCaster's interface including encoder settings, streaming controls, and statistics displays | **High** |
| TH-004 | RadioBOSS Cloud Panel Translation | Thai localization for the web-based RadioBOSS Cloud control panel including all management interfaces, scheduler, rotation builder, reports, and widgets | **Medium** |
| TH-005 | Thai Character Display in Content Fields | Full Thai character rendering (U+0E00–U+0E7F) in playlist names, track tags, comments, metadata fields, music library entries, and the Notepad feature | **High** |
| TH-006 | Report Generator Thai Support | Thai text rendering support in Report Generator exports (XLS, PDF). Correct Thai font embedding in PDF output. Thai column headers and report labels | **Medium** |
| TH-007 | Text-to-Speech Thai Support | Thai language voice option in the Text-to-Speech engine for automatic time announcements, weather announcements, and custom TTS items in playlists | **Medium** |
| TH-008 | Thai User Documentation | Translation of user manuals (PDF and online HTML versions) for RadioBOSS, RadioLogger, and RadioCaster into Thai | **Low** |
| TH-009 | Thai Time Announcement Voice Pack | Pre-recorded Thai-language time announcement voice pack for the automatic time announcement feature | **Low** |
| TH-010 | Thai Metadata Export | Thai character support in "Now Playing" metadata export via HTTP request, FTP upload, and text/XML file export. Ensure UTF-8 encoding in all export methods | **High** |
| TH-011 | Thai Locale Formatting | Thai locale date/time formatting (Buddhist Era calendar option: พ.ศ.) in scheduler, reports, logs, and all timestamp displays | **Medium** |
| TH-012 | Thai Language Selector | Thai language option (ภาษาไทย) in application preferences/settings with immediate or restart-triggered locale switching | **High** |
| TH-013 | Thai Cart Wall Labels | Support for Thai text on Cart Wall buttons, including correct rendering of Thai characters in button labels and tooltips | **Medium** |
| TH-014 | Thai Search & Indexing | Music Library search and automatic indexing must correctly handle Thai characters, including tokenization for Thai text (which has no spaces between words) | **High** |
| TH-015 | Thai API Response Support | Remote Control API should return Thai characters correctly in UTF-8 encoded responses (playlist contents, track info, song requests) | **Medium** |
| TH-016 | Thai Installer Localization | Thai language option in the installation wizard for all three desktop products | **Low** |

***

## 21. Technical Specifications for Thai Language Support

### 21.1 Unicode & Encoding

- All products must fully support Thai Unicode characters (U+0E00–U+0E7F) in every text input field, display element, file path, and data export
- UTF-8 encoding is mandatory for all internal storage, API communications, and file I/O
- API requests and responses already use UTF-8 encoding, which supports Thai natively[^10]

### 21.2 Font Requirements

- **Desktop apps**: Ensure system fonts rendering Thai glyphs are available (Tahoma, Leelawadee UI, Sarabun New). Fallback font chain must include a Thai-capable font
- **Cloud/Web panel**: Web fonts with Thai support (e.g., Sarabun from Google Fonts, or Noto Sans Thai) must be included in CSS
- **PDF reports**: Embed Thai-compatible fonts in generated PDF files to ensure correct rendering on any system

### 21.3 Text Layout Considerations

- Thai script has **no spaces between words** — line breaking requires a Thai word segmentation dictionary or ICU library
- Thai uses **combining characters** (vowels and tone marks positioned above, below, or around consonants) — rendering engine must support complex script shaping
- UI layout must accommodate Thai text length variations (Thai translations may be longer or shorter than English equivalents)
- Right-to-left text mixing is not required (Thai is left-to-right)

### 21.4 Translation Process

- DJSoft.Net provides a community translation framework for localization contributions[^3]
- A native Thai translator should create the localization files following the existing translation resource format
- All translations must be reviewed by a second native Thai speaker for accuracy and natural phrasing

### 21.5 Testing Requirements

- Comprehensive QA testing with native Thai speakers covering:
  - All UI elements display correctly with no text truncation, overlap, or rendering artifacts
  - Thai characters in metadata, playlist names, and reports export correctly in all formats (XLS, PDF, XML, HTTP)
  - Text-to-Speech announcements in Thai are intelligible and correctly pronounced
  - Search and indexing work correctly with Thai text input
  - API responses include correctly encoded Thai characters

***

## 22. Acceptance Criteria for Thai Language Feature

1. All UI elements in RadioBOSS, RadioLogger, and RadioCaster display correctly in Thai with no text truncation, overlap, or rendering issues
2. Users can select "ภาษาไทย" from the language selector and the change applies immediately or upon application restart
3. Thai characters in track metadata, playlist names, comments, and reports render correctly in all views and export formats
4. Text-to-Speech announcements in Thai are intelligible, correctly pronounced, and include time/weather vocabulary
5. Thai documentation is accurate, complete, and accessible from the help menu and download page
6. Music Library search returns correct results for Thai text queries
7. Remote Control API returns properly encoded Thai characters in all response data
8. Cart Wall buttons display Thai labels without visual artifacts
9. Report Generator produces PDF and XLS files with correctly rendered Thai text and fonts
10. RadioBOSS Cloud control panel is fully functional in Thai across all browsers and mobile devices

***

## 23. Pricing Summary

| Product | Edition / Plan | Price | License Type |
|---------|---------------|-------|-------------|
| RadioBOSS | Standard | $199 | Perpetual + 12 months updates |
| RadioBOSS | Advanced | $249 | Perpetual + 12 months updates |
| RadioBOSS | Ultimate | $299 | Perpetual + 12 months updates |
| RadioBOSS | Annual Update Renewal | $69.95 | 12 months updates |
| RadioLogger | Single License | ~$39.95 | Perpetual |
| RadioCaster | Single License | ~$49.95 | Perpetual |
| RadioBOSS.FM | Stream Hosting | From $12/month | Subscription |
| RadioBOSS Cloud | Stream + Automation | Varies by plan | Subscription |

---

## References

1. [Radio Automation Software, Internet streaming, Logging ...](https://www.djsoft.net/enu/181.htm) - RadioBOSS makes it easy and fast to convert and manage audio assets, build playlists with advertisin...

2. [RadioBOSS – Software For Radio Station Automation](https://www.djsoft.net/enu/description_radioboss.htm) - RadioBOSS is used at radio stations, clubs, hotels, shops and casinos all over the world. You're in ...

3. [Download RadioBOSS, RadioLogger, RadioCaster ...](https://www.djsoft.net/enu/download.htm) - RadioBOSS is available in different languages: English, Arabic, Chinese, Dutch, French, German, Gree...

4. [radioboss editions](https://www.djsoft.net/enu/radioboss_editions.htm) - Compare the different editions of RadioBOSS below to find the one that's right for you. Feature, Sta...

5. [News archive | RadioBOSS Radio Automation Software](https://www.djsoft.net/enu/newsarchive.htm?8vdGjZ1PHp6mcoP=syOAK5O4617UNwQ) - Some of the new features are: Virtual Mixer Console; Dayparting: set when a track can play (hours/da...

6. [RadioBOSS 7.1 [beta] | DJSoft.Net Community Forums](https://www.djsoft.net/community/threads/radioboss-7-1-beta.12390/) - RTMP streaming support; Remote Voice Tracking module (Ultimate edition only); Time Stretch feature: ...

7. [Unveiling RadioBOSS 7.1: A Game Changer for Broadcasters](http://oreateai.com/blog/unveiling-radioboss-71-a-game-changer-for-broadcasters/cf87ca3d4f0730f9fe324fc396e79a80) - One standout feature is RTMP streaming support, which allows users to broadcast live audio seamlessl...

8. [Playlist](https://manual.djsoft.net/radioboss/en/playlist.htm) - Playlist ; Extra ; Add Text-to-Speech... Read custom text. ; Add DTMF tone generator. Add DTMF tone ...

9. [RadioBOSS: All versions - Software Informer](https://radioboss.software.informer.com/versions/) - New features in RadioBOSS: - Added "Dark" UI color scheme. - Song Request API to receive automated s...

10. [Remote Control API - RadioBOSS User Manual](https://manual.djsoft.net/radioboss/en/remote_controlapi.htm) - You can control RadioBOSS remotely by using its Remote Control API. Enable and configure this featur...

11. [NEWS 8/22/2024 - RadioBOSS](https://www.djsoft.net/enu/news/174.htm) - RadioBOSS 7.0.6. What's new: Playlist Generator: added configuration for "consider tracks in the pla...

12. [RadioBOSS Cloud](https://www.radioboss.fm/support/radioboss-cloud/) - RadioBOSS Cloud, the ultimate online radio automation solution. Start your station in minutes with i...

13. [RadioBOSS 7.0 [beta] | Page 31 | DJSoft.Net Community Forums](https://www.djsoft.net/community/threads/radioboss-7-0-beta.11629/page-31) - Skip options in file types are now processed in advance to correctly display next track · Ads Schedu...

14. [NEWS 5/17/2024 - RadioBOSS](https://www.djsoft.net/enu/news/170.htm) - RadioBOSS 7.0.4. What's new: Broadcasting: added option "Use TLS" to enable streaming with TLS/SSL p...

15. [RTMP streaming](https://manual.djsoft.net/radioboss/en/rtmp-streaming.htm) - 1. In the top menu bar, select Settings -> Options... · 2. In the Settings window, select Broadcast ...

16. [remote control API - RadioBOSS User Manual](https://manual.djsoft.net/radioboss/en/remote_control_api.htm) - Enable Remote Control. Enable or disable remote control feature ; Listen on port. Select the port wh...

17. [Broadcasting of several stations from a single PC - RadioBOSS](https://www.djsoft.net/enu/radioboss_multiple_stations.htm) - Remote Voice Tracking, RTMP streaming, improved Playlist Generator, Auto Intro, Ads Scheduler, and m...

18. [RadioLogger – Record Logging and Recording Software](https://www.djsoft.net/enu/radiologger_description.htm) - Scheduler - automatic start/stop of recording in specified hours · Encoding into mp3, ogg or other c...

19. [Radio Automation Software, Internet streaming, Logging and Archiving](https://www.djsoft.net/enu/80.htm) - DJSoft.Net - home of RadioBOSS radio automation software, RadioLogger and RadioCaster. Copyright (c)...

20. [RadioCaster – Live Radio Streaming Software](https://www.djsoft.net/enu/radiocaster_details.htm) - RadioCaster is a program for taking any audio - including analog - connected to your computer or pla...

