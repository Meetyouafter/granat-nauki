import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router';

import { ToastProvider } from '@shared/ui/Toast';

function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </ToastProvider>
  );
}

export default AppProviders;
