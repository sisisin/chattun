import React, { createContext, useContext } from 'react';
import { type MrkdwnNode, parseMrkdwn } from './parser';

export interface MrkdwnContext {
  resolveUser?: (userId: string) => { displayName: string } | undefined;
  resolveEmoji?: (name: string) => string | undefined;
  myUserId?: string;
}

const MrkdwnCtx = createContext<MrkdwnContext>({});

function RenderNode({ node }: { node: MrkdwnNode }) {
  const ctx = useContext(MrkdwnCtx);

  switch (node.type) {
    case 'text':
      return <>{node.text}</>;
    case 'bold':
      return (
        <strong>
          <RenderNodes nodes={node.children} />
        </strong>
      );
    case 'italic':
      return (
        <em>
          <RenderNodes nodes={node.children} />
        </em>
      );
    case 'strike':
      return (
        <del>
          <RenderNodes nodes={node.children} />
        </del>
      );
    case 'code':
      return <code>{node.text}</code>;
    case 'codeblock':
      return (
        <pre>
          <code>{node.text}</code>
        </pre>
      );
    case 'linebreak':
      return <br />;
    case 'user_mention': {
      const user = ctx.resolveUser?.(node.userId);
      const displayName = user ? `@${user.displayName}` : `@${node.userId}`;
      const isSelf = ctx.myUserId === node.userId;
      return <span className={isSelf ? 'mention-self' : 'mention'}>{displayName}</span>;
    }
    case 'channel_ref':
      return <span className="channel-ref">#{node.name}</span>;
    case 'group_mention':
      return <span className="mention">{node.name}</span>;
    case 'special_mention':
      return <span className="mention-self">@{node.keyword}</span>;
    case 'emoji': {
      const emojiUrl = ctx.resolveEmoji?.(node.name);
      if (emojiUrl) {
        return <img className="tweet-contents-slack-emoji" src={emojiUrl} alt={node.name} />;
      }
      return <>:{node.name}:</>;
    }
    case 'link':
      return (
        <a href={node.url} target="_blank" rel="noopener noreferrer">
          {node.text ?? node.url}
        </a>
      );
  }
}

function RenderNodes({ nodes }: { nodes: MrkdwnNode[] }) {
  return (
    <>
      {nodes.map((node, i) => (
        <RenderNode key={i} node={node} />
      ))}
    </>
  );
}

export const MrkdwnContent = ({ text, context }: { text: string; context?: MrkdwnContext }) => {
  const nodes = parseMrkdwn(text);
  if (context) {
    return (
      <MrkdwnCtx.Provider value={context}>
        <RenderNodes nodes={nodes} />
      </MrkdwnCtx.Provider>
    );
  }
  return <RenderNodes nodes={nodes} />;
};
