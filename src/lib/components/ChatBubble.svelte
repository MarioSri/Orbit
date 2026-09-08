<script lang="ts">
  import Badge from './Badge.svelte';
  import Button from './Button.svelte';
  import { Sparkles, User, FileText, ArrowRight } from '@lucide/svelte';

  interface FileResult {
    title: string;
    path: string;
    size: string;
    safety: 'safe' | 'probably_safe' | 'risky';
  }

  interface Props {
    sender: 'user' | 'assistant';
    text: string;
    timestamp?: string;
    results?: FileResult[];
    quickActions?: string[];
    onActionClick?: (action: string) => void;
  }

  let {
    sender,
    text,
    timestamp,
    results = [],
    quickActions = [],
    onActionClick
  }: Props = $props();

  // Helper to format basic markdown-style text (bold and inline code)
  function formatContent(raw: string) {
    let formatted = raw
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
    return formatted;
  }
</script>

<div class="chat-row {sender}">
  <div class="bubble-wrapper">
    <div class="avatar {sender}">
      {#if sender === 'assistant'}
        <Sparkles size={14} class="ai-sparkle-icon" />
      {:else}
        <User size={14} />
      {/if}
    </div>

    <div class="bubble-content">
      <div class="bubble-header">
        <span class="sender-name">{sender === 'assistant' ? 'Orbit AI' : 'You'}</span>
        {#if timestamp}
          <span class="bubble-time">{timestamp}</span>
        {/if}
      </div>

      <div class="bubble-body">
        {@html formatContent(text)}
      </div>

      {#if results && results.length > 0}
        <div class="results-container">
          {#each results as res}
            <div class="result-card">
              <div class="result-info">
                <FileText size={16} class="result-icon" />
                <div>
                  <div class="result-title">{res.title}</div>
                  <div class="result-path">{res.path}</div>
                </div>
              </div>
              <div class="result-meta">
                <span class="result-size">{res.size}</span>
                <Badge
                  variant={res.safety === 'safe' ? 'success' : res.safety === 'probably_safe' ? 'warning' : 'danger'}
                  size="sm"
                >
                  {res.safety === 'safe' ? 'Safe' : res.safety === 'probably_safe' ? 'Likely Safe' : 'Review'}
                </Badge>
              </div>
            </div>
          {/each}
        </div>
      {/if}

      {#if quickActions && quickActions.length > 0}
        <div class="quick-actions-list">
          {#each quickActions as action}
            <button
              type="button"
              class="quick-action-pill"
              onclick={() => onActionClick && onActionClick(action)}
            >
              <span>{action}</span>
              <ArrowRight size={12} />
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .chat-row {
    display: flex;
    width: 100%;
    margin-bottom: var(--space-4);
  }

  .chat-row.user {
    justify-content: flex-end;
  }

  .chat-row.assistant {
    justify-content: flex-start;
  }

  .bubble-wrapper {
    display: flex;
    gap: var(--space-3);
    max-width: 82%;
  }

  .chat-row.user .bubble-wrapper {
    flex-direction: row-reverse;
  }

  .avatar {
    width: 28px;
    height: 28px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 11px;
    font-weight: 600;
  }

  .avatar.assistant {
    background-color: var(--accent-subtle);
    color: var(--accent);
    border: 1px solid rgba(99, 102, 241, 0.2);
  }

  .avatar.user {
    background-color: var(--surface-3);
    color: var(--text-secondary);
    border: 1px solid var(--border);
  }

  .bubble-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .bubble-header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: 11px;
    color: var(--text-tertiary);
    margin-bottom: 2px;
  }

  .chat-row.user .bubble-header {
    justify-content: flex-end;
  }

  .sender-name {
    font-weight: 600;
    color: var(--text-secondary);
  }

  .bubble-body {
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-lg);
    font-size: 13.5px;
    line-height: 1.55;
    word-break: break-word;
  }

  .chat-row.user .bubble-body {
    background-color: var(--accent);
    color: #ffffff;
    border-top-right-radius: 4px;
  }

  .chat-row.assistant .bubble-body {
    background-color: var(--surface-2);
    color: var(--text-primary);
    border: 1px solid var(--border);
    border-top-left-radius: 4px;
  }

  :global(.bubble-body strong) {
    font-weight: 600;
  }

  :global(.bubble-body code) {
    font-family: var(--font-mono);
    font-size: 12px;
    padding: 2px 5px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: var(--radius-xs);
  }

  /* Structured Results */
  .results-container {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 8px;
  }

  .result-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 12px;
    background-color: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
  }

  .result-info {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow: hidden;
  }

  :global(.result-icon) {
    color: var(--text-tertiary);
    flex-shrink: 0;
  }

  .result-title {
    font-size: 12.5px;
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .result-path {
    font-size: 11px;
    color: var(--text-tertiary);
    font-family: var(--font-mono);
  }

  .result-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .result-size {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
  }

  /* Quick action suggestion pills */
  .quick-actions-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
  }

  .quick-action-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    padding: 4px 10px;
    border-radius: var(--radius-full);
    background-color: var(--surface-1);
    color: var(--text-secondary);
    border: 1px solid var(--border);
    transition: all var(--duration-fast) var(--ease-out);
  }

  .quick-action-pill:hover {
    background-color: var(--surface-hover);
    color: var(--text-primary);
    border-color: var(--accent);
  }
</style>
