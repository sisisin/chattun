export namespace BlockKit {
  export interface RichTextBlock {
    type: 'rich_text';
    block_id: string;
    elements: RichTextElement[];
  }

  export type Block = RichTextBlock;

  // Top-level elements within a rich_text block
  export type RichTextElement =
    | RichTextSection
    | RichTextList
    | RichTextPreformatted
    | RichTextQuote;

  export interface RichTextSection {
    type: 'rich_text_section';
    elements: InlineElement[];
  }

  export interface RichTextList {
    type: 'rich_text_list';
    style: 'ordered' | 'bullet';
    indent?: number;
    offset?: number;
    border?: number;
    elements: RichTextSection[];
  }

  export interface RichTextPreformatted {
    type: 'rich_text_preformatted';
    elements: InlineElement[];
    border?: number;
  }

  export interface RichTextQuote {
    type: 'rich_text_quote';
    elements: InlineElement[];
    border?: number;
  }

  // Inline elements within sections
  export type InlineElement =
    | TextElement
    | UserElement
    | ChannelElement
    | EmojiElement
    | LinkElement
    | UsergroupElement
    | BroadcastElement
    | ColorElement;

  export interface TextStyle {
    bold?: boolean;
    italic?: boolean;
    strike?: boolean;
    code?: boolean;
  }

  export interface TextElement {
    type: 'text';
    text: string;
    style?: TextStyle;
  }

  export interface UserElement {
    type: 'user';
    user_id: string;
    style?: TextStyle;
  }

  export interface ChannelElement {
    type: 'channel';
    channel_id: string;
    style?: TextStyle;
  }

  export interface EmojiElement {
    type: 'emoji';
    name: string;
    unicode?: string;
    style?: TextStyle;
  }

  export interface LinkElement {
    type: 'link';
    url: string;
    text?: string;
    style?: TextStyle;
    unsafe?: boolean;
  }

  export interface UsergroupElement {
    type: 'usergroup';
    usergroup_id: string;
    style?: TextStyle;
  }

  export interface BroadcastElement {
    type: 'broadcast';
    range: 'here' | 'channel' | 'everyone';
    style?: TextStyle;
  }

  export interface ColorElement {
    type: 'color';
    value: string;
  }
}
