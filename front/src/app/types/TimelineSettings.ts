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
export type TimelineSetting = {
  channelMatch?: ChannelMatch;
  keywordMatch?: KeywordMatch;
};
export type GlobalSettings = {
  deepLinking: DeepLinking;
  markAsRead: boolean;
  timelines: TimelineSetting[]; // non empty required
};
export type GlobalSettingsLegacy = Partial<GlobalSettings> & {
  channelMatch?: ChannelMatch;
  keywordMatch?: KeywordMatch;
};
