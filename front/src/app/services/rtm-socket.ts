import { SlackActions } from 'app/features/slack/interface';
import { appRegistry } from 'app/services/AppRegistry';
import { SlackRTM } from 'app/types/slack';
import { slackClient } from './http/SlackClient';

export async function connect() {
  const res = await slackClient.startRtm();
  const socket = new WebSocket(res.url);
  socket.onmessage = e => {
    const msg: SlackRTM.Event = JSON.parse(e.data);
    appRegistry.dispatch(SlackActions.onRTMEmitted(msg));
  };
}
