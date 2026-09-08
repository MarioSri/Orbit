<script lang="ts">
  import { toasts, dismissToast } from '$lib/store';
  import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from '@lucide/svelte';
</script>

<div class="toast-viewport" aria-live="polite">
  {#each $toasts as toast (toast.id)}
    <div class="toast-item {toast.type}" role="status">
      <div class="toast-icon">
        {#if toast.type === 'success'}
          <CheckCircle2 size={16} />
        {:else if toast.type === 'warning'}
          <AlertTriangle size={16} />
        {:else if toast.type === 'danger'}
          <AlertCircle size={16} />
        {:else}
          <Info size={16} />
        {/if}
      </div>

      <div class="toast-text">
        <div class="toast-title">{toast.title}</div>
        {#if toast.message}
          <div class="toast-desc">{toast.message}</div>
        {/if}
      </div>

      <button
        type="button"
        class="toast-close"
        onclick={() => dismissToast(toast.id)}
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  {/each}
</div>

<style>
  .toast-viewport {
    position: fixed;
    top: 20px;
    right: 24px;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    gap: 8px;
    pointer-events: none;
    max-width: 360px;
  }

  .toast-item {
    pointer-events: auto;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 14px;
    background-color: var(--surface-1);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
    animation: toast-slide-in 240ms var(--ease-spring);
    transition: transform var(--duration-fast) var(--ease-out), opacity var(--duration-fast) var(--ease-out);
  }

  @keyframes toast-slide-in {
    from {
      opacity: 0;
      transform: translateY(-12px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .toast-icon {
    margin-top: 1px;
    flex-shrink: 0;
  }

  .toast-item.success .toast-icon { color: var(--success); }
  .toast-item.warning .toast-icon { color: var(--warning); }
  .toast-item.danger .toast-icon { color: var(--danger); }
  .toast-item.info .toast-icon { color: var(--info); }

  .toast-text {
    flex: 1;
    overflow: hidden;
  }

  .toast-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .toast-desc {
    font-size: 11.5px;
    color: var(--text-secondary);
    margin-top: 2px;
    line-height: 1.4;
  }

  .toast-close {
    color: var(--text-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
    border-radius: var(--radius-xs);
    transition: color var(--duration-fast) var(--ease-out);
  }

  .toast-close:hover {
    color: var(--text-primary);
  }
</style>
