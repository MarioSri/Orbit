<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { goto } from '$app/navigation';
  import { chatHistory, isStreamingAi, sendChatMessage } from '$lib/store';
  import { isPro } from '$lib/authStore';
  import ProGate from '$lib/components/ProGate.svelte';
  import ChatBubble from '$lib/components/ChatBubble.svelte';
  import Button from '$lib/components/Button.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import {
    Sparkles,
    Send,
    ArrowLeft,
    Shield,
    Trash2,
    Cpu,
    Zap,
    Lock
  } from '@lucide/svelte';

  let inputVal = $state('');
  let chatViewport = $state<HTMLDivElement>();

  const suggestionPrompts = [
    "What is taking up the most space on my drive?",
    "Find videos I haven't opened in over 6 months",
    "Explain System Data overnight growth",
    "Find node_modules older than 3 months"
  ];

  async function scrollToBottom() {
    await tick();
    if (chatViewport) {
      chatViewport.scrollTop = chatViewport.scrollHeight;
    }
  }

  function handleSend(promptText?: string) {
    const q = promptText || inputVal;
    if (!q.trim() || $isStreamingAi) return;
    inputVal = '';
    sendChatMessage(q);
    scrollToBottom();
  }

  function handleActionClick(action: string) {
    if (action.includes('Vault')) {
      goto('/vault');
    } else if (action.includes('Swipe')) {
      goto('/triage');
    } else if (action.includes('Dev Junk')) {
      goto('/devjunk');
    } else if (action.includes('Duplicate')) {
      goto('/duplicates');
    } else {
      handleSend(action);
    }
  }

  function clearChat() {
    chatHistory.set([]);
  }

  onMount(() => {
    scrollToBottom();
  });
</script>

