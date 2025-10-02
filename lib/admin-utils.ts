import { User } from '@clerk/nextjs';

/**
 * Check if the current user is an admin
 * @param user - The Clerk user object
 * @returns boolean - true if user is admin, false otherwise
 */
export function isAdmin(user: User | null | undefined): boolean {
  if (!user) return false;
  
  const adminUserId = process.env.ADMIN_USER;
  if (!adminUserId) return false;
  
  return user.id === adminUserId;
}

/**
 * Check if the current user is an admin (client-side version)
 * @param userId - The user ID from Clerk
 * @returns boolean - true if user is admin, false otherwise
 */
export function isAdminClient(userId: string | null | undefined): boolean {
  if (!userId) {
    console.log('Admin check: No userId provided');
    return false;
  }
  
  // For client-side, we need to use NEXT_PUBLIC_ prefix
  const adminUserId = process.env.NEXT_PUBLIC_ADMIN_USER;
  console.log('Admin check - User ID:', userId);
  console.log('Admin check - Admin User ID:', adminUserId);
  console.log('Admin check - Match:', userId === adminUserId);
  
  if (!adminUserId) {
    console.log('Admin check: No admin user ID set in environment');
    return false;
  }
  
  return userId === adminUserId;
}
