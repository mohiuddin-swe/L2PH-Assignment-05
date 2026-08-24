"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, MapPin, CheckCircle, Calendar as CalendarIcon, Clock, ShieldCheck, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { fetchApi } from "@/lib/api";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TechnicianProfile, Service } from "@/app/types";

const availableTimeSlots = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];

function parseSlotToTime(slot: string): { hours: number; minutes: number } {
  const [time, meridiem] = slot.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  return { hours, minutes };
}

export default function TechnicianProfilePage() {
  const router = useRouter();
  const params = useParams();
  const routeId = params?.id as string;

  const [technician, setTechnician] = useState<TechnicianProfile | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [date, setDate] = useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!routeId) return;

    fetchApi(`/technicians/${routeId}`)
      .then((res) => {
        setTechnician(res.data);
        if (res.data?.services?.length > 0) {
          setSelectedServiceId(res.data.services[0].id);
        }
      })
      .catch((error) => {
        console.error("Failed to load technician profile:", error);
        setNotFound(true);
      })
      .finally(() => setIsLoading(false));
  }, [routeId]);

  const handleBooking = async () => {
    if (!selectedServiceId || !date || !selectedSlot) {
      toast.error("Please select a service, date, and time slot.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { hours, minutes } = parseSlotToTime(selectedSlot);
      const scheduledDate = new Date(date);
      scheduledDate.setHours(hours, minutes, 0, 0);

      await fetchApi("/bookings", {
        method: "POST",
        body: JSON.stringify({
          serviceId: selectedServiceId,
          scheduledAt: scheduledDate.toISOString(),
        }),
      });

      toast.success("Booking requested successfully!");
      router.push("/dashboard/customer");
    } catch (error: any) {
      toast.error(error.message || "Failed to create booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (notFound || !technician) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 text-lg">Technician profile not found.</p>
      </div>
    );
  }

  const selectedServiceObj: Service | undefined =
   technician.services?.find((s: any) => s.id === selectedServiceId) ?? technician.services?.[0];
  const displayPrice = selectedServiceObj?.price ?? technician.pricing;

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center bg-white p-6 rounded-xl border shadow-sm">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg shrink-0 bg-slate-100 flex items-center justify-center text-blue-600 font-bold text-3xl">
              {technician.user?.name?.charAt(0) ?? "T"}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold text-slate-900">{technician.user?.name}</h1>
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-lg text-slate-600 font-medium mb-3">
                {technician.experience} Years Experience
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-slate-900">
                    {technician.avgRating ? technician.avgRating.toFixed(1) : "No ratings"}
                  </span>
                  <span>({technician.reviews?.length ?? 0} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {technician.location ?? "Not specified"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 border-b pb-2">About Technician</h2>
            <p className="text-slate-600 leading-relaxed">{technician.bio}</p>

            <div className="pt-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {technician.skills?.map((skill: string) => (
                  <Badge key={skill} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Services Offered</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {technician.services?.map((srv: any) => (
                <div
                  key={srv.id}
                  onClick={() => setSelectedServiceId(srv.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedServiceId === srv.id ? "border-blue-600 bg-blue-50/50 shadow-sm" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-slate-900">{srv.title}</h3>
                    <span className="font-bold text-blue-600">৳{srv.price}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{srv.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Customer Reviews</h3>
            {!technician.reviews || technician.reviews.length === 0 ? (
              <p className="text-sm text-slate-500">No reviews yet.</p>
            ) : (
              <div className="space-y-4 divide-y">
                {technician.reviews.map((rev: any) => (
                  <div key={rev.id} className="pt-3 first:pt-0">
                    <span className="font-semibold text-sm text-slate-900">{rev.customer?.name ?? "Client"}</span>
                    <div className="flex items-center gap-1 text-amber-500 my-1">
                      {"★".repeat(rev.rating)}
                    </div>
                    <p className="text-sm text-slate-600">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <Card className="sticky top-24 border-slate-200 shadow-xl overflow-visible">
            <CardHeader className="bg-slate-50 border-b pb-6">
              <CardTitle className="text-xl">Book Appointment</CardTitle>
              <CardDescription>Select a service, date, and time slot.</CardDescription>
              <div className="mt-4 text-3xl font-bold text-slate-900">
                ৳{displayPrice} <span className="text-sm font-normal text-slate-500">service fee</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6 overflow-visible">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Selected Service</label>
                <div className="p-3 bg-slate-50 rounded-lg border text-sm font-medium text-slate-800">
                  {selectedServiceObj ? selectedServiceObj.title : "Choose a service"}
                </div>
              </div>

              <div className="space-y-2 relative">
                <label className="text-sm font-medium text-slate-900">Select Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <div
                      role="button"
                      tabIndex={0}
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
                <PopoverContent className="w-auto p-0 z-50 bg-white shadow-xl border rounded-lg">
  <Calendar
    mode="single"
    selected={date}
    onSelect={setDate}
  />
</PopoverContent>
                </Popover>
              </div>

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
                disabled={!date || !selectedSlot || !selectedServiceId || isSubmitting}
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