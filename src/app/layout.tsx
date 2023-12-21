import React, { ReactNode } from 'react';
import AppWrappers from './AppWrappers';
import AuthProvider from './providers/sessionProvider';
import { getServerSession } from 'next-auth';
// import '@asseinfo/react-kanban/dist/styles.css';
// import '/public/styles/Plugins.css';

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const data = await getServerSession();
  //const [user, setUser] = useState(null);

  // useEffect(() => {
  //   if (window?.innerWidth > 1200) setOpen(true);
  // }, []);

  // useEffect(() => {
  //   if (status === 'authenticated' && session?.user) {
  //     setUser(session?.user);
  //   }
  // }, [session, status]);

  console.log({ data });

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
