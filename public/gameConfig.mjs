// ✅ File: public/gameConfig.mjs

export const gameConfig = {
  title: 'Secure Multiplayer Game',
  controlInfo: 'WASD to move',
  gameWindowWidth: 640,
  gameWindowHeight: 480,
  padding: 10,
  infoFieldHeight: 50,
  playField: {
    width: 620,
    height: 420,
  },
  avatar: {
    width: 30,
    height: 30,
    playerSrc: '/assets/player.png',
    opponentSrc: '/assets/opponent.png',
  },
  collectibleSprite: {
    width: 20,
    height: 20,
    srcs: [
      '/assets/coin1.png',
      '/assets/coin2.png',
      '/assets/coin3.png',
    ],
  },
};