const deepLinking = ['viaBrowser', 'directly'] as const;
export type DeepLinking = (typeof deepLinking)[number];

const themes = ['system', 'light', 'dark'] as const;
export type Theme = (typeof themes)[number];

const matchMethods = ['contain', 'startsWith', 'endsWith'] as const;
export type MatchMethod = (typeof matchMethods)[number];
export type ChannelMatch = {
  matchMethod: MatchMethod;
  matchValue: string;
};

export type TimelineSettings = {
  deepLinking: DeepLinking;
  theme: Theme;
  channelMatches: ChannelMatch[];
  mutedUsers: string[];
  developerMode: boolean;
};
