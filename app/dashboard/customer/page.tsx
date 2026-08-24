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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Booking } from "@/app/types";

const CANCELLABLE = ["REQUESTED", "ACCEPTED", "PAID"];

export default function CustomerDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadBookings = async () => {
    try {
      const response = await fetchApi("/bookings");
      setBookings(response.data || []);
    } catch (error: any) {
      toast.error(error.message || "Could not fetch your bookings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancelBooking = async (id: string) => {
    try {
      await fetchApi(`/bookings/${id}/cancel`, { method: "PATCH" });
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" } : b))
      );
      toast.success("Booking has been cancelled successfully.");
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel booking. Please try again.");
    }
  };

  const handlePayment = (id: string) => {
    router.push(`/dashboard/customer/bookings/${id}/pay`);
  };

  const submitReview = async () => {
    if (!reviewBooking) return;
    setSubmittingReview(true);
    try {
      await fetchApi("/reviews", {
        method: "POST",
        body: JSON.stringify({ bookingId: reviewBooking.id, rating, comment }),
      });
      toast.success("Review submitted, thank you!");
      setReviewBooking(null);
      setComment("");
      setRating(5);
      loadBookings();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Customer Dashboard</h1>
        <p className="text-slate-500">Track your active bookings, manage payments, and leave reviews.</p>
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
                  {bookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                        You haven't booked any services yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    bookings.map((booking) => {
                      const formattedDate = booking.scheduledAt
                        ? new Date(booking.scheduledAt).toLocaleDateString(undefined, {
                            year: "numeric", month: "short", day: "numeric",
                          })
                        : "N/A";
                      const formattedTime = booking.scheduledAt
                        ? new Date(booking.scheduledAt).toLocaleTimeString(undefined, {
                            hour: "2-digit", minute: "2-digit",
                          })
                        : "";

                      return (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">
                            {booking.service?.title ?? "General Service"}
                            <div className="text-xs text-slate-500 mt-1">৳{booking.service?.price ?? "-"}</div>
                          </TableCell>
                          <TableCell className="font-medium text-slate-800">
                            {booking.technicianProfile?.user?.name ?? "N/A"}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col text-sm text-slate-600">
                              <span className="flex items-center gap-1">
                                <CalendarIcon className="w-3 h-3 text-blue-600" /> {formattedDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" /> {formattedTime}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("uppercase text-[10px] font-bold tracking-wider", getStatusColor(booking.status))} variant="outline">
                              {booking.status.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            {CANCELLABLE.includes(booking.status) && (
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
                                <CreditCard className="w-4 h-4 mr-1" /> Pay ৳{booking.service?.price}
                              </Button>
                            )}

                            {booking.status === "COMPLETED" && !booking.review && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                onClick={() => setReviewBooking(booking)}
                              >
                                <Star className="w-4 h-4 mr-1" /> Leave Review
                              </Button>
                            )}

                            {booking.status === "COMPLETED" && booking.review && (
                              <span className="text-xs text-muted-foreground italic">Reviewed</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!reviewBooking} onOpenChange={(open) => !open && setReviewBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave a review for {reviewBooking?.service?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rating</Label>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setRating(n)}>
                    <Star className={cn("w-6 h-6", n <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300")} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="comment">Comment</Label>
              <Textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="How was the service?" />
            </div>
            <Button onClick={submitReview} disabled={submittingReview} className="w-full">
              {submittingReview ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}