import { SlackEntity } from './SlackEntity';

export namespace SlackRTM {
  export namespace Channels {
    export type Mark = SlackEntity.Mark;
  }

  export namespace Reaction {
    export type Added = SlackEntity.Reaction;
    export type Removed = SlackEntity.Reaction;
  }

  export type Message = SlackEntity.Message.Basic | Message.Changed | Message.Deleted;
  export namespace Message {
    export interface Changed extends SlackEntity.Message.AbstractMessage {
      subtype: 'message_changed';
      message: Omit<SlackEntity.Message.AbstractMessage, 'channel'>;
    }
    export interface Deleted extends SlackEntity.Message.AbstractMessage {
      subtype: 'message_deleted';
      deleted_ts: string;
    }
  }
}
