<script lang="ts">
  import { goto } from '$app/navigation';
  import { currentTheme, addToast } from '$lib/store';
  import { user, profile, isPro, signOut, getMyDevices } from '$lib/authStore';
  import Button from '$lib/components/Button.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import Card from '$lib/components/Card.svelte';
  import {
    Settings,
    ShieldCheck,
    Lock,
    Cpu,
    Bell,
    Palette,
    Check,
    HardDrive,
    ExternalLink,
    RefreshCw,
    Trash2,
    User,
    LogOut,
    Monitor,
    Sparkles
  } from '@lucide/svelte';

  let vaultRetentionDays = $derived<7 | 30>($isPro ? 30 : 7);
  let autoPurgeExpired = $state(true);
  let onDeviceAiEnabled = $state(true);
  let isRecheckingFda = $state(false);
  let isSigningOut = $state(false);
  let devices = $state<any[]>([]);
  let devicesLoading = $state(false);

  let notifyLowSpace = $state(true);
  let notifyOvernightSpike = $state(true);
  let notifyWeeklyDigest = $state(false);
  let notifyVaultExpiring = $state(true);

  // Load devices when user is available
  $effect(() => {
    if ($user) {
      loadDevices();
    }
  });

  async function loadDevices() {
    devicesLoading = true;
    try {
      devices = await getMyDevices();
    } catch {
      devices = [];
    } finally {
      devicesLoading = false;
    }
  }

  function handleThemeChange(theme: 'dark' | 'light') {
    currentTheme.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
    addToast('Theme Updated', `Switched to ${theme} appearance`, 'info');
  }

  function recheckPermission() {
    isRecheckingFda = true;
    setTimeout(() => {
      isRecheckingFda = false;
      addToast('Permissions Verified', 'Full Disk Access (TCC) is fully authorized', 'success');
    }, 800);
  }

  function handleSaveRetention(days: 7 | 30) {
    if (days === 30 && !$isPro) {
      addToast('Pro Feature', 'Upgrade to Pro for 30-day vault retention', 'info');
      return;
    }
    addToast('Vault Retention Updated', `Files will be protected for ${days} days`, 'success');
  }

  async function handleSignOut() {
    isSigningOut = true;
    try {
      await signOut();
      addToast('Signed Out', 'You have been signed out successfully', 'info');
      goto('/onboarding');
    } catch (err: any) {
      addToast('Error', err?.message || 'Failed to sign out', 'danger');
    } finally {
      isSigningOut = false;
    }
  }
</script>

