const deepLinking = ['viaBrowser', 'directly'] as const;
export type DeepLinking = typeof deepLinking[number];

const matchMethods = ['contain', 'startsWith', 'endsWith'] as const;
export type MatchMethod = typeof matchMethods[number];
export type ChannelMatch = {
  matchMethod: MatchMethod;
  matchValue: string;
};

export type TimelineSettings = {
  deepLinking: DeepLinking;
  channelMatch: ChannelMatch | undefined;
  markAsRead: boolean;
};
