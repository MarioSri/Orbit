<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { categories, selectedCategory, sendChatMessage, addToast } from '$lib/store';
  import Button from '$lib/components/Button.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import Card from '$lib/components/Card.svelte';
  import {
    ArrowLeft,
    Sparkles,
    Trash2,
    CheckCircle2,
    AlertTriangle,
    Shield,
    Folder,
    Code,
    Camera,
    Cpu,
    Layers,
    FileText
  } from '@lucide/svelte';

  // Read category from URL query param or store
  let activeCatId = $derived($page.url.searchParams.get('cat') || $selectedCategory || 'dev');
  let currentCategory = $derived($categories.find(c => c.id === activeCatId) || $categories[0]);

  function getCategoryIcon(id: string) {
    switch (id) {
      case 'dev': return Code;
      case 'photos': return Camera;
      case 'system': return Cpu;
      case 'apps': return Layers;
      case 'docs': return FileText;
      case 'trash': return Trash2;
      default: return Folder;
    }
  }

  function handleAskAi() {
    const question = `What can I safely clean inside ${currentCategory.name}?`;
    sendChatMessage(question);
    goto('/chat');
  }

  function handleCleanSubItem(itemName: string, size: string) {
    addToast('Purged sub-category cache', `Wiped ${itemName} (${size}) safely`, 'success');
  }

  function switchCategory(id: string) {
    selectedCategory.set(id);
    goto(`/categories?cat=${id}`);
  }
</script>

