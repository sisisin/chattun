import { SlackEntity } from './SlackEntity';

export namespace SlackRTM {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type Event = Channels | Reaction | Message;

  type Channels = Channels.Mark;
  export namespace Channels {
    export type Mark = SlackEntity.Mark & {
      type: 'channel_marked';
    };
  }

  type Reaction = Reaction.Added | Reaction.Removed;
  export namespace Reaction {
    export type Added = SlackEntity.Reaction & {
      type: 'reaction_added';
    };
    export type Removed = SlackEntity.Reaction & {
      type: 'reaction_removed';
    };
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
