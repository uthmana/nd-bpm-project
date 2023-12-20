import { getSession } from 'next-auth/react';
import { authOptions } from './options';

export async function isAuthenticated(req: any, res: any) {
  const session = await getSession();
  console.log('isAuthenticated', session);
  return req ? true : false;
}
