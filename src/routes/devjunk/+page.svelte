<script lang="ts">
  import { devJunkGroups, cleanDevJunkItem, cleanAllSafeDevJunk } from '$lib/store';
  import Button from '$lib/components/Button.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import Card from '$lib/components/Card.svelte';
  import {
    Code,
    Trash2,
    CheckCircle2,
    Clock,
    Folder,
    Sparkles,
    Cpu,
    Container,
    Boxes,
    Terminal,
    RefreshCw
  } from '@lucide/svelte';

  let selectedFilter = $state<'all' | 'node' | 'docker' | 'xcode' | 'rust'>('all');

  let totalReclaimableGb = $derived(
    +$devJunkGroups.reduce((acc, g) => acc + g.totalSizeGb, 0).toFixed(1)
  );

  let filteredGroups = $derived(
    $devJunkGroups.filter(g => {
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'node') return g.tool.toLowerCase().includes('svelte') || g.items.some(i => i.name.includes('node_modules'));
      if (selectedFilter === 'docker') return g.tool.toLowerCase().includes('docker');
      if (selectedFilter === 'xcode') return g.tool.toLowerCase().includes('xcode');
      if (selectedFilter === 'rust') return g.tool.toLowerCase().includes('rust') || g.items.some(i => i.path.includes('target'));
      return true;
    })
  );

  function getToolIcon(tool: string) {
    if (tool.includes('Docker')) return Container;
    if (tool.includes('Xcode')) return Boxes;
    if (tool.includes('Rust')) return Terminal;
    return Code;
  }
</script>

