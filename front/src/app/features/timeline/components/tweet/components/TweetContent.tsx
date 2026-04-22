import { basePath } from 'app/config';
import { BlockKitContent } from 'app/features/mrkdwn/BlockKitRenderer';
import { MrkdwnContent } from 'app/features/mrkdwn/MrkdwnRenderer';
import { type ResolveContext, useResolveContext } from 'app/features/mrkdwn/ResolveContext';
import { type TextAttachment, Tweet } from 'app/features/timeline/interface';
import * as React from 'react';
import styles from './Tweet.module.css';

const colorKeywords: Record<string, string> = {
  good: '#2eb886',
  warning: '#daa038',
  danger: '#a30200',
};

function resolveColor(color: string | undefined): string | undefined {
  if (!color) return undefined;
  return colorKeywords[color] ?? `#${color}`;
}

const AttachmentView = ({
  att,
  resolveContext,
}: {
  att: TextAttachment;
  resolveContext: ResolveContext;
}) => (
  <div
    className={styles.tweetAttachment}
    style={att.color ? { borderLeftColor: resolveColor(att.color) } : undefined}
  >
    {att.authorName && (
      <div className={styles.tweetAttachmentAuthor}>
        {att.authorIcon && (
          <img className={styles.tweetAttachmentAuthorIcon} src={att.authorIcon} alt="" />
        )}
        {att.authorName}
      </div>
    )}
    {att.title &&
      (att.titleLink ? (
        <div className={styles.tweetAttachmentTitle}>
          <a href={att.titleLink} target="_blank" rel="noopener noreferrer">
            {att.title}
          </a>
        </div>
      ) : (
        <div className={styles.tweetAttachmentTitle}>{att.title}</div>
      ))}
    {att.pretext && (
      <div className={styles.tweetAttachmentText}>
        <MrkdwnContent text={att.pretext} context={resolveContext} />
      </div>
    )}
    {att.text && (
      <div className={styles.tweetAttachmentText}>
        <MrkdwnContent text={att.text} context={resolveContext} />
      </div>
    )}
    {att.imageUrl && <img className={styles.tweetContentsImage} src={att.imageUrl} alt="" />}
    {att.footer && <div className={styles.tweetAttachmentFooter}>{att.footer}</div>}
  </div>
);

export const TweetContent = ({ message }: { message: Tweet }) => {
  const resolveContext = useResolveContext();

  const hasBlocks = message.blocks && message.blocks.length > 0;
  const hasText = message.text !== '';
  const hasContent =
    hasBlocks ||
    hasText ||
    message.files.length > 0 ||
    message.imageAttachments.length > 0 ||
    message.textAttachments.length > 0;

  const textContent = message.isHuddle ? (
    <span className={styles.tweetContentsSystemMessage}>ハドルが開始されました</span>
  ) : hasBlocks ? (
    <BlockKitContent blocks={message.blocks!} context={resolveContext} />
  ) : hasText ? (
    <MrkdwnContent text={message.text} context={resolveContext} />
  ) : !hasContent ? (
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
      {message.textAttachments.map((att, i) => (
        <AttachmentView key={`text-att-${i}`} att={att} resolveContext={resolveContext} />
      ))}
    </div>
  );
};
