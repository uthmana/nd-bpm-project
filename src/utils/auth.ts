import { $Enums } from '@prisma/client';
import { authOptions } from 'app/lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function checkUserRole(allowedRoles) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return false;
  }
  if (!session.user.role) {
    return false;
  }

  return allowedRoles.includes(session.user.role);
}
