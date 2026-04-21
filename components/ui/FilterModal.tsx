"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/components/providers/I18nProvider";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalResults: number;
}

export default function FilterModal({ isOpen, onClose, totalResults }: FilterModalProps) {
  const { dict } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();

  const propertyTypes = [
    { id: "House", label: dict.common.types.house },
    { id: "Apartment", label: dict.common.types.apartment },
    { id: "Villa", label: dict.common.types.villa },
    { id: "Penthouse", label: dict.common.types.penthouse }
  ];

  const amenitiesList = [
    { id: "pool", label: dict.amenities.pool, icon: "pool" },
    { id: "gym", label: dict.amenities.gym, icon: "fitness_center" },
    { id: "parking", label: dict.amenities.parking, icon: "local_parking" },
    { id: "ac", label: dict.amenities.ac, icon: "ac_unit" },
    { id: "wifi", label: dict.amenities.wifi, icon: "wifi" },
    { id: "patio", label: dict.amenities.patio, icon: "deck" },
  ];

  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [propertyType, setPropertyType] = useState(searchParams.get("type") || dict.common.anyType);
  const [beds, setBeds] = useState(parseInt(searchParams.get("beds") || "0"));
  const [baths, setBaths] = useState(parseInt(searchParams.get("baths") || "0"));
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    searchParams.get("amenities")?.split(",") || []
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (location) params.set("location", location); else params.delete("location");
    if (minPrice) params.set("minPrice", minPrice); else params.delete("minPrice");
    if (maxPrice) params.set("maxPrice", maxPrice); else params.delete("maxPrice");
    if (propertyType !== dict.common.anyType) params.set("type", propertyType); else params.delete("type");
    if (beds > 0) params.set("beds", beds.toString()); else params.delete("beds");
    if (baths > 0) params.set("baths", baths.toString()); else params.delete("baths");
    if (selectedAmenities.length > 0) params.set("amenities", selectedAmenities.join(",")); else params.delete("amenities");
    
    params.set("page", "1"); // Reset to first page
    router.push(`/?${params.toString()}`);
    onClose();
  };

  const handleClearAll = () => {
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setPropertyType(dict.common.anyType);
    setBeds(0);
    setBaths(0);
    setSelectedAmenities([]);
  };

  const toggleAmenity = (label: string) => {
    setSelectedAmenities(prev => 
      prev.includes(label) ? prev.filter(a => a !== label) : [...prev, label]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-nordic-dark/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <main className="relative z-20 w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <header className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-30">
          <h1 className="text-2xl font-semibold tracking-tight text-nordic-dark">{dict.common.filters}</h1>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-nordic-muted"
          >
            <span className="material-icons">close</span>
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-10">
          {/* Section 1: Location */}
          <section>
            <label className="block text-xs font-semibold text-nordic-muted uppercase tracking-wider mb-3">{dict.common.location}</label>
            <div className="relative group">
              <span className="material-icons absolute left-4 top-3.5 text-nordic-muted group-focus-within:text-mosque transition-colors">location_on</span>
              <input 
                className="w-full pl-12 pr-4 py-3 bg-nordic-dark/5 border-0 rounded-lg text-nordic-dark placeholder-nordic-muted focus:ring-2 focus:ring-mosque focus:bg-white transition-all shadow-sm" 
                placeholder={dict.filter.locationPlaceholder} 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </section>

          {/* Section 2: Price Range */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <label className="block text-xs font-semibold text-nordic-muted uppercase tracking-wider">{dict.filter.priceRange}</label>
              {(minPrice || maxPrice) && (
                <span className="text-sm font-medium text-mosque">
                  ${minPrice || "0"} – ${maxPrice || dict.filter.max}
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-nordic-dark/5 p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                <label className="block text-[10px] text-nordic-muted uppercase font-medium mb-1">{dict.filter.min} {dict.common.price}</label>
                <div className="flex items-center">
                  <span className="text-nordic-muted mr-1">$</span>
                  <input 
                    className="w-full bg-transparent border-0 p-0 text-nordic-dark font-medium focus:ring-0 text-sm" 
                    type="number" 
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="bg-nordic-dark/5 p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                <label className="block text-[10px] text-nordic-muted uppercase font-medium mb-1">{dict.filter.max} {dict.common.price}</label>
                <div className="flex items-center">
                  <span className="text-nordic-muted mr-1">$</span>
                  <input 
                    className="w-full bg-transparent border-0 p-0 text-nordic-dark font-medium focus:ring-0 text-sm" 
                    type="number" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder={dict.filter.max}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Property Details */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Property Type */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-nordic-muted uppercase tracking-wider">{dict.common.type}</label>
              <div className="relative">
                <select 
                  className="w-full bg-nordic-dark/5 border-0 rounded-lg py-3 pl-4 pr-10 text-nordic-dark appearance-none focus:ring-2 focus:ring-mosque cursor-pointer"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value={dict.common.anyType}>{dict.common.anyType}</option>
                  {propertyTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
                <span className="material-icons absolute right-3 top-3 text-nordic-muted pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Rooms */}
            <div className="space-y-4">
              {/* Beds */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-nordic-dark">{dict.filter.bedrooms}</span>
                <div className="flex items-center space-x-3 bg-nordic-dark/5 rounded-full p-1">
                  <button 
                    onClick={() => setBeds(Math.max(0, beds - 1))}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-nordic-muted hover:text-mosque disabled:opacity-50 transition-colors"
                    disabled={beds === 0}
                  >
                    <span className="material-icons text-base">remove</span>
                  </button>
                  <span className="text-sm font-semibold w-4 text-center">{beds}+</span>
                  <button 
                    onClick={() => setBeds(beds + 1)}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                  >
                    <span className="material-icons text-base">add</span>
                  </button>
                </div>
              </div>
              {/* Baths */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-nordic-dark">{dict.filter.bathrooms}</span>
                <div className="flex items-center space-x-3 bg-nordic-dark/5 rounded-full p-1">
                  <button 
                    onClick={() => setBaths(Math.max(0, baths - 1))}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-nordic-muted hover:text-mosque disabled:opacity-50 transition-colors"
                    disabled={baths === 0}
                  >
                    <span className="material-icons text-base">remove</span>
                  </button>
                  <span className="text-sm font-semibold w-4 text-center">{baths}+</span>
                  <button 
                    onClick={() => setBaths(baths + 1)}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                  >
                    <span className="material-icons text-base">add</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Amenities */}
          <section>
            <label className="block text-xs font-semibold text-nordic-muted uppercase tracking-wider mb-4">{dict.filter.amenities}</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenitiesList.map((amenity) => (
                <label key={amenity.id} className="cursor-pointer group relative">
                  <input 
                    type="checkbox"
                    className="peer sr-only"
                    checked={selectedAmenities.includes(amenity.id)}
                    onChange={() => toggleAmenity(amenity.id)}
                  />
                  <div className="h-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-nordic-muted text-sm flex items-center justify-center gap-2 transition-all hover:border-gray-300 peer-checked:bg-mosque/5 peer-checked:border-mosque peer-checked:text-mosque font-medium">
                    <span className="material-icons text-lg">{amenity.icon}</span>
                    {amenity.label}
                  </div>
                  {selectedAmenities.includes(amenity.id) && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-mosque rounded-full"></div>
                  )}
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 px-8 py-6 sticky bottom-0 z-30 flex items-center justify-between">
          <button 
            onClick={handleClearAll}
            className="text-sm font-medium text-nordic-muted hover:text-nordic-dark transition-colors underline decoration-gray-300 underline-offset-4"
          >
            {dict.filter.clearAll}
          </button>
          <button 
            onClick={handleApplyFilters}
            className="bg-mosque hover:bg-mosque/90 text-white px-8 py-3 rounded-lg font-medium shadow-lg shadow-mosque/30 transition-all hover:shadow-mosque/40 flex items-center gap-2 transform active:scale-95"
          >
            {dict.filter.showProperties}
            <span className="material-icons text-sm">arrow_forward</span>
          </button>
        </footer>
      </main>
    </div>
  );
}
