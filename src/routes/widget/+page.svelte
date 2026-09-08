<script lang="ts">
  import { storageStats, categories, cleanAllSafeDevJunk, addToast } from '$lib/store';
  import ProgressRing from '$lib/components/ProgressRing.svelte';
  import Button from '$lib/components/Button.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import {
    Orbit,
    ExternalLink,
    Zap,
    CheckCircle2,
    HardDrive,
    Trash2,
    ChevronRight
  } from '@lucide/svelte';

  function handleOpenMainApp() {
    // If running in Tauri or browser, navigate to main window or root
    if (window.opener) {
      window.opener.focus();
    } else {
      window.open('/', '_blank');
    }
  }

  function handleQuickClean() {
    cleanAllSafeDevJunk();
  }
</script>

<div class="mini-widget-container">
  <!-- Widget Header -->
  <div class="widget-header">
    <div class="brand-left">
      <Orbit size={16} class="widget-brand-icon" />
      <span class="widget-brand-title">Orbit Mini</span>
    </div>

    <Badge variant="teal" size="sm" dot={true}>Live APFS</Badge>
  </div>

  <!-- Center Progress Dial -->
  <div class="widget-dial-area">
    <ProgressRing
      value={$storageStats.usedPercent}
      max={100}
      size={116}
      strokeWidth={9}
      color="var(--accent)"
      trackColor="var(--surface-3)"
    >
      <div class="dial-content">
        <span class="dial-pct">{$storageStats.usedPercent}%</span>
        <span class="dial-sub">USED</span>
      </div>
    </ProgressRing>

    <div class="widget-space-summary">
      <div class="space-free-line">
        <span class="free-number">{$storageStats.formattedFree}</span>
        <span class="free-label">Free Space</span>
      </div>
      <div class="space-total-line">
        {$storageStats.formattedUsed} used of {$storageStats.formattedTotal}
      </div>
    </div>
  </div>

  <!-- Mini Category Distribution Bar -->
  <div class="distribution-section">
    <div class="dist-bar">
      {#each $categories as cat}
        <div
          class="dist-segment"
          style="width: {cat.percentage}%; background-color: {cat.hex};"
          title="{cat.name}: {cat.formattedSize} ({cat.percentage}%)"
        ></div>
      {/each}
    </div>

    <div class="dist-legend">
      <div class="legend-item">
        <span class="legend-dot" style="background-color: var(--cat-dev);"></span>
        <span>Dev: 112 GB</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot" style="background-color: var(--cat-photos);"></span>
        <span>Media: 94 GB</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot" style="background-color: var(--cat-system);"></span>
        <span>System: 78 GB</span>
      </div>
    </div>
  </div>

  <!-- Quick Actions -->
  <div class="widget-actions">
    <Button
      variant="primary"
      size="md"
      class="quick-clean-btn"
      onclick={handleQuickClean}
    >
      <Zap size={14} />
      <span>Clean Safe Caches (+112 GB)</span>
    </Button>

    <button
      type="button"
      class="open-full-dashboard-link"
      onclick={handleOpenMainApp}
    >
      <span>Open Full Orbit Dashboard</span>
      <ExternalLink size={12} />
    </button>
  </div>
</div>

<style>
  .mini-widget-container {
    width: 100%;
    height: 100%;
    background-color: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: var(--space-4);
    box-sizing: border-box;
    user-select: none;
  }

  .widget-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: var(--space-3);
    border-bottom: 1px solid var(--border-subtle);
  }

  .brand-left {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  :global(.widget-brand-icon) {
    color: var(--accent);
  }

  .widget-brand-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--text-primary);
  }

  /* Dial Area */
  .widget-dial-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin: var(--space-2) 0;
  }

  .dial-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .dial-pct {
    font-size: 20px;
    font-weight: 800;
    color: var(--text-primary);
    line-height: 1;
  }

  .dial-sub {
    font-size: 9.5px;
    font-weight: 700;
    color: var(--text-tertiary);
    letter-spacing: 0.06em;
    margin-top: 2px;
  }

  .widget-space-summary {
    text-align: center;
  }

  .space-free-line {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 6px;
  }

  .free-number {
    font-size: 17px;
    font-weight: 800;
    color: var(--success);
  }

  .free-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .space-total-line {
    font-size: 11px;
    color: var(--text-tertiary);
    margin-top: 2px;
  }

  /* Distribution Bar */
  .distribution-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .dist-bar {
    height: 7px;
    border-radius: var(--radius-full);
    overflow: hidden;
    display: flex;
    background-color: var(--surface-3);
  }

  .dist-segment {
    height: 100%;
    transition: width var(--duration-normal) var(--ease-out);
  }

  .dist-legend {
    display: flex;
    justify-content: space-between;
    font-size: 10.5px;
    color: var(--text-tertiary);
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .legend-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  /* Actions */
  .widget-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  :global(.quick-clean-btn) {
    width: 100%;
    justify-content: center;
  }

  .open-full-dashboard-link {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 11.5px;
    font-weight: 500;
    color: var(--text-secondary);
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px 0;
    transition: color var(--duration-fast) var(--ease-out);
  }

  .open-full-dashboard-link:hover {
    color: var(--accent);
  }
</style>
