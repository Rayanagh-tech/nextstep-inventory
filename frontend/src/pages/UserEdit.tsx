import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUserById, updateUser } from '@/services/userService';
import { toast } from 'sonner';
import type { User } from '@/types/entities/User';

const UserEdit = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState<Partial<User>>(location.state?.user || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!form.id && id) {
      setLoading(true);
      getUserById(id)
        .then((user) => setForm(user))
        .catch(() => toast.error('Failed to fetch user'))
        .finally(() => setLoading(false));
    }
  }, [id, form.id]);

  const handleChange = (field: keyof User, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    if (!id) return;
    try {
      await updateUser(id, form);
      toast.success('User updated successfully');
      navigate('/users');
    } catch (err) {
      toast.error('Failed to update user');
    }
  };

  if (loading) return <div className="p-6 text-gray-700 dark:text-white">Loading user...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Edit User</h1>
      <div className="space-y-4">
        {(['username', 'email', 'role', 'department', 'phone', 'job_title'] as (keyof User)[]).map((field) => (
          <div key={field}>
            <label className="block mb-1 capitalize text-gray-700 dark:text-gray-300">
              {field.replace('_', ' ')}
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white"
              value={String(form[field] ?? '')}
              onChange={(e) => handleChange(field, e.target.value)}
            />
          </div>
        ))}
        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default UserEdit;
