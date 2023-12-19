import React, { ReactNode } from 'react';
import AppWrappers from './AppWrappers';
import NextAuthSessionProvider from './providers/sessionProvider';
// import '@asseinfo/react-kanban/dist/styles.css';
// import '/public/styles/Plugins.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body id={'root'}>
        <NextAuthSessionProvider>
          <AppWrappers>{children}</AppWrappers>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
