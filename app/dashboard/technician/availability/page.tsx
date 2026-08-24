"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { fetchApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Trash2, Plus } from "lucide-react";
import { AvailabilitySlot } from "../../../types";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const formSchema = z.object({
  dayOfWeek: z.coerce.number().min(0).max(6),
  startTime: z.string(),
  endTime: z.string(),
});

type SlotFormValues = z.infer<typeof formSchema>;

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SlotFormValues>({
    resolver: zodResolver(formSchema) as any,
  });


  const loadSlots = async () => {
    try {
      const res = await fetchApi("/technician/availability");
      setSlots(res.data);
    } catch (error: any) {
      toast.error(error.message || "Could not load availability.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const onSubmit = async (data: SlotFormValues) => {
    setIsSaving(true);
    try {
      await fetchApi("/technician/availability", {
        method: "PUT",
        body: JSON.stringify(data),
      });
      toast.success("Availability slot added!");
      reset({ dayOfWeek: 1, startTime: "09:00", endTime: "17:00" });
      loadSlots();
    } catch (error: any) {
      toast.error(error.message || "Failed to add slot.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await fetchApi(`/technician/availability/${id}`, { method: "DELETE" });
      setSlots((prev) => prev.filter((s) => s.id !== id));
      toast.success("Slot removed.");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove slot.");
    } finally {
      setDeletingId(null);
    }
  };

  const slotsByDay = DAYS.map((_, dayIndex) => slots.filter((s) => s.dayOfWeek === dayIndex));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Availability</h1>
        <p className="text-slate-500 text-sm">Set the days and time blocks you're available for jobs.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add a time block</CardTitle>
          <CardDescription>Click a day, set your hours, and save.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <Label>Day</Label>
              <Select defaultValue="1" onValueChange={(val) => setValue("dayOfWeek", Number(val))}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DAYS.map((day, i) => (
                    <SelectItem key={day} value={String(i)}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Start Time</Label>
              <Input type="time" {...register("startTime")} className="w-32" />
              {errors.startTime && <p className="text-xs text-red-500">{errors.startTime.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>End Time</Label>
              <Input type="time" {...register("endTime")} className="w-32" />
              {errors.endTime && <p className="text-xs text-red-500">{errors.endTime.message}</p>}
            </div>
            <Button type="submit" disabled={isSaving}>
              <Plus className="w-4 h-4 mr-1" /> {isSaving ? "Adding..." : "Add Slot"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {DAYS.map((day, dayIndex) => (
          <Card key={day}>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">{day}</CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              {slotsByDay[dayIndex].length === 0 ? (
                <p className="text-xs text-slate-400">No availability set</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {slotsByDay[dayIndex].map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center gap-2 bg-blue-50 text-blue-800 text-sm px-3 py-1.5 rounded-full"
                    >
                      {slot.startTime} – {slot.endTime}
                      <button
                        onClick={() => handleDelete(slot.id)}
                        disabled={deletingId === slot.id}
                        className="hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}