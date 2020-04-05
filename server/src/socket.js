const { RTMClient } = require('@slack/client');
const logger = require('./logger');

const socketMap = new Map();

function hasClient(userId) {
  return socketMap.has(userId);
}
/**
 *
 * @param {SocketIO.Server} io
 * @param {Object} user
 * @param {string} user.userId
 * @param {string} user.accessToken
 */
async function startSocket(io, { userId, accessToken }) {
  logger.log('start socket');
  if (hasClient(userId)) {
    return;
  }

  const client = new RTMClient(accessToken);
  const res = await client.start();
  logger.log('slack connection started');
  logger.log(JSON.stringify(res), true);

  socketMap.set(userId, { client });

  const nsp = io.of(userId);
  registerEvents({ client, nsp });
  nsp.use((socket, next) => {
    if (socket.request.user.userId === userId) {
      next();
    } else {
      next(new Error('Invalid Session'));
    }
  });
}
module.exports = {
  hasClient,
  startSocket,
};
function registerEvents({ client, nsp }) {
  client.on('message', e => emitEvent(nsp, e));
  client.on('reaction_added', e => emitEvent(nsp, e));
  client.on('reaction_removed', e => emitEvent(nsp, e));
  client.on('channel_marked', e => emitEvent(nsp, e));
}
/**
 *
 * @param {SocketIO.Socket} socket
 * @param {*} e
 */
function emitEvent(socket, e) {
  logger.log(JSON.stringify(e), true);
  socket.emit(e.type, e);
}
