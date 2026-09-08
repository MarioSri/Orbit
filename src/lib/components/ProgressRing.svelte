<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    value?: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    trackColor?: string;
    class?: string;
    children?: Snippet;
  }

  let {
    value = 77,
    max = 100,
    size = 140,
    strokeWidth = 10,
    color = 'var(--accent)',
    trackColor = 'var(--surface-3)',
    class: customClass = '',
    children
  }: Props = $props();

  let radius = $derived((size - strokeWidth) / 2);
  let circumference = $derived(2 * Math.PI * radius);
  let clampedPercent = $derived(Math.min(Math.max((value / max) * 100, 0), 100));
  let strokeDashoffset = $derived(circumference - (clampedPercent / 100) * circumference);
</script>

<div
  class="progress-ring-container {customClass}"
  style="width: {size}px; height: {size}px;"
>
  <svg
    width={size}
    height={size}
    viewBox="0 0 {size} {size}"
    class="progress-ring-svg"
  >
    <!-- Background Track -->
    <circle
      cx={size / 2}
      cy={size / 2}
      r={radius}
      fill="transparent"
      stroke={trackColor}
      stroke-width={strokeWidth}
      stroke-linecap="round"
    />
    <!-- Animated Value Ring -->
    <circle
      cx={size / 2}
      cy={size / 2}
      r={radius}
      fill="transparent"
      stroke={color}
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-dasharray={circumference}
      stroke-dashoffset={strokeDashoffset}
      class="progress-value"
    />
  </svg>

  <div class="progress-ring-content">
    {#if children}
      {@render children()}
    {:else}
      <span class="default-value">{Math.round(clampedPercent)}%</span>
    {/if}
  </div>
</div>

<style>
  .progress-ring-container {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .progress-ring-svg {
    transform: rotate(-90deg);
  }

  .progress-value {
    transition: stroke-dashoffset 800ms var(--ease-spring),
                stroke var(--duration-fast) var(--ease-out);
  }

  .progress-ring-content {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    text-align: center;
  }

  .default-value {
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text-primary);
  }
</style>
