<script lang="ts">
  import { onMount } from 'svelte';
  import ChatInterface from './lib/components/chat-interface.svelte';
  import VideoChat from './lib/components/video-chat.svelte';
  import InterestSelector from './lib/components/interest-selector.svelte';
  import ConnectionStatus from './lib/components/connection-status.svelte';
  import MockBackend from './lib/services/mock-backend.js';

  let currentView: 'home' | 'interests' | 'chat' | 'video' = $state('home');
  let connectionStatus: 'disconnected' | 'connecting' | 'connected' = $state('disconnected');
  let chatMode: 'text' | 'video' = 'text';
  let messages: Array<{ text: string; sender: 'me' | 'partner'; timestamp: number }> = $state([]);
  let interests: string[] = $state([]);
  let partnerId: string | null = null;
  let mockBackend: MockBackend;

  onMount(() => {
    // Initialize mock backend
    mockBackend = new MockBackend();
    
    // Set up event listeners
    mockBackend.onStatusChange = (status: 'disconnected' | 'connecting' | 'connected') => {
      connectionStatus = status;
    };

    mockBackend.onMatched = (id: string) => {
      partnerId = id;
      connectionStatus = 'connected';
      currentView = chatMode === 'video' ? 'video' : 'chat';
      messages = [];
      
      // Simulate partner sending first message after a delay
      setTimeout(() => {
        if (connectionStatus === 'connected') {
          const greetings = [
            "Hey there! 👋",
            "Hello! How's it going?",
            "Hi! Nice to meet you!",
            "Hey! What's up?",
            "Hello! How are you today?"
          ];
          const greeting = greetings[Math.floor(Math.random() * greetings.length)];
          messages = [...messages, { 
            text: greeting, 
            sender: 'partner', 
            timestamp: Date.now() 
          }];
        }
      }, 2000 + Math.random() * 3000);
    };

    mockBackend.onMessage = (message: string) => {
      messages = [...messages, { 
        text: message, 
        sender: 'partner', 
        timestamp: Date.now() 
      }];
    };

    mockBackend.onPartnerDisconnected = () => {
      handleDisconnect();
    };

    return () => {
      if (mockBackend) {
        mockBackend.cleanup();
      }
    };
  });

  function startChat(mode: 'text' | 'video' = 'text') {
    chatMode = mode;
    connectionStatus = 'connecting';
    
    // Start matching process
    mockBackend.findMatch(mode, interests);
  }

  function sendMessage(message: string) {
    if (connectionStatus === 'connected' && partnerId) {
      messages = [...messages, { text: message, sender: 'me', timestamp: Date.now() }];
      
      // Send to mock backend for partner response
      mockBackend.sendMessage(message);
    }
  }

  function handleDisconnect() {
    connectionStatus = 'disconnected';
    currentView = 'home';
    partnerId = null;
    messages = [];
  }

  function disconnect() {
    mockBackend.disconnect();
    handleDisconnect();
  }

  function reportUser() {
    mockBackend.reportUser(partnerId, 'inappropriate_behavior');
    disconnect();
  }

  function setInterests(selectedInterests: string[]) {
    interests = selectedInterests;
    currentView = 'home';
  }
</script>

