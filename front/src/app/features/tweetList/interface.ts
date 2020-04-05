import { createModule } from 'typeless';
import { TweetSymbol } from './symbol';
import { Tweet } from 'app/features/timeline/interface';

export const [handle, TweetActions] = createModule(TweetSymbol).withActions({
  copyClicked: (msg: Tweet) => ({ payload: { msg } }),
  tweetIntersected: (message: Tweet) => ({ payload: { message } }),
});
