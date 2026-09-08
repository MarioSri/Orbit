<script lang="ts">
  import { goto } from '$app/navigation';
  import { activeTimelineIndex } from '$lib/store';
  import { isPro } from '$lib/authStore';
  import { initialTimelineSnapshots } from '$lib/mockData';
  import ProGate from '$lib/components/ProGate.svelte';
  import ProgressRing from '$lib/components/ProgressRing.svelte';
  import Button from '$lib/components/Button.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import {
    ArrowLeft,
    History,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    Zap,
    Code,
    Camera,
    Cpu,
    Layers,
    FileText,
    Trash2
  } from '@lucide/svelte';

  const snapshots = initialTimelineSnapshots;
  let currentSnapshot = $derived(snapshots[$activeTimelineIndex]);

  // Overall growth since earliest snapshot
  let netGrowthGb = $derived(
    +(currentSnapshot.totalUsedGb - snapshots[0].totalUsedGb).toFixed(1)
  );

  // Dynamic planet size calculator based on category size at active snapshot
  function getTimelinePlanetSize(sizeGb: number) {
    return Math.max(48, Math.min(96, Math.round(40 + (sizeGb / 120) * 56)));
  }

  // Position angles for the simplified galaxy
  const planetLayout = [
    { key: 'dev' as const, name: 'Developer', color: 'var(--cat-dev)', hex: '#14b8a6', angle: -30, r: 180, icon: Code },
    { key: 'photos' as const, name: 'Photos & Video', color: 'var(--cat-photos)', hex: '#a855f7', angle: 35, r: 185, icon: Camera },
    { key: 'system' as const, name: 'System Data', color: 'var(--cat-system)', hex: '#f97316', angle: 100, r: 180, icon: Cpu },
    { key: 'apps' as const, name: 'Apps', color: 'var(--cat-apps)', hex: '#3b82f6', angle: 165, r: 185, icon: Layers },
    { key: 'docs' as const, name: 'Docs', color: 'var(--cat-docs)', hex: '#64748b', angle: 225, r: 180, icon: FileText },
    { key: 'trash' as const, name: 'Trash', color: 'var(--cat-trash)', hex: '#f43f5e', angle: 280, r: 170, icon: Trash2 }
  ];

  function getPlanetCoordinates(angle: number, radius: number) {
    const rad = (angle * Math.PI) / 180;
    return {
      x: Math.round(Math.cos(rad) * radius),
      y: Math.round(Math.sin(rad) * radius)
    };
  }
</script>

