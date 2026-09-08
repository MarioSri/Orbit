<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/Button.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import Card from '$lib/components/Card.svelte';
  import { addToast } from '$lib/store';
  import { user, session, authLoading, signUp, signIn } from '$lib/authStore';
  import {
    ShieldCheck,
    HardDrive,
    Lock,
    CheckCircle2,
    ArrowRight,
    EyeOff,
    Cpu,
    FolderLock,
    ExternalLink,
    Mail,
    KeyRound,
    UserPlus,
    LogIn
  } from '@lucide/svelte';

  // Steps: 0 = auth, 1 = welcome, 2 = FDA, 3 = confirmed
  let step = $state<0 | 1 | 2 | 3>(0);
  let isGranting = $state(false);
  let isGranted = $state(false);

  // Auth form state
  let authMode = $state<'signin' | 'signup'>('signin');
  let email = $state('');
  let password = $state('');
  let authError = $state('');
  let isAuthSubmitting = $state(false);
  let showConfirmationNotice = $state(false);

  // If already authenticated, skip auth step
  onMount(() => {
    const unsubscribe = session.subscribe((s) => {
      if (s) {
        step = 1;
      }
    });
    // Also wait for authLoading to finish before deciding
    const unsubLoading = authLoading.subscribe((loading) => {
      if (!loading) {
        // Check session after loading completes
        let currentSession: any = null;
        const unsub2 = session.subscribe(s => { currentSession = s; });
        unsub2();
        if (currentSession) {
          step = 1;
        }
      }
    });
    return () => {
      unsubscribe();
      unsubLoading();
    };
  });

  async function handleAuth(e?: SubmitEvent) {
    if (e) e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    authError = '';
    isAuthSubmitting = true;

    try {
      if (authMode === 'signup') {
        const data = await signUp(email, password);
        // Supabase may require email confirmation
        if (data.user && !data.session) {
          showConfirmationNotice = true;
          addToast('Check Your Email', 'We sent a confirmation link to verify your account', 'info');
        } else {
          step = 1;
          addToast('Account Created', 'Welcome to Orbit!', 'success');
        }
      } else {
        await signIn(email, password);
        step = 1;
        addToast('Signed In', 'Welcome back to Orbit', 'success');
      }
    } catch (err: any) {
      authError = err?.message || 'Authentication failed. Please try again.';
    } finally {
      isAuthSubmitting = false;
    }
  }

  function requestAccess() {
    isGranting = true;
    setTimeout(() => {
      isGranting = false;
      isGranted = true;
      step = 3;
      addToast('Full Disk Access Granted', 'Orbit can now index System Data & local caches', 'success');
    }, 900);
  }

  function continueToDashboard() {
    goto('/');
  }
</script>

