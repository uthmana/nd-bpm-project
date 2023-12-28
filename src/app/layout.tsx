import React, { ReactNode } from 'react';
import AppWrappers from './AppWrappers';
import NextAuthSessionProvider from './providers/sessionProvider';
// import '@asseinfo/react-kanban/dist/styles.css';
// import '/public/styles/Plugins.css';

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body id={'root'} className="custom-scrollbar">
        <NextAuthSessionProvider>
          <AppWrappers>{children}</AppWrappers>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
