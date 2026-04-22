import { BlockKit } from './BlockKit';

export namespace SlackEntity {
  export interface Attachment {
    fallback: string;
    image_url?: string;
    original_url?: string;
    text?: string;
    pretext?: string;
    title?: string;
    title_link?: string;
    author_name?: string;
    author_icon?: string;
    author_link?: string;
    footer?: string;
    color?: string;
    is_msg_unfurl?: boolean;
    from_url?: string;
    files?: {
      id: string;
      filetype: string;
      thumb_360: string;
      url_private: string;
      user_team?: string;
      mp4?: string;
      thumb_video?: string;
      media_display_type?: string;
    }[];
  }

  export interface Mark {
    channel: string;
    ts: string;
  }

  interface ReactionedItem {
    type: 'message';
    channel: string;
    ts: string;
  }

  export interface Reaction {
    user: string;
    item: ReactionedItem;
    reaction: string;
    item_user?: string;
    event_ts: string;
    ts: string;
    imageUrl?: string;
  }

  export type Conversation = Conversation.IM | Conversation.Channel;
  export namespace Conversation {
    export interface IM {
      id: string;
      is_im: true;
      user: string; // DM相手のID
    }
    export interface Channel {
      id: string;
      is_im: false;
      is_member: boolean;
      name: string;
    }
  }

  export interface Member {
    id: string;
    name: string;
    real_name: string;
    profile: {
      display_name: string;
      image_24: string;
      image_32: string;
      image_48: string;
    };
    enterprise_user?: {
      id: string;
      enterprise_id: string;
      enterprise_name: string;
      is_admin: boolean;
      is_owner: boolean;
      teams: string[];
    };
  }

  export namespace Message {
    interface AbstractMessage {
      type: 'message';
      channel: string;
      ts: string;

      // todo: https://api.slack.com/events/message/bot_message
      username?: string;
      icons?: {
        image_48: string;
      };

      // todo:https://api.slack.com/events/message/file_share
      files?: {
        id: string;
        filetype: string;
        thumb_360: string;
        url_private: string;
        user_team?: string;
        mp4?: string;
        thumb_video?: string;
        media_display_type?: string;
      }[];
      event_ts: string;
    }

    interface Reaction {
      name: string;
      users: string[];
      count: number;
    }
    export interface Basic extends AbstractMessage {
      subtype?: string;
      suppress_notification?: boolean;
      user?: string;
      text?: string;
      thread_ts?: string;
      message?: {
        attachments: SlackEntity.Attachment[];
      };
      team?: string;
      user_team?: string;
      source_team?: string;
      edited?: {
        ts: string;
        user: string;
      };
      reactions?: Reaction[];
      room?: {
        call_family?: string;
      };
      permalink?: string;
      blocks?: BlockKit.Block[];
      attachments?: SlackEntity.Attachment[];
      bot_id?: string;
      bot_profile?: {
        id: string;
        name: string;
        icons: {
          image_36?: string;
          image_48?: string;
          image_72?: string;
        };
      };
    }
  }
}
