import { getSlackState } from 'app/features/slack/interface';
import React, { createContext, useContext } from 'react';
import { useMappedState } from 'typeless';

export interface ResolveContext {
  resolveUser?: (userId: string) => { displayName: string } | undefined;
  resolveChannel?: (channelId: string) => string | undefined;
  resolveEmoji?: (name: string) => string | undefined;
  myUserId?: string;
}

const Ctx = createContext<ResolveContext>({});

export const useResolveContext = () => useContext(Ctx);

export const ResolveContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { users, channels, emojis, myUserId } = useMappedState([getSlackState], s => ({
    users: s.users,
    channels: s.channels,
    emojis: s.emojis,
    myUserId: s.profile.userId,
  }));

  const resolveContext = React.useMemo<ResolveContext>(
    () => ({
      resolveUser: (userId: string) => {
        const member = users[userId];
        if (!member) return undefined;
        return { displayName: member.profile.display_name || member.real_name };
      },
      resolveEmoji: (name: string) => {
        const url = emojis[name];
        if (!url) return undefined;
        if (url.startsWith('alias:')) {
          const aliasUrl = emojis[url.slice(6)];
          return aliasUrl && !aliasUrl.startsWith('alias:') ? aliasUrl : undefined;
        }
        return url;
      },
      resolveChannel: (channelId: string) => {
        const channel = channels[channelId];
        if (!channel || channel.is_im) return undefined;
        return channel.name;
      },
      myUserId,
    }),
    [users, channels, emojis, myUserId],
  );

  return <Ctx.Provider value={resolveContext}>{children}</Ctx.Provider>;
};
