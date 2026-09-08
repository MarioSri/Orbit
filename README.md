<div align="center">

# 🪐 Orbit

**Next-Generation AI-Native Storage Intelligence & Disk Visualization**

[![Svelte 5](https://img.shields.io/badge/Svelte-5-FF3E00?style=flat-square&logo=svelte&logoColor=white)](https://svelte.dev)
[![Tauri 2](https://img.shields.io/badge/Tauri-2.0-24C8D8?style=flat-square&logo=tauri&logoColor=white)](https://tauri.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind / CSS Tokens](https://img.shields.io/badge/Styling-Custom%20Tokens-06B6D4?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

*Say goodbye to 20-year-old cluttered treemaps. Orbit provides a living, spatial galaxy view of your disk with on-device AI intelligence, swipe-triage decks, developer junk purgers, and a 30-day safety vault.*

---

</div>

## 🚀 Key Features

- 🌌 **Orbital Galaxy Visualization** — Dynamic solar system model where planets represent directories and moons represent files, scaled by size and color-coded by category.
- 💬 **Local AI Storage Assistant** — Conversational file queries, growth explanations, and cleanup recommendations with 100% on-device privacy.
- 🃏 **Swipe Triage Deck** — Rapid cleanup decisions on large files using an intuitive card deck with instant undo.
- 🛠️ **Developer Junk Detector** — Detect and purge bloated `node_modules`, `target`, `.venv`, Xcode `DerivedData`, Docker images, and stale build caches.
- 🛡️ **30-Day Safety Vault** — Soft deletion stage with one-click restoration, auto-expiration, and zero fear of accidental deletion.
- 🔍 **Duplicate & Near-Duplicate Finder** — Perceptual image hashing, exact duplicate grouping, and smart keep-newest/keep-highest-res recommendations.
- ⏳ **Timeline Scrubber & Growth Forecasts** — Historical disk snapshots, sudden spike diagnostics, and predictive runout estimations.
- 📊 **Storage Wrapped & "Roast My Storage"** — Shareable visual audits highlighting digital hoarding habits and hoarding archetypes.
- 🪟 **Menu Bar & Taskbar Compact Widget** — Lightweight real-time disk gauge, quick purge triggers, and disk health metrics.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend UI** | SvelteKit + Svelte 5 (Runes) | Ultra-lightweight, 60fps animations, responsive desktop layout |
| **Desktop Shell** | Tauri 2.0 (Rust) | Native performance, compact bundle size, secure IPC |
| **Styling** | Custom Design Tokens & Glassmorphism | Dark aesthetic with vibrant accent hues and fluid micro-interactions |
| **Icons** | Lucide Svelte | Sleek, consistent iconography |
| **Cloud / Auth** | Supabase JS | Syncing Pro status and optional encrypted preference backups |

---

## 📁 Project Structure

```
Orbit/
├── src/
│   ├── lib/
│   │   ├── components/      # UI components (AppShell, Button, Card, ProGate, ProgressRing, etc.)
│   │   ├── styles/          # Design system tokens and global themes
│   │   ├── authStore.ts     # User authentication and subscription state
│   │   ├── mockData.ts      # Structured sample dataset for drives, categories, files
│   │   ├── store.ts         # Reactive state management (triage, vault, scan status)
│   │   └── supabase.ts      # Supabase client integration
│   └── routes/
│       ├── +page.svelte     # Orbital Galaxy Overview & Dashboard
│       ├── categories/      # Category breakdowns & drill-downs
│       ├── chat/            # On-device AI Chat Assistant
│       ├── devjunk/         # Developer junk & build artifacts purge
│       ├── duplicates/      # Perceptual duplicates finder
│       ├── insights/        # Predictive analytics & storage alerts
│       ├── onboarding/      # First-launch guided tour & permissions
│       ├── settings/        # App configuration & preferences
│       ├── timeline/        # Historical snapshots & drive scrubber
│       ├── triage/          # Interactive swipe deck for fast triage
│       ├── vault/           # 30-day recovery vault & restore manager
│       ├── widget/          # Compact tray/menu bar widget
│       └── wrapped/         # Storage Wrapped & Roast My Drive summary
├── src-tauri/               # Tauri 2.0 Rust desktop backend
├── static/                  # Static assets & public resources
├── Orbit-PRD.md             # Complete Product Requirements Document
└── package.json             # Dependencies and build scripts
```

---

## ⚡ Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Rust](https://www.rust-lang.org/) (if running or building the native Tauri desktop app)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MarioSri/Orbit.git
   cd Orbit
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional):**
   ```bash
   cp .env.example .env
   ```
   Provide your Supabase URL and Anon Key if using cloud synchronization.

### Development

Run the web frontend in dev mode:
```bash
npm run dev
```

Run in Tauri Desktop mode:
```bash
npm run tauri dev
```

### Type Checking & Linting

```bash
npm run check
```

### Production Build

```bash
npm run build
```

---

## 🔒 Privacy First

Orbit is designed from the ground up to respect user privacy:
- All disk scanning and indexing occurs directly on your machine.
- File queries and content analysis run locally without sending telemetry or filenames to remote servers.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.
