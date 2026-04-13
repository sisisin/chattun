import { basePath } from 'app/config';
import { type BlockKitContext, BlockKitContent } from 'app/features/mrkdwn/BlockKitRenderer';
import { type MrkdwnContext, MrkdwnContent } from 'app/features/mrkdwn/MrkdwnRenderer';
import { getSlackState } from 'app/features/slack/interface';
import { Tweet } from 'app/features/timeline/interface';
import * as React from 'react';
import { useMappedState } from 'typeless';
import styles from './Tweet.module.css';

export const TweetContent = ({ message }: { message: Tweet }) => {
  const { users, channels, emojis, myUserId } = useMappedState([getSlackState], s => ({
    users: s.users,
    channels: s.channels,
    emojis: s.emojis,
    myUserId: s.profile.userId,
  }));

  const resolveContext = React.useMemo<MrkdwnContext & BlockKitContext>(
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

  const hasBlocks = message.blocks && message.blocks.length > 0;
  const hasContent =
    message.text !== '' || message.files.length > 0 || message.imageAttachments.length > 0;

  const textContent = message.isHuddle ? (
    <span className={styles.tweetContentsSystemMessage}>ハドルが開始されました</span>
  ) : hasBlocks ? (
    <BlockKitContent blocks={message.blocks!} context={resolveContext} />
  ) : hasContent ? (
    <MrkdwnContent text={message.text} context={resolveContext} />
  ) : (
    <span className={styles.tweetContentsSystemMessage}>
      [chattun] 未対応のメッセージ形式です。Slack appで確認してください。
    </span>
  );

  return (
    <div className={styles.tweetContents}>
      {textContent}
      {message.files.map((file, i) => {
        const params = new URLSearchParams();
        params.append('target_url', file.thumb360);
        return (
          <a key={i} href={file.urlPrivate} target="_blank" rel="noopener">
            <img className={styles.tweetContentsImage} src={`${basePath}/api/file?${params}`} />
          </a>
        );
      })}
      {message.imageAttachments.map((att, i) => (
        <img key={`att-${i}`} alt={att.fallback} src={att.imageUrl} />
      ))}
    </div>
  );
};
