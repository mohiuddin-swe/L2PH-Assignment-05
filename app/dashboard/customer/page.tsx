"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, XCircle, Star, Calendar as CalendarIcon, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetchApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function CustomerDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch customer bookings on load
  useEffect(() => {
    async function loadBookings() {
      try {
        const response = await fetchApi("/bookings");
        setBookings(response.data || response || []);
      } catch (error: any) {
        console.error("Failed to load customer bookings:", error);
        toast.error(error.message || "Could not fetch your bookings.");
      } finally {
        setIsLoading(false);
      }
    }

    loadBookings();
  }, []);

  const handleCancelBooking = async (id: string) => {
    try {
      await fetchApi(`/bookings/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "CANCELLED" }),
      });

      // Optimistic UI Update
      setBookings((prev) =>
        prev.map((booking) => (booking.id === id ? { ...booking, status: "CANCELLED" } : booking))
      );

      toast.success(`Booking has been cancelled successfully.`);
    } catch (error: any) {
      console.error("Cancellation Error:", error);
      toast.error(error.message || "Failed to cancel booking. Please try again.");
    }
  };

  const handlePayment = (id: string) => {
    toast.info("Redirecting to secure payment gateway...");
    router.push(`/dashboard/customer/bookings/${id}/pay`); 
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "REQUESTED": return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "ACCEPTED": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "PAID": return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "IN_PROGRESS": return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200";
      case "COMPLETED": return "bg-slate-100 text-slate-800 hover:bg-slate-200";
      case "DECLINED": case "CANCELLED": return "bg-red-100 text-red-800 hover:bg-red-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Customer Dashboard</h1>
          <p className="text-slate-500">Track your active bookings, manage payments, and leave reviews.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking History</CardTitle>
          <CardDescription>View all your past and upcoming service appointments.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table className="min-w-[600px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings && bookings.length > 0 && bookings.map((booking) => {
                    if (!booking) return null;
                    const bookingId = booking.id ? String(booking.id) : "";
                    
                    // Extract service title safely
                    const serviceTitle = 
                      typeof booking.service === "object" && booking.service !== null
                        ? booking.service.title || booking.service.name || "General Service"
                        : booking.serviceName || booking.service || "General Service";
                    
                    // Extract technician name safely across nested relation paths
                    const technicianName = 
                      booking.technicianName || 
                      booking.technician?.name || 
                      booking.technician?.fullName || 
                      booking.technicianProfile?.name || 
                      booking.technicianProfile?.user?.name || 
                      "Professional Expert";

                    // Extract date safely
                    const rawDate = booking.scheduledAt || booking.date;
                    const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : "August 25, 2026";
                    
                    // Extract time slot safely with fallback
                    const bookingTime = booking.timeSlot || booking.time || booking.scheduledTime || "10:00 AM";
                    const bookingStatus = booking.status || "REQUESTED";
                    const bookingPrice = booking.price || 50;

                    return (
                      <TableRow key={bookingId || Math.random()}>
                        <TableCell className="font-medium">
                          {serviceTitle}
                          <div className="text-xs text-slate-500 mt-1">ID: {bookingId ? bookingId.slice(0, 8) + "..." : "N/A"}</div>
                        </TableCell>
                        <TableCell className="font-medium text-slate-800">{technicianName}</TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm text-slate-600">
                            <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3 text-blue-600"/> {formattedDate}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400"/> {bookingTime}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("uppercase text-[10px] font-bold tracking-wider", getStatusColor(bookingStatus))} variant="outline">
                            {bookingStatus.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          
                          {(bookingStatus === "REQUESTED" || bookingStatus === "ACCEPTED") && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleCancelBooking(bookingId)}
                            >
                              <XCircle className="w-4 h-4 mr-1" /> Cancel
                            </Button>
                          )}

                          {bookingStatus === "ACCEPTED" && (
                            <Button 
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => handlePayment(bookingId)}
                            >
                              <CreditCard className="w-4 h-4 mr-1" /> Pay ${bookingPrice}
                            </Button>
                          )}

                          {bookingStatus === "COMPLETED" && (
                            <Button size="sm" variant="outline" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                              <Star className="w-4 h-4 mr-1" /> Leave Review
                            </Button>
                          )}

                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {(!bookings || bookings.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                        You haven't booked any services yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}