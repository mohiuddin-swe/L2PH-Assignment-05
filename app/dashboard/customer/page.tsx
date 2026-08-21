"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, XCircle, Star, Calendar as CalendarIcon, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BookingStatus } from "@/types";

// Mock data representing the customer's booking history
const initialBookings = [
  { id: "B-201", technician: "Alex Johnson", service: "Pipe Leak Repair", date: "2026-08-26", time: "02:00 PM", status: "ACCEPTED" as BookingStatus, price: 65 },
  { id: "B-202", technician: "Maria Garcia", service: "AC Servicing", date: "2026-08-28", time: "10:00 AM", status: "REQUESTED" as BookingStatus, price: 60 },
  { id: "B-203", technician: "David Smith", service: "Fan Installation", date: "2026-08-15", time: "11:00 AM", status: "COMPLETED" as BookingStatus, price: 45 },
];

export default function CustomerDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState(initialBookings);

  const handleCancelBooking = async (id: string) => {
    // Optimistic UI Update
    setBookings((prev) =>
      prev.map((booking) => (booking.id === id ? { ...booking, status: "CANCELLED" } : booking))
    );
    
    try {
      // TODO: Connect to PATCH /api/bookings/:id
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success(`Booking ${id} has been cancelled successfully.`);
    } catch (error) {
      toast.error("Failed to cancel booking. Please try again.");
    }
  };

  const handlePayment = (id: string) => {
    // This will route to the payment initiation page we build in Sprint 10
    toast.info("Redirecting to secure payment gateway...");
    // router.push(`/dashboard/customer/bookings/${id}/pay`);
  };

  // Helper for dynamic badge colors matching the Technician dashboard
  const getStatusColor = (status: BookingStatus) => {
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
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {booking.service}
                      <div className="text-xs text-slate-500 mt-1">ID: {booking.id}</div>
                    </TableCell>
                    <TableCell>{booking.technician}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm text-slate-600">
                        <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3"/> {booking.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {booking.time}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("uppercase text-[10px] font-bold tracking-wider", getStatusColor(booking.status))} variant="outline">
                        {booking.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      
                      {/* Conditional Actions based on Status */}
                      {(booking.status === "REQUESTED" || booking.status === "ACCEPTED") && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" /> Cancel
                        </Button>
                      )}

                      {booking.status === "ACCEPTED" && (
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handlePayment(booking.id)}
                        >
                          <CreditCard className="w-4 h-4 mr-1" /> Pay ${booking.price}
                        </Button>
                      )}

                      {booking.status === "COMPLETED" && (
                        <Button size="sm" variant="outline" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                          <Star className="w-4 h-4 mr-1" /> Leave Review
                        </Button>
                      )}

                    </TableCell>
                  </TableRow>
                ))}
                {bookings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                      You haven't booked any services yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}