import { AppLink } from 'app/components/AppLink';
import { IconAddReaction, IconThread } from 'app/components/icons/Icons';
import { EmojiMenuActions } from 'app/features/emojiMenu/interface';
import { Tweet } from 'app/features/timeline/interface';
import { Emoji } from 'emoji-mart';
import * as React from 'react';
import { useActions } from 'typeless';
import { TweetActions } from '../../interface';
import { DeepLinkingButton } from './deepLinkingButton/DeepLinkingButton';
import { useSetIntersectionObserver } from './hooks';

interface Props {
  message: Tweet;
  parentRef: React.RefObject<HTMLUListElement>;
}

export const TweetItem = ({ message, parentRef }: Props) => {
  const { addReaction, removeReaction, toggleEmojiMenu } = useActions(EmojiMenuActions);
  const { copyClicked } = useActions(TweetActions);
  const tweetRef = React.useRef<HTMLLIElement>(null);

  useSetIntersectionObserver(message, tweetRef, parentRef);

  // 空文字なら Tweet 自体一切表示しない
  if (message.text === '') return null;

  const ts = message.threadTs || message.ts;
  return (
    <li ref={tweetRef} className="tweet">
      <AppLink
        className="tweet-icon-link"
        to="/thread/:channelId/:ts"
        params={{
          channelId: message.channelId,
          ts,
        }}
      >
        <img src={message.iconUrl} alt={message.displayName} />
      </AppLink>

      <div className="tweet-displayname">
        <span>{message.displayName}</span>
        <span className="tweet-timestamp">{new Date(+ts * 1000).toLocaleString()}</span>
        {message.edited ? <span className="tweet-edited-marker">(edited)</span> : null}
      </div>
      <div className="tweet-channelname">{message.channelName}</div>
      <div className="tweet-contents" dangerouslySetInnerHTML={{ __html: message.text }} />
      <div className="tweet-actions">
        <div className="tweet-actions-list-emojis">
          {message.reactions.map((elem, i) => {
            const classNames = ['tweet-actions-list-emojis-emoji'];
            if (elem.reacted) {
              classNames.push('tweet-actions-reacted');
            }
            return (
              <span className={classNames.join(' ')} key={i} title={elem.reactors.join(', ')}>
                <Emoji
                  emoji={elem.emoji || elem.name}
                  size={20}
                  onClick={emoji =>
                    elem.reacted
                      ? removeReaction(message, emoji.id!)
                      : addReaction(message, emoji.id!)
                  }
                />

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
          {localStorage.getItem('EC') === '1' && (
            <span className="tweet-actions-reaction" onClick={() => copyClicked(message)}>
              <span className="tweet-actions-reaction-icon">C</span>
            </span>
          )}
          <AppLink
            className="tweet-actions-list-thread"
            to="/thread/:channelId/:ts"
            params={{
              channelId: message.channelId,
              ts: message.threadTs || message.ts,
            }}
          >
            <span>
              <IconThread className="tweet-actions-list-thread-icon" />
            </span>
          </AppLink>
          <DeepLinkingButton {...message.slackLink} />
        </div>
      </div>

      <div className="tweet-ts">{message.ts}</div>
    </li>
  );
};
