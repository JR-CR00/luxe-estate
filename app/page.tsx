import Navbar from "@/components/layout/Navbar";
import FilterBar from "@/components/ui/FilterBar";
import PropertyCard from "@/components/ui/PropertyCard";
import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";
import { createClient } from "@/lib/supabase/server";

const PAGE_SIZE = 8;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = (params.page as string) || "1";
  const location = params.location as string;
  const minPrice = params.minPrice as string;
  const maxPrice = params.maxPrice as string;
  const type = params.type as string;
  const beds = params.beds as string;
  const baths = params.baths as string;
  const amenities = params.amenities as string;

  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const supabase = await createClient();

  // Determine if any filters are active
  const hasFilters = !!(location || minPrice || maxPrice || type || beds || baths || amenities);

  // Fetch properties flagged as featured (only show if no filters or adjust as needed)
  let featuredProperties = [];
  if (!hasFilters) {
    const { data } = await supabase
      .from("properties")
      .select("*, property_images(image_url)")
      .eq("is_featured", true)
      .order("created_at", { ascending: false });
    featuredProperties = data || [];
  }

  // Fetch paginated properties with filters
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("properties")
    .select("*, property_images(image_url)", { count: "exact" });

  if (location) query = query.ilike("location", `%${location}%`);
  if (minPrice) query = query.gte("price", parseFloat(minPrice));
  if (maxPrice) query = query.lte("price", parseFloat(maxPrice));
  if (type && type !== "Any Type") query = query.eq("type", type);
  if (beds) query = query.gte("beds", parseInt(beds));
  if (baths) query = query.gte("baths", parseInt(baths));
  if (amenities) {
    const amenitiesList = amenities.split(",");
    query = query.contains("amenities", amenitiesList);
  }

  // If filtered, don't double count featured ones if they are in the same list
  if (!hasFilters) {
    query = query.eq("is_featured", false);
  }

  const { data: properties, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <section className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic-dark leading-tight">
              Find your{" "}
              <span className="relative inline-block">
                <span className="relative z-10 font-medium">sanctuary</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-mosque/20 -rotate-1 z-0"></span>
              </span>
              .
            </h1>
            
            <SearchBar />
            <FilterBar />
          </div>
        </section>

        {/* Featured Collections */}
        {featuredProperties && featuredProperties.length > 0 && (
          <section className="mb-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-light text-nordic-dark">
                  Featured Collections
                </h2>
                <p className="text-nordic-muted mt-1 text-sm">
                  Curated properties for the discerning eye.
                </p>
              </div>
              <a
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity"
                href="#"
              >
                View all <span className="material-icons text-sm">arrow_forward</span>
              </a>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} featured />
              ))}
            </div>
          </section>
        )}

        {/* Properties List */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-nordic-dark">
                {hasFilters ? "Search Results" : "New in Market"}
              </h2>
              <p className="text-nordic-muted mt-1 text-sm">
                {hasFilters 
                  ? `Found ${count || 0} properties matching your criteria.`
                  : "Fresh opportunities added this week."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(properties ?? []).map((property, index) => (
              <div
                key={property.id}
                className={
                  index === 4
                    ? "hidden xl:flex h-full"
                    : index === 5
                    ? "hidden lg:flex h-full"
                    : "h-full"
                }
              >
                <PropertyCard property={property} />
              </div>
            ))}
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </section>
      </main>
    </>
  );
}