<main class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
  <!-- Animated Background Elements - Optimized for mobile -->
  <div class="absolute inset-0 overflow-hidden">
    <div class="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
    <div class="absolute top-3/4 right-1/4 w-40 h-40 sm:w-80 sm:h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
    <div class="absolute top-1/2 left-1/2 w-32 h-32 sm:w-64 sm:h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
  </div>

  <!-- Crystalline Pattern Overlay -->
  <div class="absolute inset-0 opacity-5">
    <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="crystal" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <polygon points="10,2 18,8 14,16 6,16 2,8" fill="currentColor" opacity="0.1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#crystal)"/>
    </svg>
  </div>

  <div class="relative z-10 container mx-auto px-3 sm:px-4 py-4 sm:py-8">
    <!-- Header - Mobile Optimized -->
    <header class="text-center mb-6 sm:mb-12">
      <div class="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div class="relative">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250630_155353%20%282%29-xPr04mdMR0Nn9BhHiiQU0F09HIpvfT.png" alt="Kamogle Logo" class="w-12 h-12 sm:w-16 sm:h-16 drop-shadow-2xl animate-pulse" />
          <div class="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 bg-blue-400/20 rounded-full blur-xl animate-ping"></div>
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent drop-shadow-2xl">
          Kamogle
        </h1>
      </div>
      <p class="text-blue-100/80 max-w-3xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed backdrop-blur-sm bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10">
        Experience the future of anonymous connections. Connect instantly with strangers worldwide through our crystalline-clear platform. 
        <span class="text-cyan-300 font-medium block sm:inline mt-1 sm:mt-0">No registration, pure anonymity, infinite possibilities.</span>
      </p>
    </header>

    <!-- Connection Status -->
    <ConnectionStatus status={connectionStatus} />

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto">
      {#if currentView === 'home'}
        <div class="text-center space-y-6 sm:space-y-8">
          <!-- Main Action Buttons - Mobile First -->
          <div class="flex flex-col sm:grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
            <button
              onclick={() => startChat('text')}
              class="group relative overflow-hidden bg-gradient-to-r from-blue-600/80 to-cyan-600/80 backdrop-blur-xl border border-blue-400/30 text-white font-semibold py-4 sm:py-6 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              disabled={connectionStatus === 'connecting'}
            >
              <div class="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div class="relative flex items-center justify-center gap-3">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span class="text-base sm:text-lg">Text Chat</span>
              </div>
              <div class="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
            
            <button
              onclick={() => startChat('video')}
              class="group relative overflow-hidden bg-gradient-to-r from-emerald-600/80 to-teal-600/80 backdrop-blur-xl border border-emerald-400/30 text-white font-semibold py-4 sm:py-6 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              disabled={connectionStatus === 'connecting'}
            >
              <div class="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div class="relative flex items-center justify-center gap-3">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span class="text-base sm:text-lg">Video Chat</span>
              </div>
              <div class="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </div>

          <!-- Interests Button - Mobile Optimized -->
          <button
            onclick={() => currentView = 'interests'}
            class="group text-cyan-300 hover:text-white underline decoration-cyan-400/50 hover:decoration-white transition-all duration-300 text-base sm:text-lg backdrop-blur-sm bg-white/5 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-cyan-400/20 hover:border-white/30 active:scale-95"
          >
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span class="hidden sm:inline">Add interests to find like-minded souls</span>
              <span class="sm:hidden">Add interests</span>
            </span>
          </button>

          <!-- How it Works Section - Mobile Responsive -->
          <div class="backdrop-blur-xl bg-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl border border-white/20 max-w-4xl mx-auto">
            <h3 class="font-bold text-white mb-4 sm:mb-6 text-xl sm:text-2xl flex items-center justify-center gap-2 sm:gap-3">
              <svg class="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span class="hidden sm:inline">How Kamogle Works</span>
              <span class="sm:hidden">How It Works</span>
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {#each [
                { step: "1", title: "Choose Your Mode", desc: "Select text or video chat based on your preference", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13M4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
                { step: "2", title: "Instant Matching", desc: "Our crystal-clear algorithm finds your perfect stranger", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
                { step: "3", title: "Anonymous Connection", desc: "Chat freely without revealing personal information", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
                { step: "4", title: "Disconnect & Repeat", desc: "Leave anytime and instantly find a new connection", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }
              ] as item}
                <div class="group text-center p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 hover:border-cyan-400/30 transition-all duration-500 hover:scale-105 active:scale-95">
                  <div class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                    <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
                    </svg>
                  </div>
                  <div class="text-cyan-400 font-bold text-2xl sm:text-3xl mb-1 sm:mb-2">{item.step}</div>
                  <h4 class="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{item.title}</h4>
                  <p class="text-blue-100/70 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                </div>
              {/each}
            </div>
          </div>

          <!-- Current Interests Display - Mobile Responsive -->
          {#if interests.length > 0}
            <div class="backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-3xl mx-auto border border-blue-400/30">
              <h4 class="font-semibold text-cyan-300 mb-3 sm:mb-4 flex items-center justify-center gap-2 text-sm sm:text-base">
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Your Interests
              </h4>
              <div class="flex flex-wrap gap-2 sm:gap-3 justify-center">
                {#each interests as interest}
                  <span class="bg-gradient-to-r from-blue-600/50 to-cyan-600/50 backdrop-blur-sm text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm border border-blue-400/30 hover:scale-105 transition-transform duration-300">
                    {interest}
                  </span>
                {/each}
              </div>
            </div>
          {/if}
        </div>

      {:else if currentView === 'interests'}
        <InterestSelector onSave={setInterests} currentInterests={interests} />

      {:else if currentView === 'chat'}
        <ChatInterface 
          {messages} 
          onSendMessage={sendMessage}
          onDisconnect={disconnect}
          onReport={reportUser}
          {connectionStatus}
        />

      {:else if currentView === 'video'}
        <VideoChat 
          {messages}
          onSendMessage={sendMessage}
          onDisconnect={disconnect}
          onReport={reportUser}
          {connectionStatus}
        />
      {/if}
    </div>

    <!-- Footer - Mobile Optimized -->
    <footer class="text-center mt-8 sm:mt-16 text-blue-200/60 text-xs sm:text-sm backdrop-blur-sm bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 max-w-2xl mx-auto">
      <div class="flex items-center justify-center gap-2 mb-2">
        <svg class="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span class="text-cyan-300 font-medium">Stay safe online. Report inappropriate behavior immediately.</span>
      </div>
      <p class="leading-relaxed">Kamogle - Where strangers become connections through crystal-clear anonymity</p>
    </footer>
  </div>
</main>

<style>
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  /* Mobile-specific optimizations */
  @media (max-width: 640px) {
    /* Prevent zoom on input focus */
    /* input[type="text"], input[type="email"], textarea {
      font-size: 16px;
    } */
    
    /* Optimize touch targets */
    button {
      min-height: 44px;
    }
  }
</style>