{#if !$isPro}
  <ProGate
    featureName="Timeline Scrubber"
    description="Scrub through historical snapshots of your drive to see how storage evolved over time, with annotated growth spikes."
  />
{:else}
<div class="timeline-viewport">
  <!-- Top Bar -->
  <div class="timeline-header">
    <div class="header-left">
      <Button variant="ghost" size="sm" onclick={() => goto('/')}>
        <ArrowLeft size={16} />
        <span>Dashboard</span>
      </Button>

      <div class="snapshot-tag">
        <History size={14} />
        <span>Snapshot {$activeTimelineIndex + 1} of {snapshots.length}: <strong>{currentSnapshot.label} ({currentSnapshot.date})</strong></span>
      </div>
    </div>

    <div class="header-right">
      <div class="net-growth-badge">
        <TrendingUp size={13} />
        <span>{netGrowthGb >= 0 ? `+${netGrowthGb} GB` : `${netGrowthGb} GB`} vs March 2026</span>
      </div>
    </div>
  </div>

  <!-- Main Stage: Simplified Galaxy View reflecting historical snapshot -->
  <div class="timeline-stage">
    <div class="stage-center">
      <!-- Center Progress Hub -->
      <ProgressRing
        value={Math.round((currentSnapshot.totalUsedGb / 512) * 100)}
        max={100}
        size={190}
        strokeWidth={12}
        color="var(--accent)"
        trackColor="var(--surface-3)"
      >
        <div class="stage-hub-text">
          <span class="hub-percent">{Math.round((currentSnapshot.totalUsedGb / 512) * 100)}%</span>
          <span class="hub-total">{currentSnapshot.formattedUsed}</span>
          <span class="hub-date">{currentSnapshot.date}</span>
        </div>
      </ProgressRing>

      <!-- Orbiting Planets sized to snapshot values -->
      <div class="timeline-planets">
        {#each planetLayout as p}
          {@const catSize = currentSnapshot.categories[p.key]}
          {@const coords = getPlanetCoordinates(p.angle, p.r)}
          {@const diameter = getTimelinePlanetSize(catSize)}
          <div
            class="timeline-planet"
            style="
              transform: translate({coords.x}px, {coords.y}px);
              width: {diameter}px;
              height: {diameter}px;
              border-color: {p.hex};
            "
            title="{p.name}: {catSize.toFixed(1)} GB"
          >
            <p.icon size={16} class="p-icon" style="color: {p.hex};" />
            <span class="p-name">{p.name}</span>
            <span class="p-size" style="color: {p.hex};">{catSize.toFixed(1)} GB</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Active Spike Event Callout Card (if present on this snapshot) -->
    {#if currentSnapshot.spikeEvent}
      <div class="spike-callout-card">
        <div class="spike-callout-header">
          <Badge variant="warning" size="sm" dot={true}>
            {currentSnapshot.spikeEvent.badge}
          </Badge>
          <span class="spike-delta">+{currentSnapshot.spikeEvent.deltaGb} GB Growth</span>
        </div>
        <div class="spike-callout-title">{currentSnapshot.spikeEvent.title}</div>
        <p class="spike-callout-desc">{currentSnapshot.spikeEvent.description}</p>
      </div>
    {/if}
  </div>

  <!-- Bottom Scrubber Control Bar -->
  <div class="scrubber-control-bar">
    <div class="scrubber-nav-buttons">
      <Button
        variant="secondary"
        size="sm"
        disabled={$activeTimelineIndex <= 0}
        onclick={() => activeTimelineIndex.update(i => Math.max(0, i - 1))}
        ariaLabel="Previous snapshot"
      >
        <ChevronLeft size={16} />
      </Button>

      <Button
        variant="secondary"
        size="sm"
        disabled={$activeTimelineIndex >= snapshots.length - 1}
        onclick={() => activeTimelineIndex.update(i => Math.min(snapshots.length - 1, i + 1))}
        ariaLabel="Next snapshot"
      >
        <ChevronRight size={16} />
      </Button>
    </div>

    <!-- Timeline Track with Markers -->
    <div class="slider-track-container">
      <input
        type="range"
        min="0"
        max={snapshots.length - 1}
        step="1"
        bind:value={$activeTimelineIndex}
        class="timeline-range-input"
        aria-label="Storage history timeline scrubber"
      />

      <!-- Snapshots Labels & Spike Dots -->
      <div class="scrubber-ticks-row">
        {#each snapshots as snap, idx}
          <button
            type="button"
            class="scrubber-tick-item {$activeTimelineIndex === idx ? 'active' : ''}"
            onclick={() => activeTimelineIndex.set(idx)}
          >
            <div class="tick-indicator-wrapper">
              {#if snap.spikeEvent}
                <span class="spike-dot" title={snap.spikeEvent.title}></span>
              {:else}
                <span class="normal-dot"></span>
              {/if}
            </div>
            <span class="tick-label">{snap.label}</span>
            <span class="tick-size">{snap.formattedUsed}</span>
          </button>
        {/each}
      </div>
    </div>
  </div>
</div>
{/if}

<style>
  .timeline-viewport {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--bg);
    overflow: hidden;
    position: relative;
  }

  .timeline-header {
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--space-6);
    border-bottom: 1px solid var(--border);
    background-color: var(--surface-1);
    z-index: 10;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .snapshot-tag {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--text-secondary);
    background-color: var(--surface-2);
    border: 1px solid var(--border);
    padding: 3px 10px;
    border-radius: var(--radius-full);
  }

  .net-growth-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--warning);
    background-color: var(--warning-subtle);
    border: 1px solid rgba(245, 158, 11, 0.25);
    padding: 3px 10px;
    border-radius: var(--radius-full);
  }

  /* Stage */
  .timeline-stage {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding-bottom: 30px;
  }

  .stage-center {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stage-hub-text {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .hub-percent {
    font-size: 28px;
    font-weight: 800;
    color: var(--text-primary);
    line-height: 1;
  }

  .hub-total {
    font-size: 13px;
    font-weight: 700;
    color: var(--text-secondary);
    margin-top: 4px;
  }

  .hub-date {
    font-size: 11px;
    color: var(--text-tertiary);
  }

  /* Planets */
  .timeline-planets {
    position: absolute;
    width: 0;
    height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .timeline-planet {
    position: absolute;
    border-radius: 50%;
    background-color: var(--surface-1);
    border: 2px solid;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 4px;
    transition: width 350ms var(--ease-spring),
                height 350ms var(--ease-spring),
                transform 350ms var(--ease-spring);
    user-select: none;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  }

  .p-name {
    font-size: 10px;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1;
    max-width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .p-size {
    font-size: 10.5px;
    font-weight: 700;
    margin-top: 2px;
  }

  /* Spike callout */
  .spike-callout-card {
    position: absolute;
    top: 24px;
    right: 32px;
    background-color: var(--surface-1);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    max-width: 320px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    animation: spike-fade 250ms var(--ease-spring);
  }

  @keyframes spike-fade {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .spike-callout-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  .spike-delta {
    font-size: 11px;
    font-weight: 700;
    color: var(--warning);
  }

  .spike-callout-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.35;
    margin-bottom: 4px;
  }

  .spike-callout-desc {
    font-size: 11.5px;
    color: var(--text-secondary);
    line-height: 1.45;
  }

  /* Scrubber bar */
  .scrubber-control-bar {
    padding: var(--space-4) var(--space-8);
    background-color: var(--surface-1);
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .scrubber-nav-buttons {
    display: flex;
    gap: 6px;
  }

  .slider-track-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .timeline-range-input {
    width: 100%;
    accent-color: var(--accent);
    cursor: pointer;
    height: 6px;
    border-radius: var(--radius-full);
    background-color: var(--surface-3);
  }

  .scrubber-ticks-row {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .scrubber-tick-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
    padding: 0 4px;
  }

  .tick-indicator-wrapper {
    height: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .normal-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--border-strong);
    transition: background-color var(--duration-fast) var(--ease-out);
  }

  .spike-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color: var(--warning);
    box-shadow: 0 0 8px rgba(245, 158, 11, 0.7);
  }

  .scrubber-tick-item.active .normal-dot {
    background-color: var(--accent);
    transform: scale(1.4);
  }

  .tick-label {
    font-size: 11px;
    font-weight: 500;
    color: var(--text-tertiary);
  }

  .scrubber-tick-item.active .tick-label {
    color: var(--text-primary);
    font-weight: 700;
  }

  .tick-size {
    font-size: 10.5px;
    color: var(--text-tertiary);
  }

  .scrubber-tick-item.active .tick-size {
    color: var(--accent);
    font-weight: 600;
  }
</style>
