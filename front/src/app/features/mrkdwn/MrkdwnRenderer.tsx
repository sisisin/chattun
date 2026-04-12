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