<div class="devjunk-viewport">
  <div class="devjunk-container">
    <!-- Header with Bulk Action -->
    <div class="devjunk-header">
      <div>
        <div class="header-badge">
          <Badge variant="teal" size="sm" dot={true}>Developer Intelligence</Badge>
        </div>
        <h1 class="header-title">Dev Junk Scanner</h1>
        <p class="header-subtitle">
          Universal bloat detector for build artifacts, virtual environments, and unattached container volumes. Everything here regenerates automatically.
        </p>
      </div>

      <div class="bulk-action-area">
        <Button
          variant="primary"
          size="lg"
          onclick={cleanAllSafeDevJunk}
          disabled={totalReclaimableGb <= 0}
        >
          <Trash2 size={16} />
          <span>Clean All Safe Items ({totalReclaimableGb} GB)</span>
        </Button>
      </div>
    </div>

    <!-- Filter chips -->
    <div class="filter-chips-row">
      <button
        type="button"
        class="filter-chip {selectedFilter === 'all' ? 'active' : ''}"
        onclick={() => (selectedFilter = 'all')}
      >
        All Tools ({$devJunkGroups.length})
      </button>
      <button
        type="button"
        class="filter-chip {selectedFilter === 'node' ? 'active' : ''}"
        onclick={() => (selectedFilter = 'node')}
      >
        Node & Web
      </button>
      <button
        type="button"
        class="filter-chip {selectedFilter === 'docker' ? 'active' : ''}"
        onclick={() => (selectedFilter = 'docker')}
      >
        Docker
      </button>
      <button
        type="button"
        class="filter-chip {selectedFilter === 'xcode' ? 'active' : ''}"
        onclick={() => (selectedFilter = 'xcode')}
      >
        Xcode
      </button>
      <button
        type="button"
        class="filter-chip {selectedFilter === 'rust' ? 'active' : ''}"
        onclick={() => (selectedFilter = 'rust')}
      >
        Rust & Backend
      </button>
    </div>

    <!-- Grouped Projects List -->
    <div class="groups-stack">
      {#each filteredGroups as group, groupIdx (group.groupName)}
        {@const ToolIcon = getToolIcon(group.tool)}
        <div class="project-card">
          <!-- Group Title Bar -->
          <div class="group-header">
            <div class="group-left">
              <div class="tool-icon-wrap">
                <ToolIcon size={18} />
              </div>
              <div>
                <h3 class="group-name">{group.groupName}</h3>
                <span class="tool-label">{group.tool}</span>
              </div>
            </div>

            <div class="group-right">
              <span class="group-total">{group.formattedTotalSize}</span>
            </div>
          </div>

          <!-- Items Table/List -->
          <div class="group-items">
            {#each group.items as item (item.id)}
              <div class="item-row">
                <div class="item-main">
                  <div class="item-title-line">
                    <span class="item-name">{item.name}</span>
                    <Badge variant="teal" size="sm">Safe Cache</Badge>
                  </div>

                  <div class="item-path-line" title={item.path}>
                    <Folder size={11} />
                    <span>{item.path}</span>
                  </div>

                  <div class="rebuild-note">
                    <RefreshCw size={11} class="rebuild-icon" />
                    <span>{item.rebuildNote}</span>
                  </div>
                </div>

                <div class="item-actions">
                  <div class="item-time">
                    <span class="item-size">{item.formattedSize}</span>
                    <span class="item-modified">{item.lastModified}</span>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onclick={() => cleanDevJunkItem(groupIdx, item.id)}
                    title="Purge this cache"
                  >
                    <Trash2 size={13} />
                    <span>Clean</span>
                  </Button>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .devjunk-viewport {
    height: 100%;
    overflow-y: auto;
    background-color: var(--bg);
    padding: var(--space-6);
  }

  .devjunk-container {
    max-width: 960px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }

  .devjunk-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
  }

  .header-badge {
    margin-bottom: 6px;
  }

  .header-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }

  .header-subtitle {
    font-size: 13.5px;
    color: var(--text-secondary);
    line-height: 1.5;
    margin-top: 4px;
    max-width: 620px;
  }

  .filter-chips-row {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 2px;
  }

  .filter-chip {
    padding: 5px 12px;
    border-radius: var(--radius-full);
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
    background-color: var(--surface-1);
    border: 1px solid var(--border);
    transition: all var(--duration-fast) var(--ease-out);
    white-space: nowrap;
  }

  .filter-chip:hover {
    color: var(--text-primary);
    background-color: var(--surface-hover);
  }

  .filter-chip.active {
    color: var(--text-primary);
    background-color: var(--surface-3);
    border-color: var(--cat-dev);
    font-weight: 600;
  }

  .groups-stack {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .project-card {
    background-color: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  .group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    background-color: var(--surface-2);
    border-bottom: 1px solid var(--border);
  }

  .group-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .tool-icon-wrap {
    color: var(--cat-dev);
    display: flex;
    align-items: center;
  }

  .group-name {
    font-size: 14px;
    font-weight: 700;
    color: var(--text-primary);
  }

  .tool-label {
    font-size: 11px;
    color: var(--text-tertiary);
  }

  .group-total {
    font-size: 15px;
    font-weight: 800;
    color: var(--cat-dev);
  }

  .group-items {
    display: flex;
    flex-direction: column;
  }

  .item-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 18px;
    border-bottom: 1px solid var(--border-subtle);
    transition: background-color var(--duration-fast) var(--ease-out);
  }

  .item-row:last-child {
    border-bottom: none;
  }

  .item-row:hover {
    background-color: var(--surface-hover);
  }

  .item-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
    overflow: hidden;
  }

  .item-title-line {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .item-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .item-path-line {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-family: var(--font-mono);
    color: var(--text-tertiary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .rebuild-note {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11.5px;
    color: var(--text-secondary);
    margin-top: 2px;
  }

  :global(.rebuild-icon) {
    color: var(--cat-dev);
    flex-shrink: 0;
  }

  .item-actions {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
  }

  .item-time {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }

  .item-size {
    font-size: 13px;
    font-weight: 700;
    color: var(--text-primary);
  }

  .item-modified {
    font-size: 11px;
    color: var(--text-tertiary);
  }
</style>
