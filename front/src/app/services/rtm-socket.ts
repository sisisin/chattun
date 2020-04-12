import { SlackActions } from 'app/features/slack/interface';
import { appRegistry } from 'app/services/AppRegistry';
import { SlackRTM } from 'app/types/slack';
import { rtm } from 'slack';

let started = false;
export async function connect(token: string) {
  const res = await rtm.start({ token });
  const socket = new WebSocket(res.url);
  socket.onmessage = e => {
    const msg: SlackRTM.Event = JSON.parse(e.data);

    switch (msg.type) {
      case 'message':
        appRegistry.dispatch(SlackActions.onMessage(msg));
        break;

      case 'reaction_added':
        appRegistry.dispatch(SlackActions.onReactionAdded(msg));
        break;
      case 'reaction_removed':
        appRegistry.dispatch(SlackActions.onReactionRemoved(msg));
        break;

      case 'channel_marked':
        appRegistry.dispatch(SlackActions.onChannelMarked(msg));
        break;
    }
  };
  started = true;
}

export function isConnected() {
  return started;
}
