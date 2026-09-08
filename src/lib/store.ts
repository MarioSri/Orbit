import { writable, derived } from 'svelte/store';
import {
  initialStorageStats,
  initialCategories,
  initialSwipeDeck,
  initialVaultItems,
  initialDevJunkGroups,
  initialDuplicateClusters,
  initialChatHistory,
  initialTimelineSnapshots,
  initialInsightAlerts,
  initialStorageWrapped,
  type StorageStats,
  type StorageCategory,
  type SwipeItem,
  type VaultItem,
  type DevJunkGroup,
  type DuplicateCluster,
  type ChatMessage,
  type TimelineSnapshot,
  type InsightAlert
} from './mockData';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  timestamp: number;
}

// Global Stores
export const storageStats = writable<StorageStats>(initialStorageStats);
export const categories = writable<StorageCategory[]>(initialCategories);
export const swipeDeck = writable<SwipeItem[]>(initialSwipeDeck);
export const reclaimedSoFarGb = writable<number>(0);
export const vaultItems = writable<VaultItem[]>(initialVaultItems);
export const devJunkGroups = writable<DevJunkGroup[]>(initialDevJunkGroups);
export const duplicateClusters = writable<DuplicateCluster[]>(initialDuplicateClusters);
export const chatHistory = writable<ChatMessage[]>(initialChatHistory);
export const activeTimelineIndex = writable<number>(initialTimelineSnapshots.length - 1);
export const insightAlerts = writable<InsightAlert[]>(initialInsightAlerts);
export const currentTheme = writable<'dark' | 'light'>('dark');
export const selectedCategory = writable<string>('dev');
export const toasts = writable<ToastMessage[]>([]);
export const isStreamingAi = writable<boolean>(false);
export const isScanning = writable<boolean>(false);
export const showMiniWidgetPreview = writable<boolean>(false);

// Toast helper
export function addToast(title: string, message?: string, type: 'success' | 'warning' | 'danger' | 'info' = 'success') {
  const id = Math.random().toString(36).substring(2, 9);
  toasts.update(current => [...current, { id, title, message, type, timestamp: Date.now() }]);
  setTimeout(() => {
    toasts.update(current => current.filter(t => t.id !== id));
  }, 3800);
}

export function dismissToast(id: string) {
  toasts.update(current => current.filter(t => t.id !== id));
}

// Action: Clean a swipe card
export function cleanSwipeItem(item: SwipeItem) {
  swipeDeck.update(deck => deck.filter(i => i.id !== item.id));
  reclaimedSoFarGb.update(n => +(n + item.sizeGb).toFixed(1));
  storageStats.update(s => ({
    ...s,
    usedGb: +(s.usedGb - item.sizeGb).toFixed(1),
    freeGb: +(s.freeGb + item.sizeGb).toFixed(1),
    usedPercent: +(((s.usedGb - item.sizeGb) / s.totalGb) * 100).toFixed(1)
  }));

  // Add to vault
  const vaultEntry: VaultItem = {
    id: 'v-' + Math.random().toString(36).substring(2, 7),
    name: item.name,
    originalPath: item.path,
    sizeGb: item.sizeGb,
    formattedSize: item.formattedSize,
    cleanedAt: 'Just now',
    daysRemaining: 30,
    isExpiringSoon: false,
    category: item.category,
    colorHex: item.colorHex
  };
  vaultItems.update(v => [vaultEntry, ...v]);
  addToast(`Moved to 30-Day Vault`, `${item.name} (${item.formattedSize}) protected in vault`, 'success');
}

// Action: Keep a swipe card
export function keepSwipeItem(item: SwipeItem) {
  swipeDeck.update(deck => deck.filter(i => i.id !== item.id));
  addToast(`Kept on disk`, `${item.name} preserved`, 'info');
}

