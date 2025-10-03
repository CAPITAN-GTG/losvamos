/**
 * Check if the current user is an admin
 * @param user - The Clerk user object
 * @returns boolean - true if user is admin, false otherwise
 */
export function isAdmin(user: any | null | undefined): boolean {
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
    return false;
  }
  
  // For client-side, we need to use NEXT_PUBLIC_ prefix
  const adminUserId = process.env.NEXT_PUBLIC_ADMIN_USER;
  
  if (!adminUserId) {
    return false;
  }
  
  return userId === adminUserId;
}
