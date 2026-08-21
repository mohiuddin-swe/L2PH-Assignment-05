"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Star, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Expanded mock data to demonstrate filtering
const mockServices = [
  { id: "1", title: "Emergency Plumbing Repair", category: "Plumbing", price: 50, rating: 4.8, reviews: 124, imageUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=600&auto=format&fit=crop" },
  { id: "2", title: "Electrical Wiring & Setup", category: "Electrical", price: 80, rating: 4.9, reviews: 89, imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop" },
  { id: "3", title: "Full AC Servicing", category: "HVAC", price: 60, rating: 4.7, reviews: 210, imageUrl: "https://images.unsplash.com/photo-1527623512967-0c7f216aeb3f?q=80&w=600&auto=format&fit=crop" },
  { id: "4", title: "Deep Home Cleaning", category: "Cleaning", price: 120, rating: 4.9, reviews: 340, imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop" },
  { id: "5", title: "Leaky Faucet Fix", category: "Plumbing", price: 30, rating: 4.5, reviews: 45, imageUrl: "https://images.unsplash.com/photo-1607472586893-edb57cb89f5c?q=80&w=600&auto=format&fit=crop" },
  { id: "6", title: "Ceiling Fan Installation", category: "Electrical", price: 45, rating: 4.6, reviews: 67, imageUrl: "https://images.unsplash.com/photo-1565507519179-c5c7d0bf183c?q=80&w=600&auto=format&fit=crop" },
];

const categories = ["Plumbing", "Electrical", "HVAC", "Cleaning"];

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Real-time filtering logic
  const filteredServices = mockServices.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(service.category);
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
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600"
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
              <p className="text-slate-500 mt-1">Showing {filteredServices.length} results</p>
            </div>
          </div>

          {filteredServices.length === 0 ? (
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
                      src={service.imageUrl}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                    />
                  </div>
                  <CardContent className="p-4 flex-1">
                    <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                      {service.category}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-2">{service.title}</h3>
                    <div className="flex items-center gap-1 text-sm text-slate-600 mb-3">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-slate-900">{service.rating}</span>
                      <span>({service.reviews} reviews)</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 border-t bg-slate-50 flex justify-between items-center shrink-0">
                    <span className="font-semibold text-slate-900">Starts at ${service.price}</span>
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