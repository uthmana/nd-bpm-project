import React, { ReactNode } from 'react';
import AppWrappers from './AppWrappers';
import AuthProvider from './providers/sessionProvider';
// import '@asseinfo/react-kanban/dist/styles.css';
// import '/public/styles/Plugins.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body id={'root'}>
        <AuthProvider>
          <AppWrappers>{children}</AppWrappers>
        </AuthProvider>
      </body>
    </html>
  );
}
