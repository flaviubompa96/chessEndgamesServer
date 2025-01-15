const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const endgameRoutes = require("./routes/endgamesRoutes");
const websocketHandlers = require("./websockets/websocketHandlers");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use("/", endgameRoutes);

websocketHandlers(wss);

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
