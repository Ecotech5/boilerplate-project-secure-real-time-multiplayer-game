export default function generateStartPos(playField, sprite) {
  const maxX = playField.width - sprite.width;
  const maxY = playField.height - sprite.height;

  const x = Math.floor(Math.random() * (maxX + 1));
  const y = Math.floor(Math.random() * (maxY + 1));

  return { x, y };
}
