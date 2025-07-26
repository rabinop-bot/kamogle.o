<script lang="ts">
  let { status } = $props();
</script>

<div class="flex justify-center mb-4 sm:mb-8">
  <div class="backdrop-blur-xl bg-white/10 rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-2xl border border-white/20 flex items-center gap-2 sm:gap-3">
    {#if status === 'disconnected'}
      <div class="w-3 h-3 sm:w-4 sm:h-4 bg-gray-400 rounded-full shadow-lg"></div>
      <span class="text-gray-300 font-medium text-sm sm:text-base">Ready to Connect</span>
    {:else if status === 'connecting'}
      <div class="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50"></div>
      <span class="text-yellow-300 font-medium flex items-center gap-2 text-sm sm:text-base">
        <svg class="w-3 h-3 sm:w-4 sm:h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span class="hidden sm:inline">Finding your perfect stranger...</span>
        <span class="sm:hidden">Connecting...</span>
      </span>
    {:else if status === 'connected'}
      <div class="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
      <span class="text-green-300 font-medium flex items-center gap-2 text-sm sm:text-base">
        <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span class="hidden sm:inline">Connected to stranger</span>
        <span class="sm:hidden">Connected</span>
      </span>
    {/if}
  </div>
</div>
