const endgames = require("../endgames.json");
const { startStockfish, stopStockfish } = require("../services/stockfishService");

const websocketHandlers = (wss) => {
  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");

    let currentEndgame = 0;
    let stockfish = null;
    let moves = [];
    let currentFEN = null;

    let defaultDifficulty;
    let defaultType;

    const getCurrentCampaign = () => {
      return endgames[defaultDifficulty]?.find(item => item.name === defaultType);
    }

    const loadEndgame = () => {
      const currentCampaign = getCurrentCampaign();
      const endgame = currentCampaign?.data[currentEndgame];
      if (endgame) {
        currentFEN = endgame.fen;
        stockfish = startStockfish(currentFEN);
        ws.send(JSON.stringify({ type: 'start', fen: currentFEN, description: endgame.description }));

        stockfish.stdout.removeAllListeners("data");
        stockfish.stdout.on("data", (data) => {
          const output = data.toString();

          if (moves.length % 2 === 1) {
            const bestMoveMatch = output.match(/bestmove\s(\w+)/);
            if (bestMoveMatch) {
              const bestMove = bestMoveMatch[1];
              ws.send(JSON.stringify({ type: "move", move: bestMove }));
              moves.push(bestMove);
            }

            if (output.includes("bestmove (none)")) {
              ws.send(JSON.stringify({ type: "end", message: "Game over.", campaignCompleted: currentEndgame + 1 === currentCampaign?.data.length }));
            }
          }
        });
      } else {
        ws.send(JSON.stringify({ type: "err", message: "No more endgames available." }));
        ws.close();
      }
    };

    ws.on("message", (message) => {
      const data = JSON.parse(message);

      if (data.type === "start") {
        defaultDifficulty = data.difficulty;
        defaultType = data.endgameType;
        currentEndgame = 0;
        moves = [];
        loadEndgame();
      } else if (data.type === "move") {
        const { move } = data;
        moves.push(move);
        stockfish.stdin.write(`position fen ${currentFEN} moves ${moves.join(" ")}\n`);
        stockfish.stdin.write("go movetime 1000\n");
      } else if (data.type === "next") {
        currentEndgame += 1;
        moves = [];
        loadEndgame();
      }
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
      stopStockfish();
    });

    ws.on("error", (err) => {
      console.error("WebSocket error:", err);
    });
  });
};

module.exports = websocketHandlers;
