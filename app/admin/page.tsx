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
    { name: 'Total Properties', value: propertyCount || 0, icon: 'home', color: 'bg-primary' },
    { name: 'Registered Users', value: userCount || 0, icon: 'people', color: 'bg-nordic-dark' },
    { name: 'Active Agents', value: 0, icon: 'badge', color: 'bg-primary' },
    { name: 'System Alerts', value: 0, icon: 'warning', color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold text-nordic-dark dark:text-white tracking-tight">Overview Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Welcome back! Here's what's happening with your properties today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-[#152e2a] p-6 rounded-2xl shadow-soft border border-nordic-dark/5 dark:border-primary/10 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.name}</p>
              <p className="text-2xl font-bold text-nordic-dark dark:text-white">{stat.value}</p>
            </div>
            <div className={`h-12 w-12 rounded-xl ${stat.color} bg-opacity-10 flex items-center justify-center`}>
              <span className={`material-icons ${stat.color.replace('bg-', 'text-')}`}>{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-[#152e2a] p-8 rounded-2xl shadow-soft border border-nordic-dark/5 dark:border-primary/10">
          <h3 className="text-lg font-bold text-nordic-dark dark:text-white mb-6 tracking-tight">Recent Activity</h3>
          <div className="space-y-6 flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-background-light dark:bg-white/5 flex items-center justify-center mb-4">
              <span className="material-icons text-gray-300">history</span>
            </div>
            <p className="text-sm text-gray-500 font-medium">No recent activity to show in your dashboard.</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#152e2a] p-8 rounded-2xl shadow-soft border border-nordic-dark/5 dark:border-primary/10">
          <h3 className="text-lg font-bold text-nordic-dark dark:text-white mb-6 tracking-tight">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-6 rounded-2xl border border-nordic-dark/5 dark:border-primary/20 hover:bg-primary/5 transition-all group border-dashed">
              <span className="material-icons text-primary mb-2 group-hover:scale-110 transition-transform">add_business</span>
              <span className="text-sm font-bold text-nordic-dark dark:text-gray-200">New Property</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 rounded-2xl border border-nordic-dark/5 dark:border-primary/20 hover:bg-primary/5 transition-all group border-dashed">
              <span className="material-icons text-primary mb-2 group-hover:scale-110 transition-transform">person_add</span>
              <span className="text-sm font-bold text-nordic-dark dark:text-gray-200">Add Agent</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 rounded-2xl border border-nordic-dark/5 dark:border-primary/20 hover:bg-primary/5 transition-all group border-dashed">
              <span className="material-icons text-primary mb-2 group-hover:scale-110 transition-transform">analytics</span>
              <span className="text-sm font-bold text-nordic-dark dark:text-gray-200">Reports</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 rounded-2xl border border-nordic-dark/5 dark:border-primary/20 hover:bg-primary/5 transition-all group border-dashed">
              <span className="material-icons text-primary mb-2 group-hover:scale-110 transition-transform">settings</span>
              <span className="text-sm font-bold text-nordic-dark dark:text-gray-200">Site Config</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
