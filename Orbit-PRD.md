# Product Requirements Document — "Orbit" (working title)
### Version 1 Scope — AI-native storage intelligence for macOS and Windows

**Version:** 1.0 (scoped for build)
**Status:** Ready for UI-first build
**Platform priority:** macOS first (production accuracy bar), Windows built on the same shared core

---

## 1. Version 1 Scope — what's in, what's deferred

**In V1 (11 features):**
Core scan engine · Orbital galaxy view · Swipe triage deck · Dev junk detector · 30-day safety vault · Menu bar/taskbar widget · Duplicate & near-duplicate detection · Talk to your storage (on-device AI chat) · Diff & predictive alerts · Timeline scrubber · Storage Wrapped / Roast My Storage

**Deferred, not needed right now (see Section 17 for detail):**
OS Update Space Guarantee · Cloud Plan Downgrade Advisor · Trip Mode · Cross-Device Galaxy · Cross-Platform Cleanup Rule Sync · Family/Shared-Account Storage Attribution · Storage Firewall · Crowdsourced Safe-to-Delete Database · Digital Estate Mode

**Build sequencing:** V1 is being built **UI-first**. Step 1 is every screen and window below, fully designed and interactive against mock/sample data, with no real disk scanning or AI wired in yet. Step 2 (after UI sign-off) wires in the actual Rust core, SQLite index, and on-device model. This document covers the full V1 product spec; Section 6.1 and the accompanying build prompt cover the UI-first step specifically.

---

## 2. Vision

Orbit is a storage intelligence app for Mac and Windows that replaces the old "nested boxes" treemap with a living, spatial view of your drive, and adds an on-device AI you can talk to about your files. Privacy-first: everything runs locally.

---

## 3. Problem Statement

- **macOS "System Data" is an opaque black box** — caches, snapshots, Mail downloads, and old backups get lumped into one uninspectable bucket.
- **Developer bloat is universal and cross-platform** — `node_modules`, Xcode `DerivedData`, Docker images, build caches — every developer has this on both machines, and no single tool cleans both.
- **Fear of deleting is the real adoption blocker** — most people under-use cleanup tools because they're scared of breaking something.
- **Duplicate photos/videos pile up silently** — existing dedup tools are clunky or inaccurate on near-duplicates (bursts, screenshots).
- **Nobody explains change over time** — no tool tells you why your drive suddenly shrank, or forecasts when you'll run out.
- **Every competitor looks the same** — the 20-year-old treemap ("cushion map") style is a common complaint; nobody has redesigned the core visualization.

---

## 4. Goals and Non-Goals

**Goals:**
1. Ship a Mac UI where every screen for the V1 feature set exists, is navigable, and is visually distinctive — before any backend logic is wired in.
2. Establish the orbital galaxy view and swipe-triage deck as the primary interaction model, replacing the treemap entirely.
3. Design the AI chat, predictive alerts, and timeline scrubber as first-class screens, not afterthoughts bolted onto the dashboard.

**Non-Goals for V1:** mobile companion apps, NAS/network drive scanning, Linux support, enterprise/MDM management, and all 9 deferred features listed in Section 1.

---

## 5. Target Users

- **Developers / power users** — biggest pain from dev-tool bloat, most likely to pay immediately.
- **General "my drive is full" users** — triggered by a full-drive warning.
- **Digital hoarders / gen-z creators** — primary audience for Storage Wrapped / Roast My Storage.

---

## 6. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Core engine (shared logic) | Rust, compiled natively for macOS and Windows | No GC pauses on full-disk scans, one codebase shared across both platforms. |
| App shell / packaging | Tauri 2.0 | Small binaries, one UI codebase for both OSes, built-in signed auto-updater. |
| Frontend UI | Svelte (SvelteKit) + Canvas/WebGL for the galaxy view and swipe deck | Smallest/fastest major framework — needed for smooth 60fps orbital animation and card-swipe physics. |
| macOS native shim | Swift (via FFI) | Full Disk Access (TCC) prompt, System Data categorization, Menu Bar Extra, notarization. |
| Windows native shim | C++/C# (via FFI) | NTFS USN Journal access for near-instant scans, Administrator elevation, notification integration. |
| Local database | SQLite (via `rusqlite`) | Metadata index, snapshot history for the timeline scrubber, vault metadata — fully local. |
| On-device AI | llama.cpp running a quantized 3–4B instruct model (Llama 3.2 3B Instruct or Phi-3.5-mini, 4-bit GGUF) | Metal/Vulkan acceleration, fully offline, tool-calls into the local SQLite index only. |
| Duplicate detection | Rust perceptual-hashing crates | Runs locally, cached in SQLite. |
| Auto-update | Tauri's built-in signed updater | One mechanism for both platforms. |
| Code signing/distribution | Apple Developer ID + notarization (direct download); Windows EV code-signing cert | Full Disk Access / USN Journal access aren't compatible with Store sandboxing. |

