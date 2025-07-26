<script lang="ts">
  import { run } from 'svelte/legacy';

  let {
    messages = [],
    onSendMessage,
    onDisconnect,
    onReport,
    connectionStatus
  } = $props();

  let messageInput = $state('');
  let chatContainer: HTMLDivElement | null = null;

  function sendMessage() {
    if (messageInput.trim() && connectionStatus === 'connected') {
      onSendMessage(messageInput.trim());
      messageInput = '';
      
      // Scroll to bottom
      setTimeout(() => {
        if (chatContainer !== null) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 10);
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  // Auto-scroll to bottom when new messages arrive
  run(() => {
    if (messages.length > 0 && chatContainer !== null) {
      setTimeout(() => {
        if (chatContainer !== null) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 10);
    }
  });
</script>

<div class="backdrop-blur-xl bg-white/10 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 max-w-5xl mx-auto overflow-hidden">
  <!-- Chat Header - Mobile Optimized -->
  <div class="bg-gradient-to-r from-blue-600/30 to-cyan-600/30 backdrop-blur-xl border-b border-white/20 p-4 sm:p-6 flex justify-between items-center">
    <h2 class="font-bold text-white text-lg sm:text-xl flex items-center gap-2 sm:gap-3">
      <div class="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
      <span class="hidden sm:inline">Anonymous Chat</span>
      <span class="sm:hidden">Chat</span>
    </h2>
    <div class="flex gap-2 sm:gap-3">
      <button
        onclick={onReport}
        class="group bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-600 hover:to-pink-600 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 border border-red-400/30 active:scale-95"
      >
        <span class="flex items-center gap-1 sm:gap-2">
          <svg class="w-3 h-3 sm:w-4 sm:h-4 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Report
        </span>
      </button>
      <button
        onclick={onDisconnect}
        class="group bg-gradient-to-r from-gray-600/80 to-slate-600/80 hover:from-gray-700 hover:to-slate-700 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg border border-gray-400/30 active:scale-95"
      >
        <span class="flex items-center gap-1 sm:gap-2">
          <svg class="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span class="hidden sm:inline">Disconnect</span>
          <span class="sm:hidden">Exit</span>
        </span>
      </button>
    </div>
  </div>

  <!-- Messages Area - Mobile Optimized -->
  <div 
    bind:this={chatContainer}
    class="h-64 sm:h-96 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 bg-gradient-to-b from-slate-900/50 to-blue-900/50"
  >
    {#if messages.length === 0 && connectionStatus === 'connected'}
      <div class="text-center text-blue-200/70 mt-12 sm:mt-20">
        <div class="backdrop-blur-sm bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 inline-block">
          <svg class="w-8 h-8 sm:w-12 sm:h-12 text-cyan-400 mx-auto mb-2 sm:mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p class="text-base sm:text-lg font-medium">Connected! Say hello to start the conversation.</p>
        </div>
      </div>
    {/if}

    {#each messages as message, index}
      <div class="flex {message.sender === 'me' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom duration-500" style="animation-delay: {index * 100}ms">
        <div class="max-w-xs sm:max-w-sm lg:max-w-md px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 active:scale-95 {
          message.sender === 'me' 
            ? 'bg-gradient-to-r from-blue-600/80 to-cyan-600/80 text-white border-blue-400/30 shadow-lg shadow-blue-500/25' 
            : 'bg-white/10 text-gray-100 border-white/20 shadow-lg'
        }">
          <p class="text-xs sm:text-sm leading-relaxed break-words">{message.text}</p>
          <div class="text-xs opacity-60 mt-1">
            {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Message Input - Mobile Optimized -->
  <div class="bg-gradient-to-r from-slate-800/50 to-blue-800/50 backdrop-blur-xl border-t border-white/20 p-3 sm:p-6">
    <div class="flex gap-2 sm:gap-4">
      <input
        bind:value={messageInput}
        onkeypress={handleKeyPress}
        placeholder={connectionStatus === 'connected' ? 'Type your message...' : 'Waiting for connection...'}
        disabled={connectionStatus !== 'connected'}
        class="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 disabled:bg-gray-500/20 disabled:cursor-not-allowed transition-all duration-300 text-sm sm:text-base"
        style="font-size: 16px;" 
      />
      <button
        onclick={sendMessage}
        disabled={connectionStatus !== 'connected' || !messageInput.trim()}
        class="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 border border-blue-400/30 active:scale-95"
      >
        <span class="flex items-center gap-1 sm:gap-2">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <span class="hidden sm:inline">Send</span>
        </span>
      </button>
    </div>
  </div>
</div>
