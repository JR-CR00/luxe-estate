import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default async function AdminProperties() {
  const supabase = await createClient();

  // Security Check
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

  // Fetch properties with images
  const { data: properties } = await supabase
    .from('properties')
    .select('*, property_images(image_url)')
    .order('created_at', { ascending: false });

  // Calculate dynamic stats
  const totalListings = properties?.length || 0;
  const activeProperties = properties?.filter(p => p.status === 'FOR SALE' || p.status === 'FOR RENT').length || 0;
  const pendingProperties = properties?.filter(p => p.status === 'PENDING').length || 0;

  return (
    <div className="max-w-7xl mx-auto py-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-nordic-dark dark:text-white tracking-tight">My Properties</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your portfolio and track performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white dark:bg-[#152e2a] border border-gray-200 dark:border-primary/30 text-nordic-dark dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-primary/10 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-2">
            <span className="material-icons text-base">filter_list</span> Filter
          </button>
          <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md shadow-primary/20 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2">
            <span className="material-icons text-base">add</span> Add New Property
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-[#152e2a] p-6 rounded-xl border border-nordic-dark/5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Listings</p>
            <p className="text-3xl font-bold text-nordic-dark dark:text-white">{totalListings}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center text-primary">
            <span className="material-icons">apartment</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#152e2a] p-6 rounded-xl border border-nordic-dark/5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Properties</p>
            <p className="text-3xl font-bold text-nordic-dark dark:text-white">{activeProperties}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-hint-of-green/40 flex items-center justify-center text-primary">
            <span className="material-icons">check_circle</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#152e2a] p-6 rounded-xl border border-nordic-dark/5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Sale</p>
            <p className="text-3xl font-bold text-nordic-dark dark:text-white">{pendingProperties}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <span className="material-icons">pending</span>
          </div>
        </div>
      </div>

      {/* Property List Container */}
      <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-gray-200 dark:border-primary/20 overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 dark:bg-primary/5 border-b border-gray-100 dark:border-primary/10 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          <div className="col-span-6 text-left">PROPERTY DETAILS</div>
          <div className="col-span-2 text-left">PRICE</div>
          <div className="col-span-2 text-left">STATUS</div>
          <div className="col-span-2 text-right">ACTIONS</div>
        </div>

        {/* List Items */}
        <div className="divide-y divide-gray-100 dark:divide-primary/10 text-nordic-dark">
          {properties?.map((property) => (
            <div key={property.id} className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-6 hover:bg-background-light dark:hover:bg-primary/5 transition-colors items-center">
              {/* Property Details */}
              <div className="col-span-12 md:col-span-6 flex gap-5 items-center">
                <div className="relative h-20 w-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-[#1a3833]">
                  {property.property_images?.[0] ? (
                    <Image
                      src={property.property_images[0].image_url}
                      alt={property.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="material-symbols-outlined text-2xl">image</span>
                    </div>
                  )}
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-lg font-bold text-nordic-dark dark:text-white group-hover:text-primary transition-colors cursor-pointer truncate">
                    {property.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{property.location}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 dark:text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">bed</span> {property.bedrooms || 0} Beds
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">bathtub</span> {property.bathrooms || 0} Baths
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                    <span className="flex items-center gap-1.5">
                      {(property.sqft || 0).toLocaleString()} sqft
                    </span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="col-span-6 md:col-span-2">
                <div className="text-lg font-bold text-nordic-dark dark:text-gray-200 leading-tight">
                  {property.currency}{(property.price || 0).toLocaleString()}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">Monthly: {property.currency}{(Math.round((property.price || 0) / 300)).toLocaleString()}</div>
              </div>

              {/* Status */}
              <div className="col-span-6 md:col-span-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                  property.status === 'FOR SALE' || property.status === 'FOR RENT'
                    ? 'bg-hint-of-green/40 text-primary border-primary/10'
                    : property.status === 'PENDING'
                    ? 'bg-orange-50 text-orange-700 border-orange-200'
                    : 'bg-gray-100 text-gray-600 border-gray-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                    property.status === 'FOR SALE' || property.status === 'FOR RENT'
                      ? 'bg-primary'
                      : property.status === 'PENDING'
                      ? 'bg-orange-500'
                      : 'bg-gray-500'
                  }`}></span>
                  {property.status === 'FOR SALE' || property.status === 'FOR RENT' ? 'Active' : property.status === 'PENDING' ? 'Pending' : 'Sold'}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-3">
                <button className="p-2 rounded-lg text-gray-400 hover:text-nordic-dark hover:bg-gray-100 transition-all" title="Edit Property">
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all" title="Delete Property">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 border-t border-gray-100 dark:border-primary/20 flex items-center justify-between bg-white dark:bg-[#152e2a]">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium text-nordic-dark dark:text-white">1</span> to <span className="font-medium text-nordic-dark dark:text-white">{totalListings}</span> of <span className="font-medium text-nordic-dark dark:text-white">{totalListings}</span> results
          </div>
          <div className="flex gap-2">
            <button disabled className="px-4 py-2 text-sm border border-gray-200 dark:border-primary/30 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-primary/20 disabled:opacity-50 font-medium">Previous</button>
            <button disabled className="px-4 py-2 text-sm border border-gray-200 dark:border-primary/30 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-primary/20 disabled:opacity-50 font-medium">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
