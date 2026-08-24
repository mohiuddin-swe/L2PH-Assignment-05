"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Loader2, AlertTriangle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { fetchApi } from "@/lib/api";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [status, setStatus] = useState<"checking" | "confirmed" | "unconfirmed">("checking");

  useEffect(() => {
    if (!bookingId) {
      setStatus("unconfirmed");
      return;
    }
    const timer = setTimeout(() => {
      fetchApi(`/bookings/${bookingId}`)
        .then((res) => {
          setStatus(res.data.status === "PAID" ? "confirmed" : "unconfirmed");
        })
        .catch(() => setStatus("unconfirmed"));
    }, 1500);
    return () => clearTimeout(timer);
  }, [bookingId]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className={cn(
        "w-full max-w-md text-center shadow-lg",
        status === "unconfirmed" ? "border-amber-100" : "border-emerald-100"
      )}>
        <CardHeader className="pt-8">
          <div className={cn(
            "mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4",
            status === "checking" && "bg-slate-100 text-slate-500",
            status === "confirmed" && "bg-emerald-100 text-emerald-600",
            status === "unconfirmed" && "bg-amber-100 text-amber-600"
          )}>
            {status === "checking" && <Loader2 className="w-10 h-10 animate-spin" />}
            {status === "confirmed" && <CheckCircle2 className="w-10 h-10" />}
            {status === "unconfirmed" && <AlertTriangle className="w-10 h-10" />}
          </div>
          <CardTitle className="text-3xl font-bold text-slate-900">
            {status === "checking" && "Confirming Payment..."}
            {status === "confirmed" && "Payment Successful!"}
            {status === "unconfirmed" && "Verifying Your Payment"}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {status === "checking" && "Please wait while we confirm your transaction."}
            {status === "confirmed" && "Your transaction has been securely processed and your booking is confirmed."}
            {status === "unconfirmed" && "We're still verifying with the payment gateway. Check your dashboard for the latest status."}
          </CardDescription>
        </CardHeader>
        {status === "confirmed" && (
          <CardContent>
            <p className="text-sm text-slate-500">
              The technician has been notified and will arrive at the scheduled time.
            </p>
          </CardContent>
        )}
        <CardFooter className="pb-8">
          <Link
            href="/dashboard/customer"
            className={cn(buttonVariants({ size: "lg" }), "w-full bg-slate-900 hover:bg-slate-800 text-white")}
          >
            Return to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}