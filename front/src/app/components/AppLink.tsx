import React from 'react';
import { generatePath, Link } from 'react-router-dom';

interface Props {
  to: string;
  params: Record<string, string | number | boolean | undefined>;
  className?: string;
}
export const AppLink: React.FC<Props> = ({ children, to, params, className }) => {
  const path = generatePath(to, params);
  return (
    <Link className={className} to={path}>
      {children}
    </Link>
  );
};
