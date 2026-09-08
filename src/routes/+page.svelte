<script lang="ts">
  import { goto } from '$app/navigation';
  import {
    storageStats,
    categories,
    selectedCategory,
    sendChatMessage,
    addToast,
    isScanning
  } from '$lib/store';
  import ProgressRing from '$lib/components/ProgressRing.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import Button from '$lib/components/Button.svelte';
  import {
    Sparkles,
    Send,
    RotateCw,
    HardDrive,
    Code,
    Camera,
    Cpu,
    Layers,
    FileText,
    Trash2,
    ArrowUpRight,
    Zap
  } from '@lucide/svelte';

  let chatInput = $state('');
  let zoomingPlanetId = $state<string | null>(null);

  // Icon mapper helper
  function getCategoryIcon(iconName: string) {
    switch (iconName) {
      case 'Code': return Code;
      case 'Camera': return Camera;
      case 'Cpu': return Cpu;
      case 'Layers': return Layers;
      case 'FileText': return FileText;
      case 'Trash2': return Trash2;
      default: return HardDrive;
    }
  }

  // Planet placement configuration (angles & radius offsets)
  const planetPositions = [
    { id: 'dev', angle: -30, radius: 240 },
    { id: 'photos', angle: 35, radius: 245 },
    { id: 'system', angle: 100, radius: 235 },
    { id: 'apps', angle: 165, radius: 240 },
    { id: 'docs', angle: 225, radius: 235 },
    { id: 'trash', angle: 280, radius: 220 }
  ];

  function getPlanetStyle(catId: string, sizeGb: number) {
    const pos = planetPositions.find(p => p.id === catId) || { angle: 0, radius: 220 };
    const rad = (pos.angle * Math.PI) / 180;
    const x = Math.round(Math.cos(rad) * pos.radius);
    const y = Math.round(Math.sin(rad) * pos.radius);

    // Dynamic diameter based on GB size (56px to 110px)
    const diameter = Math.max(56, Math.min(110, Math.round(48 + (sizeGb / 120) * 62)));

    return {
      transform: `translate(${x}px, ${y}px)`,
      width: `${diameter}px`,
      height: `${diameter}px`
    };
  }

  function handlePlanetClick(catId: string) {
    zoomingPlanetId = catId;
    selectedCategory.set(catId);
    setTimeout(() => {
      goto(`/categories?cat=${catId}`);
    }, 280);
  }

  function handleQuickPrompt(promptText: string) {
    sendChatMessage(promptText);
    goto('/chat');
  }

  function handleSubmitChat(e?: SubmitEvent) {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;
    const q = chatInput;
    chatInput = '';
    sendChatMessage(q);
    goto('/chat');
  }

  function triggerRescan() {
    isScanning.set(true);
    addToast('Incremental Scan Started', 'Walking APFS metadata journal...', 'info');
    setTimeout(() => {
      isScanning.set(false);
      addToast('Scan Completed in 1.4s', 'Storage index verified: 100% up to date', 'success');
    }, 1400);
  }
</script>

