const express = require("express");
const router = express.Router();
const endgames = require("../endgames.json");

router.get("/endgames/:difficulty", (req, res) => {
  const { difficulty } = req.params;
  if (!endgames[difficulty]) return res.status(404).json({ error: "Difficulty not found" });
  res.json(endgames[difficulty].map(item => item.name));
});

router.get("/endgame/:id", (req, res) => {
  const { id } = req.params;
  for (const difficulty in endgames) {
    for (const type in endgames[difficulty]) {
      const endgame = endgames[difficulty][type].find((e) => e.id === parseInt(id));
      if (endgame) return res.json(endgame);
    }
  }
  res.status(404).json({ error: "Endgame not found" });
});

module.exports = router;
