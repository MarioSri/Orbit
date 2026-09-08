<script lang="ts">
  import { page } from '$app/stores';
  import {
    currentTheme,
    storageStats,
    reclaimedSoFarGb,
    insightAlerts,
    vaultItems,
    showMiniWidgetPreview
  } from '$lib/store';
  import { isPro, profile, user } from '$lib/authStore';
  import Button from './Button.svelte';
  import Badge from './Badge.svelte';
  import ToastContainer from './ToastContainer.svelte';
  import {
    Orbit,
    History,
    Sparkles,
    Flame,
    Layers,
    Code,
    Copy,
    ShieldCheck,
    MessageSquare,
    Gift,
    Settings,
    Compass,
    SlidersHorizontal,
    Sun,
    Moon,
    ExternalLink,
    HardDrive,
    CheckCircle2,
    AppWindow,
    Lock
  } from '@lucide/svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  function toggleTheme() {
    currentTheme.update(t => {
      const next = t === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }

  let isWidgetPage = $derived($page.url.pathname === '/widget');
</script>

<svelte:head>
  <title>Orbit — AI Storage Intelligence</title>
</svelte:head>

<ToastContainer />

{#if isWidgetPage}
  <!-- The Mini Widget window renders standalone without the main app shell -->
  <main class="widget-window-root">
    {@render children()}
  </main>
{:else}
  <div class="orbit-app-shell">
    <!-- Top macOS / Windows App Bar -->
    <header class="app-header">
      <div class="window-controls" aria-hidden="true">
        <span class="control-dot close"></span>
        <span class="control-dot minimize"></span>
        <span class="control-dot maximize"></span>
      </div>

      <div class="app-title-area">
        <span class="app-brand">
          <Orbit size={16} class="brand-orbit-icon" />
          <strong>Orbit</strong>
        </span>
        <span class="app-drive-pill">
          <HardDrive size={12} />
          {$storageStats.driveName}
        </span>
      </div>

      <div class="header-actions">
        {#if $reclaimedSoFarGb > 0}
          <div class="reclaimed-pill">
            <CheckCircle2 size={13} />
            <span>+{$reclaimedSoFarGb} GB Freed</span>
          </div>
        {/if}

        <button
          type="button"
          class="widget-preview-btn"
          onclick={() => showMiniWidgetPreview.update(v => !v)}
          title="Toggle Mini Taskbar Widget Preview"
        >
          <AppWindow size={14} />
          <span>Mini Widget</span>
        </button>

        <button
          type="button"
          class="theme-toggle-btn"
          onclick={toggleTheme}
          title="Toggle Dark/Light theme"
          aria-label="Toggle theme"
        >
          {#if $currentTheme === 'dark'}
            <Sun size={15} />
          {:else}
            <Moon size={15} />
          {/if}
        </button>
      </div>
    </header>

    <div class="app-body">
      <!-- Left Sidebar Navigation -->
      <aside class="app-sidebar">
        <!-- Quick Storage Meter -->
        <div class="sidebar-meter">
          <div class="meter-header">
            <span class="meter-label">Storage Used</span>
            <span class="meter-percent">{$storageStats.usedPercent}%</span>
          </div>
          <div class="meter-track">
            <div class="meter-fill" style="width: {$storageStats.usedPercent}%;"></div>
          </div>
          <div class="meter-footer">
            <span>{$storageStats.formattedUsed} used</span>
            <span>{$storageStats.formattedFree} free</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-section-title">OVERVIEW</div>
          <a href="/" class="nav-item {$page.url.pathname === '/' ? 'active' : ''}">
            <Orbit size={16} />
            <span>Galaxy View</span>
          </a>
          <a href="/timeline" class="nav-item {$page.url.pathname === '/timeline' ? 'active' : ''}">
            <History size={16} />
            <span>Timeline Scrubber</span>
            {#if !$isPro}<span class="nav-badge pro-lock"><Lock size={9} />Pro</span>{/if}
          </a>
          <a href="/insights" class="nav-item {$page.url.pathname === '/insights' ? 'active' : ''}">
            <Sparkles size={16} />
            <span>Insights & Forecast</span>
            {#if $isPro && $insightAlerts.length > 0}
              <span class="nav-badge count">{$insightAlerts.length}</span>
            {:else if !$isPro}
              <span class="nav-badge pro-lock"><Lock size={9} />Pro</span>
            {/if}
          </a>

          <div class="nav-section-title">CLEANUP & TRIAGE</div>
          <a href="/triage" class="nav-item {$page.url.pathname === '/triage' ? 'active' : ''}">
            <Flame size={16} />
            <span>Swipe Triage Deck</span>
            <span class="nav-badge safe">Fast</span>
          </a>
          <a href="/devjunk" class="nav-item {$page.url.pathname === '/devjunk' ? 'active' : ''}">
            <Code size={16} />
            <span>Dev Junk Scanner</span>
            <span class="nav-badge teal">112 GB</span>
          </a>
          <a href="/duplicates" class="nav-item {$page.url.pathname === '/duplicates' ? 'active' : ''}">
            <Copy size={16} />
            <span>Duplicate Finder</span>
            {#if !$isPro}<span class="nav-badge pro-lock"><Lock size={9} />Pro</span>{/if}
          </a>
          <a href="/vault" class="nav-item {$page.url.pathname === '/vault' ? 'active' : ''}">
            <ShieldCheck size={16} />
            <span>Safety Vault</span>
            <span class="nav-badge vault">{$vaultItems.length}</span>
          </a>

          <div class="nav-section-title">INTELLIGENCE</div>
          <a href="/chat" class="nav-item {$page.url.pathname === '/chat' ? 'active' : ''}">
            <MessageSquare size={16} />
            <span>Talk to Storage</span>
            {#if $isPro}
              <span class="nav-badge ai">Local AI</span>
            {:else}
              <span class="nav-badge pro-lock"><Lock size={9} />Pro</span>
            {/if}
          </a>
          <a href="/wrapped" class="nav-item {$page.url.pathname === '/wrapped' ? 'active' : ''}">
            <Gift size={16} />
            <span>Storage Wrapped</span>
            <span class="nav-badge roast">Roast</span>
          </a>
          <a href="/categories" class="nav-item {$page.url.pathname === '/categories' ? 'active' : ''}">
            <Layers size={16} />
            <span>Category Drill-down</span>
          </a>

          <div class="nav-section-title">SYSTEM</div>
          <a href="/widget" target="_blank" class="nav-item {$page.url.pathname === '/widget' ? 'active' : ''}">
            <AppWindow size={16} />
            <span>Mini Popover Window</span>
            <ExternalLink size={12} class="ext-icon" />
          </a>
          <a href="/onboarding" class="nav-item {$page.url.pathname === '/onboarding' ? 'active' : ''}">
            <Compass size={16} />
            <span>Onboarding / FDA</span>
          </a>
          <a href="/settings" class="nav-item {$page.url.pathname === '/settings' ? 'active' : ''}">
            <Settings size={16} />
            <span>Settings</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          {#if $user}
            <div class="sidebar-user-info">
              <span class="user-email" title={$user.email}>{$user.email}</span>
              <span class="user-plan-badge {$isPro ? 'plan-pro' : 'plan-free'}">
                {$isPro ? 'Pro' : 'Free'}
              </span>
            </div>
          {/if}
          <div class="status-indicator">
            <span class="status-dot"></span>
            <span>On-device index active</span>
          </div>
        </div>
      </aside>

      <!-- Main Content View Area -->
      <main class="app-content-viewport">
        {@render children()}
      </main>
    </div>
  </div>

  <!-- Simulated Floating Mini Widget Window (Dual-window preview helper) -->
  {#if $showMiniWidgetPreview}
    <div class="widget-preview-floating-container">
      <div class="widget-floating-card">
        <div class="widget-floating-header">
          <span>Mini Widget Window Preview</span>
          <button
            type="button"
            class="widget-close-x"
            onclick={() => showMiniWidgetPreview.set(false)}
          >
            &times;
          </button>
        </div>
        <iframe
          src="/widget"
          title="Orbit Mini Widget Window"
          class="widget-preview-iframe"
        ></iframe>
      </div>
    </div>
  {/if}
{/if}

<style>
  .orbit-app-shell {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    background-color: var(--bg);
    overflow: hidden;
  }

  /* Header */
  .app-header {
    height: 44px;
    background-color: var(--surface-1);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    flex-shrink: 0;
    -webkit-app-region: drag;
  }

  .window-controls {
    display: flex;
    align-items: center;
    gap: 7px;
    width: 70px;
    -webkit-app-region: no-drag;
  }

  .control-dot {
    width: 11px;
    height: 11px;
    border-radius: 50%;
  }

  .control-dot.close { background-color: #ff5f56; }
  .control-dot.minimize { background-color: #ffbd2e; }
  .control-dot.maximize { background-color: #27c93f; }

  .app-title-area {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .app-brand {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13.5px;
    color: var(--text-primary);
  }

  :global(.brand-orbit-icon) {
    color: var(--accent);
  }

  .app-drive-pill {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: var(--text-secondary);
    background-color: var(--surface-2);
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    -webkit-app-region: no-drag;
  }

  .reclaimed-pill {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11.5px;
    font-weight: 600;
    color: var(--success);
    background: var(--success-subtle);
    padding: 3px 9px;
    border-radius: var(--radius-full);
    border: 1px solid rgba(16, 185, 129, 0.25);
  }

  .widget-preview-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
    background-color: var(--surface-2);
    border: 1px solid var(--border);
    padding: 4px 10px;
    border-radius: var(--radius-sm);
    transition: all var(--duration-fast) var(--ease-out);
  }

  .widget-preview-btn:hover {
    color: var(--text-primary);
    background-color: var(--surface-hover);
    border-color: var(--border-strong);
  }

  .theme-toggle-btn {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    background-color: var(--surface-2);
    border: 1px solid var(--border);
    transition: all var(--duration-fast) var(--ease-out);
  }

  .theme-toggle-btn:hover {
    color: var(--text-primary);
    border-color: var(--border-strong);
  }

  /* Body */
  .app-body {
    display: flex;
    flex: 1;
    height: calc(100vh - 44px);
    overflow: hidden;
  }

  /* Sidebar */
  .app-sidebar {
    width: 240px;
    background-color: var(--surface-1);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    padding: var(--space-4) 0;
  }

  .sidebar-meter {
    padding: 0 var(--space-4) var(--space-4) var(--space-4);
    border-bottom: 1px solid var(--border-subtle);
    margin-bottom: var(--space-3);
  }

  .meter-header {
    display: flex;
    justify-content: space-between;
    font-size: 11.5px;
    color: var(--text-secondary);
    margin-bottom: 6px;
    font-weight: 500;
  }

  .meter-percent {
    color: var(--accent);
    font-weight: 600;
  }

  .meter-track {
    height: 6px;
    width: 100%;
    background-color: var(--surface-3);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .meter-fill {
    height: 100%;
    background-color: var(--accent);
    border-radius: var(--radius-full);
    transition: width 600ms var(--ease-spring);
  }

  .meter-footer {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: var(--text-tertiary);
    margin-top: 5px;
  }

  .sidebar-nav {
    flex: 1;
    overflow-y: auto;
    padding: 0 var(--space-2);
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .nav-section-title {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--text-tertiary);
    padding: 10px 10px 4px 10px;
    text-transform: uppercase;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 10px;
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 12.5px;
    font-weight: 500;
    transition: all var(--duration-fast) var(--ease-out);
    position: relative;
  }

  .nav-item:hover {
    color: var(--text-primary);
    background-color: var(--surface-hover);
  }

  .nav-item.active {
    color: var(--text-primary);
    background-color: var(--surface-2);
    font-weight: 600;
    border: 1px solid var(--border);
  }

  .nav-item.active::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 6px;
    bottom: 6px;
    width: 3px;
    background-color: var(--accent);
    border-radius: 0 4px 4px 0;
  }

  .nav-badge {
    margin-left: auto;
    font-size: 10.5px;
    padding: 1px 6px;
    border-radius: var(--radius-full);
    font-weight: 600;
  }

  .nav-badge.count {
    background-color: var(--danger-subtle);
    color: var(--danger-text);
  }

  .nav-badge.safe {
    background-color: var(--success-subtle);
    color: var(--success-text);
  }

  .nav-badge.teal {
    background-color: var(--cat-dev);
    color: #0b0c10;
  }

  .nav-badge.vault {
    background-color: var(--surface-3);
    color: var(--text-secondary);
  }

  .nav-badge.ai {
    background-color: var(--accent-subtle);
    color: var(--accent);
  }

  .nav-badge.roast {
    background-color: rgba(249, 115, 22, 0.15);
    color: var(--cat-system);
  }

  :global(.ext-icon) {
    margin-left: auto;
    color: var(--text-tertiary);
  }

  .nav-badge.pro-lock {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    background-color: var(--surface-3);
    color: var(--text-tertiary);
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.03em;
  }

  .sidebar-footer {
    padding: var(--space-3) var(--space-4) 0 var(--space-4);
    border-top: 1px solid var(--border-subtle);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .sidebar-user-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .user-email {
    font-size: 11px;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 140px;
  }

  .user-plan-badge {
    font-size: 10px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: var(--radius-full);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    flex-shrink: 0;
  }

  .user-plan-badge.plan-pro {
    background-color: var(--accent-subtle);
    color: var(--accent);
  }

  .user-plan-badge.plan-free {
    background-color: var(--surface-3);
    color: var(--text-tertiary);
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 11px;
    color: var(--text-tertiary);
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--success);
  }

  /* Content Viewport */
  .app-content-viewport {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: var(--bg);
    position: relative;
  }

  /* Widget preview floating simulator */
  .widget-preview-floating-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9000;
    animation: pop-widget 250ms var(--ease-spring);
  }

  @keyframes pop-widget {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .widget-floating-card {
    width: 340px;
    height: 480px;
    background: var(--surface-1);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
  }

  .widget-floating-header {
    height: 32px;
    padding: 0 12px;
    background: var(--surface-2);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .widget-close-x {
    font-size: 18px;
    line-height: 1;
    color: var(--text-tertiary);
  }
  .widget-close-x:hover {
    color: var(--text-primary);
  }

  .widget-preview-iframe {
    width: 100%;
    flex: 1;
    border: none;
  }

  .widget-window-root {
    width: 100vw;
    height: 100vh;
    background: transparent;
    overflow: hidden;
  }
</style>
