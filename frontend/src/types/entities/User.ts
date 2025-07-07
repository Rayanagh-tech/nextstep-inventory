export type UserRole = 'admin' | 'operator' | 'viewer' | 'user';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  email: string;
  role: string;
  username: string; // ✅ required for profile.name
  phone?: string;   // ✅ add this
  department?: string; // ✅ and this
  job_title?: string; 
  mfa_enabled?: boolean;
  last_login?: string;
  
}

