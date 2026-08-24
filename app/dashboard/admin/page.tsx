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
import { Badge } from "@/components/ui/badge";
import { User, Booking } from "../../types";

const categorySchema = z.object({
  name: z.string().min(2, { message: "Category name must be at least 2 characters" }),
});
type CategoryFormValues = z.infer<typeof categorySchema>;

const statusColor: Record<string, string> = {
  REQUESTED: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  DECLINED: "bg-red-100 text-red-800",
  PAID: "bg-purple-100 text-purple-800",
  IN_PROGRESS: "bg-green-100 text-green-800",
  COMPLETED: "bg-gray-200 text-gray-800",
  CANCELLED: "bg-red-200 text-red-900",
};

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banningId, setBanningId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    fetchApi("/admin/bookings")
      .then((res) => setBookings(res.data))
      .catch((err) => toast.error(err.message || "Could not fetch bookings."))
      .finally(() => setIsLoadingBookings(false));

    fetchApi("/admin/users")
      .then((res) => setUsers(res.data))
      .catch((err) => toast.error(err.message || "Could not fetch users."))
      .finally(() => setIsLoadingUsers(false));
  }, []);

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
      toast.error(error.message || "Failed to create category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleBan = async (user: User) => {
    const newStatus = user.status === "BANNED" ? "ACTIVE" : "BANNED";
    setBanningId(user.id);
    try {
      await fetchApi(`/admin/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      );
      toast.success(`User ${newStatus === "BANNED" ? "banned" : "unbanned"}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update user status");
    } finally {
      setBanningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Command Center</h1>
        <p className="text-slate-500">Manage users, categories, and platform-wide bookings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create Category */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Create Category</CardTitle>
            <CardDescription>Add a new service classification</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onCreateCategory)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input id="name" placeholder="e.g. Electrical" {...register("name")} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Add Category"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* All Bookings */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>All Platform Bookings</CardTitle>
            <CardDescription>Every booking across all customers and technicians</CardDescription>
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
                      <th className="py-3 px-4 font-medium">Service</th>
                      <th className="py-3 px-4 font-medium">Customer</th>
                      <th className="py-3 px-4 font-medium">Technician</th>
                      <th className="py-3 px-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 text-slate-900 font-medium">
                          {booking.service?.title ?? "N/A"}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {booking.customer?.name ?? "N/A"}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {booking.technicianProfile?.user?.name ?? "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={statusColor[booking.status] ?? ""} variant="secondary">
                            {booking.status}
                          </Badge>
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

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View all users and manage their access</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingUsers ? (
            <p className="text-sm text-slate-500 py-8 text-center">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-3 px-4 font-medium">Name</th>
                    <th className="py-3 px-4 font-medium">Email</th>
                    <th className="py-3 px-4 font-medium">Role</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-medium text-slate-900">{user.name}</td>
                      <td className="py-3 px-4 text-slate-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{user.role}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={user.status === "BANNED" ? "destructive" : "secondary"}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {user.role !== "ADMIN" && (
                          <Button
                            size="sm"
                            variant={user.status === "BANNED" ? "outline" : "destructive"}
                            disabled={banningId === user.id}
                            onClick={() => toggleBan(user)}
                          >
                            {banningId === user.id
                              ? "..."
                              : user.status === "BANNED" ? "Unban" : "Ban"}
                          </Button>
                        )}
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
  );
}