<div class="galaxy-viewport {zoomingPlanetId ? 'zooming' : ''}">
  <!-- Top Stats Bar -->
  <div class="galaxy-header">
    <div class="drive-spec">
      <span class="drive-title">Macintosh HD — Data</span>
      <span class="drive-badge">APFS Volume</span>
    </div>

    <div class="galaxy-actions">
      <div class="scan-meta">
        <span class="scan-dot"></span>
        <span>Last scan: 2.8s ago</span>
      </div>
      <Button
        variant="secondary"
        size="sm"
        disabled={$isScanning}
        onclick={triggerRescan}
      >
        <RotateCw size={13} class={$isScanning ? 'spin' : ''} />
        <span>{$isScanning ? 'Scanning...' : 'Rescan'}</span>
      </Button>
    </div>
  </div>

  <!-- Galaxy Stage Container -->
  <div class="galaxy-stage">
    <!-- Concentric Orbital Guide Rings -->
    <svg class="orbit-rings-svg" aria-hidden="true">
      <circle cx="50%" cy="50%" r="160" class="orbit-guide-ring ring-1" />
      <circle cx="50%" cy="50%" r="240" class="orbit-guide-ring ring-2" />
      <circle cx="50%" cy="50%" r="310" class="orbit-guide-ring ring-3" />
    </svg>

    <!-- Center Hub: Large ProgressRing -->
    <div class="center-hub">
      <ProgressRing
        value={$storageStats.usedPercent}
        max={100}
        size={230}
        strokeWidth={14}
        color="var(--accent)"
        trackColor="var(--surface-3)"
      >
        <div class="hub-details">
          <span class="hub-percent">{$storageStats.usedPercent}%</span>
          <span class="hub-used">{$storageStats.formattedUsed} used</span>
          <div class="hub-sub">
            <span class="hub-free">{$storageStats.formattedFree} free</span>
            <span class="hub-dot">•</span>
            <span class="hub-total">{$storageStats.formattedTotal}</span>
          </div>
        </div>
      </ProgressRing>
    </div>

    <!-- Orbiting Category Planets -->
    <div class="planets-system">
      {#each $categories as cat (cat.id)}
        {@const style = getPlanetStyle(cat.id, cat.sizeGb)}
        {@const IconComponent = getCategoryIcon(cat.icon)}
        <button
          type="button"
          class="planet-node {zoomingPlanetId === cat.id ? 'is-zooming' : ''}"
          style="transform: {style.transform}; width: {style.width}; height: {style.height}; --cat-color: {cat.hex};"
          onclick={() => handlePlanetClick(cat.id)}
          title="Drill into {cat.name} ({cat.formattedSize})"
        >
          <div class="planet-halo"></div>
          <div class="planet-inner">
            <IconComponent size={20} class="planet-icon" />
            <span class="planet-name">{cat.name}</span>
            <span class="planet-size">{cat.formattedSize}</span>
          </div>

          <!-- Hover Tooltip -->
          <div class="planet-tooltip">
            <div class="tooltip-top">
              <strong>{cat.name}</strong>
              <span>{cat.percentage}%</span>
            </div>
            <div class="tooltip-peek">
              {cat.subBreakdown[0]?.name || 'Inspect files'}
            </div>
            <div class="tooltip-cta">
              <span>Drill down</span>
              <ArrowUpRight size={11} />
            </div>
          </div>
        </button>
      {/each}
    </div>
  </div>

  <!-- Persistent Bottom Chat Input Bar -->
  <div class="bottom-chat-bar">
    <!-- Suggestion Chips -->
    <div class="suggestion-chips">
      <button
        type="button"
        class="chip-btn"
        onclick={() => handleQuickPrompt("What can I safely delete inside Developer Junk?")}
      >
        <Zap size={12} class="chip-icon" />
        <span>Clean safe dev junk (+112 GB)</span>
      </button>

      <button
        type="button"
        class="chip-btn"
        onclick={() => handleQuickPrompt("Why did System Data grow overnight?")}
      >
        <Sparkles size={12} class="chip-icon" />
        <span>Why did System Data grow?</span>
      </button>

      <button
        type="button"
        class="chip-btn"
        onclick={() => handleQuickPrompt("Find node_modules inactive for over 3 months")}
      >
        <Code size={12} class="chip-icon" />
        <span>Find inactive node_modules</span>
      </button>
    </div>

    <!-- Persistent Input -->
    <form class="chat-form" onsubmit={handleSubmitChat}>
      <div class="chat-input-wrapper">
        <Sparkles size={17} class="chat-sparkle-leading" />
        <input
          type="text"
          bind:value={chatInput}
          placeholder="Ask your storage anything (e.g. 'find videos over 2GB unplayed in 1 year')..."
          class="chat-input"
        />
        <Button
          variant="primary"
          size="sm"
          type="submit"
          disabled={!chatInput.trim()}
          class="chat-send-btn"
          title="Send query to on-device LLM"
        >
          <Send size={13} />
          <span>Ask</span>
        </Button>
      </div>
    </form>
  </div>
</div>

<style>
  .galaxy-viewport {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    background: radial-gradient(circle at 50% 45%, var(--surface-1) 0%, var(--bg) 75%);
    transition: transform var(--duration-normal) var(--ease-spring), opacity var(--duration-normal) var(--ease-out);
  }

  .galaxy-viewport.zooming {
    transform: scale(1.08);
    opacity: 0.1;
  }

  /* Header */
  .galaxy-header {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--space-6);
    z-index: 10;
  }

  .drive-spec {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .drive-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .drive-badge {
    font-size: 11px;
    background-color: var(--surface-2);
    color: var(--text-tertiary);
    border: 1px solid var(--border);
    padding: 2px 7px;
    border-radius: var(--radius-sm);
  }

  .galaxy-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .scan-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    color: var(--text-tertiary);
  }

  .scan-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--success);
  }

  :global(.spin) {
    animation: rotate-spin 1s linear infinite;
  }

  @keyframes rotate-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Stage & Orbit Rings */
  .galaxy-stage {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 96px; /* leave room for bottom chat bar */
  }

  .orbit-rings-svg {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }

  .orbit-guide-ring {
    fill: none;
    stroke: var(--border);
    stroke-width: 1;
    stroke-dasharray: 4 8;
    opacity: 0.55;
  }

  .ring-1 { opacity: 0.35; }
  .ring-2 { opacity: 0.65; }
  .ring-3 { opacity: 0.45; }

  /* Center Hub */
  .center-hub {
    position: relative;
    z-index: 5;
    background-color: var(--surface-1);
    border-radius: 50%;
    padding: 6px;
    border: 1px solid var(--border-subtle);
  }

  .hub-details {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .hub-percent {
    font-size: 34px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text-primary);
    line-height: 1;
  }

  .hub-used {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--text-secondary);
    margin-top: 5px;
  }

  .hub-sub {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: var(--text-tertiary);
    margin-top: 2px;
  }

  .hub-free {
    color: var(--success-text);
    font-weight: 500;
  }

  /* Planets System */
  .planets-system {
    position: absolute;
    width: 0;
    height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .planet-node {
    position: absolute;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--surface-1);
    border: 2px solid var(--cat-color);
    box-shadow: 0 0 0 1px var(--surface-2);
    cursor: pointer;
    transition: transform 300ms var(--ease-spring),
                box-shadow 200ms var(--ease-out),
                border-color 200ms var(--ease-out);
    user-select: none;
    animation: planet-drift 6s ease-in-out infinite alternate;
  }

  @keyframes planet-drift {
    0% { margin-top: -3px; }
    100% { margin-top: 3px; }
  }

  .planet-node:hover {
    transform: scale(1.1) !important;
    box-shadow: 0 0 24px rgba(0, 0, 0, 0.4), 0 0 16px var(--cat-color);
    z-index: 30;
  }

  .planet-node.is-zooming {
    transform: scale(6) !important;
    opacity: 0;
    transition: transform 300ms var(--ease-spring), opacity 200ms var(--ease-out);
  }

  .planet-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 6px;
    pointer-events: none;
  }

  :global(.planet-icon) {
    color: var(--cat-color);
    margin-bottom: 2px;
  }

  .planet-name {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.1;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .planet-size {
    font-size: 11px;
    font-weight: 700;
    color: var(--cat-color);
    margin-top: 2px;
  }

  /* Hover Tooltip */
  .planet-tooltip {
    position: absolute;
    bottom: -62px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--surface-2);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
    padding: 6px 10px;
    min-width: 140px;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--duration-fast) var(--ease-out);
    white-space: nowrap;
    z-index: 50;
  }

  .planet-node:hover .planet-tooltip {
    opacity: 1;
  }

  .tooltip-top {
    display: flex;
    justify-content: space-between;
    font-size: 11.5px;
    color: var(--text-primary);
  }

  .tooltip-peek {
    font-size: 11px;
    color: var(--text-secondary);
    margin-top: 2px;
  }

  .tooltip-cta {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 10px;
    font-weight: 600;
    color: var(--accent);
    margin-top: 4px;
  }

  /* Persistent Bottom Chat Bar */
  .bottom-chat-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: var(--space-3) var(--space-6) var(--space-5) var(--space-6);
    background: linear-gradient(to top, var(--surface-1) 80%, transparent 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    z-index: 40;
  }

  .suggestion-chips {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .chip-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    font-weight: 500;
    color: var(--text-secondary);
    background-color: var(--surface-2);
    border: 1px solid var(--border);
    padding: 5px 12px;
    border-radius: var(--radius-full);
    transition: all var(--duration-fast) var(--ease-out);
  }

  .chip-btn:hover {
    color: var(--text-primary);
    background-color: var(--surface-hover);
    border-color: var(--accent);
  }

  :global(.chip-icon) {
    color: var(--accent);
  }

  .chat-form {
    width: 100%;
    max-width: 680px;
  }

  .chat-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    background-color: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-full);
    padding: 5px 6px 5px 14px;
    transition: border-color var(--duration-fast) var(--ease-out);
  }

  .chat-input-wrapper:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 1px var(--accent);
  }

  :global(.chat-sparkle-leading) {
    color: var(--accent);
    margin-right: 8px;
    flex-shrink: 0;
  }

  .chat-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 13px;
    color: var(--text-primary);
  }

  .chat-input::placeholder {
    color: var(--text-tertiary);
  }

  :global(.chat-send-btn) {
    border-radius: var(--radius-full) !important;
  }
</style>
