<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import {
    swipeDeck,
    reclaimedSoFarGb,
    cleanSwipeItem,
    keepSwipeItem
  } from '$lib/store';
  import Button from '$lib/components/Button.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import {
    Check,
    Trash2,
    HardDrive,
    ArrowLeft,
    Clock,
    Folder,
    ShieldAlert,
    RotateCcw,
    ShieldCheck,
    Sparkles
  } from '@lucide/svelte';
  import { initialSwipeDeck } from '$lib/mockData';

  let currentCardIndex = $state(0);
  let swipeDirection = $state<'clean' | 'keep' | null>(null);
  let isAnimating = $state(false);

  let currentItem = $derived($swipeDeck[currentCardIndex]);
  let totalCardsCount = $derived($swipeDeck.length);

  function handleClean() {
    if (!currentItem || isAnimating) return;
    isAnimating = true;
    swipeDirection = 'clean';
    const item = currentItem;

    setTimeout(() => {
      cleanSwipeItem(item);
      swipeDirection = null;
      isAnimating = false;
    }, 280);
  }

  function handleKeep() {
    if (!currentItem || isAnimating) return;
    isAnimating = true;
    swipeDirection = 'keep';
    const item = currentItem;

    setTimeout(() => {
      keepSwipeItem(item);
      swipeDirection = null;
      isAnimating = false;
    }, 280);
  }

  // Keyboard navigation support (ArrowLeft = Keep, ArrowRight = Clean)
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleKeep();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleClean();
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  function resetDeck() {
    swipeDeck.set([...initialSwipeDeck]);
    currentCardIndex = 0;
  }
</script>

