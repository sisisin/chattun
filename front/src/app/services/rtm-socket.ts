import { SlackActions } from 'app/features/slack/interface';
import { appRegistry } from 'app/services/AppRegistry';
import { SlackRTM } from 'app/types/slack';
import { slackClient } from './http/SlackClient';

import { io } from 'socket.io-client';

export async function connect1() {
  const res = await slackClient.startRtm();
  const socket = new WebSocket(res.url);
  socket.onmessage = e => {
    const msg: SlackRTM.Event = JSON.parse(e.data);
    appRegistry.dispatch(SlackActions.onRTMEmitted(msg));
  };
}
export async function connect() {
  // todo: prod url
  const socket = io('https://local.sisisin.house:3100', { transports: ['websocket'] });

  socket.on('message', ev => {
    console.log(ev);
    appRegistry.dispatch(SlackActions.onRTMEmitted(ev));
  });
}
