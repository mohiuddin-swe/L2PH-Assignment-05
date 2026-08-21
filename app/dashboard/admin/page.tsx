"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { fetchApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Validation schema for category creation
const categorySchema = z.object({
  name: z.string().min(2, { message: "Category name must be at least 2 characters" }),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
  });

  // Fetch all bookings on load (GET /api/admin/bookings)
  useEffect(() => {
    async function loadBookings() {
      try {
        const response = await fetchApi("/admin/bookings");
        setBookings(response.data || response);
      } catch (error: any) {
        console.error("Failed to load bookings:", error);
        toast.error(error.message || "Could not fetch bookings.");
      } finally {
        setIsLoadingBookings(false);
      }
    }

    loadBookings();
  }, []);

  // Handle category creation (POST /api/admin/categories)
  const onCreateCategory = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      await fetchApi("/admin/categories", {
        method: "POST",
        body: JSON.stringify(data),
      });

      toast.success("Category created successfully!");
      reset(); 
    } catch (error: any) {
      console.error("Category Creation Error:", error);
      toast.error(error.message || "Failed to create category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Command Center</h1>
        <p className="text-slate-500">Manage categories and review platform-wide bookings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create Category Section */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Create Category</CardTitle>
            <CardDescription>Add a new service classification</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onCreateCategory)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Software Engineering" 
                  {...register("name")} 
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Add Category"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Bookings Table Section */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>All Platform Bookings</CardTitle>
            <CardDescription>Review all service bookings requested across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingBookings ? (
              <p className="text-sm text-slate-500 py-8 text-center">Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">No bookings found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-3 px-4 font-medium">ID</th>
                      <th className="py-3 px-4 font-medium">Service</th>
                      <th className="py-3 px-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.map((booking: any) => (
                      <tr key={booking.id || Math.random()} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-mono text-xs text-slate-600">
                          {booking.id ? booking.id.slice(0, 8) + "..." : "N/A"}
                        </td>
                        <td className="py-3 px-4 text-slate-900 font-medium">
                          {booking.serviceName || booking.title || "General Service"}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {booking.status || "PENDING"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}