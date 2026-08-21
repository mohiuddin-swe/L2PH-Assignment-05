"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Assuming your backend expects title/serviceName and potentially a description
const bookingSchema = z.object({
  serviceName: z.string().min(3, { message: "Service name is required" }),
  description: z.string().min(10, { message: "Please provide more details about the issue" }),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function BookingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    try {
      // POST /api/bookings (Adjust endpoint based on your specific API docs)
      await fetchApi("/bookings", {
        method: "POST",
        body: JSON.stringify(data),
      });

      toast.success("Booking request submitted successfully!");
      router.push("/dashboard/customer"); // Redirect to customer dashboard
    } catch (error: any) {
      console.error("Booking Error:", error);
      toast.error(error.message || "Failed to submit booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Request a Service</CardTitle>
          <CardDescription>Fill in the details to book a professional</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="serviceName">Service Name</Label>
              <Input id="serviceName" placeholder="e.g. AC Repair, Plumbing" {...register("serviceName")} />
              {errors.serviceName && <p className="text-sm text-red-500">{errors.serviceName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Details</Label>
              <textarea
                id="description"
                className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                placeholder="Describe your issue..."
                {...register("description")}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Book Service"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}