import { Link } from '@tanstack/react-router';
import React from 'react';

interface Props {
  to: string;
  params: Record<string, string>;
  className?: string;
  children?: React.ReactNode;
}
export const AppLink: React.FC<Props> = ({ children, to, params, className }) => {
  return (
    <Link to={to} params={params} className={className}>
      {children}
    </Link>
  );
};
