import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

// Mock data to simulate backend response
const mockServices = [
  {
    id: "1",
    title: "Plumbing Repair",
    category: "Plumbing",
    price: "Starts at $50",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Electrical Installation",
    category: "Electrical",
    price: "Starts at $80",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "AC Servicing",
    category: "HVAC",
    price: "Starts at $60",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1527623512967-0c7f216aeb3f?q=80&w=600&auto=format&fit=crop",
  },
];

export default async function HomePage() {
  // Simulate a network delay to test our loading.tsx file
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Your Trusted Home Service Platform
          </h1>
          <p className="text-lg text-slate-300">
            Book certified plumbers, electricians, and technicians in seconds.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link 
              href="/services" 
              className={cn(buttonVariants({ size: "lg" }), "bg-blue-600 text-white hover:bg-blue-700")}
            >
              Browse Services
            </Link>
            <Link 
              href="/auth/register" 
              className={cn(buttonVariants({ size: "lg", variant: "outline" }), "text-slate-900 bg-white hover:bg-slate-100")}
            >
              Become a Technician
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Services Grid */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Featured Services</h2>
          <Link href="/services" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockServices.map((service) => (
            <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 w-full bg-slate-100">
                <Image
                  src={service.imageUrl}
                  alt={service.title}
                  fill
                  className="object-cover"
                  sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                  priority={service.id === "1"}
                />
              </div>
              <CardContent className="p-4">
                <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                  {service.category}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{service.title}</h3>
                <div className="flex items-center gap-1 text-sm text-slate-600 mb-3">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-slate-900">{service.rating}</span>
                  <span>(120+ reviews)</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 border-t bg-slate-50 flex justify-between items-center">
                <span className="font-semibold text-slate-900">{service.price}</span>
                <Link href={`/services`} className={buttonVariants({ size: "sm" })}>
                  Book Now
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}