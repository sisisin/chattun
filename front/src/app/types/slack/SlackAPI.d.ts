import { SlackEntity } from '.';

export namespace SlackAPI {
  interface Response {
    ok: boolean;
  }
  interface MetaData {
    next_cursor?: string;
  }

  export namespace Conversations {
    export interface List extends Response {
      channels: SlackEntity.Conversation[];
      response_metadata?: MetaData;
    }

    export interface Replies extends Response {
      has_more: boolean;
      messages: SlackEntity.Message.Basic[];
    }
  }

  export namespace Users {
    export interface List extends Response {
      members: SlackEntity.Member[];
      response_metadata?: SlackAPI.MetaData;
    }
  }
  export namespace Emoji {
    type SlackEmoji = Record<string, string>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface List extends Response {
      emoji: SlackEmoji;
    }
  }

  export namespace Team {
    export interface Info extends Response {
      team: {
        domain: string;
      };
    }
  }
  export namespace RTM {
    export interface Start extends Response {
      url: string;
    }
  }
}
