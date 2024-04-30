const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve the static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Object to store user information (userId: username)
const users = {};

// Array to store chat messages
const chatHistory = [];

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle new user
  socket.on("newUser", ({ userId, username }) => {
    // Store user information
    users[userId] = username;
    // Send chat history to the new user
    socket.emit("chatHistory", chatHistory);
  });

  // Handle incoming messages
  socket.on("chatMessage", ({ userId, username, message }) => {
    // Broadcast the message to all connected clients
    io.emit("chatMessage", {
      userId,
      username: users[userId], // Retrieve username using userId
      message,
    });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Someboady left the chat");
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
