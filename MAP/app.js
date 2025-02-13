const express = require('express');
const app = express();
const path = require("path");
const fs = require('fs');
const http = require("http");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Ensure views folder exists

// Middleware to serve static files (like CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Check if the views folder and index.ejs exist
if (!fs.existsSync(path.join(__dirname, "views", "index.ejs"))) {
    console.error("Error: views/index.ejs file is missing!");
}

// Define a single route for rendering index.ejs
app.get('/', (req, res) => {
    res.render("index");
});

// Socket.io functionality
io.on("connection", (socket) => {
    console.log("New user connected: " + socket.id);

    socket.on("send-location", (data) => {
        io.emit("receive-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id);
        console.log("User disconnected: " + socket.id);
    });
});

// Start the server
const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
