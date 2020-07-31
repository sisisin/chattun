const deepLinking = ['viaBrowser', 'directly'] as const;
export type DeepLinking = typeof deepLinking[number];

const matchMethods = ['contain', 'startsWith', 'endsWith'] as const;
export type MatchMethod = typeof matchMethods[number];
export type ChannelMatch = {
  matchMethod: MatchMethod;
  matchValue: string;
};

const keywordMatchMethods = ['notContain'] as const;
export type KeywordMatchMethod = typeof keywordMatchMethods[number];
export type KeywordMatch = {
  matchMethod: KeywordMatchMethod;
  matchValue: string;
};
export type TimelineSettings = {
  deepLinking: DeepLinking;
  channelMatch: ChannelMatch | undefined;
  keywordMatch: KeywordMatch | undefined;
  markAsRead: boolean;
};
