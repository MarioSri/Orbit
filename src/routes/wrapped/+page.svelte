<script lang="ts">
  import { initialStorageWrapped } from '$lib/mockData';
  import { addToast } from '$lib/store';
  import Button from '$lib/components/Button.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import Card from '$lib/components/Card.svelte';
  import {
    Gift,
    Share2,
    Sparkles,
    Check,
    Download,
    Flame,
    Copy,
    FolderGit2,
    Camera,
    Trash2,
    Container
  } from '@lucide/svelte';

  const data = initialStorageWrapped;
  let isCopied = $state(false);

  function getStatIcon(icon: string) {
    switch (icon) {
      case 'FolderGit2': return FolderGit2;
      case 'Camera': return Camera;
      case 'Trash2': return Trash2;
      case 'Container': return Container;
      default: return Sparkles;
    }
  }

  function handleShare() {
    isCopied = true;
    const shareText = `🛸 My Orbit Storage Wrapped: "${data.personalityTitle}"\n- 74 Abandoned node_modules\n- 4,218 unread screenshots\n- 84 days since last trash empty\n#OrbitWrapped2026`;
    navigator.clipboard?.writeText?.(shareText);
    addToast('Card Copied to Clipboard!', 'Share your Storage Roast on Twitter/X or Slack', 'success');
    setTimeout(() => {
      isCopied = false;
    }, 2400);
  }

  function handleExportImage() {
    addToast('Exported High-Res Card', 'Saved to ~/Downloads/Orbit_Wrapped_2026.png', 'success');
  }
</script>