<div class="triage-viewport">
  <!-- Top Bar with Reclaimed Counter & Progress -->
  <div class="triage-header">
    <Button variant="ghost" size="sm" onclick={() => goto('/')}>
      <ArrowLeft size={16} />
      <span>Dashboard</span>
    </Button>

    <div class="reclaimed-counter">
      <span class="counter-label">Reclaimed so far:</span>
      <span class="counter-value">{$reclaimedSoFarGb} GB</span>
    </div>

    <div class="triage-meta">
      {#if currentItem}
        <span class="progress-indicator">Item 1 of {totalCardsCount}</span>
      {:else}
        <Badge variant="success" size="sm" dot={true}>Completed</Badge>
      {/if}
    </div>
  </div>

  <!-- Card Arena -->
  <div class="triage-arena">
    {#if currentItem}
      <div class="deck-stack">
        <!-- Background preview of next card in stack -->
        {#if totalCardsCount > 1}
          <div class="card-underlay" aria-hidden="true"></div>
        {/if}

        <!-- Active Swipeable Card -->
        <div
          class="triage-card {swipeDirection ? `swiping-${swipeDirection}` : ''}"
        >
          <!-- Category & Safety Confidence -->
          <div class="card-badges-row">
            <Badge variant="purple" size="sm" class="cat-pill">
              {currentItem.category}
            </Badge>

            <Badge
              variant={currentItem.confidence === 'safe' ? 'success' : currentItem.confidence === 'probably_safe' ? 'warning' : 'danger'}
              size="sm"
              dot={true}
            >
              {currentItem.confidence === 'safe' ? 'Safe to Delete' : currentItem.confidence === 'probably_safe' ? 'Probably Safe' : 'Review Carefully'}
            </Badge>
          </div>

          <!-- Big Size Display -->
          <div class="card-size-hero">
            <span class="size-number">{currentItem.formattedSize}</span>
            <span class="size-label">Reclaimable</span>
          </div>

          <!-- File / Folder Details -->
          <div class="card-file-details">
            <h2 class="card-file-name" title={currentItem.name}>
              {currentItem.name}
            </h2>
            <div class="card-file-path" title={currentItem.path}>
              <Folder size={13} class="path-icon" />
              <span>{currentItem.path}</span>
            </div>
          </div>

          <!-- Plain-English Reason & Last Accessed -->
          <div class="card-explanation-box">
            <div class="reason-row">
              <span class="reason-heading">Why clean this:</span>
              <p class="reason-body">{currentItem.reason}</p>
            </div>

            <div class="accessed-row">
              <Clock size={13} class="time-icon" />
              <span>Last accessed: <strong>{currentItem.lastAccessed}</strong></span>
            </div>
          </div>

          <!-- Safety Guarantee -->
          <div class="vault-safety-guarantee">
            <ShieldCheck size={14} class="shield-icon" />
            <span>Protected by Orbit 30-Day Safety Vault. Restore anytime with 1 tap.</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="triage-controls">
        <button
          type="button"
          class="action-circle-btn keep-btn"
          onclick={handleKeep}
          disabled={isAnimating}
          title="Keep on disk (Left Arrow)"
          aria-label="Keep this item"
        >
          <Check size={28} strokeWidth={2.5} />
          <span class="btn-caption">Keep (←)</span>
        </button>

        <button
          type="button"
          class="action-circle-btn clean-btn"
          onclick={handleClean}
          disabled={isAnimating}
          title="Send to Safety Vault (Right Arrow)"
          aria-label="Clean this item"
        >
          <Trash2 size={26} strokeWidth={2.5} />
          <span class="btn-caption">Clean (→)</span>
        </button>
      </div>
    {:else}
      <!-- Completed Deck State -->
      <div class="completed-state">
        <div class="celebration-icon-box">
          <Sparkles size={40} class="celebrate-sparkle" />
        </div>

        <h2 class="completed-title">Triage Deck Complete!</h2>
        <p class="completed-desc">
          You have triaged all major storage candidates and reclaimed a total of <strong>{$reclaimedSoFarGb} GB</strong> to your Safety Vault.
        </p>

        <div class="completed-actions">
          <Button variant="secondary" size="md" onclick={resetDeck}>
            <RotateCcw size={15} />
            <span>Reset Sample Deck</span>
          </Button>
          <Button variant="primary" size="md" onclick={() => goto('/vault')}>
            <ShieldCheck size={15} />
            <span>Inspect Safety Vault</span>
          </Button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .triage-viewport {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--bg);
    overflow: hidden;
  }

  .triage-header {
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--space-6);
    border-bottom: 1px solid var(--border);
    background-color: var(--surface-1);
    z-index: 10;
  }

  .reclaimed-counter {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: var(--surface-2);
    border: 1px solid var(--border);
    padding: 4px 14px;
    border-radius: var(--radius-full);
  }

  .counter-label {
    font-size: 11.5px;
    color: var(--text-secondary);
  }

  .counter-value {
    font-size: 14px;
    font-weight: 700;
    color: var(--success);
  }

  .progress-indicator {
    font-size: 12px;
    color: var(--text-tertiary);
    font-weight: 500;
  }

  /* Arena */
  .triage-arena {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-6);
    position: relative;
  }

  .deck-stack {
    position: relative;
    width: 100%;
    max-width: 460px;
    height: 440px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-underlay {
    position: absolute;
    width: 95%;
    height: 96%;
    background-color: var(--surface-2);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-xl);
    transform: translateY(12px) scale(0.96);
    z-index: 1;
    opacity: 0.6;
  }

  .triage-card {
    position: absolute;
    inset: 0;
    z-index: 2;
    background-color: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: var(--space-6);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    transition: transform 260ms var(--ease-spring), opacity 220ms var(--ease-out);
    user-select: none;
  }

  .triage-card.swiping-clean {
    transform: translate(360px, 40px) rotate(22deg) scale(0.9) !important;
    opacity: 0;
  }

  .triage-card.swiping-keep {
    transform: translate(-360px, 40px) rotate(-22deg) scale(0.9) !important;
    opacity: 0;
  }

  .card-badges-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .card-size-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin: var(--space-2) 0;
  }

  .size-number {
    font-size: 46px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text-primary);
    line-height: 1;
  }

  .size-label {
    font-size: 11.5px;
    font-weight: 600;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 4px;
  }

  .card-file-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
    text-align: center;
  }

  .card-file-name {
    font-size: 15px;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.3;
    word-break: break-word;
  }

  .card-file-path {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 11px;
    font-family: var(--font-mono);
    color: var(--text-tertiary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }

  :global(.path-icon) {
    flex-shrink: 0;
  }

  .card-explanation-box {
    background-color: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: var(--space-3) var(--space-4);
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 12px;
  }

  .reason-heading {
    font-weight: 600;
    color: var(--text-secondary);
    display: block;
    margin-bottom: 2px;
  }

  .reason-body {
    color: var(--text-primary);
    line-height: 1.45;
  }

  .accessed-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--text-tertiary);
    border-top: 1px solid var(--border-subtle);
    padding-top: 6px;
  }

  .vault-safety-guarantee {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 11px;
    color: var(--success-text);
    text-align: center;
  }

  :global(.shield-icon) {
    color: var(--success);
    flex-shrink: 0;
  }

  /* Action Buttons */
  .triage-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 48px;
    margin-top: var(--space-6);
  }

  .action-circle-btn {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    transition: all var(--duration-fast) var(--ease-spring);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
    position: relative;
  }

  .action-circle-btn:active:not(:disabled) {
    transform: scale(0.92);
  }

  .action-circle-btn.keep-btn {
    background-color: var(--surface-2);
    color: var(--text-secondary);
    border-color: var(--border);
  }

  .action-circle-btn.keep-btn:hover {
    background-color: var(--success-subtle);
    color: var(--success);
    border-color: rgba(16, 185, 129, 0.3);
  }

  .action-circle-btn.clean-btn {
    background-color: var(--danger-subtle);
    color: var(--danger-text);
    border-color: rgba(239, 68, 68, 0.3);
  }

  .action-circle-btn.clean-btn:hover {
    background-color: var(--danger);
    color: #ffffff;
    border-color: var(--danger);
  }

  .btn-caption {
    font-size: 10px;
    font-weight: 600;
    margin-top: 2px;
  }

  /* Completed State */
  .completed-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 420px;
    padding: var(--space-8);
    background-color: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
  }

  .celebration-icon-box {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background-color: var(--success-subtle);
    border: 1px solid rgba(16, 185, 129, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--space-4);
  }

  :global(.celebrate-sparkle) {
    color: var(--success);
  }

  .completed-title {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--space-2);
  }

  .completed-desc {
    font-size: 13.5px;
    color: var(--text-secondary);
    line-height: 1.5;
    margin-bottom: var(--space-6);
  }

  .completed-actions {
    display: flex;
    gap: 12px;
  }
</style>