{#if !$isPro}
  <ProGate
    featureName="Talk to Your Storage"
    description="Ask natural-language questions about your drive. The on-device AI queries your local SQLite index — file contents never leave your machine."
  />
{:else}
<div class="chat-page-viewport">
  <!-- Top Bar -->
  <div class="chat-header">
    <div class="header-left">
      <Button variant="ghost" size="sm" onclick={() => goto('/')}>
        <ArrowLeft size={16} />
        <span>Dashboard</span>
      </Button>

      <div class="ai-status-pill">
        <Cpu size={13} class="cpu-icon" />
        <span class="ai-name">Llama 3.2 3B Instruct</span>
        <Badge variant="teal" size="sm">Metal 4-bit</Badge>
      </div>
    </div>

    <div class="header-right">
      <div class="privacy-guarantee">
        <Lock size={12} />
        <span>100% On-Device Metadata</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onclick={clearChat}
        title="Clear conversation"
      >
        <Trash2 size={14} />
      </Button>
    </div>
  </div>

  <!-- Messages History Viewport -->
  <div class="messages-container" bind:this={chatViewport}>
    <div class="conversation-intro">
      <div class="intro-icon-box">
        <Sparkles size={28} class="intro-sparkle" />
      </div>
      <h2 class="intro-title">Talk to your Storage</h2>
      <p class="intro-desc">
        Ask questions in plain English. Orbit tool-calls into your local SQLite index to find bloat, trace growth, and explain opaque system caches.
      </p>
    </div>

    <div class="messages-list">
      {#each $chatHistory as msg (msg.id)}
        <ChatBubble
          sender={msg.sender}
          text={msg.text}
          timestamp={msg.timestamp}
          results={msg.results}
          quickActions={msg.quickActions}
          onActionClick={handleActionClick}
        />
      {/each}

      {#if $isStreamingAi}
        <div class="streaming-indicator">
          <span class="pulse-dot"></span>
          <span>Orbit AI is searching local index...</span>
        </div>
      {/if}
    </div>
  </div>

  <!-- Bottom Input & Suggestions -->
  <div class="chat-bottom-area">
    <!-- Prompt chips -->
    <div class="prompt-chips-row">
      {#each suggestionPrompts as prompt}
        <button
          type="button"
          class="prompt-chip"
          onclick={() => handleSend(prompt)}
          disabled={$isStreamingAi}
        >
          <Sparkles size={11} class="chip-sparkle" />
          <span>{prompt}</span>
        </button>
      {/each}
    </div>

    <!-- Input Box -->
    <form
      class="chat-input-form"
      onsubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}
    >
      <div class="input-bar-inner">
        <input
          type="text"
          bind:value={inputVal}
          placeholder="Ask a question about your files, caches, or disk growth..."
          class="main-chat-input"
          disabled={$isStreamingAi}
        />
        <Button
          variant="primary"
          size="sm"
          type="submit"
          disabled={!inputVal.trim() || $isStreamingAi}
          class="submit-btn"
        >
          <Send size={14} />
          <span>Ask</span>
        </Button>
      </div>
      <div class="disclaimer-text">
        Zero cloud telemetry. Orbit operates strictly on local metadata without reading file contents.
      </div>
    </form>
  </div>
</div>
{/if}

<style>
  .chat-page-viewport {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--bg);
    overflow: hidden;
  }

  .chat-header {
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--space-6);
    border-bottom: 1px solid var(--border);
    background-color: var(--surface-1);
    z-index: 10;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .ai-status-pill {
    display: flex;
    align-items: center;
    gap: 7px;
    background-color: var(--surface-2);
    border: 1px solid var(--border);
    padding: 3px 10px;
    border-radius: var(--radius-full);
  }

  :global(.cpu-icon) {
    color: var(--accent);
  }

  .ai-name {
    font-size: 11.5px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .privacy-guarantee {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--text-tertiary);
  }

  /* Messages Area */
  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-6) var(--space-6) var(--space-4) var(--space-6);
    display: flex;
    flex-direction: column;
  }

  .conversation-intro {
    max-width: 580px;
    margin: var(--space-4) auto var(--space-6) auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .intro-icon-box {
    width: 54px;
    height: 54px;
    border-radius: var(--radius-lg);
    background-color: var(--accent-subtle);
    border: 1px solid rgba(99, 102, 241, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--space-3);
  }

  :global(.intro-sparkle) {
    color: var(--accent);
  }

  .intro-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 4px;
  }

  .intro-desc {
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .messages-list {
    max-width: 820px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .streaming-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--accent);
    padding: 8px 12px;
    margin-bottom: var(--space-3);
  }

  .pulse-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: var(--accent);
    animation: stream-pulse 1s ease-in-out infinite;
  }

  @keyframes stream-pulse {
    0%, 100% { opacity: 0.3; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
  }

  /* Bottom Area */
  .chat-bottom-area {
    padding: var(--space-3) var(--space-6) var(--space-4) var(--space-6);
    background-color: var(--surface-1);
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .prompt-chips-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    max-width: 820px;
  }

  .prompt-chip {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 500;
    color: var(--text-secondary);
    background-color: var(--surface-2);
    border: 1px solid var(--border);
    padding: 4px 10px;
    border-radius: var(--radius-full);
    transition: all var(--duration-fast) var(--ease-out);
  }

  .prompt-chip:hover:not(:disabled) {
    color: var(--text-primary);
    background-color: var(--surface-hover);
    border-color: var(--accent);
  }

  :global(.chip-sparkle) {
    color: var(--accent);
  }

  .chat-input-form {
    width: 100%;
    max-width: 820px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .input-bar-inner {
    width: 100%;
    display: flex;
    align-items: center;
    background-color: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-full);
    padding: 6px 8px 6px 16px;
    transition: border-color var(--duration-fast) var(--ease-out);
  }

  .input-bar-inner:focus-within {
    border-color: var(--accent);
  }

  .main-chat-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 13.5px;
    color: var(--text-primary);
  }

  .main-chat-input::placeholder {
    color: var(--text-tertiary);
  }

  :global(.submit-btn) {
    border-radius: var(--radius-full) !important;
  }

  .disclaimer-text {
    font-size: 11px;
    color: var(--text-tertiary);
    text-align: center;
  }
</style>