<div class="wrapped-viewport">
  <div class="wrapped-container">
    <!-- Header Controls -->
    <div class="wrapped-top-controls">
      <div>
        <div class="wrapped-badge-row">
          <Badge variant="coral" size="sm" dot={true}>Viral Feature</Badge>
          <span class="wrapped-year">ANNUAL EDITION</span>
        </div>
        <h1 class="wrapped-page-title">Storage Wrapped '26</h1>
        <p class="wrapped-page-desc">Your SSD called. It has a few polite notes about your file hygiene.</p>
      </div>

      <div class="export-buttons-group">
        <Button variant="secondary" size="md" onclick={handleExportImage}>
          <Download size={15} />
          <span>Save Image</span>
        </Button>
        <Button variant="primary" size="md" onclick={handleShare}>
          {#if isCopied}
            <Check size={15} />
            <span>Copied to Clipboard!</span>
          {:else}
            <Share2 size={15} />
            <span>Share Roast</span>
          {/if}
        </Button>
      </div>
    </div>

    <!-- The Shareable Wrapped Poster Card -->
    <div class="wrapped-poster">
      <!-- Top banner of poster -->
      <div class="poster-banner">
        <div class="poster-brand">
          <span>ORBIT // STORAGE ROAST 2026</span>
        </div>
        <div class="poster-serial">
          <span>APFS INDEX #09-420-ORBIT</span>
        </div>
      </div>

      <!-- Personality Title Hero -->
      <div class="poster-hero">
        <div class="personality-avatar" aria-hidden="true">
          {data.avatarEmoji}
        </div>
        <div class="personality-badge">
          <span>YOUR STORAGE PERSONALITY</span>
        </div>
        <h2 class="personality-title">{data.personalityTitle}</h2>
        <p class="personality-tagline">{data.personalityTagline}</p>
      </div>

      <!-- Playful Roast Paragraph -->
      <div class="poster-roast-box">
        <div class="roast-flame-icon">
          <Flame size={20} />
        </div>
        <p class="roast-paragraph">
          "{data.roastParagraph}"
        </p>
      </div>

      <!-- 4 Playful Stats Bento Grid -->
      <div class="poster-stats-grid">
        {#each data.highlightStats as stat}
          {@const Icon = getStatIcon(stat.icon)}
          <div class="stat-bento-cell">
            <div class="stat-cell-top">
              <Icon size={16} class="cell-icon" />
              <span class="cell-label">{stat.label}</span>
            </div>
            <div class="cell-value">{stat.value}</div>
            <div class="cell-note">{stat.note}</div>
          </div>
        {/each}
      </div>

      <!-- Storage Habits Checklist -->
      <div class="poster-habits-box">
        <div class="habits-title">VERIFIED STORAGE HABITS</div>
        <div class="habits-grid">
          {#each data.habits as habit}
            <div class="habit-item">
              <span class="habit-check">✓</span>
              <span class="habit-text">{habit}</span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Poster Footer -->
      <div class="poster-footer">
        <span class="footer-tag">#OrbitWrapped2026</span>
        <span class="footer-disclaimer">Scanned 512 GB locally on Apple Silicon • Zero Cloud Telemetry</span>
      </div>
    </div>
  </div>
</div>

<style>
  .wrapped-viewport {
    height: 100%;
    overflow-y: auto;
    background-color: var(--bg);
    padding: var(--space-6);
  }

  .wrapped-container {
    max-width: 820px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }

  .wrapped-top-controls {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
  }

  .wrapped-badge-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  .wrapped-year {
    font-size: 11px;
    font-weight: 700;
    color: var(--text-tertiary);
    letter-spacing: 0.08em;
  }

  .wrapped-page-title {
    font-size: 24px;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }

  .wrapped-page-desc {
    font-size: 13.5px;
    color: var(--text-secondary);
    margin-top: 4px;
  }

  .export-buttons-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* Poster Card */
  .wrapped-poster {
    background-color: var(--surface-1);
    border: 2px solid var(--border-strong);
    border-radius: var(--radius-xl);
    padding: var(--space-6) var(--space-8);
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    position: relative;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.35);
  }

  .poster-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--text-tertiary);
    border-bottom: 1px solid var(--border-subtle);
    padding-bottom: var(--space-3);
  }

  /* Hero */
  .poster-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .personality-avatar {
    font-size: 52px;
    line-height: 1;
    margin-bottom: var(--space-2);
  }

  .personality-badge {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: var(--accent);
    background-color: var(--accent-subtle);
    border: 1px solid rgba(99, 102, 241, 0.25);
    padding: 3px 10px;
    border-radius: var(--radius-full);
    margin-bottom: 8px;
  }

  .personality-title {
    font-size: 28px;
    font-weight: 900;
    letter-spacing: -0.03em;
    color: var(--text-primary);
    text-transform: uppercase;
  }

  .personality-tagline {
    font-size: 14px;
    color: var(--text-secondary);
    margin-top: 4px;
    font-style: italic;
  }

  /* Roast Quote Box */
  .poster-roast-box {
    background-color: rgba(249, 115, 22, 0.06);
    border: 1px solid rgba(249, 115, 22, 0.25);
    border-radius: var(--radius-lg);
    padding: var(--space-4) var(--space-5);
    display: flex;
    align-items: flex-start;
    gap: 14px;
  }

  .roast-flame-icon {
    color: var(--cat-system);
    flex-shrink: 0;
    margin-top: 2px;
  }

  .roast-paragraph {
    font-size: 13.5px;
    line-height: 1.6;
    color: var(--text-primary);
  }

  /* Stats Bento Grid */
  .poster-stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
  }

  .stat-bento-cell {
    background-color: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .stat-cell-top {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  :global(.cell-icon) {
    color: var(--accent);
  }

  .cell-label {
    font-size: 11.5px;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .cell-value {
    font-size: 22px;
    font-weight: 800;
    color: var(--text-primary);
  }

  .cell-note {
    font-size: 11px;
    color: var(--text-tertiary);
  }

  /* Habits Box */
  .poster-habits-box {
    background-color: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .habits-title {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.06em;
    color: var(--text-tertiary);
  }

  .habits-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .habit-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--text-primary);
  }

  .habit-check {
    color: var(--success);
    font-weight: 800;
    font-size: 13px;
  }

  /* Footer */
  .poster-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11px;
    color: var(--text-tertiary);
    border-top: 1px solid var(--border-subtle);
    padding-top: var(--space-3);
  }

  .footer-tag {
    font-weight: 700;
    color: var(--accent);
  }
</style>
