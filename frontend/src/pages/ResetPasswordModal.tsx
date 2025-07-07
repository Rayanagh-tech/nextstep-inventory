import { useState } from 'react';
import { updatePassword } from '@/services/userService';
import { toast } from 'sonner';

interface Props {
  userId: string;
  onClose: () => void;
}

const ResetPasswordModal = ({ userId, onClose }: Props) => {
  const [newPassword, setNewPassword] = useState('');

  const handleReset = async () => {
    try {
      await updatePassword(userId, { currentPassword: 'admin_override', newPassword });
      toast.success('Password reset successfully');
      onClose();
    } catch (err) {
      toast.error('Failed to reset password');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Reset Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white">
            Cancel
          </button>
          <button onClick={handleReset} className="px-4 py-2 rounded bg-blue-600 text-white">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
