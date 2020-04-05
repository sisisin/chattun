import { SlackActions } from 'app/features/slack/interface';
import { appRegistry } from 'app/services/AppRegistry';
import { SlackRTM } from 'app/types/slack';
import * as ioClient from 'socket.io-client';
import { basePath } from '../config';
const io = (ioClient as any).default;
let socket: SocketIOClient.Socket | null = null;
// const io = process.env.NODE_ENV === 'test'?(ioClient.default):ioClient

export function connect(userId: string) {
  socket = io(`${basePath}/${userId}`, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 99999,
  }) as SocketIOClient.Socket;
  socket.on('message', (e: SlackRTM.Message) => {
    appRegistry.dispatch(SlackActions.onMessage(e));
  });
  socket.on('reaction_added', (e: SlackRTM.Reaction.Added) => {
    appRegistry.dispatch(SlackActions.onReactionAdded(e));
  });
  socket.on('reaction_removed', (e: SlackRTM.Reaction.Removed) => {
    appRegistry.dispatch(SlackActions.onReactionRemoved(e));
  });
  socket.on('channel_marked', (e: SlackRTM.Channels.Mark) => {
    appRegistry.dispatch(SlackActions.onChannelMarked(e));
  });
}

export function isConnected() {
  return socket != null;
}
