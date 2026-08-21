"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, MapPin, CheckCircle, Calendar as CalendarIcon, Clock, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock data to simulate the backend response for a specific technician
const mockTechnician = {
  id: "1",
  name: "Alex Johnson",
  trade: "Master Plumber",
  rating: 4.8,
  reviews: 124,
  location: "Dhaka, Bangladesh",
  bio: "With over 10 years of experience in residential and commercial plumbing, I specialize in leak detection, pipe repair, and full fixture installations. I guarantee clean, efficient, and long-lasting work.",
  skills: ["Pipe Repair", "Water Heaters", "Leak Detection", "Drain Cleaning"],
  priceRate: 50, // Starting price
  avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
};

// Mock available time slots
const availableTimeSlots = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];

export default function TechnicianProfilePage() {
  const router = useRouter();
  const [date, setDate] = useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBooking = async () => {
    if (!date || !selectedSlot) {
      toast.error("Please select both a date and a time slot.");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Connect to POST /api/bookings
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
      
      toast.success("Booking request sent successfully!");
      router.push("/dashboard/customer");
    } catch (error) {
      console.error("Booking Error:", error);
      toast.error("Failed to request booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg shrink-0">
              <Image 
                src={mockTechnician.avatarUrl} 
                alt={mockTechnician.name} 
                fill 
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold text-slate-900">{mockTechnician.name}</h1>
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-lg text-slate-600 font-medium mb-3">{mockTechnician.trade}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-slate-900">{mockTechnician.rating}</span>
                  <span>({mockTechnician.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {mockTechnician.location}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 border-b pb-2">About the Technician</h2>
            <p className="text-slate-600 leading-relaxed">{mockTechnician.bio}</p>
            
            <div className="pt-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">Verified Skills</h3>
              <div className="flex flex-wrap gap-2">
                {mockTechnician.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Widget */}
        <div>
          <Card className="sticky top-8 border-slate-200 shadow-xl">
            <CardHeader className="bg-slate-50 border-b pb-6">
              <CardTitle className="text-xl">Book this Service</CardTitle>
              <CardDescription>Select an available date and time.</CardDescription>
              <div className="mt-4 text-3xl font-bold text-slate-900">
                ${mockTechnician.priceRate} <span className="text-sm font-normal text-slate-500">starting price</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              {/* Date Picker - Fixed by using a standard element wrapper instead of nested button */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Select Date</label>
                <Popover>
                  <PopoverTrigger className="w-full text-left">
                    <div
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full justify-start text-left font-normal cursor-pointer flex items-center",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Select Time Slot</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableTimeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={cn(
                        buttonVariants({ variant: selectedSlot === slot ? "default" : "outline" }),
                        "w-full",
                        selectedSlot === slot ? "bg-blue-600 text-white hover:bg-blue-700" : ""
                      )}
                      onClick={() => setSelectedSlot(slot)}
                      disabled={!date}
                    >
                      <Clock className="w-3 h-3 mr-2" />
                      {slot}
                    </button>
                  ))}
                </div>
                {!date && <p className="text-xs text-slate-500 mt-1">Please select a date first.</p>}
              </div>

            </CardContent>
            <CardFooter className="pt-2 pb-6 px-6">
              <Button 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white" 
                size="lg"
                onClick={handleBooking}
                disabled={!date || !selectedSlot || isSubmitting}
              >
                {isSubmitting ? "Sending Request..." : "Request Booking"}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
      </div>
    </main>
  );
}