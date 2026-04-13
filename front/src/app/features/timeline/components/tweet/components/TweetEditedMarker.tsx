import * as React from 'react';
import { toDisplayTime } from 'app/utility/time';
import styles from './Tweet.module.css';

interface Props {
  edit?: {
    ts: string;
  };
}

export const TweetEditedMarker = ({ edit }: Props) => {
  if (edit === undefined) return null;
  const timestamp = new Date(+edit.ts * 1000);
  return (
    <span className={styles.tweetEditedMarker} title={timestamp.toLocaleString()}>
      (edited at {toDisplayTime(timestamp)})
    </span>
  );
};
