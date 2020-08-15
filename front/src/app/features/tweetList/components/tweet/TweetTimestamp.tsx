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
  return twoDigits(datetime.getHours()) + ':' + twoDigits(datetime.getMinutes());
}

function twoDigits(n: number): string {
  return ('0' + n).slice(-2);
}