<div class="onboarding-container">
  <div class="onboarding-card-wrapper">
    <!-- Progress dots (4 steps now) -->
    <div class="step-indicator">
      <span class="step-dot {step >= 0 ? 'active' : ''}"></span>
      <span class="step-line {step >= 1 ? 'active' : ''}"></span>
      <span class="step-dot {step >= 1 ? 'active' : ''}"></span>
      <span class="step-line {step >= 2 ? 'active' : ''}"></span>
      <span class="step-dot {step >= 2 ? 'active' : ''}"></span>
      <span class="step-line {step >= 3 ? 'active' : ''}"></span>
      <span class="step-dot {step >= 3 ? 'active' : ''}"></span>
    </div>

    {#if step === 0}
      <!-- Step 0: Authentication -->
      <div class="step-content">
        <div class="hero-icon-box auth-box">
          {#if authMode === 'signin'}
            <LogIn size={38} class="accent-icon" />
          {:else}
            <UserPlus size={38} class="accent-icon" />
          {/if}
        </div>

        <h1 class="step-title">
          {authMode === 'signin' ? 'Sign In to Orbit' : 'Create Your Account'}
        </h1>
        <p class="step-subtitle">
          {authMode === 'signin'
            ? 'Sign in to sync your subscription and unlock paid features across devices.'
            : 'Create an account to unlock Pro features and manage your subscription.'}
        </p>

        {#if showConfirmationNotice}
          <Card surface="2" padding="md" class="confirmation-card">
            <div class="confirmation-content">
              <Mail size={24} class="accent-icon" />
              <div>
                <strong>Check your email</strong>
                <p class="confirmation-desc">
                  We sent a confirmation link to <strong>{email}</strong>. Click it, then come back and sign in.
                </p>
              </div>
            </div>
            <Button variant="secondary" size="md" onclick={() => { showConfirmationNotice = false; authMode = 'signin'; }}>
              Back to Sign In
            </Button>
          </Card>
        {:else}
          <form class="auth-form" onsubmit={handleAuth}>
            <div class="input-group">
              <label class="input-label" for="auth-email">
                <Mail size={14} />
                <span>Email</span>
              </label>
              <input
                id="auth-email"
                type="email"
                bind:value={email}
                placeholder="you@example.com"
                class="auth-input"
                required
                autocomplete="email"
              />
            </div>

            <div class="input-group">
              <label class="input-label" for="auth-password">
                <KeyRound size={14} />
                <span>Password</span>
              </label>
              <input
                id="auth-password"
                type="password"
                bind:value={password}
                placeholder={authMode === 'signup' ? 'Choose a strong password' : 'Your password'}
                class="auth-input"
                required
                minlength={6}
                autocomplete={authMode === 'signup' ? 'new-password' : 'current-password'}
              />
            </div>

            {#if authError}
              <div class="auth-error">
                <span>{authError}</span>
              </div>
            {/if}

            <Button
              variant="primary"
              size="lg"
              type="submit"
              disabled={isAuthSubmitting || !email.trim() || !password.trim()}
            >
              {#if isAuthSubmitting}
                <span>{authMode === 'signin' ? 'Signing in...' : 'Creating account...'}</span>
              {:else}
                <span>{authMode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight size={16} />
              {/if}
            </Button>
          </form>

          <div class="auth-toggle">
            {#if authMode === 'signin'}
              <span class="toggle-text">Don't have an account?</span>
              <button type="button" class="toggle-link" onclick={() => { authMode = 'signup'; authError = ''; }}>
                Create one
              </button>
            {:else}
              <span class="toggle-text">Already have an account?</span>
              <button type="button" class="toggle-link" onclick={() => { authMode = 'signin'; authError = ''; }}>
                Sign in
              </button>
            {/if}
          </div>
        {/if}
      </div>

    {:else if step === 1}
      <div class="step-content">
        <div class="hero-icon-box">
          <HardDrive size={38} class="accent-icon" />
        </div>

        <h1 class="step-title">Welcome to Orbit</h1>
        <p class="step-subtitle">
          AI-native storage intelligence for Mac and Windows. Replaces archaic treemaps with a living, spatial galaxy view and on-device intelligence.
        </p>

        <div class="feature-pills">
          <div class="feature-pill">
            <ShieldCheck size={16} class="pill-icon" />
            <span>100% On-Device & Private</span>
          </div>
          <div class="feature-pill">
            <Cpu size={16} class="pill-icon" />
            <span>Local SQLite Index</span>
          </div>
          <div class="feature-pill">
            <EyeOff size={16} class="pill-icon" />
            <span>Zero Cloud Telemetry</span>
          </div>
        </div>

        <div class="action-footer">
          <Button variant="primary" size="lg" onclick={() => (step = 2)}>
            <span>Get Started</span>
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    {:else if step === 2}
      <div class="step-content">
        <div class="hero-icon-box lock">
          <FolderLock size={38} class="lock-icon" />
        </div>

        <h1 class="step-title">Why Orbit needs Full Disk Access</h1>
        <p class="step-subtitle">
          By default, macOS sandboxing hides the largest consumers of your SSD. Without access, Orbit can only guess.
        </p>

        <div class="reasons-grid">
          <Card surface="2" padding="sm" class="reason-card">
            <div class="reason-header">
              <Badge variant="coral" size="sm">System Data</Badge>
              <strong>De-mystify the black box</strong>
            </div>
            <p class="reason-desc">
              Inspect hidden APFS snapshots, Time Machine bundles, and Xcode caches that Apple lumps into opaque "System Data".
            </p>
          </Card>

          <Card surface="2" padding="sm" class="reason-card">
            <div class="reason-header">
              <Badge variant="teal" size="sm">Developer Junk</Badge>
              <strong>Index all node_modules & Docker</strong>
            </div>
            <p class="reason-desc">
              Traverse deeply nested developer dependencies across your entire home directory and containers in under 3 seconds.
            </p>
          </Card>

          <Card surface="2" padding="sm" class="reason-card">
            <div class="reason-header">
              <Badge variant="success" size="sm">30-Day Vault</Badge>
              <strong>Safe, reversible cleanup</strong>
            </div>
            <p class="reason-desc">
              Never worry about accidental deletion. Files are staged in an encrypted local safety vault before permanent purging.
            </p>
          </Card>
        </div>

        <div class="action-footer double">
          <Button variant="secondary" size="lg" onclick={() => (step = 1)}>
            Back
          </Button>
          <Button
            variant="primary"
            size="lg"
            disabled={isGranting}
            onclick={requestAccess}
          >
            {#if isGranting}
              <span>Prompting System Settings...</span>
            {:else}
              <span>Grant Full Disk Access</span>
              <ArrowRight size={16} />
            {/if}
          </Button>
        </div>
      </div>
    {:else}
      <div class="step-content">
        <div class="hero-icon-box success">
          <CheckCircle2 size={42} class="success-icon" />
        </div>

        <Badge variant="success" size="md" dot={true}>Permission Active</Badge>

        <h1 class="step-title">Access Confirmed & Ready</h1>
        <p class="step-subtitle">
          Full Disk Access is active. Orbit has initialized your on-device SQLite index and mapped 512 GB across all 6 core categories.
        </p>

        <Card surface="2" padding="md" class="scan-summary-card">
          <div class="summary-row">
            <span class="label">Startup Disk:</span>
            <span class="val">Macintosh HD — Data (APFS)</span>
          </div>
          <div class="summary-row">
            <span class="label">Initial Index Time:</span>
            <span class="val">2.8 seconds (100% on-device)</span>
          </div>
          <div class="summary-row">
            <span class="label">Reclaimable Candidates:</span>
            <span class="val text-success">~112.5 GB safe developer caches</span>
          </div>
        </Card>

        <div class="action-footer">
          <Button variant="primary" size="lg" onclick={continueToDashboard}>
            <span>Enter Orbit Dashboard</span>
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .onboarding-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-6);
  }

  .onboarding-card-wrapper {
    width: 100%;
    max-width: 580px;
    background-color: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: var(--space-8);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .step-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: var(--space-6);
  }

  .step-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--surface-3);
    transition: background-color var(--duration-normal) var(--ease-out);
  }
  .step-dot.active {
    background-color: var(--accent);
  }

  .step-line {
    width: 24px;
    height: 2px;
    background-color: var(--surface-3);
  }
  .step-line.active {
    background-color: var(--accent);
  }

  .step-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .hero-icon-box {
    width: 72px;
    height: 72px;
    border-radius: var(--radius-lg);
    background-color: var(--surface-2);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--space-4);
  }

  .hero-icon-box.auth-box {
    background-color: var(--accent-subtle);
    border-color: rgba(99, 102, 241, 0.2);
  }

  .hero-icon-box.lock {
    background-color: var(--accent-subtle);
    border-color: rgba(99, 102, 241, 0.2);
  }

  .hero-icon-box.success {
    background-color: var(--success-subtle);
    border-color: rgba(16, 185, 129, 0.2);
  }

  :global(.accent-icon) { color: var(--accent); }
  :global(.lock-icon) { color: var(--accent); }
  :global(.success-icon) { color: var(--success); }

  .step-title {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    margin-bottom: var(--space-2);
  }

  .step-subtitle {
    font-size: 13.5px;
    color: var(--text-secondary);
    line-height: 1.55;
    margin-bottom: var(--space-6);
    max-width: 480px;
  }

  /* Auth Form */
  .auth-form {
    width: 100%;
    max-width: 380px;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    text-align: left;
  }

  .input-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .auth-input {
    width: 100%;
    padding: 10px 14px;
    background-color: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-size: 13.5px;
    color: var(--text-primary);
    outline: none;
    transition: border-color var(--duration-fast) var(--ease-out);
  }

  .auth-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 1px var(--accent);
  }

  .auth-input::placeholder {
    color: var(--text-tertiary);
  }

  .auth-error {
    background-color: var(--danger-subtle);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: var(--radius-md);
    padding: 8px 12px;
    font-size: 12px;
    color: var(--danger-text);
    text-align: left;
  }

  .auth-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: var(--space-4);
    font-size: 12.5px;
  }

  .toggle-text {
    color: var(--text-secondary);
  }

  .toggle-link {
    color: var(--accent);
    font-weight: 600;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-size: 12.5px;
  }

  .toggle-link:hover {
    text-decoration: underline;
  }

  :global(.confirmation-card) {
    width: 100%;
    max-width: 380px;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .confirmation-content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .confirmation-content strong {
    font-size: 13.5px;
    color: var(--text-primary);
  }

  .confirmation-desc {
    font-size: 12px;
    color: var(--text-secondary);
    line-height: 1.45;
    margin-top: 4px;
  }

  /* Feature pills */
  .feature-pills {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-bottom: var(--space-8);
  }

  .feature-pill {
    display: flex;
    align-items: center;
    gap: 7px;
    background-color: var(--surface-2);
    border: 1px solid var(--border);
    padding: 6px 12px;
    border-radius: var(--radius-full);
    font-size: 12px;
    color: var(--text-secondary);
  }

  :global(.pill-icon) { color: var(--accent); }

  .reasons-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    margin-bottom: var(--space-6);
    text-align: left;
  }

  :global(.reason-card) {
    border-radius: var(--radius-md) !important;
  }

  .reason-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 4px;
    font-size: 13px;
    color: var(--text-primary);
  }

  .reason-desc {
    font-size: 12px;
    color: var(--text-secondary);
    line-height: 1.45;
  }

  :global(.scan-summary-card) {
    width: 100%;
    margin-top: var(--space-4);
    margin-bottom: var(--space-6);
    text-align: left;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 12.5px;
    padding: 6px 0;
    border-bottom: 1px solid var(--border-subtle);
  }
  .summary-row:last-child {
    border-bottom: none;
  }

  .label { color: var(--text-secondary); }
  .val { font-weight: 500; color: var(--text-primary); }
  .text-success { color: var(--success); font-weight: 600; }

  .action-footer {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .action-footer.double {
    gap: 12px;
  }
</style>
