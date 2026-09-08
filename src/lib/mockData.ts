// Orbit Mock Data — Single Source of Truth for V1 Storage Intelligence
export interface StorageStats {
  totalGb: number;
  usedGb: number;
  freeGb: number;
  usedPercent: number;
  formattedTotal: string;
  formattedUsed: string;
  formattedFree: string;
  driveName: string;
  osType: string;
  lastScanTime: string;
  scanDurationSec: number;
}

export interface CategorySubItem {
  name: string;
  size: string;
  count: number;
  safeToReview: boolean;
}

export interface StorageCategory {
  id: string;
  name: string;
  sizeGb: number;
  formattedSize: string;
  percentage: number;
  colorVar: string;
  hex: string;
  icon: string;
  itemsCount: number;
  subBreakdown: CategorySubItem[];
  rebuildNote: string;
}

export interface SwipeItem {
  id: string;
  name: string;
  path: string;
  sizeGb: number;
  formattedSize: string;
  confidence: 'safe' | 'probably_safe' | 'risky';
  category: string;
  colorHex: string;
  lastAccessed: string;
  reason: string;
  actionNote: string;
}

export interface VaultItem {
  id: string;
  name: string;
  originalPath: string;
  sizeGb: number;
  formattedSize: string;
  cleanedAt: string;
  daysRemaining: number;
  isExpiringSoon: boolean;
  category: string;
  colorHex: string;
}

export interface DevJunkItem {
  id: string;
  name: string;
  path: string;
  sizeGb: number;
  formattedSize: string;
  lastModified: string;
  rebuildNote: string;
  isSafe: boolean;
}

export interface DevJunkGroup {
  groupName: string;
  tool: string;
  totalSizeGb: number;
  formattedTotalSize: string;
  items: DevJunkItem[];
}

export interface DuplicateItem {
  id: string;
  name: string;
  path: string;
  sizeMb: number;
  formattedSize: string;
  resolution: string;
  date: string;
  isSelected: boolean;
  isBest: boolean;
  previewColor: string;
  type: 'image' | 'video' | 'archive' | 'document';
}

