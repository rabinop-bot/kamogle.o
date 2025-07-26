<script lang="ts">
  let { onSave, currentInterests = [] } = $props();

  let selectedInterests = $state([...currentInterests]);
  
  const popularInterests = [
    'Music', 'Movies', 'Gaming', 'Sports', 'Art', 'Technology',
    'Travel', 'Food', 'Books', 'Photography', 'Fitness', 'Fashion',
    'Science', 'Politics', 'Comedy', 'Anime', 'Cooking', 'Dancing',
    'Programming', 'Languages', 'History', 'Philosophy', 'Pets', 'Nature'
  ];

  function toggleInterest(interest: string) {
    if (selectedInterests.includes(interest)) {
      selectedInterests = selectedInterests.filter(i => i !== interest);
    } else {
      selectedInterests = [...selectedInterests, interest];
    }
  }

  function saveInterests() {
    onSave(selectedInterests);
  }
</script>

<div class="backdrop-blur-xl bg-white/10 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 max-w-4xl mx-auto p-4 sm:p-8">
  <div class="text-center mb-6 sm:mb-8">
    <h2 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent mb-3 sm:mb-4">
      Select Your Interests
    </h2>
    <p class="text-blue-100/80 text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto">
      Choose topics that spark your curiosity to connect with like-minded souls across the digital cosmos.
    </p>
  </div>

  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
    {#each popularInterests as interest}
      <button
        onclick={() => toggleInterest(interest)}
        class="group relative overflow-hidden px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border transition-all duration-500 hover:scale-105 active:scale-95 {
          selectedInterests.includes(interest)
            ? 'bg-gradient-to-r from-blue-600/80 to-cyan-600/80 text-white border-blue-400/30 shadow-lg shadow-blue-500/25'
            : 'bg-white/10 backdrop-blur-sm text-blue-100 border-white/20 hover:border-cyan-400/50 hover:bg-white/20'
        }"
      >
        <div class="relative z-10 font-medium text-xs sm:text-sm">{interest}</div>
        {#if selectedInterests.includes(interest)}
          <div class="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        {/if}
        <div class="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </button>
    {/each}
  </div>

  <div class="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 sm:pt-6 border-t border-white/20">
    <div class="flex items-center gap-2 sm:gap-3">
      <div class="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
      <p class="text-blue-200/80 font-medium text-sm sm:text-base">
        {selectedInterests.length} interest{selectedInterests.length !== 1 ? 's' : ''} selected
      </p>
    </div>
    
    <div class="flex gap-3 sm:gap-4 w-full sm:w-auto">
      <button
        onclick={() => onSave([])}
        class="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 text-blue-200 hover:text-white transition-all duration-300 font-medium backdrop-blur-sm bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:border-white/30 active:scale-95"
      >
        Skip for now
      </button>
      <button
        onclick={saveInterests}
        class="flex-1 sm:flex-none group relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 border border-blue-400/30 active:scale-95"
      >
        <div class="relative z-10 flex items-center justify-center gap-2">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class="text-sm sm:text-base">Save & Continue</span>
        </div>
        <div class="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </button>
    </div>
  </div>
</div>
