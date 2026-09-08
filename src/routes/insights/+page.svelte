<script lang="ts">
  import { goto } from '$app/navigation';
  import { insightAlerts, dismissInsightAlert, addToast } from '$lib/store';
  import { isPro } from '$lib/authStore';
  import ProGate from '$lib/components/ProGate.svelte';
  import Button from '$lib/components/Button.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import Card from '$lib/components/Card.svelte';
  import {
    Sparkles,
    AlertTriangle,
    TrendingUp,
    Zap,
    X,
    ArrowRight,
    CheckCircle2,
    Calendar,
    Flame,
    RotateCcw
  } from '@lucide/svelte';
  import { initialInsightAlerts } from '$lib/mockData';

  function getAlertIcon(type: string) {
    switch (type) {
      case 'forecast': return AlertTriangle;
      case 'diff': return TrendingUp;
      case 'recommendation': return Flame;
      default: return Sparkles;
    }
  }

  function handleAction(route: string) {
    goto(route);
  }

  function handleDismiss(id: string) {
    dismissInsightAlert(id);
  }

  function restoreAlerts() {
    insightAlerts.set([...initialInsightAlerts]);
    addToast('Insights Restored', 'Refreshed forecasting pipeline', 'info');
  }
</script>

{#if !$isPro}
  <ProGate
    featureName="Insights & Predictive Alerts"
    description="Continuous background diffing that tracks storage trajectory, flags overnight spikes, and projects when your drive will be full."
  />
{:else}
<div class="insights-viewport">
  <div class="insights-container">
    <!-- Header -->
    <div class="insights-header">
      <div>
        <div class="header-pill">
          <Badge variant="accent" size="sm" dot={true}>Predictive Forecasting</Badge>
        </div>
        <h1 class="header-title">Insights & Predictive Alerts</h1>
        <p class="header-subtitle">
          Continuous background diffing that tracks storage trajectory, flags abnormal overnight spikes, and projects exhaustion dates.
        </p>
      </div>

      <div class="header-action">
        {#if $insightAlerts.length < initialInsightAlerts.length}
          <Button variant="secondary" size="sm" onclick={restoreAlerts}>
            <RotateCcw size={13} />
            <span>Reset Alerts</span>
          </Button>
        {/if}
      </div>
    </div>

    <!-- Forecasting Summary KPI Cards -->
    <div class="kpi-grid">
      <Card surface="1" padding="sm" class="kpi-card danger-kpi">
        <div class="kpi-label">Projected Drive Exhaustion</div>
        <div class="kpi-val text-danger">In 19 Days</div>
        <div class="kpi-sub">Est. date: September 25, 2026</div>
      </Card>

      <Card surface="1" padding="sm" class="kpi-card">
        <div class="kpi-label">30-Day Burn Rate</div>
        <div class="kpi-val text-warning">+2.2 GB / day</div>
        <div class="kpi-sub">Driven by Docker & 4K recordings</div>
      </Card>

      <Card surface="1" padding="sm" class="kpi-card">
        <div class="kpi-label">Reclamation Buffer</div>
        <div class="kpi-val text-success">~112.5 GB</div>
        <div class="kpi-sub">Safe caches ready to purge</div>
      </Card>
    </div>

    <!-- Vertical Alerts Feed -->
    {#if $insightAlerts.length > 0}
      <div class="alerts-feed">
        <div class="feed-header">
          <span class="feed-title">Active Intelligence Feed ({$insightAlerts.length})</span>
          <span class="feed-hint">Dismiss or act on suggestions</span>
        </div>

        <div class="cards-list">
          {#each $insightAlerts as alert (alert.id)}
            {@const Icon = getAlertIcon(alert.type)}
            <div class="alert-feed-card {alert.severity}">
              <div class="card-icon-col">
                <div class="alert-icon-wrap {alert.severity}">
                  <Icon size={18} />
                </div>
              </div>

              <div class="card-main-col">
                <div class="card-meta-line">
                  <Badge
                    variant={alert.severity === 'high' ? 'danger' : alert.severity === 'medium' ? 'warning' : 'accent'}
                    size="sm"
                  >
                    {alert.title}
                  </Badge>

                  <span class="impact-pill">
                    {alert.formattedImpact}
                  </span>
                </div>

                <h3 class="card-headline">{alert.headline}</h3>
                <p class="card-explanation">{alert.explanation}</p>

                <div class="card-action-row">
                  <Button
                    variant="primary"
                    size="sm"
                    onclick={() => handleAction(alert.actionRoute)}
                  >
                    <span>{alert.actionText}</span>
                    <ArrowRight size={13} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onclick={() => handleDismiss(alert.id)}
                  >
                    <span>Dismiss</span>
                  </Button>
                </div>
              </div>

              <div class="card-dismiss-col">
                <button
                  type="button"
                  class="dismiss-x-btn"
                  onclick={() => handleDismiss(alert.id)}
                  title="Dismiss alert"
                  aria-label="Dismiss alert"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {:else}
      <!-- Empty Feed State -->
      <div class="all-clear-card">
        <div class="clear-icon-box">
          <CheckCircle2 size={42} class="text-success" />
        </div>
        <h2 class="clear-title">All Insights Resolved</h2>
        <p class="clear-desc">
          You have dismissed all active forecasts and alert recommendations. Orbit will alert you when new storage anomalies or growth spikes are indexed.
        </p>
        <Button variant="secondary" size="md" onclick={restoreAlerts}>
          <RotateCcw size={15} />
          <span>Reload Sample Insights</span>
        </Button>
      </div>
    {/if}
  </div>
</div>
{/if}

<style>
  .insights-viewport {
    height: 100%;
    overflow-y: auto;
    background-color: var(--bg);
    padding: var(--space-6);
  }

  .insights-container {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }

  .insights-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
  }

  .header-pill {
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
    max-width: 620px;
  }

  /* KPI Grid */
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-4);
  }

  :global(.kpi-card) {
    border-radius: var(--radius-md) !important;
  }

  :global(.danger-kpi) {
    border-left: 3px solid var(--danger) !important;
  }

  .kpi-label {
    font-size: 11.5px;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .kpi-val {
    font-size: 24px;
    font-weight: 800;
    margin: 4px 0 2px 0;
  }

  .kpi-sub {
    font-size: 11px;
    color: var(--text-tertiary);
  }

  .text-danger { color: var(--danger); }
  .text-warning { color: var(--warning); }
  .text-success { color: var(--success); }

  /* Feed */
  .alerts-feed {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .feed-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .feed-hint {
    font-size: 11.5px;
    color: var(--text-tertiary);
    font-weight: 400;
  }

  .cards-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .alert-feed-card {
    background-color: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: var(--space-5);
    display: flex;
    gap: 16px;
    transition: all var(--duration-fast) var(--ease-out);
    position: relative;
  }

  .alert-feed-card:hover {
    border-color: var(--border-strong);
    background-color: var(--surface-hover);
  }

  .alert-feed-card.high {
    border-left: 3px solid var(--danger);
  }

  .alert-feed-card.medium {
    border-left: 3px solid var(--warning);
  }

  .alert-feed-card.low {
    border-left: 3px solid var(--accent);
  }

  .card-icon-col {
    flex-shrink: 0;
  }

  .alert-icon-wrap {
    width: 38px;
    height: 38px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .alert-icon-wrap.high {
    background-color: var(--danger-subtle);
    color: var(--danger);
  }

  .alert-icon-wrap.medium {
    background-color: var(--warning-subtle);
    color: var(--warning);
  }

  .alert-icon-wrap.low {
    background-color: var(--accent-subtle);
    color: var(--accent);
  }

  .card-main-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .card-meta-line {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .impact-pill {
    font-size: 11px;
    font-weight: 600;
    color: var(--success-text);
  }

  .card-headline {
    font-size: 14.5px;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.35;
  }

  .card-explanation {
    font-size: 12.5px;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .card-action-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 6px;
  }

  .card-dismiss-col {
    flex-shrink: 0;
  }

  .dismiss-x-btn {
    color: var(--text-tertiary);
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: var(--radius-xs);
    transition: color var(--duration-fast) var(--ease-out);
  }

  .dismiss-x-btn:hover {
    color: var(--text-primary);
  }

  /* All Clear */
  .all-clear-card {
    background-color: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: var(--space-8);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .clear-icon-box {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: var(--success-subtle);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--space-4);
  }

  .clear-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--space-2);
  }

  .clear-desc {
    font-size: 13px;
    color: var(--text-secondary);
    max-width: 440px;
    line-height: 1.5;
    margin-bottom: var(--space-6);
  }
</style>