export interface DuplicateCluster {
  id: string;
  clusterName: string;
  category: string;
  totalReclaimableGb: number;
  formattedReclaimable: string;
  items: DuplicateItem[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  results?: {
    title: string;
    path: string;
    size: string;
    safety: 'safe' | 'probably_safe' | 'risky';
  }[];
  quickActions?: string[];
}

export interface TimelineSnapshot {
  id: string;
  label: string;
  date: string;
  totalUsedGb: number;
  formattedUsed: string;
  categories: {
    photos: number;
    system: number;
    dev: number;
    apps: number;
    docs: number;
    trash: number;
  };
  spikeEvent?: {
    deltaGb: number;
    title: string;
    description: string;
    badge: string;
  };
}

export interface InsightAlert {
  id: string;
  type: 'forecast' | 'diff' | 'recommendation' | 'tip';
  severity: 'high' | 'medium' | 'low';
  title: string;
  headline: string;
  explanation: string;
  actionText: string;
  actionRoute: string;
  impactGb: number;
  formattedImpact: string;
  dismissed?: boolean;
}

export interface StorageWrappedData {
  personalityTitle: string;
  personalityTagline: string;
  avatarEmoji: string;
  roastParagraph: string;
  primaryMetric: {
    value: string;
    label: string;
    context: string;
  };
  highlightStats: {
    label: string;
    value: string;
    note: string;
    icon: string;
  }[];
  habits: string[];
}

// ----------------------------------------------------
// Mock Data Store
// ----------------------------------------------------

export const initialStorageStats: StorageStats = {
  totalGb: 512,
  usedGb: 394.2,
  freeGb: 117.8,
  usedPercent: 77.0,
  formattedTotal: "512 GB",
  formattedUsed: "394.2 GB",
  formattedFree: "117.8 GB",
  driveName: "Macintosh HD — Data",
  osType: "macOS Sequoia 15.2 (24C101)",
  lastScanTime: "Just now",
  scanDurationSec: 2.8
};

export const initialCategories: StorageCategory[] = [
  {
    id: "dev",
    name: "Developer Junk",
    sizeGb: 112.5,
    formattedSize: "112.5 GB",
    percentage: 28.5,
    colorVar: "var(--cat-dev)",
    hex: "#14b8a6",
    icon: "Code",
    itemsCount: 418290,
    rebuildNote: "Completely safe to wipe. Rebuilds automatically on next compile or package install.",
    subBreakdown: [
      { name: "node_modules (74 projects)", size: "44.2 GB", count: 74, safeToReview: true },
      { name: "Xcode DerivedData & Caches", size: "28.1 GB", count: 12, safeToReview: true },
      { name: "Docker Virtual Volumes & dangling layers", size: "24.6 GB", count: 6, safeToReview: true },
      { name: "Cargo & Rust target/ release caches", size: "9.4 GB", count: 8, safeToReview: true },
      { name: "Python virtualenvs (.venv & conda)", size: "6.2 GB", count: 15, safeToReview: true }
    ]
  },
  {
    id: "photos",
    name: "Photos & Video",
    sizeGb: 94.6,
    formattedSize: "94.6 GB",
    percentage: 24.0,
    colorVar: "var(--cat-photos)",
    hex: "#a855f7",
    icon: "Camera",
    itemsCount: 14820,
    rebuildNote: "Raw camera rushes, 4K screen recordings, and duplicate photo bursts.",
    subBreakdown: [
      { name: "4K Drone Footage & ProRes Rushes", size: "38.4 GB", count: 18, safeToReview: true },
      { name: "Photos Library (.photoslibrary)", size: "29.2 GB", count: 12400, safeToReview: false },
      { name: "Screen Recordings & OBS captures", size: "14.8 GB", count: 42, safeToReview: true },
      { name: "Burst shots & Near-duplicate clusters", size: "12.2 GB", count: 2360, safeToReview: true }
    ]
  },
  {
    id: "system",
    name: "System Data",
    sizeGb: 78.4,
    formattedSize: "78.4 GB",
    percentage: 19.9,
    colorVar: "var(--cat-system)",
    hex: "#f97316",
    icon: "Cpu",
    itemsCount: 840,
    rebuildNote: "Local APFS snapshots, CoreOS diagnostic crash logs, and staged Time Machine bundles.",
    subBreakdown: [
      { name: "APFS Local Snapshots (pre-update)", size: "31.2 GB", count: 8, safeToReview: true },
      { name: "Time Machine Staged Local Backups", size: "19.4 GB", count: 3, safeToReview: true },
      { name: "CrashReporter & Diagnostic Traces", size: "14.6 GB", count: 182, safeToReview: true },
      { name: "System Caches & Core Extension Blobs", size: "13.2 GB", count: 647, safeToReview: false }
    ]
  },
  {
    id: "apps",
    name: "Applications",
    sizeGb: 68.2,
    formattedSize: "68.2 GB",
    percentage: 17.3,
    colorVar: "var(--cat-apps)",
    hex: "#3b82f6",
    icon: "Layers",
    itemsCount: 142,
    rebuildNote: "Desktop software, simulator runtimes, and local game installations.",
    subBreakdown: [
      { name: "Xcode.app + iOS 17.2 & 18.0 Simulators", size: "34.8 GB", count: 2, safeToReview: true },
      { name: "Adobe Creative Cloud Applications", size: "16.4 GB", count: 4, safeToReview: false },
      { name: "Unreal Engine 5.4 Editor & Tooling", size: "11.2 GB", count: 1, safeToReview: true },
      { name: "Productivity & Utility Apps", size: "5.8 GB", count: 135, safeToReview: false }
    ]
  },
  {
    id: "docs",
    name: "Documents & Files",
    sizeGb: 27.5,
    formattedSize: "27.5 GB",
    percentage: 7.0,
    colorVar: "var(--cat-docs)",
    hex: "#64748b",
    icon: "FileText",
    itemsCount: 8940,
    rebuildNote: "Large SQL dumps, project archives, design files, and local documentation.",
    subBreakdown: [
      { name: "Old Production SQL Dumps (.sql.gz)", size: "14.2 GB", count: 7, safeToReview: true },
      { name: "PDF Archives & Research Papers", size: "6.8 GB", count: 1240, safeToReview: false },
      { name: "Figma & Sketch offline caches", size: "4.1 GB", count: 320, safeToReview: true },
      { name: "Spreadsheets, markdown & invoices", size: "2.4 GB", count: 7373, safeToReview: false }
    ]
  },
  {
    id: "trash",
    name: "Trash & Bin",
    sizeGb: 13.0,
    formattedSize: "13.0 GB",
    percentage: 3.3,
    colorVar: "var(--cat-trash)",
    hex: "#f43f5e",
    icon: "Trash2",
    itemsCount: 194,
    rebuildNote: "Discarded files sitting in ~/.Trash waiting for manual emptying.",
    subBreakdown: [
      { name: "Deleted files older than 30 days", size: "9.4 GB", count: 142, safeToReview: true },
      { name: "Recent downloads moved to Trash", size: "3.6 GB", count: 52, safeToReview: true }
    ]
  }
];

export const initialSwipeDeck: SwipeItem[] = [
  {
    id: "sw-1",
    name: "4K_Launch_Keynote_Final_v3_PRORES.mov",
    path: "~/Movies/Exports/4K_Launch_Keynote_Final_v3_PRORES.mov",
    sizeGb: 28.4,
    formattedSize: "28.4 GB",
    confidence: "safe",
    category: "Photos & Video",
    colorHex: "#a855f7",
    lastAccessed: "8 months ago",
    reason: "Massive uncompressed ProRes export. Final MP4 version already exists in Cloud.",
    actionNote: "Move to 30-Day Vault"
  },
  {
    id: "sw-2",
    name: "iOS 17.2 Simulator Runtime",
    path: "~/Library/Developer/CoreSimulator/Profiles/Runtimes/iOS_17.2.simruntime",
    sizeGb: 14.8,
    formattedSize: "14.8 GB",
    confidence: "safe",
    category: "Developer Junk",
    colorHex: "#14b8a6",
    lastAccessed: "6 months ago",
    reason: "You are currently building against iOS 18.0. Old simulator runtime is unused.",
    actionNote: "Can be re-downloaded via Xcode Settings at any time"
  },
  {
    id: "sw-3",
    name: "pg_dump_staging_2025-11.sql",
    path: "~/Downloads/Databases/pg_dump_staging_2025-11.sql",
    sizeGb: 11.2,
    formattedSize: "11.2 GB",
    confidence: "probably_safe",
    category: "Documents & Files",
    colorHex: "#64748b",
    lastAccessed: "9 months ago",
    reason: "Temporary staging database dump created for local migration testing.",
    actionNote: "Check if migration was verified before cleaning"
  },
  {
    id: "sw-4",
    name: "Cyberpunk2077_ShaderCache.bin",
    path: "~/Library/Application Support/Steam/steamapps/shadercache/1091500",
    sizeGb: 18.5,
    formattedSize: "18.5 GB",
    confidence: "safe",
    category: "Developer Junk",
    colorHex: "#14b8a6",
    lastAccessed: "11 months ago",
    reason: "Game was uninstalled 4 months ago, but shader cache files remained on disk.",
    actionNote: "Orphaned game cache"
  },
  {
    id: "sw-5",
    name: "Win11_Dev_Snapshot_2025.pvm",
    path: "~/Parallels/Win11_Dev_Snapshot_2025.pvm",
    sizeGb: 32.1,
    formattedSize: "32.1 GB",
    confidence: "probably_safe",
    category: "Applications",
    colorHex: "#3b82f6",
    lastAccessed: "7 months ago",
    reason: "Frozen Windows VM snapshot. Base VM is currently active.",
    actionNote: "Reclaims 32 GB instantly"
  },
  {
    id: "sw-6",
    name: "Slack Service Worker Cache",
    path: "~/Library/Application Support/Slack/Service Worker/CacheStorage",
    sizeGb: 6.4,
    formattedSize: "6.4 GB",
    confidence: "safe",
    category: "Developer Junk",
    colorHex: "#14b8a6",
    lastAccessed: "Yesterday",
    reason: "Bloated webview cache. Slack automatically re-fetches needed messages.",
    actionNote: "Safe to purge"
  },
  {
    id: "sw-7",
    name: "com.apple.TimeMachine.localsnapshots/2026-06-14",
    path: "/System/Volumes/Data/.MobileBackups/Snapshot-2026-06-14",
    sizeGb: 22.8,
    formattedSize: "22.8 GB",
    confidence: "safe",
    category: "System Data",
    colorHex: "#f97316",
    lastAccessed: "84 days ago",
    reason: "Old APFS local snapshot preserved before a minor macOS point update.",
    actionNote: "Safe to delete via tmutil"
  },
  {
    id: "sw-8",
    name: "Adobe Premiere Pro Auto-Save Scratch",
    path: "~/Documents/Adobe/Premiere Pro/24.0/Adobe Premiere Pro Auto-Save",
    sizeGb: 16.7,
    formattedSize: "16.7 GB",
    confidence: "probably_safe",
    category: "Photos & Video",
    colorHex: "#a855f7",
    lastAccessed: "5 months ago",
    reason: "Hundreds of intermediate auto-save project backups from finished client project.",
    actionNote: "Final project file is archived"
  }
];

export const initialVaultItems: VaultItem[] = [
  {
    id: "v-1",
    name: "target/release (rust-engine)",
    originalPath: "~/Projects/orbit/rust-engine/target/release",
    sizeGb: 8.6,
    formattedSize: "8.6 GB",
    cleanedAt: "2 days ago",
    daysRemaining: 28,
    isExpiringSoon: false,
    category: "Developer Junk",
    colorHex: "#14b8a6"
  },
  {
    id: "v-2",
    name: "Docker Dangling Build Cache (dangling=true)",
    originalPath: "/var/lib/docker/overlay2",
    sizeGb: 21.4,
    formattedSize: "21.4 GB",
    cleanedAt: "5 days ago",
    daysRemaining: 25,
    isExpiringSoon: false,
    category: "Developer Junk",
    colorHex: "#14b8a6"
  },
  {
    id: "v-3",
    name: "Screen Recording 2026-07-22 14-30-11.mov",
    originalPath: "~/Desktop/Screen Recording 2026-07-22 14-30-11.mov",
    sizeGb: 4.2,
    formattedSize: "4.2 GB",
    cleanedAt: "28 days ago",
    daysRemaining: 2,
    isExpiringSoon: true,
    category: "Photos & Video",
    colorHex: "#a855f7"
  },
  {
    id: "v-4",
    name: "Xcode DerivedData/AppStoreConnect-gwkqoz",
    originalPath: "~/Library/Developer/Xcode/DerivedData/AppStoreConnect-gwkqoz",
    sizeGb: 14.1,
    formattedSize: "14.1 GB",
    cleanedAt: "29 days ago",
    daysRemaining: 1,
    isExpiringSoon: true,
    category: "Developer Junk",
    colorHex: "#14b8a6"
  },
  {
    id: "v-5",
    name: "Install macOS Sonoma.app (Old installer)",
    originalPath: "/Applications/Install macOS Sonoma.app",
    sizeGb: 12.8,
    formattedSize: "12.8 GB",
    cleanedAt: "12 days ago",
    daysRemaining: 18,
    isExpiringSoon: false,
    category: "Applications",
    colorHex: "#3b82f6"
  },
  {
    id: "v-6",
    name: "staging-dump-archive.tar.gz",
    originalPath: "~/Downloads/staging-dump-archive.tar.gz",
    sizeGb: 6.9,
    formattedSize: "6.9 GB",
    cleanedAt: "19 days ago",
    daysRemaining: 11,
    isExpiringSoon: false,
    category: "Documents & Files",
    colorHex: "#64748b"
  }
];

export const initialDevJunkGroups: DevJunkGroup[] = [
  {
    groupName: "orbit-desktop",
    tool: "SvelteKit & Tauri",
    totalSizeGb: 4.8,
    formattedTotalSize: "4.8 GB",
    items: [
      {
        id: "dj-1",
        name: "node_modules",
        path: "~/Projects/orbit-desktop/node_modules",
        sizeGb: 1.2,
        formattedSize: "1.2 GB",
        lastModified: "2 days ago",
        rebuildNote: "Regenerates cleanly on next 'npm install'",
        isSafe: true
      },
      {
        id: "dj-2",
        name: ".svelte-kit cache",
        path: "~/Projects/orbit-desktop/.svelte-kit",
        sizeGb: 0.4,
        formattedSize: "420 MB",
        lastModified: "Today",
        rebuildNote: "Recompiles in ~1.2s on next vite build",
        isSafe: true
      },
      {
        id: "dj-3",
        name: "src-tauri/target/debug",
        path: "~/Projects/orbit-desktop/src-tauri/target/debug",
        sizeGb: 3.2,
        formattedSize: "3.2 GB",
        lastModified: "3 days ago",
        rebuildNote: "Rust intermediate compilation artifacts",
        isSafe: true
      }
    ]
  },
  {
    groupName: "Docker Virtual Subsystem",
    tool: "Docker Desktop",
    totalSizeGb: 34.6,
    formattedTotalSize: "34.6 GB",
    items: [
      {
        id: "dj-4",
        name: "Dangling Image Layers (<none>:<none>)",
        path: "~/Library/Containers/com.docker.docker/Data/vms/0/data/docker.raw",
        sizeGb: 18.2,
        formattedSize: "18.2 GB",
        lastModified: "1 week ago",
        rebuildNote: "Untagged intermediate build stages",
        isSafe: true
      },
      {
        id: "dj-5",
        name: "Unattached Volume Storage",
        path: "docker volume prune",
        sizeGb: 16.4,
        formattedSize: "16.4 GB",
        lastModified: "3 weeks ago",
        rebuildNote: "Volumes orphaned after container shutdowns",
        isSafe: true
      }
    ]
  },
  {
    groupName: "Xcode Build Workspaces",
    tool: "Apple Xcode",
    totalSizeGb: 28.1,
    formattedTotalSize: "28.1 GB",
    items: [
      {
        id: "dj-6",
        name: "DerivedData (Inactive Projects)",
        path: "~/Library/Developer/Xcode/DerivedData/*",
        sizeGb: 19.5,
        formattedSize: "19.5 GB",
        lastModified: "2 months ago",
        rebuildNote: "Index caches for projects you haven't opened in 60+ days",
        isSafe: true
      },
      {
        id: "dj-7",
        name: "iOS DeviceSupport symbols (iOS 16.4 - 17.0)",
        path: "~/Library/Developer/Xcode/iOS DeviceSupport",
        sizeGb: 8.6,
        formattedSize: "8.6 GB",
        lastModified: "1 year ago",
        rebuildNote: "Symbol files for old iOS versions no longer connected",
        isSafe: true
      }
    ]
  },
  {
    groupName: "fintech-backend",
    tool: "Rust & PostgreSQL",
    totalSizeGb: 15.8,
    formattedTotalSize: "15.8 GB",
    items: [
      {
        id: "dj-8",
        name: "target/ (Full Cargo build tree)",
        path: "~/Work/fintech-backend/target",
        sizeGb: 12.4,
        formattedSize: "12.4 GB",
        lastModified: "3 weeks ago",
        rebuildNote: "Run 'cargo build' to recompile",
        isSafe: true
      },
      {
        id: "dj-9",
        name: "node_modules (admin dashboard)",
        path: "~/Work/fintech-backend/admin/node_modules",
        sizeGb: 3.4,
        formattedSize: "3.4 GB",
        lastModified: "1 month ago",
        rebuildNote: "Regenerates on npm install",
        isSafe: true
      }
    ]
  },
  {
    groupName: "legacy-android-companion",
    tool: "Gradle & Android Studio",
    totalSizeGb: 11.2,
    formattedTotalSize: "11.2 GB",
    items: [
      {
        id: "dj-10",
        name: ".gradle/caches/modules-2",
        path: "~/.gradle/caches/modules-2",
        sizeGb: 8.1,
        formattedSize: "8.1 GB",
        lastModified: "4 months ago",
        rebuildNote: "Cached JARs/AARs; downloads on Gradle sync",
        isSafe: true
      },
      {
        id: "dj-11",
        name: "app/build/intermediates",
        path: "~/Projects/companion/app/build",
        sizeGb: 3.1,
        formattedSize: "3.1 GB",
        lastModified: "4 months ago",
        rebuildNote: "Clean build output directory",
        isSafe: true
      }
    ]
  }
];

export const initialDuplicateClusters: DuplicateCluster[] = [
  {
    id: "dup-1",
    clusterName: "Whistler Snowboarding GoPro Burst",
    category: "Photos & Video",
    totalReclaimableGb: 4.8,
    formattedReclaimable: "4.8 GB Reclaimable",
    items: [
      {
        id: "d1-1",
        name: "GOPR0842_Burst_01.MP4",
        path: "~/Pictures/Snowboard2026/GOPR0842_Burst_01.MP4",
        sizeMb: 1250,
        formattedSize: "1.25 GB",
        resolution: "4K 60fps",
        date: "Jan 14, 2026",
        isSelected: false,
        isBest: true,
        previewColor: "#818cf8",
        type: "video"
      },
      {
        id: "d1-2",
        name: "GOPR0842_Burst_02.MP4",
        path: "~/Pictures/Snowboard2026/GOPR0842_Burst_02.MP4",
        sizeMb: 1240,
        formattedSize: "1.24 GB",
        resolution: "4K 60fps (98% match)",
        date: "Jan 14, 2026",
        isSelected: true,
        isBest: false,
        previewColor: "#6366f1",
        type: "video"
      },
      {
        id: "d1-3",
        name: "GOPR0842_Burst_03.MP4",
        path: "~/Pictures/Snowboard2026/GOPR0842_Burst_03.MP4",
        sizeMb: 1210,
        formattedSize: "1.21 GB",
        resolution: "4K 60fps (96% match)",
        date: "Jan 14, 2026",
        isSelected: true,
        isBest: false,
        previewColor: "#4f46e5",
        type: "video"
      },
      {
        id: "d1-4",
        name: "GOPR0842_Burst_04.MP4",
        path: "~/Pictures/Snowboard2026/GOPR0842_Burst_04.MP4",
        sizeMb: 1100,
        formattedSize: "1.10 GB",
        resolution: "4K 60fps (97% match)",
        date: "Jan 14, 2026",
        isSelected: true,
        isBest: false,
        previewColor: "#4338ca",
        type: "video"
      }
    ]
  },
  {
    id: "dup-2",
    clusterName: "Brand Identity Vector Keynote Exports",
    category: "Documents & Files",
    totalReclaimableGb: 1.6,
    formattedReclaimable: "1.6 GB Reclaimable",
    items: [
      {
        id: "d2-1",
        name: "Orbit_Pitch_Deck_v4_MASTER.pdf",
        path: "~/Documents/Decks/Orbit_Pitch_Deck_v4_MASTER.pdf",
        sizeMb: 540,
        formattedSize: "540 MB",
        resolution: "Vector 300dpi",
        date: "Feb 02, 2026",
        isSelected: false,
        isBest: true,
        previewColor: "#38bdf8",
        type: "document"
      },
      {
        id: "d2-2",
        name: "Orbit_Pitch_Deck_v4_draft3.pdf",
        path: "~/Downloads/Orbit_Pitch_Deck_v4_draft3.pdf",
        sizeMb: 535,
        formattedSize: "535 MB",
        resolution: "Exact duplicate copy",
        date: "Feb 01, 2026",
        isSelected: true,
        isBest: false,
        previewColor: "#0ea5e9",
        type: "document"
      },
      {
        id: "d2-3",
        name: "Orbit_Pitch_Deck_v4_old.pdf",
        path: "~/Desktop/Orbit_Pitch_Deck_v4_old.pdf",
        sizeMb: 525,
        formattedSize: "525 MB",
        resolution: "Exact duplicate copy",
        date: "Jan 30, 2026",
        isSelected: true,
        isBest: false,
        previewColor: "#0284c7",
        type: "document"
      }
    ]
  },
  {
    id: "dup-3",
    clusterName: "Screen Recording UI Bug Repro Bursts",
    category: "Photos & Video",
    totalReclaimableGb: 6.2,
    formattedReclaimable: "6.2 GB Reclaimable",
    items: [
      {
        id: "d3-1",
        name: "Screen Recording 2026-08-11 at 16.42.01.mov",
        path: "~/Desktop/Screen Recording 2026-08-11 at 16.42.01.mov",
        sizeMb: 3100,
        formattedSize: "3.1 GB",
        resolution: "Retina 60fps",
        date: "Aug 11, 2026",
        isSelected: false,
        isBest: true,
        previewColor: "#f43f5e",
        type: "video"
      },
      {
        id: "d3-2",
        name: "Screen Recording 2026-08-11 at 16.45.19.mov",
        path: "~/Desktop/Screen Recording 2026-08-11 at 16.45.19.mov",
        sizeMb: 3100,
        formattedSize: "3.1 GB",
        resolution: "Retina 60fps (99% match)",
        date: "Aug 11, 2026",
        isSelected: true,
        isBest: false,
        previewColor: "#e11d48",
        type: "video"
      }
    ]
  }
];

export const initialChatHistory: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "user",
    timestamp: "10:14 AM",
    text: "What is taking up the most space on my drive right now?"
  },
  {
    id: "msg-2",
    sender: "assistant",
    timestamp: "10:14 AM",
    text: "Your drive is **77% full (394.2 GB used of 512 GB)**. The largest category by far is **Developer Junk (112.5 GB)**, followed by **Photos & Video (94.6 GB)** and **System Data (78.4 GB)**.\n\nInside Developer Junk, you have 74 separate `node_modules` directories totaling 44.2 GB, and 24.6 GB of dangling Docker containers.",
    quickActions: [
      "Show all node_modules older than 3 months",
      "Explain System Data growth",
      "Clean safe developer caches"
    ]
  },
  {
    id: "msg-3",
    sender: "user",
    timestamp: "10:16 AM",
    text: "Find videos I haven't opened in over 6 months."
  },
  {
    id: "msg-4",
    sender: "assistant",
    timestamp: "10:16 AM",
    text: "I scanned your local metadata index and found **5 large video files (totaling 66.8 GB)** that haven't been accessed in at least 180 days:",
    results: [
      {
        title: "4K_Launch_Keynote_Final_v3_PRORES.mov",
        path: "~/Movies/Exports",
        size: "28.4 GB",
        safety: "safe"
      },
      {
        title: "OBS_Studio_Session_2025-10-18.mkv",
        path: "~/Movies/Captures",
        size: "18.2 GB",
        safety: "safe"
      },
      {
        title: "Client_Commercial_Grading_Pass1.mov",
        path: "~/Projects/Archive",
        size: "12.8 GB",
        safety: "probably_safe"
      },
      {
        title: "Conference_Keynote_Raw_AudioVideo.mp4",
        path: "~/Downloads/Events",
        size: "7.4 GB",
        safety: "safe"
      }
    ],
    quickActions: [
      "Send all 4 to Safety Vault",
      "Open in Swipe Deck",
      "Compress to HEVC"
    ]
  }
];

