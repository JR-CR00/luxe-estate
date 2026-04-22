import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Second layer of security: Server-side check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect('/');
  }

  // Fetch some stats
  const { count: propertyCount } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true });

  const { count: userCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  const stats = [
    { name: 'Total Properties', value: propertyCount || 0, icon: 'home', color: 'bg-blue-500' },
    { name: 'Registered Users', value: userCount || 0, icon: 'people', color: 'bg-green-500' },
    { name: 'Active Agents', value: 0, icon: 'badge', color: 'bg-purple-500' },
    { name: 'System Alerts', value: 0, icon: 'warning', color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-[#152e2a] p-6 rounded-2xl shadow-soft border border-gray-100 dark:border-[#006655]/10">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                <span className="material-icons">{stat.icon}</span>
              </div>
              <span className="text-2xl font-bold text-[#19322F] dark:text-white">{stat.value}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.name}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-[#152e2a] p-8 rounded-2xl shadow-soft border border-gray-100 dark:border-[#006655]/10">
          <h3 className="text-lg font-bold text-[#19322F] dark:text-white mb-6">Recent Activity</h3>
          <div className="space-y-6">
            <p className="text-sm text-gray-500">No recent activity to show.</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#152e2a] p-8 rounded-2xl shadow-soft border border-gray-100 dark:border-[#006655]/10">
          <h3 className="text-lg font-bold text-[#19322F] dark:text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-6 rounded-xl border border-gray-100 dark:border-[#006655]/20 hover:bg-mosque/5 transition-colors group">
              <span className="material-icons text-mosque mb-2 group-hover:scale-110 transition-transform">add_business</span>
              <span className="text-sm font-medium text-[#19322F] dark:text-gray-200">New Property</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 rounded-xl border border-gray-100 dark:border-[#006655]/20 hover:bg-mosque/5 transition-colors group">
              <span className="material-icons text-mosque mb-2 group-hover:scale-110 transition-transform">person_add</span>
              <span className="text-sm font-medium text-[#19322F] dark:text-gray-200">Add Agent</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 rounded-xl border border-gray-100 dark:border-[#006655]/20 hover:bg-mosque/5 transition-colors group">
              <span className="material-icons text-mosque mb-2 group-hover:scale-110 transition-transform">analytics</span>
              <span className="text-sm font-medium text-[#19322F] dark:text-gray-200">Reports</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 rounded-xl border border-gray-100 dark:border-[#006655]/20 hover:bg-mosque/5 transition-colors group">
              <span className="material-icons text-mosque mb-2 group-hover:scale-110 transition-transform">settings</span>
              <span className="text-sm font-medium text-[#19322F] dark:text-gray-200">Site Config</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
