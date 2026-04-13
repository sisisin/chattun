import { AppLink } from 'app/components/AppLink';
import { IconAddReaction, IconThread } from 'app/components/icons/Icons';
import { EmojiMenuActions } from 'app/features/emojiMenu/interface';
import { getGlobalSettingState } from 'app/features/globalSetting/interface';
import { Tweet } from 'app/features/timeline/interface';
import * as React from 'react';
import { useActions, useMappedState } from 'typeless';
import { TweetActions } from '../interface';
import { DeepLinkingButton } from './deepLinkingButton/DeepLinkingButton';
import { useSetIntersectionObserver } from './hooks';
import { TweetContent } from './TweetContent';
import { TweetTimestamp } from './TweetTimestamp';
import { TweetEditedMarker } from './TweetEditedMarker';
import styles from './Tweet.module.css';

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

export const TweetView = ({ message, parentRef }: Props) => {
  const { addReaction, removeReaction, toggleEmojiMenu } = useActions(EmojiMenuActions);
  const { copyClicked } = useActions(TweetActions);
  const { developerMode } = useMappedState([getGlobalSettingState], s => ({
    developerMode: s.developerMode,
  }));
  const tweetRef = React.useRef<HTMLLIElement>(null);

  useSetIntersectionObserver(message, tweetRef, parentRef);

  const isThreadReply = message.threadTs != null && message.threadTs !== message.ts;
  const linkingTs = message.threadTs || message.ts;
  return (
    <li
      ref={tweetRef}
      className={`${styles.tweet}${isThreadReply ? ` ${styles.tweetThreadReply}` : ''}`}
    >
      <AppLink
        className={styles.tweetIconLink}
        to="/thread/$channelId/$ts"
        params={{
          channelId: message.channelId,
          ts: linkingTs,
        }}
      >
        <img src={message.iconUrl} alt={message.displayName} />
      </AppLink>

      <div className={styles.tweetStatus}>
        <span className={styles.tweetDisplayname}>{message.displayName}</span>
        <TweetTimestamp datetime={new Date(+message.ts * 1000)} />
        <TweetEditedMarker edit={message.edited} />
      </div>
      <div className={styles.tweetChannelname}>
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
      <TweetContent message={message} />
      <div className={styles.tweetActions}>
        <div className={styles.tweetActionsListEmojis}>
          {message.reactions.map((elem, i) => {
            const classNames = [styles.tweetActionsListEmojisEmoji];
            if (elem.reacted) {
              classNames.push(styles.tweetActionsReacted);
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

                <span className={styles.tweetActionsListEmojisCount}>{elem.count}</span>
              </span>
            );
          })}
        </div>

        <div className={styles.tweetActionsList}>
          <span
            className={`${styles.tweetActionsReaction} ${styles.emojiParent}`}
            onClick={({ clientX, clientY }) => {
              toggleEmojiMenu({ targetMessage: message, clientX, clientY });
            }}
          >
            <IconAddReaction className={styles.tweetActionsReactionIcon} />
          </span>
          {developerMode && (
            <span className={styles.tweetActionsReaction} onClick={() => copyClicked(message)}>
              <span className={styles.tweetActionsReactionIcon}>C</span>
            </span>
          )}
          <AppLink
            className={styles.tweetActionsListThread}
            to="/thread/$channelId/$ts"
            params={{
              channelId: message.channelId,
              ts: linkingTs,
            }}
          >
            <span>
              <IconThread className={styles.tweetActionsListThreadIcon} />
            </span>
          </AppLink>
          <DeepLinkingButton {...message.slackLink} />
          {message.threadTs && (
            <AppLink
              className={styles.tweetActionsThreadLink}
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
