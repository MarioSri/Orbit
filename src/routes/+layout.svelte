<script lang="ts">
  import { onMount } from 'svelte';
  import '$lib/styles/tokens.css';
  import AppShell from '$lib/components/AppShell.svelte';
  import { initAuth } from '$lib/authStore';

  let { children } = $props();

  onMount(() => {
    initAuth();
  });
</script>

<AppShell>
  {@render children()}
</AppShell>
