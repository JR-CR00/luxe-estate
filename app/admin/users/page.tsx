'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'agent' | 'user';
  updated_at: string;
};

export default function AdminUsers() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('email', { ascending: true });

    if (data) setProfiles(data as Profile[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      alert('Error updating role: ' + error.message);
    } else {
      setProfiles(profiles.map(p => p.id === userId ? { ...p, role: newRole as any } : p));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-[#19322F] dark:text-white">User Management</h3>
      </div>

      <div className="bg-white dark:bg-[#152e2a] rounded-2xl shadow-soft border border-gray-100 dark:border-[#006655]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-[#006655]/10">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#006655]/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : (
                profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-mosque/10 text-mosque flex items-center justify-center font-bold">
                          {profile.email[0].toUpperCase()}
                        </div>
                        <span className="font-semibold text-[#19322F] dark:text-white">
                          {profile.full_name || 'No Name'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{profile.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={profile.role}
                        onChange={(e) => handleRoleChange(profile.id, e.target.value)}
                        className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-[#006655]/20 rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-mosque/20 outline-none transition-all cursor-pointer"
                      >
                        <option value="user">User</option>
                        <option value="agent">Agent</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(profile.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <span className="material-icons text-lg">block</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
