import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
import drawDropShadow from "./drawDropShadow.mjs";
import drawUI from "./drawUI.mjs";
import generateStartPos from "./generateStartPos.mjs";
import gameConfig from "./gameConfig.mjs";

const socket = io();

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = gameConfig.playField.width;
canvas.height = gameConfig.playField.height;

// Game state
let currentPlayer = {
  id: socket.id,
  x: 50,
  y: 50,
  score: 0,
  color: "blue",
};
let opponents = [];
let collectible = null;

// Handle server responses
socket.on("connect", () => {
  currentPlayer.id = socket.id;
  socket.emit("joinGame", currentPlayer);
});

socket.on("currentOpponents", (players) => {
  opponents = players;
});

socket.on("newOpponent", (player) => {
  opponents.push(player);
});

socket.on("opponentStateChange", (updatedPlayer) => {
  opponents = opponents.map((op) => (op.id === updatedPlayer.id ? updatedPlayer : op));
});

socket.on("opponentLeave", (id) => {
  opponents = opponents.filter((p) => p.id !== id);
});

socket.on("collectible", (item) => {
  collectible = item;
});

socket.on("scored", (newScore) => {
  currentPlayer.score = newScore;
});

// Movement
document.addEventListener("keydown", (e) => {
  const step = 5;
  if (e.key === "ArrowUp") currentPlayer.y -= step;
  if (e.key === "ArrowDown") currentPlayer.y += step;
  if (e.key === "ArrowLeft") currentPlayer.x -= step;
  if (e.key === "ArrowRight") currentPlayer.x += step;

  socket.emit("playerStateChange", currentPlayer);
});

// Collision detection
function checkCollision() {
  if (!collectible) return false;

  return (
    currentPlayer.x < collectible.x + gameConfig.collectibleSprite.size &&
    currentPlayer.x + gameConfig.player.size > collectible.x &&
    currentPlayer.y < collectible.y + gameConfig.collectibleSprite.size &&
    currentPlayer.y + gameConfig.player.size > collectible.y
  );
}

// Main loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw self
  ctx.fillStyle = currentPlayer.color;
  ctx.fillRect(currentPlayer.x, currentPlayer.y, gameConfig.player.size, gameConfig.player.size);

  // Draw opponents
  opponents.forEach((op) => {
    ctx.fillStyle = "red";
    ctx.fillRect(op.x, op.y, gameConfig.player.size, gameConfig.player.size);
  });

  // Draw collectible
  if (collectible) {
    const sprite = new Image();
    sprite.src = gameConfig.collectibleSprite.srcs[collectible.spriteSrcIndex];
    ctx.drawImage(sprite, collectible.x, collectible.y, 32, 32);
  }

  // Draw UI
  drawDropShadow(ctx, `Score: ${currentPlayer.score}`, 20, 30);
  drawUI(ctx);

  // Collision logic
  if (checkCollision()) {
    socket.emit("playerCollideWithCollectible", currentPlayer);
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