### 6.1 UI-first build note
For this step, scaffold the Tauri + SvelteKit shell and every screen in Section 9, wired to **mock JSON data**, with no Rust core, no SQLite, and no llama.cpp integration yet. The AI chat panel should show realistic pre-written mock responses to a fixed set of sample prompts, not a real model call.

---

## 7. Architecture Overview (target, post UI-first step)

```
Svelte UI (Tauri webview) -- Tauri IPC --> Rust Core Engine (scanning, diffing, hashing, snapshots, AI orchestration)
                                                |                    |
                                       macOS shim (Swift)   Windows shim (C++/C#)
                                                |
                              SQLite (local index, snapshots, vault metadata)
                                                |
                        llama.cpp on-device model (tool-calls into SQLite only)
```

---

## 8. V1 Feature List

| # | Feature | Problem it solves | Tier |
|---|---|---|---|
| 1 | Accurate core scan engine | Trust — numbers must match Finder/Explorer | Free |
| 2 | Orbital galaxy view | Replaces cluttered treemap with one clear spatial view | Free |
| 3 | Swipe triage deck | Fast, low-friction cleanup decisions on big items | Free |
| 4 | Dev junk detector | Universal, cross-platform, undermarketed pain | Free |
| 5 | 30-day undo / safety vault | Removes the fear that stops people cleaning aggressively | Freemium (7-day free / 30-day paid) |
| 6 | Menu bar / taskbar widget | Passive awareness without opening the app | Free |
| 7 | Duplicate & near-duplicate detection | Classic problem, rarely done well | Paid |
| 8 | Talk to your storage (on-device AI chat) | Natural-language control, ties the product together | Paid |
| 9 | Diff & predictive alerts | Nobody forecasts or explains change over time | Paid |
| 10 | Timeline scrubber | Unique, best demo moment | Paid |
| 11 | Storage Wrapped / Roast My Storage | Viral growth loop | Free (growth feature) |

---

## 9. Screen / Window Inventory

1. **Onboarding / Permission Flow** — welcome screen, plain-language explanation of Full Disk Access, "Grant Access" action, granted-confirmation state.
2. **Main Dashboard (Orbital Galaxy View)** — center hub ring (% used), category planets in orbit, persistent chat bar pinned at the bottom.
3. **Category Drill-down** — zoom-transition view when a planet is tapped, sub-breakdown of that category, back action, "ask AI about this" shortcut.
4. **Swipe Triage Deck** — full-screen card stack, keep/clean actions, running "reclaimed so far" counter, progress indicator.
5. **Safety Vault** — list of recently cleaned items with countdown timers, restore action per item, empty state, "expiring soon" state.
6. **Dev Junk Scanner Results** — grouped list of detected caches (`node_modules`, `DerivedData`, Docker, build dirs) by project, size, last-modified, one-tap clean.
7. **Duplicate & Near-Duplicate Finder** — gallery/grid of clustered similar photos/videos, "keep best, clean rest" affordance, reclaimable-size estimate.
8. **AI Chat Panel** — expands from the persistent bottom bar into a full panel; message history, suggested prompt chips, streaming-response state.
9. **Timeline Scrubber** — historical drive view with a draggable horizontal slider, animated per-category size changes, annotated growth spikes.
10. **Predictive Alerts / Insights Feed** — notification-style feed: "full in 12 days," "System Data grew 8GB overnight — here's why," dismissible/actionable cards.
11. **Storage Wrapped / Roast My Storage** — generated shareable card: stats summary, roast text, export/share action, "storage personality" result.
12. **Menu Bar / Taskbar Mini Widget** — small always-on-top popover: mini ring, quick stats, click-through to the main dashboard.
13. **Settings** — permission status, vault retention preference, AI toggle, notification preferences, theme.

---

## 10. Step-by-Step V1 Feature Specs

### 10.1 Core scan engine
Walk the full startup volume; categorize into Photos, Apps, Documents, System Data, Mail, Messages, Trash, Developer. **Acceptance:** total used space within 0.5% of System Settings → Storage; full scan of a 512GB SSD in ≤45s; incremental re-scans in <3s.

### 10.2 Onboarding / permission flow
Explain Full Disk Access in plain language before requesting it; deep-link to the correct System Settings pane; show a clear granted/denied state.

