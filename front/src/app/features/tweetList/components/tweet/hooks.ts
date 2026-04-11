import { Tweet } from 'app/features/timeline/interface';
import React from 'react';
import { useActions } from 'typeless';
import { TweetActions } from '../../interface';

export function useSetIntersectionObserver(
  message: Tweet,
  tweetRef: React.RefObject<HTMLElement>,
  rootRef: React.RefObject<HTMLUListElement>,
) {
  const { tweetIntersected } = useActions(TweetActions);
  const tweetIntersectedRef = React.useRef(tweetIntersected);
  tweetIntersectedRef.current = tweetIntersected;
  const messageRef = React.useRef(message);
  messageRef.current = message;

  React.useEffect(() => {
    const target = tweetRef.current;
    const root = rootRef.current;
    if (target && root) {
      const option: IntersectionObserverInit = {
        // fixme: CSSでのMenuの高さ指定に依存しちゃってる
        rootMargin: '-48px 0px',
        threshold: 1.0,
      };
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          tweetIntersectedRef.current(messageRef.current);
          observer.unobserve(target);
        }
      }, option);

      observer.observe(target);
      return () => observer.unobserve(target);
    } else {
      return;
    }

  }, [tweetRef, rootRef]);
}
