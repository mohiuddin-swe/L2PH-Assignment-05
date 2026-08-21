"use client";

import { useState } from "react";
import { Users, Activity, DollarSign, Ban, CheckCircle, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Mock data representing platform health and users
const platformStats = {
  totalUsers: 1245,
  activeBookings: 89,
  totalRevenue: 15400,
};

const initialUsers = [
  { id: "U-001", name: "Alex Johnson", email: "alex@example.com", role: "TECHNICIAN", isBanned: false },
  { id: "U-002", name: "Sarah Smith", email: "sarah@example.com", role: "CUSTOMER", isBanned: false },
  { id: "U-003", name: "Mike Davis", email: "mike.d@example.com", role: "CUSTOMER", isBanned: true },
];

const initialCategories = [
  { id: "C-1", name: "Plumbing", slug: "plumbing", count: 45 },
  { id: "C-2", name: "Electrical", slug: "electrical", count: 38 },
  { id: "C-3", name: "HVAC", slug: "hvac", count: 24 },
];

export default function AdminDashboard() {
  const [users, setUsers] = useState(initialUsers);
  const [categories, setCategories] = useState(initialCategories);

  const toggleUserBan = async (id: string, currentlyBanned: boolean) => {
    // Optimistic UI Update
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, isBanned: !currentlyBanned } : user))
    );
    
    try {
      // TODO: Connect to PATCH /api/admin/users/:id/ban
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success(`User has been successfully ${currentlyBanned ? "unbanned" : "banned"}.`);
    } catch (error) {
      toast.error("Failed to update user status.");
    }
  };

  const deleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    toast.success("Category deleted successfully.");
  };

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Command Center</h1>
          <p className="text-slate-500">Monitor platform metrics, moderate users, and manage services.</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{platformStats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-slate-500">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                <Activity className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{platformStats.activeBookings}</div>
                <p className="text-xs text-slate-500">Jobs currently in progress</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${platformStats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-slate-500">Platform earnings all-time</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Platform Users</CardTitle>
              <CardDescription>View all registered users and manage account access.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table className="min-w-[600px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Details</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="font-medium text-slate-900">{user.name}</div>
                          <div className="text-sm text-slate-500">{user.email}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="uppercase text-[10px] tracking-wider">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.isBanned ? (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-200" variant="outline">BANNED</Badge>
                          ) : (
                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200" variant="outline">ACTIVE</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {user.isBanned ? (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              onClick={() => toggleUserBan(user.id, user.isBanned)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" /> Unban
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => toggleUserBan(user.id, user.isBanned)}
                            >
                              <Ban className="w-4 h-4 mr-1" /> Ban User
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Service Categories</CardTitle>
                <CardDescription>Manage the types of services offered on FixItNow.</CardDescription>
              </div>
              <Button size="sm" className="bg-slate-900 hover:bg-slate-800">
                <Plus className="w-4 h-4 mr-1" /> Add Category
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Active Services</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-slate-500">{category.slug}</TableCell>
                        <TableCell>{category.count}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => deleteCategory(category.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}