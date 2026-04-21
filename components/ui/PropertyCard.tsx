import Image from "next/image";
import Link from "next/link";

// Supports both Supabase DB records (snake_case) and legacy mock data (camelCase)
export interface PropertyRecord {
  id: string;
  title: string;
  location: string;
  price: number;
  currency: string;
  price_type?: string | null;
  priceType?: string | null; // legacy camelCase support
  beds: number;
  baths: number;
  area: number;
  property_images?: { image_url: string }[];
  imageUrl?: string; // legacy camelCase support
  type: string;
  status: "FOR SALE" | "FOR RENT";
  badges?: string[] | null;
  is_new?: boolean | null;
  is_featured?: boolean | null;
  slug?: string | null;
}

interface PropertyCardProps {
  property: PropertyRecord;
  featured?: boolean;
}

export default function PropertyCard({ property, featured = false }: PropertyCardProps) {
  // Normalize snake_case (Supabase) and camelCase (mock) fields
  const imageUrl = property.property_images?.[0]?.image_url ?? property.imageUrl ?? "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop";
  const priceType = property.price_type ?? property.priceType ?? null;

  if (featured) {
    return (
      <Link href={property.slug ? `/properties/${property.slug}` : "#"} className="group relative rounded-xl overflow-hidden shadow-soft bg-white cursor-pointer block">
        <div className="aspect-[4/3] w-full overflow-hidden relative">
          <Image
            alt={property.title}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            src={imageUrl}
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {property.is_new && (
              <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                New
              </span>
            )}
            {property.badges && property.badges[0] && (
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-nordic-dark">
                {property.badges[0]}
              </span>
            )}
          </div>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-nordic-dark hover:bg-mosque hover:text-white transition-all z-10">
            <span className="material-icons text-xl">favorite_border</span>
          </button>
          <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
        </div>
        <div className="p-6 relative">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-medium text-nordic-dark group-hover:text-mosque transition-colors">
                {property.title}
              </h3>
              <p className="text-nordic-muted text-sm flex items-center gap-1 mt-1">
                <span className="material-icons text-sm">place</span> {property.location}
              </p>
            </div>
            <span className="text-xl font-semibold text-mosque">
              {property.currency}
              {property.price.toLocaleString()}
              {priceType && (
                <span className="text-sm font-normal text-nordic-muted">{priceType}</span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-nordic-dark/5">
            <div className="flex items-center gap-2 text-nordic-muted text-sm">
              <span className="material-icons text-lg">king_bed</span> {property.beds} Beds
            </div>
            <div className="flex items-center gap-2 text-nordic-muted text-sm">
              <span className="material-icons text-lg">bathtub</span> {property.baths} Baths
            </div>
            <div className="flex items-center gap-2 text-nordic-muted text-sm">
              <span className="material-icons text-lg">square_foot</span> {property.area.toLocaleString()} m²
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={property.slug ? `/properties/${property.slug}` : "#"} className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 group cursor-pointer h-full flex flex-col block">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          alt={property.title}
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          src={imageUrl}
        />
        <button className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full hover:bg-mosque hover:text-white transition-colors text-nordic-dark z-10 flex items-center justify-center shadow-sm">
          <span className="material-icons text-lg">favorite_border</span>
        </button>
        {/* Status badge */}
        <div
          className={`absolute bottom-3 left-3 text-white text-xs font-bold px-2 py-1 rounded ${
            property.status === "FOR RENT" ? "bg-mosque/90" : "bg-nordic-dark/90"
          }`}
        >
          {property.status}
        </div>
        {/* New badge */}
        {property.is_new && (
          <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md">
            New
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="font-bold text-lg text-nordic-dark">
            {property.currency}
            {property.price.toLocaleString()}
            {priceType && (
              <span className="text-sm font-normal text-nordic-muted">{priceType}</span>
            )}
          </h3>
        </div>
        <h4 className="text-nordic-dark font-medium truncate mb-1">
          {property.title}
        </h4>
        <p className="text-nordic-muted text-xs mb-4">{property.location}</p>
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">king_bed</span> {property.beds}
          </div>
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">bathtub</span> {property.baths}
          </div>
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">square_foot</span> {property.area}m²
          </div>
        </div>
      </div>
    </Link>
  );
}
