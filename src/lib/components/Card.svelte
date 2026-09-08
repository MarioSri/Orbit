<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    surface?: '1' | '2' | '3';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hoverable?: boolean;
    border?: boolean;
    class?: string;
    onclick?: (e: MouseEvent) => void;
    children?: Snippet;
  }

  let {
    surface = '1',
    padding = 'md',
    hoverable = false,
    border = true,
    class: customClass = '',
    onclick,
    children
  }: Props = $props();
</script>

{#if onclick}
  <button
    type="button"
    {onclick}
    class="orbit-card surface-{surface} p-{padding} {hoverable ? 'hoverable' : ''} {border ? 'has-border' : ''} {customClass} is-btn"
  >
    {#if children}
      {@render children()}
    {/if}
  </button>
{:else}
  <div
    class="orbit-card surface-{surface} p-{padding} {hoverable ? 'hoverable' : ''} {border ? 'has-border' : ''} {customClass}"
  >
    {#if children}
      {@render children()}
    {/if}
  </div>
{/if}

<style>
  .orbit-card {
    border-radius: var(--radius-lg);
    transition: background-color var(--duration-fast) var(--ease-out),
                border-color var(--duration-fast) var(--ease-out),
                transform var(--duration-fast) var(--ease-out);
    position: relative;
    overflow: hidden;
  }

  /* Surfaces */
  .surface-1 {
    background-color: var(--surface-1);
  }
  .surface-2 {
    background-color: var(--surface-2);
  }
  .surface-3 {
    background-color: var(--surface-3);
  }

  /* Borders */
  .has-border {
    border: 1px solid var(--border);
  }

  .is-btn {
    width: 100%;
    text-align: left;
    display: block;
  }

  /* Paddings */
  .p-none { padding: 0; }
  .p-sm { padding: var(--space-3); }
  .p-md { padding: var(--space-5); }
  .p-lg { padding: var(--space-6); }

  /* Hoverable */
  .hoverable {
    cursor: pointer;
  }
  .hoverable:hover {
    border-color: var(--border-strong);
    background-color: var(--surface-hover);
  }
  .hoverable:active {
    transform: scale(0.99);
  }
</style>
