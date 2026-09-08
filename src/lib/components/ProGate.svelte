<script lang="ts">
  import { goto } from '$app/navigation';
  import Button from './Button.svelte';
  import Badge from './Badge.svelte';
  import { Lock, ArrowRight, Sparkles } from '@lucide/svelte';
  import type { Snippet } from 'svelte';

  let {
    featureName,
    description,
    children
  }: {
    featureName: string;
    description: string;
    children?: Snippet;
  } = $props();
</script>

<div class="pro-gate-overlay">
  <div class="pro-gate-card">
    <div class="pro-icon-box">
      <Lock size={28} class="pro-lock-icon" />
    </div>

    <Badge variant="coral" size="md">Pro Feature</Badge>

    <h2 class="pro-gate-title">{featureName}</h2>
    <p class="pro-gate-desc">{description}</p>

    <Button variant="primary" size="lg" onclick={() => goto('/settings')}>
      <Sparkles size={14} />
      <span>Upgrade to Pro</span>
      <ArrowRight size={14} />
    </Button>

    <p class="pro-gate-hint">Unlock all premium features with a single subscription</p>
  </div>

  {#if children}
    <div class="pro-gate-preview">
      {@render children()}
    </div>
  {/if}
</div>

<style>
  .pro-gate-overlay {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pro-gate-preview {
    position: absolute;
    inset: 0;
    opacity: 0.15;
    pointer-events: none;
    filter: blur(2px);
    overflow: hidden;
  }

  .pro-gate-card {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--space-3);
    padding: var(--space-8);
    background-color: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    max-width: 420px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  .pro-icon-box {
    width: 56px;
    height: 56px;
    border-radius: var(--radius-lg);
    background-color: var(--accent-subtle);
    border: 1px solid rgba(99, 102, 241, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :global(.pro-lock-icon) {
    color: var(--accent);
  }

  .pro-gate-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }

  .pro-gate-desc {
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.5;
    max-width: 340px;
  }

  .pro-gate-hint {
    font-size: 11px;
    color: var(--text-tertiary);
    margin-top: var(--space-1);
  }
</style>
