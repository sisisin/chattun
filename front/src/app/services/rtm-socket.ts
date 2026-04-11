import { SlackActions } from 'app/features/slack/interface';
import { appRegistry } from 'app/services/AppRegistry';
import { io } from 'socket.io-client';
import { basePath } from 'app/config';
import { appHistory } from 'app/services/appHistory';

export async function connect() {
  const socket = io(basePath, { transports: ['websocket'] });

  socket.on('pong', () => {
    console.log('received pong');
  });
  socket.on('message', ev => {
    appRegistry.dispatch(SlackActions.onRTMEmitted(ev));
  });
  socket.on('disconnect', reason => {
    if (reason === 'io server disconnect') {
      alert('セッションの有効期限が切れました。再度ログインしてください。');
      appHistory.push('/login');
    }
  });

  socket.send('ping');
}
