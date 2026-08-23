"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";
import { Service, ServiceCategory } from "@/types";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchApi("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => {});

    fetchApi("/services")
      .then((res) => setServices(res.data))
      .catch((error) => {
        console.error("Failed to load services:", error);
        toast.error("Failed to fetch live services.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(service.category?.name);
    return matchesSearch && matchesCategory;
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
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
                  placeholder="e.g. Wiring Repair..."
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
                {categories.length === 0 ? (
                  <p className="text-xs text-slate-400">No categories yet</p>
                ) : (
                  categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.id}
                        checked={selectedCategories.includes(category.name)}
                        onCheckedChange={() => toggleCategory(category.name)}
                      />
                      <label
                        htmlFor={category.id}
                        className="text-sm font-medium leading-none text-slate-600 cursor-pointer"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </aside>

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
                <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                  <div className="relative h-48 w-full bg-slate-100 shrink-0">
                    <Image
                      src="https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=600&auto=format&fit=crop"
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <CardContent className="p-4 flex-1">
                    <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                      {service.category?.name ?? "General"}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{service.description}</p>
                    {service.technicianProfile?.user?.name && (
                      <p className="text-xs text-slate-400 mt-2">
                        by {service.technicianProfile.user.name}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 border-t bg-slate-50 flex justify-between items-center shrink-0">
                    <span className="font-semibold text-slate-900">
                      ৳{service.price}
                    </span>
                    <Link
                      href={`/technicians/${service.technicianProfileId}`}
                      className={buttonVariants({ size: "sm" })}
                    >
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