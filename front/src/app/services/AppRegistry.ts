import { ActionLike, Registry } from 'typeless';

class AppRegistry extends Registry {
  dispatch(action: ActionLike) {
    super.dispatch(action);
  }
}

export const appRegistry = new AppRegistry();
