import { basePath } from 'app/config';
import { BlockKitContent } from 'app/features/mrkdwn/BlockKitRenderer';
import { MrkdwnContent } from 'app/features/mrkdwn/MrkdwnRenderer';
import { useResolveContext } from 'app/features/mrkdwn/ResolveContext';
import { Tweet } from 'app/features/timeline/interface';
import * as React from 'react';
import styles from './Tweet.module.css';

export const TweetContent = ({ message }: { message: Tweet }) => {
  const resolveContext = useResolveContext();

  const hasBlocks = message.blocks && message.blocks.length > 0;
  const hasText = message.text !== '';

  const textContent = message.isHuddle ? (
    <span className={styles.tweetContentsSystemMessage}>ハドルが開始されました</span>
  ) : hasBlocks ? (
    <BlockKitContent blocks={message.blocks!} context={resolveContext} />
  ) : hasText ? (
    <MrkdwnContent text={message.text} context={resolveContext} />
  ) : message.files.length === 0 && message.imageAttachments.length === 0 ? (
    <span className={styles.tweetContentsSystemMessage}>
      [chattun] 未対応のメッセージ形式です。Slack appで確認してください。
    </span>
  ) : null;

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
