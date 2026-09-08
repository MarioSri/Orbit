<script lang="ts">
  import { goto } from '$app/navigation';
  import { vaultItems, restoreVaultItem, addToast } from '$lib/store';
  import { isPro } from '$lib/authStore';
  import Button from '$lib/components/Button.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import Card from '$lib/components/Card.svelte';
  import {
    ShieldCheck,
    RotateCcw,
    Trash2,
    Clock,
    AlertTriangle,
    Folder,
    FileText,
    CheckCircle2,
    Sparkles,
    Info,
    ArrowRight,
    Lock
  } from '@lucide/svelte';

  let totalVaultSizeGb = $derived(
    +$vaultItems.reduce((sum, item) => sum + item.sizeGb, 0).toFixed(1)
  );

  let expiringSoonCount = $derived(
    $vaultItems.filter(item => item.isExpiringSoon || item.daysRemaining <= 3).length
  );

  function handleRestore(id: string) {
    restoreVaultItem(id);
  }

  function handlePurge(id: string, name: string) {
    vaultItems.update(items => items.filter(i => i.id !== id));
    addToast('Purged permanently', `${name} removed from vault`, 'danger');
  }

  function handlePurgeExpired() {
    vaultItems.update(items => items.filter(i => i.daysRemaining > 3));
    addToast('Purged expired items', 'Expired staging items cleared permanently', 'info');
  }
</script>

