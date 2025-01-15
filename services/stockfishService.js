const { spawn } = require("child_process");

let stockfishProcess = null;

const startStockfish = (fen) => {
  if (stockfishProcess) stockfishProcess.kill();

  stockfishProcess = spawn("stockfish");
  stockfishProcess.stdin.write(`position fen ${fen}\n`);
  stockfishProcess.stdin.write("go movetime 1000\n");

  return stockfishProcess;
};

const stopStockfish = () => {
  if (stockfishProcess) {
    stockfishProcess.kill();
    stockfishProcess = null;
  }
};

module.exports = {
  startStockfish,
  stopStockfish,
};
