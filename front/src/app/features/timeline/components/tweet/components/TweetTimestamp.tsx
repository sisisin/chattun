import * as React from 'react';
import { toDisplayTime } from 'app/utility/time';

interface Props {
  datetime: Date;
}

export const TweetTimestamp = ({ datetime }: Props) => {
  return (
    <span className="tweet-timestamp" title={datetime.toLocaleString()}>
      {toDisplayTime(datetime)}
    </span>
  );
};