<div class="vault-viewport">
  <div class="vault-container">
    <!-- Header -->
    <div class="vault-header">
      <div>
        <div class="vault-tagline">
          <ShieldCheck size={16} class="shield-title-icon" />
          <span>ZERO-RISK STORAGE INTELLIGENCE</span>
        </div>
        <h1 class="vault-title">{$isPro ? '30' : '7'}-Day Safety Vault</h1>
        <p class="vault-desc">
          Every file and cache cleaned by Orbit lands here first. If anything is ever needed again, restore it to its exact original path with one tap.
        </p>

        {#if !$isPro}
          <div class="vault-upgrade-banner">
            <Lock size={14} />
            <span>Free plan: 7-day retention.</span>
            <button type="button" class="vault-upgrade-link" onclick={() => goto('/settings')}>
              Upgrade to Pro for 30 days <ArrowRight size={12} />
            </button>
          </div>
        {/if}
      </div>

      <div class="header-actions">
        {#if expiringSoonCount > 0}
          <Button variant="danger" size="sm" onclick={handlePurgeExpired}>
            <Trash2 size={13} />
            <span>Purge Expired ({expiringSoonCount})</span>
          </Button>
        {/if}
      </div>
    </div>

    <!-- Vault Overview Metrics -->
    <div class="vault-metrics-grid">
      <Card surface="1" padding="sm" class="metric-card">
        <div class="metric-label">Items Staged</div>
        <div class="metric-val">{$vaultItems.length}</div>
        <div class="metric-sub">Protected locally on disk</div>
      </Card>

      <Card surface="1" padding="sm" class="metric-card">
        <div class="metric-label">Vault Storage Total</div>
        <div class="metric-val text-accent">{totalVaultSizeGb} GB</div>
        <div class="metric-sub">Pending automatic reclamation</div>
      </Card>

      <Card surface="1" padding="sm" class="metric-card">
        <div class="metric-label">Expiring Soon (&le;3 days)</div>
        <div class="metric-val {expiringSoonCount > 0 ? 'text-warning' : 'text-secondary'}">
          {expiringSoonCount} items
        </div>
        <div class="metric-sub">Will be purged permanently</div>
      </Card>
    </div>

    <!-- Vault Items List -->
    {#if $vaultItems.length > 0}
      <div class="vault-list-container">
        <div class="list-heading">
          <span class="heading-title">Staged Files & Directories</span>
          <span class="heading-note">Sorted by expiration date</span>
        </div>

        <div class="vault-items-list">
          {#each $vaultItems as item (item.id)}
            <div class="vault-row {item.isExpiringSoon ? 'expiring-soon' : ''}">
              <div class="vault-row-main">
                <div class="row-icon-wrap" style="color: {item.colorHex};">
                  <FileText size={18} />
                </div>

                <div class="row-info">
                  <div class="row-title-line">
                    <span class="row-name">{item.name}</span>
                    <Badge variant="neutral" size="sm">{item.category}</Badge>
                    {#if item.isExpiringSoon || item.daysRemaining <= 3}
                      <Badge variant="warning" size="sm" dot={true}>
                        Expiring Soon ({item.daysRemaining}d)
                      </Badge>
                    {/if}
                  </div>

                  <div class="row-path" title={item.originalPath}>
                    <Folder size={11} class="sub-icon" />
                    <span>{item.originalPath}</span>
                  </div>
                </div>
              </div>

              <div class="vault-row-actions">
                <div class="row-timing">
                  <span class="row-size">{item.formattedSize}</span>
                  <span class="countdown-tag {item.daysRemaining <= 3 ? 'urgent' : ''}">
                    <Clock size={11} />
                    {item.daysRemaining} days left
                  </span>
                </div>

                <div class="action-buttons">
                  <Button
                    variant="secondary"
                    size="sm"
                    onclick={() => handleRestore(item.id)}
                    title="Restore file to original location"
                  >
                    <RotateCcw size={13} />
                    <span>Restore</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onclick={() => handlePurge(item.id, item.name)}
                    title="Purge permanently now"
                    ariaLabel="Purge item permanently"
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {:else}
      <!-- Empty State -->
      <div class="empty-vault-card">
        <div class="empty-icon-wrap">
          <ShieldCheck size={40} class="shield-empty-icon" />
        </div>
        <h2 class="empty-title">Your Safety Vault is Empty</h2>
        <p class="empty-desc">
          No files are currently staged for retention. Clean files from the Swipe Triage Deck or Dev Junk Scanner to send them here first.
        </p>
        <Button variant="primary" size="md" onclick={() => goto('/triage')}>
          <span>Open Swipe Triage Deck</span>
        </Button>
      </div>
    {/if}
  </div>
</div>

<style>
  .vault-viewport {
    height: 100%;
    overflow-y: auto;
    background-color: var(--bg);
    padding: var(--space-6);
  }

  .vault-container {
    max-width: 960px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }

  .vault-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
  }

  .vault-tagline {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--success);
    margin-bottom: 4px;
  }

  :global(.shield-title-icon) {
    color: var(--success);
  }

  .vault-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }

  .vault-desc {
    font-size: 13.5px;
    color: var(--text-secondary);
    line-height: 1.5;
    margin-top: 4px;
    max-width: 680px;
  }

  .vault-metrics-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-4);
  }

  :global(.metric-card) {
    border-radius: var(--radius-md) !important;
  }

  .metric-label {
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .metric-val {
    font-size: 24px;
    font-weight: 800;
    color: var(--text-primary);
    margin: 4px 0 2px 0;
  }

  .metric-val.text-accent { color: var(--accent); }
  .metric-val.text-warning { color: var(--warning); }
  .metric-val.text-secondary { color: var(--text-secondary); }

  .metric-sub {
    font-size: 11px;
    color: var(--text-tertiary);
  }

  /* List */
  .vault-list-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .list-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .heading-note {
    font-size: 11.5px;
    color: var(--text-tertiary);
    font-weight: 400;
  }

  .vault-items-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .vault-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 16px;
    background-color: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    transition: all var(--duration-fast) var(--ease-out);
  }

  .vault-row:hover {
    border-color: var(--border-strong);
    background-color: var(--surface-hover);
  }

  .vault-row.expiring-soon {
    border-left: 3px solid var(--warning);
  }

  .vault-row-main {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    overflow: hidden;
  }

  .row-icon-wrap {
    flex-shrink: 0;
  }

  .row-info {
    display: flex;
    flex-direction: column;
    gap: 3px;
    overflow: hidden;
  }

  .row-title-line {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .row-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .row-path {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-family: var(--font-mono);
    color: var(--text-tertiary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :global(.sub-icon) {
    flex-shrink: 0;
  }

  .vault-row-actions {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-shrink: 0;
  }

  .row-timing {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }

  .row-size {
    font-size: 13px;
    font-weight: 700;
    color: var(--text-primary);
  }

  .countdown-tag {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: var(--text-secondary);
  }

  .countdown-tag.urgent {
    color: var(--warning);
    font-weight: 600;
  }

  .action-buttons {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* Empty State */
  .empty-vault-card {
    background-color: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: var(--space-8);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: var(--space-4);
  }

  .empty-icon-wrap {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    background-color: var(--surface-2);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--space-4);
  }

  :global(.shield-empty-icon) {
    color: var(--success);
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
    max-width: 420px;
    line-height: 1.5;
    margin-bottom: var(--space-6);
  }

  .vault-upgrade-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: var(--space-3);
    padding: 8px 14px;
    background-color: var(--accent-subtle);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: var(--radius-md);
    font-size: 12px;
    color: var(--text-secondary);
  }

  .vault-upgrade-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--accent);
    font-weight: 600;
    font-size: 12px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .vault-upgrade-link:hover {
    text-decoration: underline;
  }
</style>
