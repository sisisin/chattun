import { emojify, has } from 'node-emoji';
import React, { useContext, createContext } from 'react';
import type { BlockKit } from 'app/types/slack';
import type { ResolveContext } from './ResolveContext';
import styles from './MrkdwnRenderer.module.css';

const BlockKitCtx = createContext<ResolveContext>({});

function InlineElement({ element }: { element: BlockKit.InlineElement }) {
  const ctx = useContext(BlockKitCtx);

  switch (element.type) {
    case 'text': {
      let content: React.ReactNode = element.text;
      if (element.style?.code) {
        return <code>{element.text}</code>;
      }
      if (element.style?.bold) {
        content = <strong>{content}</strong>;
      }
      if (element.style?.italic) {
        content = <em>{content}</em>;
      }
      if (element.style?.strike) {
        content = <del>{content}</del>;
      }
      return <>{content}</>;
    }
    case 'user': {
      const user = ctx.resolveUser?.(element.user_id);
      const displayName = user ? `@${user.displayName}` : `@${element.user_id}`;
      const isSelf = ctx.myUserId === element.user_id;
      return <span className={isSelf ? styles.mentionSelf : styles.mention}>{displayName}</span>;
    }
    case 'channel': {
      const channelName = ctx.resolveChannel?.(element.channel_id);
      return <span>#{channelName ?? element.channel_id}</span>;
    }
    case 'emoji': {
      if (element.unicode) {
        const codePoints = element.unicode.split('-').map(cp => parseInt(cp, 16));
        return <>{String.fromCodePoint(...codePoints)}</>;
      }
      const emojiUrl = ctx.resolveEmoji?.(element.name);
      if (emojiUrl) {
        return <img className={styles.slackEmoji} src={emojiUrl} alt={element.name} />;
      }
      if (has(element.name)) {
        return <>{emojify(`:${element.name}:`)}</>;
      }
      return <>:{element.name}:</>;
    }
    case 'link': {
      let content: React.ReactNode = element.text ?? element.url;
      if (element.style?.bold) {
        content = <strong>{content}</strong>;
      }
      if (element.style?.italic) {
        content = <em>{content}</em>;
      }
      if (element.style?.strike) {
        content = <del>{content}</del>;
      }
      return (
        <a href={element.url} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      );
    }
    case 'usergroup':
      return <span>@{element.usergroup_id}</span>;
    case 'broadcast':
      return <span className={styles.mentionSelf}>@{element.range}</span>;
    case 'color':
      return <span style={{ color: element.value }}>{element.value}</span>;
  }
}

function InlineElements({ elements }: { elements: BlockKit.InlineElement[] }) {
  return (
    <>
      {elements.map((el, i) => (
        <InlineElement key={i} element={el} />
      ))}
    </>
  );
}

function RichTextElement({ element }: { element: BlockKit.RichTextElement }) {
  switch (element.type) {
    case 'rich_text_section':
      return (
        <span>
          <InlineElements elements={element.elements} />
        </span>
      );
    case 'rich_text_list': {
      const items = element.elements.map((section, i) => (
        <li key={i}>
          <InlineElements elements={section.elements} />
        </li>
      ));
      return element.style === 'ordered' ? <ol>{items}</ol> : <ul>{items}</ul>;
    }
    case 'rich_text_preformatted':
      return (
        <pre>
          <code>
            <InlineElements elements={element.elements} />
          </code>
        </pre>
      );
    case 'rich_text_quote':
      return (
        <blockquote className={styles.blockquote}>
          <InlineElements elements={element.elements} />
        </blockquote>
      );
  }
}

export const BlockKitContent = ({
  blocks,
  context,
}: {
  blocks: BlockKit.RichTextBlock[];
  context?: ResolveContext;
}) => {
  return (
    <BlockKitCtx.Provider value={context ?? {}}>
      {blocks.map((block, bi) =>
        block.elements.map((element, ei) => (
          <RichTextElement key={`${bi}-${ei}`} element={element} />
        )),
      )}
    </BlockKitCtx.Provider>
  );
};