### 10.3 Orbital galaxy view
Center hub with percentage ring and used/free numbers; category planets sized proportionally, positioned around the hub; tapping a planet triggers a zoom-transition drill-down, not a new window.

### 10.4 Swipe triage deck
Surface the largest files/folders ordered by confidence (safest first); two actions only — keep, clean; cleaned items go to the vault, not straight to permanent deletion; visible running reclaimed counter.

### 10.5 Safety vault
Every deletion lands here first; free tier 7-day retention, paid 30-day; one-tap full restore including folder structure.

### 10.6 Dev junk detector
Recognize `node_modules`, Xcode `DerivedData`, Docker `.raw`/`.vhdx`, `.next`, `target/`, Gradle/Android build caches; show a plain-English rebuild-cost note per item.

### 10.7 Menu bar / taskbar widget
Small always-visible icon reflecting current usage, color shifts as the drive fills; one click opens the main dashboard.

### 10.8 Duplicate & near-duplicate detection
Perceptual-hash photos and videos; surface near-duplicate bursts and screenshot clusters for one-tap batch cleanup with a reclaimable-size estimate shown up front.

### 10.9 Talk to your storage (AI chat)
Persistent chat bar on the dashboard, expandable to a full panel; natural-language queries resolve to structured lookups against the local index (metadata only, never file contents); suggested-prompt chips for common queries.

### 10.10 Diff & predictive alerts
Automatic periodic snapshots; surface "why did I lose X GB" explanations and "you'll be full in N days" forecasts as dismissible, actionable cards in an insights feed.

### 10.11 Timeline scrubber
Draggable horizontal slider under the galaxy view; scrubbing animates category sizes back through history using stored snapshots; annotate spikes with what caused them.

### 10.12 Storage Wrapped / Roast My Storage
Generates a shareable summary card from current stats and history — playful stats, a roast, and a "storage personality" result — with a one-tap export/share action.

---

## 11. Non-Functional Requirements

- **Accuracy:** ≥99.5% match against native OS storage reporting.
- **Performance:** full scan ≤45s (Mac, 512GB SSD) / ≤20s (Windows, NTFS via USN Journal); incremental scans <3s.
- **Privacy:** no file contents ever leave the device; AI model runs fully on-device.
- **Reliability:** the safety vault must survive app crashes and updates without data loss — the most heavily tested code path in the app.

---

## 12. Permissions & Platform Constraints

- **macOS:** Full Disk Access (TCC); likely runs outside the App Sandbox — direct-download distribution with Developer ID notarization, not Mac App Store, for the full-featured version.
- **Windows:** Administrator elevation for deep system folders; EV code-signing certificate recommended early to avoid SmartScreen friction.
- **Fallback:** USN Journal scanning only works on NTFS; exFAT/FAT32 drives need a slower fallback traversal.

---

## 13. Monetization (V1)

- **Free:** core scan, galaxy view, swipe deck, dev junk detector, menu bar widget, 7-day vault, Storage Wrapped/Roast My Storage.
- **Paid (subscription):** 30-day vault, duplicate detection, AI chat, predictive alerts, timeline scrubber.

---

## 14. Success Metrics

- Storage-accuracy match rate vs. native OS reporting (target ≥99.5%)
- Time-to-first-cleanup from install (target under 5 minutes)
- % of users who grant Full Disk Access on first run
- 7-day retention and free-to-paid conversion rate
- Viral coefficient from Storage Wrapped / Roast My Storage shares

---

## 15. Risks

- Apple may change private storage-categorization behavior between OS versions — mitigate with independently-computed categories.
- Aggressive disk-scanning may trigger Windows Defender/SmartScreen flags — mitigate with EV signing.
- On-device LLM performance on older/low-RAM machines — plan a rule-based fallback mode.
- Full Disk Access friction is a known drop-off point — onboarding needs real design attention.

---

## 16. Out of Scope (V1)

Mobile companion apps, NAS/network drive scanning, Linux support, enterprise/MDM deployment, Mac App Store distribution (full-featured version).

---

## 17. Deferred to Post-V1

OS Update Space Guarantee · Cloud Plan Downgrade Advisor · Trip Mode · Cross-Device Galaxy · Cross-Platform Cleanup Rule Sync · Family/Shared-Account Storage Attribution · Storage Firewall · Crowdsourced Safe-to-Delete Database · Digital Estate Mode — all remain in the product vision, just not in this build.

---

## 18. Open Questions

- Final pricing model: pure subscription vs. one-time + AI add-on?
- Final on-device model choice — pending real hardware benchmarking on Apple Silicon and mid-range Windows GPUs.
