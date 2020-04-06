import { isAfterMarked } from 'app/features/slack/SlackQuery';
import { getSlackClient } from 'app/services/http/SlackClient';
import { SessionActions } from '../session/interface';
import { TimelineActions } from '../timeline/interface';
import { handle, SlackActions, SlackState } from './interface';

// --- Epic ---
export const epic = handle
  .epic()
  .on(SessionActions.connectionInitialized, async () => {
    const emojis = await getSlackClient().listEmojis();
    return SlackActions.fetchEmojis(emojis);
  })
  .on(SessionActions.connectionInitialized, async () => {
    const users = await getSlackClient().listUsers();
    return SlackActions.fetchUsers(users);
  })
  .on(SessionActions.connectionInitialized, async () => {
    const channels = await getSlackClient().listChannels();
    return SlackActions.fetchChannels(channels);
  })
  .on(SessionActions.connectionInitialized, async () => {
    const team = await getSlackClient().teamInfo();
    return SlackActions.fetchTeamInfo(team);
  });

// --- Reducer ---
export const initialState: SlackState = {
  messagesByChannel: {},
  emojis: {},
  users: {},
  channels: {},
  markedByChannels: {},
  // note: アプリが動き始める前に初期化されているべきなので、型はnullableにしていない
  // が、初期値自体はサーバーからとってくるので一旦undefで初期化する
  profile: undefined!,
};

export function toObject<T extends { id: string }>(target: T[]): Partial<Record<string, T>> {
  const obj: Partial<Record<string, T>> = {};
  target.forEach(v => {
    obj[v.id] = v;
  });
  return obj;
}

export const reducer = handle
  .reducer(initialState)
  .on(SessionActions.connectionInitialized, (state, { userId }) => {
    state.profile = { userId };
  })
  .on(SlackActions.fetchTeamInfo, (state, { teamInfo }) => {
    state.profile.domain = teamInfo.team.domain;
  })
  .on(SlackActions.fetchEmojis, (state, { emojis }) => {
    state.emojis = emojis.emoji;
  })
  .on(SlackActions.fetchUsers, (state, { users }) => {
    state.users = toObject(users.members);
  })
  .on(SlackActions.fetchChannels, (state, { channels }) => {
    state.channels = toObject(channels.channels);
  })
  .nested('messagesByChannel', reducer => {
    const getUpdatedAt = () => ({ updatedAt: new Date().getTime() });

    return reducer
      .on(SlackActions.mergeMessages, (state, { messages }) => {
        messages.forEach(msg => {
          if (state[msg.channel] === undefined) {
            state[msg.channel] = {};
          }
          if (state[msg.channel]![msg.ts] === undefined) {
            state[msg.channel]![msg.ts] = { ...msg, ...getUpdatedAt() };
          }
        });
      })
      .on(SlackActions.onMessage, (state, { message }) => {
        if (message.subtype === 'message_deleted') {
          delete state[message.channel]?.[message.deleted_ts];
          return;
        }

        if (state[message.channel] === undefined) {
          state[message.channel] = {};
        }

        switch (message.subtype) {
          case 'message_changed': {
            const body = message.message;
            if (state[message.channel]![body.ts] === undefined) {
              state[message.channel]![body.ts] = {
                channel: message.channel,
                ...body,
                ...getUpdatedAt(),
              };
            } else {
              state[message.channel]![body.ts] = {
                ...state[message.channel]![body.ts],
                ...body,
              };
            }
            break;
          }

          default: {
            state[message.channel]![message.ts] = { ...message, ...getUpdatedAt() };
            break;
          }
        }
      })
      .on(SlackActions.onReactionAdded, (state, { reaction }) => {
        // そもそも投稿を持ってなかったら何もしない
        if (state[reaction.item.channel]?.[reaction.item.ts] === undefined) {
          return;
        }

        const message = state[reaction.item.channel]![reaction.item.ts]!;
        message.updatedAt = getUpdatedAt().updatedAt;
        if (message.reactions === undefined) {
          message.reactions = [
            {
              name: reaction.reaction,
              users: [reaction.user],
              count: 1,
            },
          ];
        } else {
          const reactions = message.reactions;

          const idx = reactions.findIndex(r => r.name === reaction.reaction);
          if (idx > -1) {
            const { name, count, users } = reactions[idx];
            message.reactions!.splice(idx, 1, {
              name,
              users: [...users, reaction.user],
              count: count + 1,
            });
          } else {
            message.reactions!.push({
              name: reaction.reaction,
              users: [reaction.user],
              count: 1,
            });
          }
        }
      })
      .on(SlackActions.onReactionRemoved, (state, { reaction }) => {
        // そもそも投稿を持ってなかったら何もしない
        if (state[reaction.item.channel]?.[reaction.item.ts] === undefined) {
          return;
        }

        const message = state[reaction.item.channel]![reaction.item.ts]!;
        message.updatedAt = getUpdatedAt().updatedAt;

        if (message.reactions === undefined) {
          return;
        } else {
          message.reactions = message.reactions.reduce((acc, curr) => {
            if (curr.name !== reaction.reaction) {
              return [...acc, curr];
            }

            if (curr.count === 1) {
              return acc;
            }

            return [
              ...acc,
              {
                name: curr.name,
                count: curr.count - 1,
                users: curr.users.filter(u => u !== reaction.user),
              },
            ];
          }, []);
        }
      });
  })
  .nested('markedByChannels', reducer =>
    reducer
      .on(TimelineActions.markFulfilled, (state, { message }) => {
        if (isAfterMarked(message, state)) {
          state[message.channelId] = message.ts;
        }
      })
      .on(SlackActions.onChannelMarked, (state, { mark: { ts, channel } }) => {
        if (isAfterMarked({ ts, channelId: channel }, state)) {
          state[channel] = ts;
        }
      }),
  );

// --- Module ---
export const useSlackModule = () => {
  handle();
};
