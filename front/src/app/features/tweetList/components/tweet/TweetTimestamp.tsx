import * as React from 'react';

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

function toDisplayTime(datetime: Date): string {
  return `${datetime.getHours()}:${datetime.getMinutes()}`;
}
