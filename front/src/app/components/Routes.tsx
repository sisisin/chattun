import { RouterProvider } from '@tanstack/react-router';
import React from 'react';
import { router } from 'app/router';

export const Routes: React.FC = () => {
  return <RouterProvider router={router} />;
};
