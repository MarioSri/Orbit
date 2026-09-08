# Orbit

AI-Native Storage Intelligence and Disk Visualization for macOS and Windows.

Orbit provides a spatial galaxy view of storage drives combined with an on-device AI assistant, swipe-triage decks for rapid file decisions, developer junk cleanup, and a 30-day safety vault.

---

## Key Features

- **Orbital Galaxy Visualization**: Dynamic spatial model where directories and files are rendered in orbit, scaled by size and categorized by type.
- **Local AI Storage Assistant**: Conversational file queries, disk growth explanations, and cleanup recommendations with local privacy.
- **Swipe Triage Deck**: Rapid cleanup decisions on large files using an interactive card deck with instant undo.
- **Developer Junk Detector**: Automated detection and cleanup for node_modules, build targets, virtual environments, Xcode DerivedData, Docker images, and stale caches.
- **30-Day Safety Vault**: Staged soft deletion with one-click restoration, auto-expiration, and protection against accidental data loss.
- **Duplicate Detection**: Perceptual image hashing and exact file matching with intelligent retention suggestions.
- **Timeline Scrubber and Growth Forecasting**: Historical disk snapshots, spike diagnostics, and predictive capacity estimates.
- **Storage Wrapped**: Visual storage audits and usage habit summaries.
- **Menu Bar and Taskbar Widget**: Compact system tray widget with real-time disk gauges and quick purge actions.

---

## Architecture and Tech Stack

| Layer | Technology | Description |
|---|---|---|
| Frontend UI | SvelteKit + Svelte 5 (Runes) | High performance UI with smooth 60fps animations |
| Desktop Shell | Tauri 2.0 (Rust) | Native cross-platform performance with secure IPC |
| Styling | Design Tokens and CSS Variables | Structured dark theme with responsive layout |
| Iconography | Lucide Svelte | Consistent interface icons |
| Cloud and Auth | Supabase JS | Pro subscription verification and encrypted preference sync |

---

## Project Structure

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
│       ├── +page.svelte     # Orbital Galaxy Overview and Dashboard
│       ├── categories/      # Category breakdowns and drill-downs
│       ├── chat/            # On-device AI Chat Assistant
│       ├── devjunk/         # Developer junk and build artifacts purge
│       ├── duplicates/      # Perceptual duplicates finder
│       ├── insights/        # Predictive analytics and storage alerts
│       ├── onboarding/      # First-launch guided tour and permissions
│       ├── settings/        # App configuration and preferences
│       ├── timeline/        # Historical snapshots and drive scrubber
│       ├── triage/          # Interactive swipe deck for fast triage
│       ├── vault/           # 30-day recovery vault and restore manager
│       ├── widget/          # Compact tray and menu bar widget
│       └── wrapped/         # Storage Wrapped summary
├── src-tauri/               # Tauri 2.0 Rust desktop backend
├── static/                  # Static assets and public resources
├── Orbit-PRD.md             # Product Requirements Document
└── package.json             # Dependencies and scripts
```

---

## Quick Start

### Prerequisites

- Node.js (v18 or newer recommended)
- Rust and Cargo (required for building the Tauri desktop application)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MarioSri/Orbit.git
   cd Orbit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables (Optional):
   ```bash
   cp .env.example .env
   ```

### Development

Start the development server:
```bash
npm run dev
```

Run in Tauri Desktop mode:
```bash
npm run tauri dev
```

### Type Checking

```bash
npm run check
```

### Production Build

```bash
npm run build
```

---

## Privacy Architecture

Orbit is built with local-first privacy:
- Disk scanning and indexing are processed locally on the device.
- Storage queries and intelligence run on-device without transmitting file names or metadata to external servers.

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
