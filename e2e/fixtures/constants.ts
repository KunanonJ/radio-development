/**
 * Locale strings used in E2E assertions. Must match locales/en/*.json and locales/th/*.json.
 * Update when adding or changing UI copy.
 */
export const EN = {
  // Common
  app_name: "RadioBOSS",
  language: "Language",
  language_thai: "Thai",
  language_english: "English",
  settings: "Settings",
  error: "Error",
  search: "Search",
  save: "Save",
  help: "Help",
  // Public app
  public_app_name: "RadioBOSS Public",
  public_title: "Listener Delivery",
  public_subtitle: "Public embeds and playback are delivered at the edge",
  nav_widgets: "Widgets",
  nav_metadata: "Metadata",
  // Streaming (title used in nav/sections)
  streaming_title: "Broadcasting",
  streaming_listeners: "Listeners",
  streaming_encoder: "Encoder",
  streaming_now_playing_export: "Now Playing export",
  streaming_statistics: "Statistics",
  // Player
  player_title: "Player",
  player_current_track: "Current track",
  player_next_track: "Next track",
  player_live_assist: "Live Assist",
  player_crossfade: "Crossfade",
  player_voice_tracking: "Voice Tracking",
  // Playlist
  playlist_generate: "Playlist",
  // Library
  library_title: "Music Library",
  library_artwork: "Artwork",
  library_tags: "Tags",
  library_comments: "Comments",
  // Scheduler
  scheduler_title: "Scheduler",
  scheduler_events: "Events",
  scheduler_recurring: "Recurring",
  scheduler_commands: "Commands",
  scheduler_manual_mode: "Manual mode",
  // Reports
  reports_title: "Report Generator",
  reports_date_range: "Date range",
  reports_export_xls: "Export to XLS",
  reports_export_pdf: "Export to PDF",
  reports_airplay: "Airplay",
  reports_generate_report: "Generate report",
  reports_compliance: "Compliance",
  // Ads
  ads_title: "Advertisement Scheduler",
  ads_commercial_break: "Commercial break",
  ads_groups: "Groups",
  ads_start_date: "Start date",
  ads_end_date: "End date",
  // Errors
  errors_connection_failed: "Connection failed",
  errors_stream_error: "Streaming error",
  errors_invalid_token: "Invalid or missing playback token",
  errors_token_expired: "Playback token has expired",
  errors_please_restart: "Please restart the application",
  errors_file_not_found: "File not found",
  errors_save_failed: "Save failed",
  // Console
  console_title: "Operations Console",
  console_subtitle: "Station programming, automation, and queue state",
  // Admin
  admin_app_name: "RadioBOSS.FM",
  admin_title: "Hosting Admin",
  admin_subtitle: "Internal staff surface for tenancy",
  nav_plans: "Plans",
  nav_provisioning: "Provisioning",
  nav_observability: "Observability",
  provisioning_workflow_title: "Provisioning workflow",
  pilot_gates_title: "Pilot gates",
} as const;

export const TH = {
  language_thai: "ภาษาไทย",
  language_english: "English",
  streaming_title: "การออกอากาศ",
  streaming_listeners: "ผู้ฟัง",
  streaming_encoder: "เอนโคเดอร์",
  streaming_now_playing_export: "ส่งออกกำลังเล่น",
  streaming_statistics: "สถิติ",
  errors_connection_failed: "เชื่อมต่อไม่สำเร็จ",
  errors_stream_error: "ข้อผิดพลาดในการสตรีม",
  errors_invalid_token: "โทเค็นเล่นไม่ถูกต้องหรือไม่มี",
  errors_token_expired: "โทเค็นเล่นหมดอายุแล้ว",
  errors_please_restart: "กรุณารีสตาร์ทแอปพลิเคชัน",
  common_error: "ข้อผิดพลาด",
  common_language: "ภาษา",
  common_settings: "การตั้งค่า",
  player_current_track: "เพลงที่เล่นอยู่",
  player_next_track: "เพลงถัดไป",
  player_live_assist: "ช่วยถ่ายทอดสด",
  library_title: "คลังเพลง",
  scheduler_title: "ตัวจัดตาราง",
  reports_title: "ตัวสร้างรายงาน",
  ads_title: "ตัวจัดตารางโฆษณา",
  errors_save_failed: "บันทึกไม่สำเร็จ",
} as const;