export const initialTimelineSnapshots: TimelineSnapshot[] = [
  {
    id: "t-1",
    label: "6 Months Ago",
    date: "March 2026",
    totalUsedGb: 218.4,
    formattedUsed: "218.4 GB",
    categories: { photos: 62.0, system: 41.2, dev: 48.0, apps: 45.0, docs: 18.2, trash: 4.0 }
  },
  {
    id: "t-2",
    label: "4 Months Ago",
    date: "May 2026",
    totalUsedGb: 268.9,
    formattedUsed: "268.9 GB",
    categories: { photos: 71.0, system: 48.5, dev: 68.2, apps: 54.0, docs: 21.0, trash: 6.2 },
    spikeEvent: {
      deltaGb: 50.5,
      title: "+50.5 GB: Xcode 16 & Simulator SDKs",
      description: "Massive runtime installer and SDK symbols loaded during WWDC beta kickoff.",
      badge: "App SDK Spike"
    }
  },
  {
    id: "t-3",
    label: "2 Months Ago",
    date: "July 2026",
    totalUsedGb: 312.4,
    formattedUsed: "312.4 GB",
    categories: { photos: 82.4, system: 56.0, dev: 86.4, apps: 59.0, docs: 22.8, trash: 5.8 }
  },
  {
    id: "t-4",
    label: "1 Month Ago",
    date: "August 2026",
    totalUsedGb: 348.1,
    formattedUsed: "348.1 GB",
    categories: { photos: 88.0, system: 64.2, dev: 98.5, apps: 64.0, docs: 25.4, trash: 8.0 },
    spikeEvent: {
      deltaGb: 35.7,
      title: "+35.7 GB: Docker Machine Learning Container",
      description: "Pulled local Ollama 8B GGUF weights and PyTorch development environment.",
      badge: "Docker ML Spike"
    }
  },
  {
    id: "t-5",
    label: "Last Week",
    date: "Aug 30, 2026",
    totalUsedGb: 380.0,
    formattedUsed: "380.0 GB",
    categories: { photos: 92.0, system: 74.0, dev: 108.0, apps: 67.0, docs: 26.8, trash: 12.2 }
  },
  {
    id: "t-6",
    label: "Today",
    date: "Sep 06, 2026",
    totalUsedGb: 394.2,
    formattedUsed: "394.2 GB",
    categories: { photos: 94.6, system: 78.4, dev: 112.5, apps: 68.2, docs: 27.5, trash: 13.0 },
    spikeEvent: {
      deltaGb: 14.2,
      title: "+14.2 GB: System Data Overnight APFS Snapshot",
      description: "macOS created an automatic pre-patch snapshot before background system maintenance.",
      badge: "System Data Growth"
    }
  }
];

