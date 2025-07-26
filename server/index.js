import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
// Import SvelteKit handler from build output
import { handler } from '../build/handler.js';
// SvelteKit SSR middleware (must be after static and API/socket routes)
// Only add once, after static and API/socket routes
// Security headers for production
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  next();
});
// Set Content-Type charset for text files
app.use((req, res, next) => {
  if (req.url.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
  }
  if (req.url.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  }
  if (req.url.endsWith('.html')) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
  }
  next();
});
// Remove unneeded content-security-policy header
app.use((req, res, next) => {
  res.removeHeader('Content-Security-Policy');
  next();
});
// Serve static files with cache-control immutable
app.use(express.static('public', {
  setHeaders: (res, path) => {
    if (path.endsWith('.css') || path.endsWith('.js') || path.endsWith('.png')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));
// SvelteKit SSR middleware (must be after static and API/socket routes)
app.use(handler);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let waitingUsers = {
  text: [],
  video: []
};

io.on('connection', (socket) => {

  console.log('User connected:', socket.id);

  // Listen for chat mode from client
  socket.on('chatMode', (mode) => {
    if (!['text', 'video'].includes(mode)) return;
    socket.chatMode = mode;
    console.log(`User ${socket.id} requested mode: ${mode}`);
    // Add user to waiting list
    waitingUsers[mode].push(socket);
    console.log(`Waiting list for ${mode}:`, waitingUsers[mode].map(s => s.id));
    // If at least two users are waiting, match them
    if (waitingUsers[mode].length >= 2) {
      const user1 = waitingUsers[mode].shift();
      const user2 = waitingUsers[mode].shift();
      user1.partner = user2;
      user2.partner = user1;
      console.log(`Matched users: ${user1.id} <-> ${user2.id} in mode: ${mode}`);
      user1.emit('matched');
      user2.emit('matched');
    }
  });


  // Handle messages
  socket.on('message', (msg) => {
    if (socket.partner) {
      socket.partner.emit('message', msg);
    }
  });


  // Handle disconnect
  socket.on('disconnect', () => {
    if (socket.chatMode) {
      // Remove from waiting list if present
      waitingUsers[socket.chatMode] = waitingUsers[socket.chatMode].filter(s => s !== socket);
    }
    if (socket.partner) {
      socket.partner.emit('partnerDisconnected');
      socket.partner.partner = null;
    }
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
