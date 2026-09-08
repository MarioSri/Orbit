<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'accent' | 'purple' | 'coral' | 'teal' | 'blue';
    dot?: boolean;
    size?: 'sm' | 'md';
    class?: string;
    children?: Snippet;
  }

  let {
    variant = 'neutral',
    dot = false,
    size = 'sm',
    class: customClass = '',
    children
  }: Props = $props();
</script>

<span class="orbit-badge {variant} {size} {customClass}">
  {#if dot}
    <span class="badge-dot" aria-hidden="true"></span>
  {/if}
  {#if children}
    {@render children()}
  {/if}
</span>

<style>
  .orbit-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
    line-height: 1;
    border-radius: var(--radius-full);
    letter-spacing: 0.01em;
    border: 1px solid transparent;
    user-select: none;
    white-space: nowrap;
  }

  .orbit-badge.sm {
    font-size: 11.5px;
    padding: 3px 8px;
  }

  .orbit-badge.md {
    font-size: 12.5px;
    padding: 4px 11px;
  }

  .badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: currentColor;
  }

  /* Variants */
  .orbit-badge.neutral {
    background-color: var(--surface-3);
    color: var(--text-secondary);
    border-color: var(--border);
  }

  .orbit-badge.success {
    background-color: var(--success-subtle);
    color: var(--success-text);
    border-color: rgba(16, 185, 129, 0.2);
  }

  .orbit-badge.warning {
    background-color: var(--warning-subtle);
    color: var(--warning-text);
    border-color: rgba(245, 158, 11, 0.2);
  }

  .orbit-badge.danger {
    background-color: var(--danger-subtle);
    color: var(--danger-text);
    border-color: rgba(239, 68, 68, 0.2);
  }

  .orbit-badge.accent {
    background-color: var(--accent-subtle);
    color: var(--accent);
    border-color: rgba(99, 102, 241, 0.2);
  }

  .orbit-badge.purple {
    background-color: rgba(168, 85, 247, 0.12);
    color: #c084fc;
    border-color: rgba(168, 85, 247, 0.2);
  }

  .orbit-badge.coral {
    background-color: rgba(249, 115, 22, 0.12);
    color: #fb923c;
    border-color: rgba(249, 115, 22, 0.2);
  }

  .orbit-badge.teal {
    background-color: rgba(20, 184, 166, 0.12);
    color: #2dd4bf;
    border-color: rgba(20, 184, 166, 0.2);
  }

  .orbit-badge.blue {
    background-color: rgba(59, 130, 246, 0.12);
    color: #60a5fa;
    border-color: rgba(59, 130, 246, 0.2);
  }
</style>