export const initialInsightAlerts: InsightAlert[] = [
  {
    id: "alt-1",
    type: "forecast",
    severity: "high",
    title: "Critical Drive Forecast",
    headline: "At your current rate, your drive will be 100% full in 19 days.",
    explanation: "You have accumulated an average of +2.2 GB/day over the last 30 days, primarily from Docker build caches and screen recordings. 117.8 GB remaining.",
    actionText: "Open Swipe Triage",
    actionRoute: "/triage",
    impactGb: 48.5,
    formattedImpact: "Reclaim ~48.5 GB"
  },
  {
    id: "alt-2",
    type: "diff",
    severity: "medium",
    title: "System Data Overnight Diff",
    headline: "System Data suddenly grew +14.2 GB overnight.",
    explanation: "Orbit detected an APFS local snapshot created during yesterday's Time Machine sync pause. It is safe to flush.",
    actionText: "Inspect System Data",
    actionRoute: "/categories?cat=system",
    impactGb: 14.2,
    formattedImpact: "Flush 14.2 GB"
  },
  {
    id: "alt-3",
    type: "recommendation",
    severity: "medium",
    title: "Dormant Projects Detected",
    headline: "38 inactive projects contain 44.2 GB of node_modules.",
    explanation: "These repos have not had a git commit or file touch in over 90 days. Deleting their node_modules saves space without losing any source code.",
    actionText: "Wipe Dormant Dev Junk",
    actionRoute: "/devjunk",
    impactGb: 44.2,
    formattedImpact: "Wipe 44.2 GB"
  },
  {
    id: "alt-4",
    type: "tip",
    severity: "low",
    title: "Duplicate Burst Cleanup",
    headline: "Found 6 near-duplicate clusters from your recent photo shoots.",
    explanation: "Quickly keep the single best shot in each burst and purge the blurry/secondary takes.",
    actionText: "Review Duplicates",
    actionRoute: "/duplicates",
    impactGb: 12.6,
    formattedImpact: "Save 12.6 GB"
  }
];

