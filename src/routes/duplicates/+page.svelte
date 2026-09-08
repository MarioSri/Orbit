<script lang="ts">
  import { duplicateClusters, cleanDuplicateCluster, addToast } from '$lib/store';
  import { isPro } from '$lib/authStore';
  import Button from '$lib/components/Button.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import Card from '$lib/components/Card.svelte';
  import ProGate from '$lib/components/ProGate.svelte';
  import {
    Copy,
    CheckCircle2,
    Trash2,
    Video,
    Image,
    FileText,
    Star,
    Sparkles,
    CheckSquare,
    Square
  } from '@lucide/svelte';

  let totalReclaimableGb = $derived(
    +$duplicateClusters.reduce((acc, c) => acc + c.totalReclaimableGb, 0).toFixed(1)
  );

  function toggleItemSelection(clusterId: string, itemId: string) {
    duplicateClusters.update(clusters =>
      clusters.map(cluster => {
        if (cluster.id === clusterId) {
          return {
            ...cluster,
            items: cluster.items.map(item =>
              item.id === itemId ? { ...item, isSelected: !item.isSelected } : item
            )
          };
        }
        return cluster;
      })
    );
  }

  function handleKeepBestCleanRest(clusterId: string) {
    cleanDuplicateCluster(clusterId);
  }

  function handleCleanAllSelected() {
    duplicateClusters.update(clusters => []);
    addToast('All duplicate clusters cleaned', `Purged ${totalReclaimableGb} GB of redundant files`, 'success');
  }
</script>

