<script lang="ts">
  let {
    messages = [],
    onSendMessage,
    onDisconnect,
    onReport,
    connectionStatus
  } = $props();

  let messageInput = $state('');
  let localVideo = $state();
  let remoteVideo = $state();
  let localStream;
  let peerConnection;
  let isMuted = $state(false);
  let isVideoOff = $state(false);
  let isPartnerVideoOn = $state(true);
  let showChat = $state(false);

  // Simulate video streams
  function startVideo() {
    if (typeof window !== 'undefined' && navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (localVideo) {
            localVideo.srcObject = stream;
          }
        })
        .catch(error => {
          console.log('Camera access denied or not available');
        });
    }
    
    // Simulate partner video with a placeholder
    setTimeout(() => {
      if (remoteVideo && connectionStatus === 'connected') {
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 240;
        const ctx = canvas.getContext('2d');
        
        function animate() {
          if (connectionStatus === 'connected' && isPartnerVideoOn) {
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, `hsl(${Date.now() / 50 % 360}, 50%, 30%)`);
            gradient.addColorStop(1, `hsl(${(Date.now() / 50 + 180) % 360}, 50%, 50%)`);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Partner Video', canvas.width/2, canvas.height/2);
            ctx.font = '12px Arial';
            ctx.fillText('(Simulated)', canvas.width/2, canvas.height/2 + 25);
            
            requestAnimationFrame(animate);
          }
        }
        
        const stream = canvas.captureStream(30);
        remoteVideo.srcObject = stream;
        animate();
      }
    }, 1000);
  }

  function toggleMute() {
    isMuted = !isMuted;
  }

  function toggleVideo() {
    isVideoOff = !isVideoOff;
  }

  function toggleChat() {
    showChat = !showChat;
  }

  function sendMessage() {
    if (messageInput.trim() && connectionStatus === 'connected') {
      onSendMessage(messageInput.trim());
      messageInput = '';
    }
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  // Start video when connected
  $effect(() => {
    if (connectionStatus === 'connected') {
      startVideo();
    }
  });
</script>

<div class="backdrop-blur-xl bg-white/10 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 max-w-7xl mx-auto overflow-hidden">
  <!-- Video Header - Mobile Optimized -->
  <div class="bg-gradient-to-r from-emerald-600/30 to-teal-600/30 backdrop-blur-xl border-b border-white/20 p-4 sm:p-6 flex justify-between items-center">
    <h2 class="font-bold text-white text-lg sm:text-xl flex items-center gap-2 sm:gap-3">
      <div class="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
      <span class="hidden sm:inline">Video Chat</span>
      <span class="sm:hidden">Video</span>
    </h2>
    <div class="flex gap-2 sm:gap-3">
      <!-- Mobile Chat Toggle -->
      <button
        onclick={toggleChat}
        class="sm:hidden group bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-700 hover:to-cyan-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 border border-blue-400/30 active:scale-95"
        aria-label="Toggle chat"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span class="sr-only">Toggle chat</span>
      </button>
      
      <button
        onclick={onReport}
        class="group bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-600 hover:to-pink-600 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 border border-red-400/30 active:scale-95"
        aria-label="Report"
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
        aria-label="Disconnect"
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

  <div class="flex flex-col xl:flex-row">
    <!-- Video Area - Mobile Optimized -->
    <div class="flex-1 p-3 sm:p-6 bg-gradient-to-b from-slate-900/50 to-blue-900/50">
      <div class="grid grid-cols-1 {showChat && 'sm:hidden'} lg:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-6">
        <!-- Remote Video -->
        <div class="relative bg-gradient-to-br from-gray-900 to-slate-900 rounded-xl sm:rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-2xl">
          <video
            bind:this={remoteVideo}
            autoplay
            playsinline
            class="w-full h-full object-cover"
          >
            <track kind="captions" />
          </video>
          {#if !isPartnerVideoOn}
            <div class="absolute inset-0 bg-gradient-to-br from-gray-800 to-slate-800 flex items-center justify-center">
              <div class="text-center text-white">
                <div class="w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-r from-gray-600 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                  <svg class="w-6 h-6 sm:w-10 sm:h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <span class="text-sm sm:text-lg font-medium">Partner's video is off</span>
              </div>
            </div>
          {/if}
          <div class="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-black/60 backdrop-blur-sm text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border border-white/20">
            Stranger
          </div>
        </div>

        <!-- Local Video -->
        <div class="relative bg-gradient-to-br from-gray-900 to-slate-900 rounded-xl sm:rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-2xl">
          <video
            bind:this={localVideo}
            autoplay
            playsinline
            muted
            class="w-full h-full object-cover {isVideoOff ? 'hidden' : ''}"
          >
            <track kind="captions" />
          </video>
          {#if isVideoOff}
            <div class="absolute inset-0 bg-gradient-to-br from-gray-800 to-slate-800 flex items-center justify-center">
              <div class="text-center text-white">
                <div class="w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-r from-red-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                  <svg class="w-6 h-6 sm:w-10 sm:h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <span class="text-sm sm:text-lg font-medium">Video Off</span>
              </div>
            </div>
          {:else if !localVideo?.srcObject}
            <div class="absolute inset-0 bg-gradient-to-br from-gray-800 to-slate-800 flex items-center justify-center">
              <div class="text-center text-white">
                <div class="w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                  <svg class="w-6 h-6 sm:w-10 sm:h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <span class="text-sm sm:text-lg font-medium">Your Video</span>
              </div>
            </div>
          {/if}
          <div class="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-black/60 backdrop-blur-sm text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border border-white/20">
            You
          </div>
        </div>
      </div>

      <!-- Video Controls - Mobile Optimized -->
      <div class="flex justify-center gap-3 sm:gap-4">
        <button
          onclick={toggleMute}
          class="group p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 border shadow-lg {isMuted ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 border-red-400/30 shadow-red-500/25' : 'bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 border-gray-400/30'} text-white"
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {#if isMuted}
            <svg class="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
            <span class="sr-only">Unmute</span>
          {:else}
            <svg class="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span class="sr-only">Mute</span>
          {/if}
        </button>

        <button
          onclick={toggleVideo}
          class="group p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 border shadow-lg {isVideoOff ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 border-red-400/30 shadow-red-500/25' : 'bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 border-gray-400/30'} text-white"
          title={isVideoOff ? 'Turn on video' : 'Turn off video'}
          aria-label={isVideoOff ? 'Turn on video' : 'Turn off video'}
        >
          {#if isVideoOff}
            <svg class="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            <span class="sr-only">Turn on video</span>
          {:else}
            <svg class="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span class="sr-only">Turn off video</span>
          {/if}
        </button>
      </div>
    </div>

    <!-- Chat Sidebar - Mobile Responsive -->
    <div class="w-full xl:w-96 border-l border-white/20 bg-gradient-to-b from-slate-800/50 to-blue-800/50 {showChat ? 'block' : 'hidden xl:block'}">
      <div class="h-48 sm:h-80 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3">
        {#if messages.length === 0}
          <div class="text-center text-blue-200/70 text-xs sm:text-sm mt-8 sm:mt-16">
            <div class="backdrop-blur-sm bg-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
              <svg class="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 mx-auto mb-1 sm:mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p class="font-medium">Chat while you video call!</p>
            </div>
          </div>
        {/if}

        {#each messages as message}
          <div class="flex {message.sender === 'me' ? 'justify-end' : 'justify-start'}">
            <div class="max-w-xs px-3 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm backdrop-blur-sm border transition-all duration-300 hover:scale-105 active:scale-95 {
              message.sender === 'me' 
                ? 'bg-gradient-to-r from-blue-600/80 to-cyan-600/80 text-white border-blue-400/30 shadow-lg shadow-blue-500/25' 
                : 'bg-white/10 text-gray-100 border-white/20 shadow-lg'
            }">
              {message.text}
            </div>
          </div>
        {/each}
      </div>

      <div class="border-t border-white/20 p-3 sm:p-4">
        <div class="flex gap-2 sm:gap-3">
          <input
            bind:value={messageInput}
            onkeypress={handleKeyPress}
            placeholder="Type a message..."
            disabled={connectionStatus !== 'connected'}
            class="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 sm:py-2 text-white placeholder-blue-200/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 disabled:bg-gray-500/20 transition-all duration-300"
            style="font-size: 16px;"
          />
          <button
            onclick={sendMessage}
            disabled={connectionStatus !== 'connected' || !messageInput.trim()}
            class="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 border border-blue-400/30 active:scale-95"
          >
            <svg class="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span class="sr-only">Send message</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
