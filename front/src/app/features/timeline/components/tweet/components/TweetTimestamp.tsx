import * as React from 'react';
import { toDisplayTime } from 'app/utility/time';
import styles from './Tweet.module.css';

interface Props {
  datetime: Date;
}

export const TweetTimestamp = ({ datetime }: Props) => {
  return (
    <span className={styles.tweetTimestamp} title={datetime.toLocaleString()}>
      {toDisplayTime(datetime)}
    </span>
  );
};
