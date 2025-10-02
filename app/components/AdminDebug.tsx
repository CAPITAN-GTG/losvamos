'use client';

import { useUser } from '@clerk/nextjs';
import { isAdminClient } from '@/lib/admin-utils';

export default function AdminDebug() {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) {
    return null;
  }

  const isAdmin = isAdminClient(user.id);
  const adminUserId = process.env.NEXT_PUBLIC_ADMIN_USER;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Admin Debug Info:</h3>
      <div className="space-y-1">
        <div><strong>User ID:</strong> {user.id}</div>
        <div><strong>Admin User ID:</strong> {adminUserId || 'Not set'}</div>
        <div><strong>IDs Match:</strong> {user.id === adminUserId ? 'Yes' : 'No'}</div>
        <div><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</div>
        <div><strong>User Name:</strong> {user.firstName} {user.lastName}</div>
        <div><strong>Env Check:</strong> {process.env.NEXT_PUBLIC_ADMIN_USER ? 'Found' : 'Not found'}</div>
      </div>
    </div>
  );
}