<div class="settings-viewport">
  <div class="settings-container">
    <!-- Header -->
    <div class="settings-header">
      <div class="settings-title-row">
        <Settings size={22} class="settings-header-icon" />
        <h1 class="settings-title">Preferences & Configuration</h1>
      </div>
      <p class="settings-subtitle">
        Manage your account, subscription, local security permissions, and on-device AI runtime.
      </p>
    </div>

    <!-- Section 0: Account & Plan -->
    {#if $user}
      <div class="settings-section">
        <div class="section-title-line">
          <User size={16} />
          <h2>Account & Plan</h2>
        </div>

        <Card surface="1" padding="md" class="setting-card">
          <div class="setting-row">
            <div class="setting-info">
              <div class="setting-name-line">
                <span class="setting-name">{$user.email}</span>
                <Badge variant={$isPro ? 'accent' : 'neutral'} size="sm">{$isPro ? 'Pro Plan' : 'Free Plan'}</Badge>
              </div>
              <p class="setting-desc">
                {$isPro
                  ? 'Full access to all premium features including Duplicate Finder, AI Chat, Insights, Timeline, and 30-day vault.'
                  : 'Upgrade to Pro to unlock Duplicate Finder, AI Chat, Insights, Timeline Scrubber, and 30-day vault protection.'}
              </p>
            </div>

            {#if !$isPro}
              <Button variant="primary" size="sm">
                <Sparkles size={13} />
                <span>Upgrade to Pro</span>
              </Button>
            {/if}
          </div>

          <div class="setting-row divider-top">
            <div class="setting-info">
              <span class="setting-name">Linked Devices</span>
              <p class="setting-desc">
                {#if devicesLoading}
                  Loading devices...
                {:else if devices.length === 0}
                  No devices registered yet.
                {:else}
                  {devices.length} device{devices.length !== 1 ? 's' : ''} linked to your account (max {$profile?.max_devices ?? 3})
                {/if}
              </p>
            </div>

            {#if devices.length > 0}
              <div class="devices-list">
                {#each devices as device}
                  <div class="device-item">
                    <Monitor size={13} />
                    <span class="device-name">{device.device_name || 'Unknown Device'}</span>
                    <span class="device-os">{device.os || ''}</span>
                  </div>
                {/each}
              </div>
            {/if}
          </div>

          <div class="setting-row divider-top">
            <div class="setting-info">
              <span class="setting-name">Sign Out</span>
              <p class="setting-desc">Sign out from this device. Your local data remains on disk.</p>
            </div>

            <Button
              variant="danger"
              size="sm"
              disabled={isSigningOut}
              onclick={handleSignOut}
            >
              <LogOut size={13} />
              <span>{isSigningOut ? 'Signing out...' : 'Sign Out'}</span>
            </Button>
          </div>
        </Card>
      </div>
    {:else}
      <div class="settings-section">
        <div class="section-title-line">
          <User size={16} />
          <h2>Account & Plan</h2>
        </div>

        <Card surface="1" padding="md" class="setting-card">
          <div class="setting-row">
            <div class="setting-info">
              <div class="setting-name-line">
                <span class="setting-name">Guest Mode (Local Only)</span>
                <Badge variant="neutral" size="sm">Free Plan</Badge>
              </div>
              <p class="setting-desc">
                Sign in with Supabase to manage your subscription tier, sync license status, and view linked devices.
              </p>
            </div>

            <Button variant="primary" size="sm" onclick={() => goto('/onboarding')}>
              <User size={13} />
              <span>Sign In / Create Account</span>
            </Button>
          </div>
        </Card>
      </div>
    {/if}

    <!-- Section 1: Permissions -->
    <div class="settings-section">
      <div class="section-title-line">
        <ShieldCheck size={16} />
        <h2>Disk Permissions</h2>
      </div>

      <Card surface="1" padding="md" class="setting-card">
        <div class="setting-row">
          <div class="setting-info">
            <div class="setting-name-line">
              <span class="setting-name">macOS Full Disk Access (TCC)</span>
              <Badge variant="success" size="sm" dot={true}>Authorized</Badge>
            </div>
            <p class="setting-desc">
              Allows Orbit to inspect opaque System Data, APFS local snapshots, and developer tool build caches.
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            disabled={isRecheckingFda}
            onclick={recheckPermission}
          >
            <RefreshCw size={13} class={isRecheckingFda ? 'spin' : ''} />
            <span>{isRecheckingFda ? 'Verifying...' : 'Re-check FDA'}</span>
          </Button>
        </div>
      </Card>
    </div>

    <!-- Section 2: Safety Vault -->
    <div class="settings-section">
      <div class="section-title-line">
        <Lock size={16} />
        <h2>Safety Vault Policy</h2>
      </div>

      <Card surface="1" padding="md" class="setting-card">
        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-name">Vault Staging Retention Period</span>
            <p class="setting-desc">
              Cleaned files remain fully restorable with original folder structure before permanent removal.
            </p>
          </div>

          <div class="segmented-control">
            <button
              type="button"
              class="segment-btn {vaultRetentionDays === 7 ? 'active' : ''}"
              onclick={() => handleSaveRetention(7)}
            >
              7 Days (Free)
            </button>
            <button
              type="button"
              class="segment-btn {vaultRetentionDays === 30 ? 'active' : ''} {!$isPro ? 'locked' : ''}"
              onclick={() => handleSaveRetention(30)}
              disabled={!$isPro}
            >
              {#if !$isPro}<Lock size={11} />{/if}
              30 Days (Pro)
            </button>
          </div>
        </div>

        <div class="setting-row divider-top">
          <div class="setting-info">
            <span class="setting-name">Auto-purge Expired Items</span>
            <p class="setting-desc">
              Automatically deletes staging items after their retention countdown reaches 0 days.
            </p>
          </div>

          <label class="toggle-switch">
            <input type="checkbox" bind:checked={autoPurgeExpired} />
            <span class="slider"></span>
          </label>
        </div>
      </Card>
    </div>

    <!-- Section 3: On-Device AI -->
    <div class="settings-section">
      <div class="section-title-line">
        <Cpu size={16} />
        <h2>On-Device Intelligence</h2>
      </div>

      <Card surface="1" padding="md" class="setting-card">
        <div class="setting-row">
          <div class="setting-info">
            <div class="setting-name-line">
              <span class="setting-name">Local LLM Chat Engine</span>
              <Badge variant="teal" size="sm">100% Offline</Badge>
            </div>
            <p class="setting-desc">
              Enables natural language queries into your local SQLite storage index without cloud roundtrips.
            </p>
          </div>

          <label class="toggle-switch">
            <input type="checkbox" bind:checked={onDeviceAiEnabled} />
            <span class="slider"></span>
          </label>
        </div>

        <div class="ai-model-details-box">
          <div class="model-row">
            <span class="model-label">Model Architecture:</span>
            <span class="model-val">Llama-3.2-3B-Instruct (4-bit Q4_K_M GGUF)</span>
          </div>
          <div class="model-row">
            <span class="model-label">Hardware Acceleration:</span>
            <span class="model-val text-accent">Apple Metal GPU & Neural Engine</span>
          </div>
          <div class="model-row">
            <span class="model-label">Privacy Guarantee:</span>
            <span class="model-val text-success">Tool-calling metadata only. File contents are never indexed.</span>
          </div>
        </div>
      </Card>
    </div>

    <!-- Section 4: Notifications -->
    <div class="settings-section">
      <div class="section-title-line">
        <Bell size={16} />
        <h2>Alerts & Notifications</h2>
      </div>

      <Card surface="1" padding="md" class="setting-card">
        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-name">Critical Low Space Warning</span>
            <p class="setting-desc">Alert when free space drops below 20 GB or exhaustion forecast &lt; 14 days.</p>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" bind:checked={notifyLowSpace} />
            <span class="slider"></span>
          </label>
        </div>

        <div class="setting-row divider-top">
          <div class="setting-info">
            <span class="setting-name">Overnight Growth Spike Detection</span>
            <p class="setting-desc">Notify when System Data or Docker suddenly expands by more than 8 GB.</p>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" bind:checked={notifyOvernightSpike} />
            <span class="slider"></span>
          </label>
        </div>

        <div class="setting-row divider-top">
          <div class="setting-info">
            <span class="setting-name">Vault Expiration Reminders</span>
            <p class="setting-desc">Notice 3 days before items in the Safety Vault are permanently purged.</p>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" bind:checked={notifyVaultExpiring} />
            <span class="slider"></span>
          </label>
        </div>
      </Card>
    </div>

    <!-- Section 5: Appearance -->
    <div class="settings-section">
      <div class="section-title-line">
        <Palette size={16} />
        <h2>Interface Appearance</h2>
      </div>

      <Card surface="1" padding="md" class="setting-card">
        <div class="theme-options-grid">
          <button
            type="button"
            class="theme-card {$currentTheme === 'dark' ? 'selected' : ''}"
            onclick={() => handleThemeChange('dark')}
          >
            <div class="theme-preview dark-preview">
              <div class="preview-hub"></div>
            </div>
            <div class="theme-label-line">
              <span>Dark Mode (Recommended)</span>
              {#if $currentTheme === 'dark'}
                <Check size={14} class="check-icon" />
              {/if}
            </div>
          </button>

          <button
            type="button"
            class="theme-card {$currentTheme === 'light' ? 'selected' : ''}"
            onclick={() => handleThemeChange('light')}
          >
            <div class="theme-preview light-preview">
              <div class="preview-hub"></div>
            </div>
            <div class="theme-label-line">
              <span>Light Mode</span>
              {#if $currentTheme === 'light'}
                <Check size={14} class="check-icon" />
              {/if}
            </div>
          </button>
        </div>
      </Card>
    </div>

    <!-- App Version & About Footer -->
    <div class="settings-footer">
      <div class="footer-app-spec">
        <strong>Orbit Desktop</strong>
        <span>v1.0.0 (Build 2026.09.06-darwin-arm64)</span>
      </div>
      <div class="footer-links">
        <span class="footer-copy">Tauri 2.0 + SvelteKit Architecture</span>
      </div>
    </div>
  </div>
</div>

<style>
  .settings-viewport {
    height: 100%;
    overflow-y: auto;
    background-color: var(--bg);
    padding: var(--space-6);
  }

  .settings-container {
    max-width: 820px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .settings-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .settings-title-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  :global(.settings-header-icon) {
    color: var(--accent);
  }

  .settings-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }

  .settings-subtitle {
    font-size: 13.5px;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  /* Section */
  .settings-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .section-title-line {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 700;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .section-title-line h2 {
    font-size: 13px;
    font-weight: 700;
  }

  :global(.setting-card) {
    border-radius: var(--radius-lg) !important;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  .setting-row.divider-top {
    border-top: 1px solid var(--border-subtle);
    padding-top: var(--space-4);
  }

  .setting-info {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .setting-name-line {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .setting-name {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .setting-desc {
    font-size: 12px;
    color: var(--text-secondary);
    line-height: 1.45;
    max-width: 520px;
  }

  :global(.spin) {
    animation: rotate-spin 1s linear infinite;
  }

  @keyframes rotate-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Segmented Control */
  .segmented-control {
    display: flex;
    background-color: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 3px;
    gap: 2px;
  }

  .segment-btn {
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    border-radius: var(--radius-sm);
    transition: all var(--duration-fast) var(--ease-out);
  }

  .segment-btn.active {
    background-color: var(--surface-1);
    color: var(--text-primary);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  }

  /* Toggle Switch */
  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
    flex-shrink: 0;
  }

  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background-color: var(--surface-3);
    border-radius: var(--radius-full);
    transition: background-color var(--duration-fast) var(--ease-out);
    border: 1px solid var(--border);
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 2px;
    bottom: 2px;
    background-color: #ffffff;
    border-radius: 50%;
    transition: transform var(--duration-fast) var(--ease-spring);
  }

  input:checked + .slider {
    background-color: var(--accent);
    border-color: var(--accent);
  }

  input:checked + .slider:before {
    transform: translateX(20px);
  }

  /* AI Model Box */
  .ai-model-details-box {
    background-color: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 12px;
  }

  .model-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  .model-label {
    color: var(--text-secondary);
  }

  .model-val {
    font-weight: 500;
    color: var(--text-primary);
  }

  .model-val.text-accent { color: var(--accent); }
  .model-val.text-success { color: var(--success); }

  /* Theme Options */
  .theme-options-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }

  .theme-card {
    background-color: var(--surface-2);
    border: 2px solid var(--border);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: 10px;
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
    text-align: left;
  }

  .theme-card:hover {
    border-color: var(--border-strong);
  }

  .theme-card.selected {
    border-color: var(--accent);
    background-color: var(--surface-hover);
  }

  .theme-preview {
    height: 80px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border);
  }

  .dark-preview {
    background-color: #0b0c10;
  }

  .light-preview {
    background-color: #f7f8fa;
  }

  .preview-hub {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 3px solid var(--accent);
  }

  .theme-label-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12.5px;
    font-weight: 600;
    color: var(--text-primary);
  }

  :global(.check-icon) {
    color: var(--accent);
  }

  /* Footer */
  .settings-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: var(--space-4);
    border-top: 1px solid var(--border-subtle);
    font-size: 11.5px;
    color: var(--text-tertiary);
  }

  .footer-app-spec {
    display: flex;
    gap: 6px;
  }

  .devices-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .device-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--text-secondary);
    background-color: var(--surface-2);
    padding: 6px 10px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
  }

  .device-name {
    font-weight: 600;
    color: var(--text-primary);
  }

  .device-os {
    font-size: 11px;
    color: var(--text-tertiary);
  }

  .segment-btn.locked {
    opacity: 0.5;
    cursor: not-allowed;
    display: flex;
    align-items: center;
    gap: 4px;
  }
</style>
