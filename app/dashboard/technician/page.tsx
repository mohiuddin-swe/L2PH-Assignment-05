"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Check, X, Play, CheckCircle2, Calendar as CalendarIcon, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { BookingStatus } from "@/types";

// Mock data representing backend state
const initialBookings = [
  { id: "B-101", customer: "Sarah Smith", service: "Emergency Plumbing", date: "2026-08-25", time: "10:00 AM", status: "REQUESTED" as BookingStatus, price: 80 },
  { id: "B-102", customer: "John Doe", service: "Pipe Leak Repair", date: "2026-08-26", time: "02:00 PM", status: "PAID" as BookingStatus, price: 65 },
  { id: "B-103", customer: "Mike Johnson", service: "Water Heater Setup", date: "2026-08-22", time: "09:00 AM", status: "IN_PROGRESS" as BookingStatus, price: 120 },
];

export default function TechnicianDashboard() {
  const [bookings, setBookings] = useState(initialBookings);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);

  // Optimistic UI Update function
  const updateBookingStatus = async (id: string, newStatus: BookingStatus) => {
    // 1. Instantly update the UI (Optimistic Update)
    setBookings((prev) =>
      prev.map((booking) => (booking.id === id ? { ...booking, status: newStatus } : booking))
    );
    
    // 2. Simulate API Call
    try {
      // TODO: Connect to PATCH /api/technician/bookings/:id
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success(`Booking ${id} marked as ${newStatus.replace("_", " ")}`);
    } catch (error) {
      // 3. Rollback on failure (Optional, but good practice)
      toast.error("Failed to update status.");
    }
  };

  // Helper for dynamic badge colors
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Technician Dashboard</h1>
          <p className="text-slate-500">Manage your jobs, schedule, and earnings.</p>
        </div>
      </div>

      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bookings">Job Requests</TabsTrigger>
          <TabsTrigger value="schedule">Availability & Schedule</TabsTrigger>
        </TabsList>
        
        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Incoming & Active Jobs</CardTitle>
              <CardDescription>Review new requests and update job statuses.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.customer}</TableCell>
                        <TableCell>{booking.service}</TableCell>
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
                          {/* Conditional Action Buttons based on Status */}
                          {booking.status === "REQUESTED" && (
                            <>
                              <Button size="sm" variant="outline" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={() => updateBookingStatus(booking.id, "ACCEPTED")}>
                                <Check className="w-4 h-4 mr-1" /> Accept
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => updateBookingStatus(booking.id, "DECLINED")}>
                                <X className="w-4 h-4 mr-1" /> Decline
                              </Button>
                            </>
                          )}
                          
                          {booking.status === "PAID" && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => updateBookingStatus(booking.id, "IN_PROGRESS")}>
                              <Play className="w-4 h-4 mr-1" /> Start Job
                            </Button>
                          )}

                          {booking.status === "IN_PROGRESS" && (
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => updateBookingStatus(booking.id, "COMPLETED")}>
                              <CheckCircle2 className="w-4 h-4 mr-1" /> Mark Complete
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {bookings.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                          No bookings found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Manage Availability</CardTitle>
              <CardDescription>Select dates on the calendar to mark yourself as unavailable (Off Days).</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center sm:justify-start">
              <Calendar
                mode="multiple"
                selected={blockedDates}
                onSelect={(dates) => setBlockedDates(dates as Date[])}
                className="rounded-md border shadow-sm"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}