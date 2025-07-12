// @ts-check
import { strict as assert } from 'assert';
import { io as Client } from 'socket.io-client';

const SERVER_URL = 'http://localhost:3005';

describe('Functional Tests', function () {
  let clientSocket;

  before(function (done) {
    clientSocket = new Client(SERVER_URL);
    clientSocket.on('connect', done);
  });

  after(function (done) {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
    done();
  });

  it('should receive an init message with id', function (done) {
    clientSocket.on('init', (data) => {
      assert.ok(data.id);
      done();
    });
  });

  it('should receive game state updates', function (done) {
    clientSocket.once('state', (state) => {
      assert.ok(state.players);
      assert.ok(state.collectible);
      done();
    });
  });
});
