import { useState } from 'react';
import api from '../api/api';

const UpdateProfile = () => {
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};
  const [fullName, setFullName] = useState(currentUser.fullName || '');
  const [username, setUsername] = useState(currentUser.username || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleProfileUpdate = async () => {
    try {
      const res = await api.put('/user/update-profile', { fullName, username });
      localStorage.setItem('user', JSON.stringify(res.data));
      alert('Profile updated');
    } catch {
      alert('Failed to update profile');
    }
  };

  const handlePasswordChange = async () => {
    try {
      await api.put('/user/update-password', { oldPassword, newPassword });
      alert('Password changed');
      setOldPassword('');
      setNewPassword('');
    } catch {
      alert('Password change failed');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto space-y-8">
      <h2 className="text-2xl font-bold mb-4">Update Profile</h2>

      <div className="space-y-2">
        <label className="block font-semibold">Full Name</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <label className="block font-semibold mt-4">Username</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button
          onClick={handleProfileUpdate}
          className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 w-full"
        >
          Update Profile
        </button>
      </div>

      <hr className="my-4" />

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Change Password</h3>
        <input
          type="password"
          placeholder="Old Password"
          className="border p-2 w-full"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          className="border p-2 w-full"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          onClick={handlePasswordChange}
          className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 w-full"
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default UpdateProfile;
