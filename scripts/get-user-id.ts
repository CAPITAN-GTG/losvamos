// This script helps you get your Clerk user ID
// Run this with: npx tsx scripts/get-user-id.ts

import { ClerkProvider } from '@clerk/nextjs';

console.log('To get your Clerk User ID:');
console.log('1. Go to your app and sign in');
console.log('2. Open browser developer tools (F12)');
console.log('3. Go to Console tab');
console.log('4. Type: window.Clerk?.user?.id');
console.log('5. Copy the returned ID');
console.log('');
console.log('Then add it to your .env.local file:');
console.log('NEXT_PUBLIC_ADMIN_USER=your_user_id_here');
console.log('');
console.log('Or you can check the Clerk dashboard at:');
console.log('https://dashboard.clerk.com/');