{#if !$isPro}
  <ProGate
    featureName="Duplicate & Near-Duplicate Finder"
    description="Intelligently detects burst shots, duplicated exports, and redundant screen recordings using perceptual hashing — all on-device."
  />
{:else}
<div class="duplicates-viewport">
  <div class="duplicates-container">
    <!-- Header -->
    <div class="duplicates-header">
      <div>
        <div class="header-badge">
          <Badge variant="purple" size="sm" dot={true}>Perceptual Hashing</Badge>
        </div>
        <h1 class="header-title">Duplicate & Near-Duplicate Finder</h1>
        <p class="header-subtitle">
          Intelligently grouped clusters of burst shots, duplicated keynote exports, and video screen recordings.
        </p>
      </div>

      <div class="header-stats">
        <div class="reclaimable-box">
          <span class="reclaimable-label">Estimated Reclaimable</span>
          <span class="reclaimable-val">{totalReclaimableGb} GB</span>
        </div>
        {#if $duplicateClusters.length > 0}
          <Button variant="primary" size="md" onclick={handleCleanAllSelected}>
            <Trash2 size={15} />
            <span>Clean All Clusters</span>
          </Button>
        {/if}
      </div>
    </div>

    <!-- Clusters Gallery List -->
    {#if $duplicateClusters.length > 0}
      <div class="clusters-stack">
        {#each $duplicateClusters as cluster (cluster.id)}
          <div class="cluster-card">
            <!-- Cluster Header -->
            <div class="cluster-header">
              <div class="cluster-title-wrap">
                <Copy size={16} class="cluster-icon" />
                <h3 class="cluster-name">{cluster.clusterName}</h3>
                <Badge variant="purple" size="sm">{cluster.category}</Badge>
              </div>

              <div class="cluster-actions">
                <span class="cluster-savings">+{cluster.formattedReclaimable}</span>
                <Button
                  variant="primary"
                  size="sm"
                  onclick={() => handleKeepBestCleanRest(cluster.id)}
                >
                  <Star size={13} />
                  <span>Keep Best, Clean Rest</span>
                </Button>
              </div>
            </div>

            <!-- Items Thumbnails Grid -->
            <div class="cluster-grid">
              {#each cluster.items as item (item.id)}
                <div
                  role="button"
                  tabindex="0"
                  class="thumb-card {item.isBest ? 'is-best' : ''} {item.isSelected ? 'is-selected' : ''}"
                  onclick={() => !item.isBest && toggleItemSelection(cluster.id, item.id)}
                  onkeydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (!item.isBest) toggleItemSelection(cluster.id, item.id);
                    }
                  }}
                >
                  <!-- Stylized Thumbnail Box -->
                  <div
                    class="thumb-preview"
                    style="background-color: {item.previewColor};"
                  >
                    {#if item.type === 'video'}
                      <Video size={24} class="thumb-media-icon" />
                    {:else if item.type === 'image'}
                      <Image size={24} class="thumb-media-icon" />
                    {:else}
                      <FileText size={24} class="thumb-media-icon" />
                    {/if}

                    <div class="thumb-badge-overlay">
                      {#if item.isBest}
                        <span class="best-pill">
                          <Star size={11} />
                          Best Quality
                        </span>
                      {:else}
                        <button
                          type="button"
                          class="select-checkbox"
                          aria-label="Toggle selection"
                        >
                          {#if item.isSelected}
                            <CheckSquare size={16} class="text-danger" />
                          {:else}
                            <Square size={16} />
                          {/if}
                        </button>
                      {/if}
                    </div>

                    <span class="resolution-tag">{item.resolution}</span>
                  </div>

                  <!-- Details -->
                  <div class="thumb-info">
                    <span class="thumb-name" title={item.name}>{item.name}</span>
                    <div class="thumb-meta-line">
                      <span class="thumb-size">{item.formattedSize}</span>
                      <span class="thumb-date">{item.date}</span>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <!-- Empty duplicates state -->
      <div class="empty-duplicates-card">
        <div class="empty-sparkle-box">
          <CheckCircle2 size={40} class="text-success" />
        </div>
        <h2 class="empty-title">Zero Duplicates Remaining</h2>
        <p class="empty-desc">
          Your perceptual hashing index is completely clear of redundant video bursts and duplicate project exports.
        </p>
        <Button variant="secondary" size="md" onclick={() => location.reload()}>
          <span>Re-scan Library</span>
        </Button>
      </div>
    {/if}
  </div>
</div>
{/if}

<style>
  .duplicates-viewport {
    height: 100%;
    overflow-y: auto;
    background-color: var(--bg);
    padding: var(--space-6);
  }

  .duplicates-container {
    max-width: 980px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }

  .duplicates-header {
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
    max-width: 580px;
  }

  .header-stats {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .reclaimable-box {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .reclaimable-label {
    font-size: 11px;
    color: var(--text-tertiary);
  }

  .reclaimable-val {
    font-size: 18px;
    font-weight: 800;
    color: var(--accent);
  }

  /* Clusters */
  .clusters-stack {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }

  .cluster-card {
    background-color: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .cluster-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border-subtle);
    padding-bottom: var(--space-3);
  }

  .cluster-title-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  :global(.cluster-icon) {
    color: var(--cat-photos);
  }

  .cluster-name {
    font-size: 14.5px;
    font-weight: 700;
    color: var(--text-primary);
  }

  .cluster-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .cluster-savings {
    font-size: 12.5px;
    font-weight: 700;
    color: var(--success);
  }

  /* Grid */
  .cluster-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--space-4);
  }

  .thumb-card {
    background-color: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    overflow: hidden;
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
    display: flex;
    flex-direction: column;
  }

  .thumb-card:hover {
    border-color: var(--border-strong);
    transform: translateY(-2px);
  }

  .thumb-card.is-best {
    border-color: rgba(99, 102, 241, 0.5);
    background-color: rgba(99, 102, 241, 0.04);
  }

  .thumb-card.is-selected {
    border-color: var(--danger);
    background-color: var(--danger-subtle);
  }

  .thumb-preview {
    height: 120px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :global(.thumb-media-icon) {
    color: rgba(255, 255, 255, 0.85);
  }

  .thumb-badge-overlay {
    position: absolute;
    top: 8px;
    right: 8px;
  }

  .best-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 10.5px;
    font-weight: 700;
    background-color: rgba(0, 0, 0, 0.65);
    color: #ffd166;
    padding: 3px 7px;
    border-radius: var(--radius-sm);
    backdrop-filter: blur(4px);
  }

  .select-checkbox {
    background: rgba(0, 0, 0, 0.5);
    color: #ffffff;
    border: none;
    border-radius: 4px;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .resolution-tag {
    position: absolute;
    bottom: 6px;
    left: 8px;
    font-size: 10px;
    font-weight: 600;
    color: #ffffff;
    background: rgba(0, 0, 0, 0.65);
    padding: 2px 6px;
    border-radius: var(--radius-xs);
  }

  .thumb-info {
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .thumb-name {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .thumb-meta-line {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: var(--text-tertiary);
  }

  .thumb-size {
    font-weight: 600;
    color: var(--text-secondary);
  }

  /* Empty state */
  .empty-duplicates-card {
    background-color: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: var(--space-8);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .empty-sparkle-box {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: var(--success-subtle);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--space-4);
  }

  .empty-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--space-2);
  }

  .empty-desc {
    font-size: 13px;
    color: var(--text-secondary);
    max-width: 440px;
    line-height: 1.5;
    margin-bottom: var(--space-6);
  }
</style>
