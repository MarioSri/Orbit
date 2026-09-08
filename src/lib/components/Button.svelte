<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'icon-only';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onclick?: (e: MouseEvent) => void;
    class?: string;
    title?: string;
    ariaLabel?: string;
    children?: Snippet;
  }

  let {
    variant = 'primary',
    size = 'md',
    disabled = false,
    type = 'button',
    onclick,
    class: customClass = '',
    title,
    ariaLabel,
    children,
    ...restProps
  }: Props = $props();
</script>

<button
  {type}
  {disabled}
  {onclick}
  {title}
  aria-label={ariaLabel || title}
  class="orbit-btn {variant} {size} {customClass}"
  {...restProps}
>
  {#if children}
    {@render children()}
  {/if}
</button>

<style>
  .orbit-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: 500;
    letter-spacing: -0.01em;
    border-radius: var(--radius-md);
    transition: background-color var(--duration-fast) var(--ease-out),
                color var(--duration-fast) var(--ease-out),
                border-color var(--duration-fast) var(--ease-out),
                transform var(--duration-fast) var(--ease-out);
    white-space: nowrap;
    text-decoration: none;
    border: 1px solid transparent;
  }

  /* Sizes */
  .orbit-btn.sm {
    height: 30px;
    padding: 0 10px;
    font-size: 12px;
    border-radius: var(--radius-sm);
  }

  .orbit-btn.md {
    height: 38px;
    padding: 0 16px;
    font-size: 13.5px;
  }

  .orbit-btn.lg {
    height: 46px;
    padding: 0 22px;
    font-size: 15px;
    border-radius: var(--radius-lg);
  }

  .orbit-btn.icon-only.sm {
    width: 30px;
    height: 30px;
    padding: 0;
  }
  .orbit-btn.icon-only.md {
    width: 38px;
    height: 38px;
    padding: 0;
  }
  .orbit-btn.icon-only.lg {
    width: 46px;
    height: 46px;
    padding: 0;
  }

  /* Variants */
  .orbit-btn.primary {
    background-color: var(--accent);
    color: var(--accent-text);
  }
  .orbit-btn.primary:hover:not(:disabled) {
    background-color: var(--accent-hover);
  }

  .orbit-btn.secondary {
    background-color: var(--surface-2);
    color: var(--text-primary);
    border-color: var(--border);
  }
  .orbit-btn.secondary:hover:not(:disabled) {
    background-color: var(--surface-hover);
    border-color: var(--border-strong);
  }

  .orbit-btn.danger {
    background-color: var(--danger-subtle);
    color: var(--danger-text);
    border-color: rgba(239, 68, 68, 0.2);
  }
  .orbit-btn.danger:hover:not(:disabled) {
    background-color: var(--danger);
    color: #ffffff;
    border-color: var(--danger);
  }

  .orbit-btn.ghost {
    background-color: transparent;
    color: var(--text-secondary);
  }
  .orbit-btn.ghost:hover:not(:disabled) {
    background-color: var(--surface-2);
    color: var(--text-primary);
  }

  .orbit-btn.icon-only {
    background-color: var(--surface-2);
    color: var(--text-secondary);
    border-color: var(--border);
  }
  .orbit-btn.icon-only:hover:not(:disabled) {
    background-color: var(--surface-hover);
    color: var(--text-primary);
    border-color: var(--border-strong);
  }

  /* States */
  .orbit-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    pointer-events: none;
  }

  .orbit-btn:active:not(:disabled) {
    transform: scale(0.97);
  }
</style>
