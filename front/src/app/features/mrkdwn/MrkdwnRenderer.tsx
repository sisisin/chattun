import React from 'react';
import { type MrkdwnNode, parseMrkdwn } from './parser';

function RenderNode({ node }: { node: MrkdwnNode }) {
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
    case 'user_mention':
      return <span className="mention">@{node.userId}</span>;
    case 'channel_ref':
      return <span className="channel-ref">#{node.name}</span>;
    case 'group_mention':
      return <span className="mention">{node.name}</span>;
    case 'special_mention':
      return <span className="mention">@{node.keyword}</span>;
    case 'emoji':
      return <span className="emoji">:{node.name}:</span>;
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

export const MrkdwnContent = ({ text }: { text: string }) => {
  const nodes = parseMrkdwn(text);
  return <RenderNodes nodes={nodes} />;
};
