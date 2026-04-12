import { basePath } from 'app/config';
import { type MrkdwnContext, MrkdwnContent } from 'app/features/mrkdwn/MrkdwnRenderer';
import { getSlackState } from 'app/features/slack/interface';
import { Tweet } from 'app/features/timeline/interface';
import * as React from 'react';
import { useMappedState } from 'typeless';

export const TweetContent = ({ message }: { message: Tweet }) => {
  const { users, emojis, myUserId } = useMappedState([getSlackState], s => ({
    users: s.users,
    emojis: s.emojis,
    myUserId: s.profile.userId,
  }));

  const mrkdwnContext = React.useMemo<MrkdwnContext>(
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
      myUserId,
    }),
    [users, emojis, myUserId],
  );

  const hasContent =
    message.text !== '' || message.files.length > 0 || message.imageAttachments.length > 0;

  return (
    <div className="tweet-contents">
      {hasContent ? (
        <>
          <MrkdwnContent text={message.text} context={mrkdwnContext} />
          {message.files.map((file, i) => {
            const params = new URLSearchParams();
            params.append('target_url', file.thumb360);
            return (
              <a key={i} href={file.urlPrivate} target="_blank" rel="noopener">
                <img className="tweet-contents-image" src={`${basePath}/api/file?${params}`} />
              </a>
            );
          })}
          {message.imageAttachments.map((att, i) => (
            <img key={`att-${i}`} alt={att.fallback} src={att.imageUrl} />
          ))}
        </>
      ) : (
        <span className="tweet-contents-unsupported">
          対応していないメッセージ形式です。Slack appで確認してください。
        </span>
      )}
    </div>
  );
};
