"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { fetchApi } from "@/lib/api";
import { buttonVariants, Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Pencil } from "lucide-react";
import { Service, ServiceCategory } from "@/app/types";

const formSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number"),
});

type ServiceFormValues = z.infer<typeof formSchema>;

export default function TechnicianServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(formSchema) as any,
  });
  const loadData = async () => {
    try {
      const [profileRes, categoriesRes] = await Promise.all([
        fetchApi("/technician/profile"),
        fetchApi("/categories"),
      ]);
      setServices(profileRes.data.services ?? []);
      setCategories(categoriesRes.data);
    } catch (error: any) {
      toast.error(error.message || "Could not load services.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateDialog = () => {
    setEditingService(null);
    reset({ categoryId: "", title: "", description: "", price: 0 });
    setDialogOpen(true);
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    reset({
      categoryId: service.categoryId,
      title: service.title,
      description: service.description ?? "",
      price: service.price,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: ServiceFormValues) => {
    setIsSaving(true);
    try {
      if (editingService) {
        await fetchApi(`/services/${editingService.id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
        toast.success("Service updated!");
      } else {
        await fetchApi("/services", {
          method: "POST",
          body: JSON.stringify(data),
        });
        toast.success("Service created!");
      }
      setDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to save service.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Services</h1>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            className={buttonVariants({ variant: "default" })}
            onClick={openCreateDialog}
          >
            <Plus className="w-4 h-4 mr-1" /> Add Service
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
<Select
  defaultValue={(editingService?.categoryId as string) || ""}
  onValueChange={(val) => setValue("categoryId", val as string)}
>
  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
  <SelectContent>
    {categories.map((c: any) => (
      <SelectItem key={c.id} value={c.id as string}>{c.name}</SelectItem>
    ))}
  </SelectContent>
</Select>
                {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title")} />
                {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register("description")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (৳)</Label>
                <Input id="price" type="number" {...register("price")} />
                {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? "Saving..." : editingService ? "Update Service" : "Create Service"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {services.length === 0 ? (
     <p className="text-slate-500 text-center py-12">You haven't added any services yet.</p>
) : (

       <div className="rounded-md border overflow-x-auto">
    <table className="w-full text-left text-sm border-collapse">
      <thead>
        <tr className="border-b bg-slate-50 text-slate-500">
          <th className="py-3 px-4 font-medium">Title</th>
          <th className="py-3 px-4 font-medium">Category</th>
          <th className="py-3 px-4 font-medium">Description</th>
          <th className="py-3 px-4 font-medium">Price</th>
          <th className="py-3 px-4 font-medium text-right">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {services.map((service) => (
          <tr key={service.id} className="hover:bg-slate-50/50">
            <td className="py-3 px-4 font-medium text-slate-900">{service.title}</td>
            <td className="py-3 px-4">
              <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                {service.category?.name}
              </span>
            </td>
            <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{service.description}</td>
            <td className="py-3 px-4 font-semibold text-slate-900">৳{service.price}</td>
            <td className="py-3 px-4 text-right">
              <Button size="sm" variant="outline" onClick={() => openEditDialog(service)}>
                <Pencil className="w-3 h-3 mr-1" /> Edit
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
      )}
    </div>
  );
}