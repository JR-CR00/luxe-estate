import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';

export default async function AdminProperties() {
  const supabase = await createClient();

  const { data: properties } = await supabase
    .from('properties')
    .select('*, property_images(image_url)')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-[#19322F] dark:text-white">Property Inventory</h3>
        <button className="bg-[#006655] hover:bg-[#004d40] text-white px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-[#006655]/20">
          <span className="material-icons text-sm">add</span>
          Add Property
        </button>
      </div>

      <div className="bg-white dark:bg-[#152e2a] rounded-2xl shadow-soft border border-gray-100 dark:border-[#006655]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-[#006655]/10">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#006655]/10">
              {properties?.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 relative overflow-hidden flex-shrink-0">
                        {property.property_images?.[0] ? (
                          <Image
                            src={property.property_images[0].image_url}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="material-icons">image</span>
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-[#19322F] dark:text-white truncate max-w-[200px]">
                        {property.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{property.location}</td>
                  <td className="px-6 py-4 font-bold text-mosque">
                    {property.currency}{property.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-mosque/10 text-mosque text-xs font-medium rounded-full">
                      {property.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      property.status === 'FOR SALE' 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'bg-amber-50 text-amber-600'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="p-2 text-gray-400 hover:text-mosque transition-colors">
                      <span className="material-icons text-lg">edit</span>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <span className="material-icons text-lg">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
