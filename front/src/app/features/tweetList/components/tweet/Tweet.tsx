import { AppLink } from 'app/components/AppLink';
import { IconAddReaction, IconThread } from 'app/components/icons/Icons';
import { EmojiMenuActions } from 'app/features/emojiMenu/interface';
import { getGlobalSettingState } from 'app/features/globalSetting/interface';
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
  const tweetRef = React.useRef<HTMLLIElement>(null);

  useSetIntersectionObserver(message, tweetRef, parentRef);

  // 空文字なら Tweet 自体一切表示しない
  if (message.text === '') return null;

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
      <div className="tweet-contents" dangerouslySetInnerHTML={{ __html: message.text }} />
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
        </div>
      </div>
    </li>
  );
};
