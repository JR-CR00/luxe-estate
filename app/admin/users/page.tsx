'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'agent' | 'user';
  updated_at: string;
  avatar_url?: string;
};

export default function AdminUsers() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  
  const supabase = createClient();

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('full_name', { ascending: true });

    if (data) {
      setProfiles(data as Profile[]);
      setFilteredProfiles(data as Profile[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Filter and Search logic
  useEffect(() => {
    let result = profiles;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.full_name?.toLowerCase().includes(query) || 
        p.email.toLowerCase().includes(query)
      );
    }

    if (activeTab !== 'all') {
      result = result.filter(p => p.role === activeTab);
    }

    setFilteredProfiles(result);
  }, [searchQuery, activeTab, profiles]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      alert('Error updating role: ' + error.message);
    } else {
      setProfiles(profiles.map(p => p.id === userId ? { ...p, role: newRole as any } : p));
      setOpenDropdownId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-4">
      {/* Header Section */}
      <header className="w-full pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-nordic-dark dark:text-white">User Directory</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-base font-medium">Manage user access and roles for your properties.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-icons text-nordic-dark/30 group-focus-within:text-primary text-xl transition-colors">search</span>
              </div>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 border-none rounded-xl bg-white dark:bg-[#152e2a] text-nordic-dark dark:text-white shadow-sm ring-1 ring-nordic-dark/5 placeholder-nordic-dark/30 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm font-medium" 
                placeholder="Search by name, email..." 
              />
            </div>
            <button className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-sm font-bold rounded-xl text-primary bg-transparent hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all whitespace-nowrap">
              <span className="material-icons text-xl mr-2 font-bold">add</span>
              Add User
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10 flex gap-10 border-b border-nordic-dark/10 overflow-x-auto hide-scroll">
          {[
            { id: 'all', label: 'All Users' },
            { id: 'agent', label: 'Agents' },
            { id: 'admin', label: 'Admins' },
            { id: 'user', label: 'Regular Users' },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-base font-bold transition-all whitespace-nowrap border-b-2 tracking-tight ${
                activeTab === tab.id 
                  ? 'text-primary border-primary' 
                  : 'text-nordic-dark/40 border-transparent hover:text-nordic-dark/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main List */}
      <main className="w-full pb-16 space-y-5">
        {/* Table Header Labels */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-8 text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-2">
          <div className="col-span-4">USER DETAILS</div>
          <div className="col-span-3">ROLE & STATUS</div>
          <div className="col-span-3">PERFORMANCE</div>
          <div className="col-span-2 text-right">ACTIONS</div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-nordic-dark/5">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-5 text-gray-500 font-medium tracking-tight">Loading directory...</p>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-nordic-dark/5">
            <span className="material-icons text-6xl text-nordic-dark/10 mb-5">search_off</span>
            <p className="text-nordic-dark/60 font-bold text-lg tracking-tight">No users found matching your criteria.</p>
          </div>
        ) : (
          filteredProfiles.map((profile) => (
            <div 
              key={profile.id} 
              className={`group relative rounded-2xl p-6 shadow-sm border transition-all flex flex-col md:grid md:grid-cols-12 gap-4 items-center ${
                profile.role === 'admin' 
                  ? 'bg-hint-of-green/20 dark:bg-primary/10 border-primary/20' 
                  : 'bg-white dark:bg-[#152e2a] border-nordic-dark/5 dark:border-primary/5 hover:bg-gray-50 transition-colors'
              }`}
            >
              {/* User Details */}
              <div className="col-span-12 md:col-span-4 flex items-center w-full">
                <div className="relative flex-shrink-0">
                  <div className="h-14 w-14 rounded-full bg-gray-100 dark:bg-[#1a3833] overflow-hidden border-2 border-white dark:border-primary flex items-center justify-center font-bold text-primary shadow-sm">
                    {profile.avatar_url ? (
                      <Image 
                        src={profile.avatar_url} 
                        alt={profile.full_name || 'User'} 
                        width={56} 
                        height={56} 
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-xl">{profile.full_name?.[0] || profile.email[0].toUpperCase()}</span>
                    )}
                  </div>
                  <span className={`absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full ring-2 ring-white ${
                    profile.role === 'admin' ? 'bg-green-400' : 'bg-gray-300'
                  }`}></span>
                </div>
                <div className="ml-5 overflow-hidden">
                  <div className="text-base font-bold text-nordic-dark dark:text-white truncate tracking-tight">{profile.full_name || 'No Name'}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300 truncate font-medium">{profile.email}</div>
                  <div className="mt-1.5 text-[10px] px-2.5 py-0.5 inline-block bg-white dark:bg-white/10 rounded-md font-bold text-gray-400 dark:text-gray-500 border border-nordic-dark/5">
                    ID: #{profile.id.substring(0, 8).toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Role & Status */}
              <div className="col-span-12 md:col-span-3 w-full flex items-center justify-between md:justify-start gap-5">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider ${
                  profile.role === 'admin' 
                    ? 'bg-nordic-dark text-white' 
                    : profile.role === 'agent'
                    ? 'bg-primary/10 text-primary border border-primary/5'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  {profile.role === 'admin' ? 'Administrator' : profile.role === 'agent' ? 'Agent' : 'User'}
                </span>
                <div className="flex items-center text-xs font-bold text-gray-400">
                  <span className={`material-icons text-[14px] mr-1.5 ${profile.role === 'admin' ? 'text-primary' : 'text-gray-300'}`}>
                    {profile.role === 'admin' ? 'check_circle' : 'schedule'}
                  </span>
                  {profile.role === 'admin' ? 'Active' : 'Away'}
                </div>
              </div>

              {/* Performance */}
              <div className="col-span-12 md:col-span-3 w-full grid grid-cols-2 gap-6">
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">PROPERTIES</div>
                  <div className="text-lg font-bold text-nordic-dark dark:text-white tracking-tight">
                    {profile.role === 'admin' ? '-' : profile.role === 'agent' ? '12' : '0'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">SALES (YTD)</div>
                  <div className="text-lg font-bold text-nordic-dark dark:text-white tracking-tight">
                    {profile.role === 'admin' ? '-' : profile.role === 'agent' ? '$2.4M' : '$0'}
                  </div>
                </div>
              </div>

              {/* Actions Dropdown */}
              <div className="col-span-12 md:col-span-2 w-full flex justify-end relative">
                <button 
                  onClick={() => setOpenDropdownId(openDropdownId === profile.id ? null : profile.id)}
                  className={`inline-flex items-center px-5 py-2.5 shadow-sm text-xs font-bold rounded-xl transition-all w-full md:w-auto justify-center ring-1 ${
                    openDropdownId === profile.id
                      ? 'bg-primary text-white ring-primary shadow-lg shadow-primary/20'
                      : 'bg-white text-nordic-dark ring-nordic-dark/5 hover:ring-nordic-dark/20'
                  }`}
                >
                  Change Role
                  <span className="material-icons text-lg ml-2">
                    {openDropdownId === profile.id ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {openDropdownId === profile.id && (
                  <div className="absolute top-full right-0 mt-3 w-56 rounded-2xl shadow-xl bg-primary text-white focus:outline-none overflow-hidden z-[100] origin-top-right animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="py-2">
                      {[
                        { id: 'admin', label: 'Administrator', icon: 'shield' },
                        { id: 'agent', label: 'Agent', icon: 'support_agent' },
                        { id: 'user', label: 'Regular User', icon: 'person' },
                      ].map((roleOption) => (
                        <button
                          key={roleOption.id}
                          onClick={() => handleRoleChange(profile.id, roleOption.id)}
                          className={`w-full group flex items-center px-5 py-3.5 text-xs font-bold tracking-tight transition-all text-left ${
                            profile.role === roleOption.id
                              ? 'bg-white/20 text-white'
                              : 'text-white/70 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <span className={`material-icons text-base mr-3 ${
                            profile.role === roleOption.id ? 'text-white' : 'text-white/40 group-hover:text-white'
                          }`}>
                            {roleOption.icon}
                          </span>
                          {roleOption.label}
                        </button>
                      ))}
                      <div className="border-t border-white/10 my-1.5 mx-3"></div>
                      <button className="w-full group flex items-center px-5 py-3.5 text-xs font-bold tracking-tight text-red-100 hover:bg-red-500/20 transition-all text-left">
                        <span className="material-icons text-base mr-3 text-red-200/50 group-hover:text-red-100">block</span>
                        Suspend User
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </main>

      {/* Pagination Footer */}
      <footer className="mt-auto py-8">
        <div className="flex items-center justify-between border-t border-nordic-dark/5 pt-8">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Showing <span className="font-bold text-nordic-dark">1</span> to <span className="font-bold text-nordic-dark">{filteredProfiles.length}</span> of <span className="font-bold text-nordic-dark">{profiles.length}</span> users
              </p>
            </div>
            <div>
              <nav aria-label="Pagination" className="flex gap-2">
                <button className="h-10 w-10 flex items-center justify-center rounded-xl text-nordic-dark/40 hover:text-primary transition-colors">
                  <span className="material-icons">chevron_left</span>
                </button>
                <button className="h-10 w-10 flex items-center justify-center bg-primary text-white rounded-xl font-bold shadow-md shadow-primary/20">
                  1
                </button>
                <button className="h-10 w-10 flex items-center justify-center text-nordic-dark/60 hover:text-primary font-bold transition-colors">
                  2
                </button>
                <button className="h-10 w-10 flex items-center justify-center text-nordic-dark/60 hover:text-primary font-bold transition-colors">
                  3
                </button>
                <span className="h-10 w-10 flex items-center justify-center text-nordic-dark/30 font-bold">...</span>
                <button className="h-10 w-10 flex items-center justify-center text-nordic-dark/60 hover:text-primary font-bold transition-colors">
                  8
                </button>
                <button className="h-10 w-10 flex items-center justify-center rounded-xl text-nordic-dark/40 hover:text-primary transition-colors">
                  <span className="material-icons">chevron_right</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
