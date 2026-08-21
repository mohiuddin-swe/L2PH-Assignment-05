"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Star, SlidersHorizontal, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

const categories = ["Plumbing", "Electrical", "HVAC", "Cleaning"];

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Fetch live services from backend on load
  useEffect(() => {
    async function loadServices() {
      try {
        const response = await fetchApi("/services");
        setServices(response.data || response || []);
      } catch (error: any) {
        console.error("Failed to load services:", error);
        toast.error("Failed to fetch live services. Showing empty state.");
      } finally {
        setIsLoading(false);
      }
    }

    loadServices();
  }, []);

  // Helper to extract category name safely whether it's a string or an object
  const getCategoryName = (category: any) => {
    if (!category) return "General";
    if (typeof category === "string") return category;
    return category.name || "General";
  };

  // Real-time filtering logic
  const filteredServices = services.filter((service) => {
    const title = service.title || service.name || "";
    const categoryName = getCategoryName(service.category);
    
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(categoryName);
    return matchesSearch && matchesCategory;
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="flex items-center gap-2 font-semibold text-lg text-slate-900 border-b pb-4">
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-slate-700">Search Services</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  id="search"
                  placeholder="e.g. AC Repair..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-slate-700">Categories</Label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox 
                      id={category} 
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <label
                      htmlFor={category}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600 cursor-pointer"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content: Service Grid */}
        <section className="flex-1">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Available Services</h1>
              <p className="text-slate-500 mt-1">
                {isLoading ? "Loading..." : `Showing ${filteredServices.length} results`}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-lg border border-dashed">
              <p className="text-slate-500 text-lg">No services found matching your criteria.</p>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedCategories([]); }}
                className="text-blue-600 hover:underline mt-2 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Card key={service.id || Math.random()} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                  <div className="relative h-48 w-full bg-slate-100 shrink-0">
                    <Image
                      src={service.imageUrl || "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=600&auto=format&fit=crop"}
                      alt={service.title || service.name || "Service"}
                      fill
                      className="object-cover"
                      sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                    />
                  </div>
                  <CardContent className="p-4 flex-1">
                    <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                      {getCategoryName(service.category)}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-2">
                      {service.title || service.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-slate-600 mb-3">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-slate-900">{service.rating || "4.8"}</span>
                      <span>({service.reviews || "120"} reviews)</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 border-t bg-slate-50 flex justify-between items-center shrink-0">
                    <span className="font-semibold text-slate-900">
                      Starts at ${service.price || "50"}
                    </span>
                    <Link href={`/technicians/${service.id}`} className={buttonVariants({ size: "sm" })}>
                      View Details
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}