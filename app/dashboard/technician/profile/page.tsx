"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { fetchApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const profileSchema = z.object({
  bio: z.string().optional(),
  location: z.string().optional(),
  experience: z.coerce.number().min(0, { message: "Experience must be 0 or more" }),
  pricing: z.coerce.number().min(0, { message: "Pricing must be 0 or more" }),
  skills: z.string().optional(), // comma-separated input, split before submit
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function TechnicianProfileEditPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    fetchApi("/technician/profile")
      .then((res) => {
        const p = res.data;
        reset({
          bio: p.bio ?? "",
          location: p.location ?? "",
          experience: p.experience ?? 0,
          pricing: p.pricing ?? 0,
          skills: (p.skills ?? []).join(", "),
        });
      })
      .catch((err) => toast.error(err.message || "Could not load profile."))
      .finally(() => setIsLoading(false));
  }, [reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      await fetchApi("/technician/profile", {
        method: "PUT",
        body: JSON.stringify({
          bio: data.bio,
          location: data.location,
          experience: data.experience,
          pricing: data.pricing,
          skills: data.skills
            ? data.skills.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
        }),
      });
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile.");
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
    <div className="max-w-2xl mx-auto p-6 md:p-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your skills, experience, and rates.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" {...register("bio")} placeholder="Tell customers about your experience..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register("location")} placeholder="e.g. Dhaka" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Experience (years)</Label>
                <Input id="experience" type="number" {...register("experience")} />
                {errors.experience && <p className="text-sm text-red-500">{errors.experience.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricing">Base Pricing (৳)</Label>
                <Input id="pricing" type="number" {...register("pricing")} />
                {errors.pricing && <p className="text-sm text-red-500">{errors.pricing.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input id="skills" {...register("skills")} placeholder="wiring, circuit repair, panel installation" />
            </div>

            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}