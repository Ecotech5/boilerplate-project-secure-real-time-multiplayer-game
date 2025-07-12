// @ts-check
import { strict as assert } from 'assert';
import { Player } from '../game/Player.mjs';
import { Collectible } from '../game/Collectible.mjs';

describe('Unit Tests', function () {
  describe('Player class', function () {
    it('should initialize with default values', function () {
      const p = new Player('123');
      assert.equal(p.id, '123');
      assert.equal(typeof p.x, 'number');
      assert.equal(typeof p.y, 'number');
      assert.equal(p.score, 0);
    });

    it('should move correctly', function () {
      const p = new Player('abc', 100, 100);
      p.move('left');
      assert.equal(p.x, 95);
      p.move('right');
      assert.equal(p.x, 100);
      p.move('up');
      assert.equal(p.y, 95);
      p.move('down');
      assert.equal(p.y, 100);
    });
  });

  describe('Collectible class', function () {
    it('should respawn with new coordinates', function () {
      const c = new Collectible();
      const x1 = c.x;
      const y1 = c.y;
      c.respawn();
      assert.notEqual(c.x, x1);
      assert.notEqual(c.y, y1);
    });

    it('should detect collision with a player', function () {
      const c = new Collectible();
      const p = new Player('abc', c.x, c.y);
      assert.equal(c.isCollected(p), true);
    });
  });
});
