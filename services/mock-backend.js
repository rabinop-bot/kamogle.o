export default class MockBackend {
  constructor() {
    this.isConnected = false
    this.partnerId = null
    this.messageTimeout = null
    this.disconnectTimeout = null

    // Event callbacks
    this.onStatusChange = null
    this.onMatched = null
    this.onMessage = null
    this.onPartnerDisconnected = null

    // Simulated responses
    this.responses = [
      "That's interesting! Tell me more.",
      "I totally agree with you!",
      "Really? I've never thought about it that way.",
      "Haha, that's funny! 😄",
      "What do you think about that?",
      "I love that too!",
      "That sounds cool!",
      "Where are you from?",
      "What's your favorite hobby?",
      "Nice chatting with you!",
      "That's awesome!",
      "I see what you mean.",
      "Interesting perspective!",
      "Tell me something about yourself.",
      "What's the weather like there?",
      "Do you have any pets?",
      "What kind of music do you like?",
      "That's so cool!",
      "I've been there before!",
      "What do you do for fun?",
    ]
  }

  findMatch(mode, interests) {
    if (this.onStatusChange) {
      this.onStatusChange("connecting")
    }

    // Simulate matching delay (1-5 seconds)
    const matchDelay = 1000 + Math.random() * 4000

    setTimeout(() => {
      this.partnerId = "partner_" + Math.random().toString(36).substr(2, 9)
      this.isConnected = true

      if (this.onMatched) {
        this.onMatched(this.partnerId)
      }

      // Simulate random partner disconnection (20% chance after 30-120 seconds)
      if (Math.random() < 0.2) {
        this.disconnectTimeout = setTimeout(
          () => {
            this.simulatePartnerDisconnect()
          },
          30000 + Math.random() * 90000,
        )
      }
    }, matchDelay)
  }

  sendMessage(message) {
    if (!this.isConnected) return

    // Clear any existing timeout
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout)
    }

    // Simulate partner response delay (1-8 seconds)
    const responseDelay = 1000 + Math.random() * 7000

    this.messageTimeout = setTimeout(() => {
      if (this.isConnected && this.onMessage) {
        // Choose response based on message content
        const response = this.getContextualResponse(message)
        this.onMessage(response)
      }
    }, responseDelay)
  }

  getContextualResponse(message) {
    const msg = message.toLowerCase()

    // Contextual responses
    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
      const greetings = ["Hello there! 👋", "Hey! How's it going?", "Hi! Nice to meet you!", "Hello! 😊"]
      return greetings[Math.floor(Math.random() * greetings.length)]
    }

    if (msg.includes("how are you") || msg.includes("how r u")) {
      const responses = [
        "I'm doing great, thanks! How about you?",
        "Pretty good! Just chilling. You?",
        "All good here! What about you?",
      ]
      return responses[Math.floor(Math.random() * responses.length)]
    }

    if (msg.includes("where") && msg.includes("from")) {
      const locations = [
        "I'm from somewhere far away! 🌍",
        "From a place you probably haven't heard of 😄",
        "Let's keep it mysterious! Where are you from?",
      ]
      return locations[Math.floor(Math.random() * locations.length)]
    }

    if (msg.includes("age") || msg.includes("old")) {
      return "Let's not talk about age, let's just chat! 😊"
    }

    if (msg.includes("name")) {
      return "I prefer to stay anonymous! That's the fun of this, right? 😄"
    }

    if (msg.includes("music")) {
      const musicResponses = [
        "I love all kinds of music! What about you?",
        "Music is life! What's your favorite genre?",
        "I'm always discovering new artists. Any recommendations?",
      ]
      return musicResponses[Math.floor(Math.random() * musicResponses.length)]
    }

    if (msg.includes("movie") || msg.includes("film")) {
      const movieResponses = [
        "I'm a huge movie fan! What's the last good movie you watched?",
        "Movies are great! I love both classics and new releases.",
        "What genre do you prefer?",
      ]
      return movieResponses[Math.floor(Math.random() * movieResponses.length)]
    }

    if (msg.includes("game") || msg.includes("gaming")) {
      const gameResponses = [
        "Gaming is awesome! What do you play?",
        "I love games too! PC or console?",
        "What's your favorite game right now?",
      ]
      return gameResponses[Math.floor(Math.random() * gameResponses.length)]
    }

    if (msg.includes("?")) {
      // If it's a question, give a more engaging response
      const questionResponses = [
        "That's a great question! Let me think...",
        "Hmm, interesting question!",
        "Good question! What do you think?",
        "I'd say... what's your take on it?",
      ]
      return questionResponses[Math.floor(Math.random() * questionResponses.length)]
    }

    // Default random response
    return this.responses[Math.floor(Math.random() * this.responses.length)]
  }

  disconnect() {
    this.isConnected = false
    this.partnerId = null

    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout)
      this.messageTimeout = null
    }

    if (this.disconnectTimeout) {
      clearTimeout(this.disconnectTimeout)
      this.disconnectTimeout = null
    }
  }

  simulatePartnerDisconnect() {
    if (this.isConnected && this.onPartnerDisconnected) {
      this.onPartnerDisconnected()
    }
    this.disconnect()
  }

  reportUser(partnerId, reason) {
    console.log(`User reported: ${partnerId} for ${reason}`)
    // In a real app, this would send to the backend

    // Simulate report confirmation
    setTimeout(() => {
      alert("Thank you for your report. The user has been flagged for review.")
    }, 500)
  }

  cleanup() {
    this.disconnect()
  }
}