// Action: Restore vault item
export function restoreVaultItem(id: string) {
  let restoredItem: VaultItem | undefined;
  vaultItems.update(items => {
    restoredItem = items.find(i => i.id === id);
    return items.filter(i => i.id !== id);
  });

  if (restoredItem) {
    storageStats.update(s => ({
      ...s,
      usedGb: +(s.usedGb + (restoredItem?.sizeGb || 0)).toFixed(1),
      freeGb: +(s.freeGb - (restoredItem?.sizeGb || 0)).toFixed(1),
      usedPercent: +(((s.usedGb + (restoredItem?.sizeGb || 0)) / s.totalGb) * 100).toFixed(1)
    }));
    addToast('Restored successfully', `${restoredItem.name} restored to original location`, 'success');
  }
}

// Action: Clean single dev junk item
export function cleanDevJunkItem(groupIdx: number, itemId: string) {
  let cleanedSize = 0;
  let itemName = '';
  devJunkGroups.update(groups => {
    return groups.map((grp, gIdx) => {
      if (gIdx === groupIdx) {
        const item = grp.items.find(i => i.id === itemId);
        if (item) {
          cleanedSize = item.sizeGb;
          itemName = item.name;
        }
        const updatedItems = grp.items.filter(i => i.id !== itemId);
        const newTotal = updatedItems.reduce((acc, i) => acc + i.sizeGb, 0);
        return {
          ...grp,
          items: updatedItems,
          totalSizeGb: +newTotal.toFixed(1),
          formattedTotalSize: `${newTotal.toFixed(1)} GB`
        };
      }
      return grp;
    });
  });

  if (cleanedSize > 0) {
    storageStats.update(s => ({
      ...s,
      usedGb: +(s.usedGb - cleanedSize).toFixed(1),
      freeGb: +(s.freeGb + cleanedSize).toFixed(1)
    }));
    addToast('Cleaned dev cache', `${itemName} wiped (+${cleanedSize.toFixed(1)} GB free)`, 'success');
  }
}

// Action: Clean all safe dev junk items
export function cleanAllSafeDevJunk() {
  let totalSaved = 0;
  devJunkGroups.update(groups => {
    return groups.map(grp => {
      const removed = grp.items.filter(i => i.isSafe);
      totalSaved += removed.reduce((a, b) => a + b.sizeGb, 0);
      const remaining = grp.items.filter(i => !i.isSafe);
      const newTotal = remaining.reduce((a, b) => a + b.sizeGb, 0);
      return {
        ...grp,
        items: remaining,
        totalSizeGb: +newTotal.toFixed(1),
        formattedTotalSize: `${newTotal.toFixed(1)} GB`
      };
    });
  });

  storageStats.update(s => ({
    ...s,
    usedGb: +(s.usedGb - totalSaved).toFixed(1),
    freeGb: +(s.freeGb + totalSaved).toFixed(1)
  }));
  addToast('Purged all safe developer caches', `Reclaimed ${totalSaved.toFixed(1)} GB across all projects`, 'success');
}

// Action: Clean duplicate cluster
export function cleanDuplicateCluster(clusterId: string) {
  let reclaimedGb = 0;
  duplicateClusters.update(clusters => {
    const cluster = clusters.find(c => c.id === clusterId);
    if (cluster) {
      reclaimedGb = cluster.totalReclaimableGb;
    }
    return clusters.filter(c => c.id !== clusterId);
  });

  if (reclaimedGb > 0) {
    storageStats.update(s => ({
      ...s,
      usedGb: +(s.usedGb - reclaimedGb).toFixed(1),
      freeGb: +(s.freeGb + reclaimedGb).toFixed(1)
    }));
    addToast('Near-duplicates cleaned', `Kept best shot, wiped rest (+${reclaimedGb.toFixed(1)} GB)`, 'success');
  }
}

// Action: Dismiss insight alert
export function dismissInsightAlert(id: string) {
  insightAlerts.update(alerts => alerts.filter(a => a.id !== id));
  addToast('Insight dismissed', 'Alert removed from feed', 'info');
}

