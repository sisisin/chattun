import { IconOpenSlack } from 'app/components/icons/Icons';
import { Tweet } from 'app/features/timeline/interface';
import { assertNever } from 'app/types/typeAssertions';
import * as React from 'react';
import styles from '../Tweet.module.css';

type Props = Tweet['slackLink'];

export const DeepLinkingButton: React.FC<Props> = ({ link, type }) => {
  if (link === undefined) {
    return (
      <span className={styles.tweetActionsListOpenslack}>
        <IconOpenSlack className={styles.tweetActionsListOpenslackIcon} />
      </span>
    );
  }

  const props: React.AnchorHTMLAttributes<HTMLAnchorElement> = (() => {
    const base = { href: link, className: styles.tweetActionsListOpenslack };
    if (type === 'directly') {
      return base;
    } else if (type === 'viaBrowser') {
      return {
        ...base,
        target: '_blank',
        rel: 'noopener noreferrer',
      };
    } else {
      assertNever(type);
    }
  })();
  return (
    <a {...props}>
      <IconOpenSlack className={styles.tweetActionsListOpenslackIcon} />
    </a>
  );
};
