import Navbar from "@/components/layout/Navbar";
import FilterBar from "@/components/ui/FilterBar";
import PropertyCard from "@/components/ui/PropertyCard";
import { mockProperties } from "@/data/mockProperties";

export default function Home() {
  const featuredProperties = mockProperties.slice(0, 2);
  const newProperties = mockProperties.slice(2);

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
            <div className="relative group max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-icons text-nordic-muted text-2xl group-focus-within:text-mosque transition-colors">
                  search
                </span>
              </div>
              <input
                className="block w-full pl-12 pr-4 py-4 rounded-xl border-none bg-white text-nordic-dark shadow-soft placeholder-nordic-muted/60 focus:ring-2 focus:ring-mosque focus:bg-white:bg-white/10 transition-all text-lg"
                placeholder="Search by city, neighborhood, or address..."
                type="text"
              />
              <button className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20">
                Search
              </button>
            </div>
            <FilterBar />
          </div>
        </section>

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

        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-nordic-dark">
                New in Market
              </h2>
              <p className="text-nordic-muted mt-1 text-sm">
                Fresh opportunities added this week.
              </p>
            </div>
            <div className="hidden md:flex bg-white p-1 rounded-lg">
              <button className="px-4 py-1.5 rounded-md text-sm font-medium bg-nordic-dark text-white shadow-sm">
                All
              </button>
              <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark:text-white">
                Buy
              </button>
              <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark:text-white">
                Rent
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newProperties.map((property, index) => (
              <div
                key={property.id}
                className={
                  index === 4 ? "hidden xl:flex h-full" : index === 5 ? "hidden lg:flex h-full" : "h-full"
                }
              >
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <button className="px-8 py-3 bg-white border border-nordic-dark/10 hover:border-mosque hover:text-mosque text-nordic-dark font-medium rounded-lg transition-all hover:shadow-md">
              Load more properties
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
