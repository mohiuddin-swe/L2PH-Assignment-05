"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { fetchApi } from "@/lib/api";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function BookingForm({ serviceId }: { serviceId: string }) {
  const router = useRouter();
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleBook = async () => {
    const token = Cookies.get("accessToken");
    if (!token) {
      toast.error("Please log in as a customer to book.");
      router.push("/auth/login");
      return;
    }
    if (!scheduledAt) {
      toast.error("Please select a date and time.");
      return;
    }

    setLoading(true);
    try {
      await fetchApi("/bookings", {
        method: "POST",
        body: JSON.stringify({
          serviceId,
          scheduledAt: new Date(scheduledAt).toISOString(),
        }),
      });
      toast.success("Booking requested! Check your dashboard.");
      setOpen(false);
      router.push("/dashboard/customer");
    } catch (err: any) {
      toast.error(err.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ size: "sm" })}>
        Book Now
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a time slot</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="scheduledAt">Date & Time</Label>
          <Input
            id="scheduledAt"
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
        </div>
        <Button onClick={handleBook} disabled={loading} className="w-full">
          {loading ? "Booking..." : "Confirm Booking"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}