<div class="drilldown-viewport">
  <!-- Top Navigation & Tabs -->
  <div class="drilldown-topbar">
    <div class="back-area">
      <Button variant="ghost" size="sm" onclick={() => goto('/')}>
        <ArrowLeft size={16} />
        <span>Back to Galaxy</span>
      </Button>
    </div>

    <!-- Category Switcher Tabs -->
    <div class="category-tabs">
      {#each $categories as cat}
        <button
          type="button"
          class="cat-tab {activeCatId === cat.id ? 'active' : ''}"
          style="--tab-color: {cat.hex};"
          onclick={() => switchCategory(cat.id)}
        >
          <span>{cat.name}</span>
          <span class="tab-size">{cat.formattedSize}</span>
        </button>
      {/each}
    </div>
  </div>

  <div class="drilldown-content">
    <!-- Category Hero Header -->
    <div class="cat-hero-card" style="border-left: 4px solid {currentCategory.hex};">
      <div class="hero-main-info">
        <div class="hero-icon-wrap" style="background-color: {currentCategory.hex}1a; color: {currentCategory.hex};">
          {#key currentCategory.id}
            {@const Icon = getCategoryIcon(currentCategory.id)}
            <Icon size={28} />
          {/key}
        </div>

        <div>
          <div class="hero-meta-badge">
            <span class="dot" style="background-color: {currentCategory.hex};"></span>
            <span>{currentCategory.percentage}% of total storage</span>
          </div>
          <h1 class="cat-title">{currentCategory.name}</h1>
          <div class="cat-size-row">
            <span class="cat-size">{currentCategory.formattedSize}</span>
            <span class="cat-items-count">({currentCategory.itemsCount.toLocaleString()} indexed items)</span>
          </div>
        </div>
      </div>

      <div class="hero-actions">
        <Button variant="secondary" size="md" onclick={handleAskAi}>
          <Sparkles size={15} class="sparkle-icon" />
          <span>Ask AI About This</span>
        </Button>

        <Button
          variant="primary"
          size="md"
          onclick={() => addToast('Safe Cleanup Started', `Scanning safe ${currentCategory.name} items...`, 'success')}
        >
          <Trash2 size={15} />
          <span>Clean Safe Items</span>
        </Button>
      </div>
    </div>

    <!-- Plain-English Rebuild Note Alert -->
    <div class="rebuild-note-banner">
      <div class="note-icon-wrap">
        <Shield size={16} />
      </div>
      <div class="note-text">
        <strong>Storage Guidance:</strong> {currentCategory.rebuildNote}
      </div>
    </div>

    <!-- Sub-Breakdown Section -->
    <div class="breakdown-section">
      <div class="section-header">
        <h2 class="section-title">Nested Breakdown & Caches</h2>
        <span class="section-count">{currentCategory.subBreakdown.length} sub-groups detected</span>
      </div>

      <div class="sub-items-list">
        {#each currentCategory.subBreakdown as subItem}
          <div class="sub-item-row">
            <div class="sub-item-icon">
              <Folder size={18} />
            </div>

            <div class="sub-item-details">
              <div class="sub-item-name-row">
                <span class="sub-item-name">{subItem.name}</span>
                {#if subItem.safeToReview}
                  <Badge variant="success" size="sm" dot={true}>Safe to Clean</Badge>
                {:else}
                  <Badge variant="neutral" size="sm">System Protected</Badge>
                {/if}
              </div>
              <div class="sub-item-meta">
                <span>{subItem.count} tracked references</span>
                <span>•</span>
                <span>Calculated via APFS directory index</span>
              </div>
            </div>

            <div class="sub-item-actions">
              <span class="sub-item-size">{subItem.size}</span>
              {#if subItem.safeToReview}
                <Button
                  variant="secondary"
                  size="sm"
                  onclick={() => handleCleanSubItem(subItem.name, subItem.size)}
                  title="Wipe this sub-cache"
                >
                  <Trash2 size={13} />
                  <span>Wipe</span>
                </Button>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .drilldown-viewport {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    background-color: var(--bg);
  }

  .drilldown-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-6);
    border-bottom: 1px solid var(--border);
    background-color: var(--surface-1);
    position: sticky;
    top: 0;
    z-index: 20;
    gap: 16px;
  }

  .category-tabs {
    display: flex;
    align-items: center;
    gap: 6px;
    overflow-x: auto;
    max-width: 65%;
  }

  .cat-tab {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
    background-color: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-full);
    transition: all var(--duration-fast) var(--ease-out);
    white-space: nowrap;
  }

  .cat-tab:hover {
    color: var(--text-primary);
    background-color: var(--surface-hover);
  }

  .cat-tab.active {
    color: var(--text-primary);
    background-color: var(--surface-3);
    border-color: var(--tab-color);
  }

  .tab-size {
    font-size: 10.5px;
    color: var(--text-tertiary);
    font-weight: 600;
  }

  .drilldown-content {
    padding: var(--space-6);
    max-width: 960px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }

  .cat-hero-card {
    background-color: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: var(--space-6);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  .hero-main-info {
    display: flex;
    align-items: center;
    gap: 18px;
  }

  .hero-icon-wrap {
    width: 60px;
    height: 60px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .hero-meta-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 2px;
  }

  .hero-meta-badge .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
  }

  .cat-title {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }

  .cat-size-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-top: 4px;
  }

  .cat-size {
    font-size: 18px;
    font-weight: 800;
    color: var(--accent);
  }

  .cat-items-count {
    font-size: 12px;
    color: var(--text-tertiary);
  }

  .hero-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  :global(.sparkle-icon) {
    color: var(--accent);
  }

  .rebuild-note-banner {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background-color: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-size: 12.5px;
    color: var(--text-secondary);
  }

  .note-icon-wrap {
    color: var(--accent);
    flex-shrink: 0;
  }

  .breakdown-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .section-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .section-count {
    font-size: 12px;
    color: var(--text-tertiary);
  }

  .sub-items-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .sub-item-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 18px;
    background-color: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    transition: all var(--duration-fast) var(--ease-out);
  }

  .sub-item-row:hover {
    border-color: var(--border-strong);
    background-color: var(--surface-hover);
  }

  .sub-item-icon {
    color: var(--text-tertiary);
    flex-shrink: 0;
  }

  .sub-item-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .sub-item-name-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .sub-item-name {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .sub-item-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    color: var(--text-tertiary);
  }

  .sub-item-actions {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-shrink: 0;
  }

  .sub-item-size {
    font-size: 13.5px;
    font-weight: 700;
    color: var(--text-primary);
    min-width: 65px;
    text-align: right;
  }
</style>
