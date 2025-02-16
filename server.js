import express from "express";
import "dotenv/config";
<<<<<<< HEAD
import cors from "cors"
=======
>>>>>>> origin/main
import cluster from "node:cluster";
import os from "node:os";
import process from "node:process";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the main express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server); // Attach Socket.IO to the server

// Middlewares
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
<<<<<<< HEAD
app.use(cors({
  origin: 'https://tracking-application-nbbf.onrender.com/', // Allow requests from this specific origin
  methods: 'GET,POST,PUT,DELETE', // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true // Enable credentials (cookies, authorization headers)
}));
=======
>>>>>>> origin/main

// Store location of the users
const users = {};

// Haversine formula to calculate distance between two users
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Handling sockets
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Receive and store user location
  socket.on("send-location", ({ latitude, longitude }) => {
    users[socket.id] = { latitude, longitude };

    // Calculating distances between users
    const distances = {};
    for (const userId in users) {
      if (userId !== socket.id) {
        const { latitude: lat2, longitude: lon2 } = users[userId];
        distances[userId] = getDistance(latitude, longitude, lat2, lon2);
      }
    }

    // Broadcasting  the updated locations to all clients
    io.emit("receive-location", {
      id: socket.id,
      latitude,
      longitude,
      distances,
    });
  });

  // /User disconnection Handling
  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("user-disconnected", socket.id);
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Setting up Clusters for the better scalability
const totalCpus = os.cpus().length;

if (cluster.isPrimary) {
  // Fork worker processes for each CPU
  for (let i = 0; i < totalCpus; i++) {
    cluster.fork();
  }

  console.log(`Primary process ${process.pid} is running`);
} else {
  // Worker process
  const port = process.env.PORT || 3000;

  // Define routes
  app.get("/", (req, res) => {
    res.render("index"); // Ensure "index.ejs" exists in the "views" directory
  });

  // Start the server
  server.listen(port, () => {
    console.log(`Worker process ${process.pid} is running on port ${port}`);
  });
}