// Send chat message with simulated streaming response
export function sendChatMessage(promptText: string) {
  if (!promptText.trim()) return;

  const userMsg: ChatMessage = {
    id: 'user-' + Date.now(),
    sender: 'user',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: promptText
  };

  chatHistory.update(list => [...list, userMsg]);
  isStreamingAi.set(true);

  // Generate intelligent mock response based on prompt
  let responseText = `I analyzed your drive's local SQLite index for "${promptText}".`;
  let results: ChatMessage['results'] = undefined;
  let actions = ["Recheck after next build", "View in Timeline", "Open Storage Wrapped"];

  const lower = promptText.toLowerCase();
  if (lower.includes('node_modules') || lower.includes('dev') || lower.includes('docker')) {
    responseText = `Found **74 node_modules** folders totaling **44.2 GB**, plus **34.6 GB** of dangling Docker containers. You can safely purge caches from projects inactive for over 60 days without losing any code.`;
    results = [
      { title: "fintech-backend/node_modules", path: "~/Work/fintech-backend", size: "3.4 GB", safety: "safe" },
      { title: "legacy-companion/.gradle", path: "~/.gradle/caches", size: "8.1 GB", safety: "safe" },
      { title: "Docker dangling virtual disk", path: "~/Library/Containers/docker", size: "18.2 GB", safety: "safe" }
    ];
    actions = ["Wipe safe dev junk", "Review in Dev Junk Scanner", "Keep active projects"];
  } else if (lower.includes('system data') || lower.includes('apfs') || lower.includes('snapshot')) {
    responseText = `Your System Data is currently **78.4 GB**. The main driver is **31.2 GB of APFS local snapshots** created before recent minor OS point updates. With Full Disk Access granted, Orbit can safely flush expired snapshots.`;
    results = [
      { title: "APFS Snapshot 2026-08-30", path: "/.MobileBackups", size: "16.4 GB", safety: "safe" },
      { title: "Time Machine Staged Packets", path: "/.TimeMachine", size: "14.8 GB", safety: "safe" }
    ];
    actions = ["Flush local APFS snapshots", "Run System Deep Scan", "Ignore"];
  } else if (lower.includes('photo') || lower.includes('video') || lower.includes('duplicate')) {
    responseText = `Identified **14.8 GB of screen recordings** and **4.8 GB of near-duplicate GoPro bursts** from your recent Whistler trip.`;
    results = [
      { title: "GOPR0842_Burst (3 duplicate takes)", path: "~/Pictures/Snowboard2026", size: "3.55 GB", safety: "safe" },
      { title: "Screen Recording 2026-08-11 UI Bug", path: "~/Desktop", size: "3.1 GB", safety: "safe" }
    ];
    actions = ["Open Duplicate Finder", "Review GoPro Bursts", "Compress to HEVC"];
  } else {
    responseText = `Here is what Orbit found across your storage metadata:\n- **Free space:** 117.8 GB (healthy buffer)\n- **Quick reclaim potential:** ~68.4 GB with zero risk to personal documents or git history.\n- **Recommended next step:** Triage the 8 largest files in your Swipe Deck.`;
    actions = ["Launch Swipe Triage", "Inspect Safety Vault", "Check Forecast"];
  }

  // Streaming effect
  const assistantMsgId = 'assistant-' + Date.now();
  const fullText = responseText;
  let currentIdx = 0;

  const assistantMsg: ChatMessage = {
    id: assistantMsgId,
    sender: 'assistant',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: '',
    results,
    quickActions: actions
  };

  chatHistory.update(list => [...list, assistantMsg]);

  const streamInterval = setInterval(() => {
    currentIdx += 3;
    if (currentIdx >= fullText.length) {
      currentIdx = fullText.length;
      clearInterval(streamInterval);
      isStreamingAi.set(false);
    }
    chatHistory.update(list =>
      list.map(m => (m.id === assistantMsgId ? { ...m, text: fullText.slice(0, currentIdx) } : m))
    );
  }, 18);
}
