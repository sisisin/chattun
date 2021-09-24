import { SlackActions } from 'app/features/slack/interface';
import { appRegistry } from 'app/services/AppRegistry';
import { io } from 'socket.io-client';
import { basePath } from 'app/config';

export async function connect() {
  const socket = io(basePath, { transports: ['websocket'] });

  socket.on('message', ev => {
    appRegistry.dispatch(SlackActions.onRTMEmitted(ev));
  });
}
