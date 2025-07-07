import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserById } from '@/services/userService';
import type { User } from '@/types/entities/User';
import { toast } from 'sonner';

const UserView = () => {
  const { id } = useParams();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(location.state?.user || null);

  useEffect(() => {
    if (!user && id) {
      getUserById(id)
        .then(setUser)
        .catch(() => toast.error('Failed to fetch user'));
    }
  }, [id, user]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <div className="space-y-4">
        <div><strong>Username:</strong> {user.username}</div>
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Role:</strong> {user.role}</div>
        <div><strong>Department:</strong> {user.department}</div>
        <div><strong>Phone:</strong> {user.phone}</div>
        <div><strong>Job Title:</strong> {user.job_title}</div>
        <div><strong>MFA Enabled:</strong> {user.mfa_enabled ? 'Yes' : 'No'}</div>
        <div><strong>Last Login:</strong> {user.last_login || 'Never'}</div>
      </div>
    </div>
  );
};

export default UserView;