export const initialStorageWrapped: StorageWrappedData = {
  personalityTitle: "The Relentless Stash Goblin",
  personalityTagline: "You build fast, you hoard caches, and you refuse to empty your trash.",
  avatarEmoji: "🛸",
  roastParagraph: "You have 74 separate node_modules folders sitting on this SSD like haunted apartments nobody has visited since 2024. You also have 28 GB of ProRes video from a single keynote you promised yourself you'd 'edit this weekend,' and 4,218 screenshots named 'Screenshot 2026-07-14 at 2.41.09 AM'. It's time to let go.",
  primaryMetric: {
    value: "112.5 GB",
    label: "Developer Hoarding Index",
    context: "Top 2% of most cluttered developers scanned by Orbit"
  },
  highlightStats: [
    {
      label: "Abandoned node_modules",
      value: "74 folders",
      note: "Oldest from August 2024",
      icon: "FolderGit2"
    },
    {
      label: "Unopened Screenshots",
      value: "4,218 files",
      note: "Totaling 14.8 GB on Desktop",
      icon: "Camera"
    },
    {
      label: "Days Since Empty Trash",
      value: "84 days",
      note: "13.0 GB of ghosts in ~/.Trash",
      icon: "Trash2"
    },
    {
      label: "Dangling Docker Containers",
      value: "34.6 GB",
      note: "6 ghost volumes alive",
      icon: "Container"
    }
  ],
  habits: [
    "Takes 12 near-identical screenshots of the same Figma frame",
    "Runs 'npm i' instead of deleting old repositories",
    "Keeps 3 different iOS Simulator versions just in case",
    "Believes System Data will magically clean itself"
  ]
};

export const initialSettings = {
  fullDiskAccessGranted: true,
  onDeviceAiEnabled: true,
  aiModel: "Llama-3.2-3B-Instruct-Q4_K_M (Metal / CoreML accelerated)",
  notifications: {
    lowSpaceAlert: true,
    weeklySpikeDigest: true,
    overnightGrowthWarning: true,
    vaultExpirationReminder: true
  },
  theme: "dark" as "dark" | "light" | "system"
};
