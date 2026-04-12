import { AppLink } from 'app/components/AppLink';
import { IconAddReaction, IconThread } from 'app/components/icons/Icons';
import { basePath } from 'app/config';
import { EmojiMenuActions } from 'app/features/emojiMenu/interface';
import { getGlobalSettingState } from 'app/features/globalSetting/interface';
import { type MrkdwnContext, MrkdwnContent } from 'app/features/mrkdwn/MrkdwnRenderer';
import { getSlackState } from 'app/features/slack/interface';
import { Tweet } from 'app/features/timeline/interface';
import * as React from 'react';
import { useActions, useMappedState } from 'typeless';
import { TweetActions } from '../../interface';
import { DeepLinkingButton } from './deepLinkingButton/DeepLinkingButton';
import { useSetIntersectionObserver } from './hooks';
import { TweetTimestamp } from './TweetTimestamp';
import { TweetEditedMarker } from './TweetEditedMarker';

const skinToneRegex = /^(.+?)::skin-tone-(\d)$/;
function parseSkinTone(name: string): { id: string; skin?: number } {
  const match = skinToneRegex.exec(name);
  if (match) {
    return { id: match[1], skin: Number(match[2]) };
  }
  return { id: name };
}

interface Props {
  message: Tweet;
  parentRef: React.RefObject<HTMLUListElement>;
}

export const TweetItem = ({ message, parentRef }: Props) => {
  const { addReaction, removeReaction, toggleEmojiMenu } = useActions(EmojiMenuActions);
  const { copyClicked } = useActions(TweetActions);
  const { developerMode } = useMappedState([getGlobalSettingState], s => ({
    developerMode: s.developerMode,
  }));
  const { users, emojis, myUserId } = useMappedState([getSlackState], s => ({
    users: s.users,
    emojis: s.emojis,
    myUserId: s.profile.userId,
  }));
  const tweetRef = React.useRef<HTMLLIElement>(null);

  useSetIntersectionObserver(message, tweetRef, parentRef);

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

  const isThreadReply = message.threadTs != null && message.threadTs !== message.ts;
  const linkingTs = message.threadTs || message.ts;
  return (
    <li ref={tweetRef} className={`tweet${isThreadReply ? ' tweet--thread-reply' : ''}`}>
      <AppLink
        className="tweet-icon-link"
        to="/thread/$channelId/$ts"
        params={{
          channelId: message.channelId,
          ts: linkingTs,
        }}
      >
        <img src={message.iconUrl} alt={message.displayName} />
      </AppLink>

      <div className="tweet-status">
        <span className="tweet-displayname">{message.displayName}</span>
        <TweetTimestamp datetime={new Date(+message.ts * 1000)} />
        <TweetEditedMarker edit={message.edited} />
      </div>
      <div className="tweet-channelname">
        {message.channelLink.link ? (
          <a
            href={message.channelLink.link}
            {...(message.channelLink.type === 'viaBrowser'
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            {message.channelName}
          </a>
        ) : (
          message.channelName
        )}
      </div>
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
      <div className="tweet-actions">
        <div className="tweet-actions-list-emojis">
          {message.reactions.map((elem, i) => {
            const classNames = ['tweet-actions-list-emojis-emoji'];
            if (elem.reacted) {
              classNames.push('tweet-actions-reacted');
            }
            const emojiId = elem.emoji?.id ?? elem.name;
            return (
              <span
                className={classNames.join(' ')}
                key={i}
                title={elem.reactors.join(', ')}
                onClick={() =>
                  elem.reacted ? removeReaction(message, emojiId) : addReaction(message, emojiId)
                }
              >
                {elem.emoji ? (
                  <img
                    src={elem.emoji.skins[0].src}
                    alt={elem.name}
                    style={{ width: 20, height: 20 }}
                  />
                ) : (
                  <em-emoji {...parseSkinTone(elem.name)} size="20px" />
                )}

                <span className="tweet-actions-list-emojis-count">{elem.count}</span>
              </span>
            );
          })}
        </div>

        <div className="tweet-actions-list">
          <span
            className="tweet-actions-reaction emoji-parent"
            onClick={({ clientX, clientY }) => {
              toggleEmojiMenu({ targetMessage: message, clientX, clientY });
            }}
          >
            <IconAddReaction className="tweet-actions-reaction-icon" />
          </span>
          {developerMode && (
            <span className="tweet-actions-reaction" onClick={() => copyClicked(message)}>
              <span className="tweet-actions-reaction-icon">C</span>
            </span>
          )}
          <AppLink
            className="tweet-actions-list-thread"
            to="/thread/$channelId/$ts"
            params={{
              channelId: message.channelId,
              ts: linkingTs,
            }}
          >
            <span>
              <IconThread className="tweet-actions-list-thread-icon" />
            </span>
          </AppLink>
          <DeepLinkingButton {...message.slackLink} />
          {message.threadTs && (
            <AppLink
              className="tweet-actions-thread-link"
              to="/thread/$channelId/$ts"
              params={{
                channelId: message.channelId,
                ts: linkingTs,
              }}
            >
              スレッドを表示
            </AppLink>
          )}
        </div>
      </div>
    </li>
  );
};
