import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router';

import { ToastProvider } from '@shared/ui/Toast';

const AppProviders = ({ children }: { children: ReactNode }) => (
  <ToastProvider>
    <BrowserRouter>{children}</BrowserRouter>
  </ToastProvider>
);

export default AppProviders;
