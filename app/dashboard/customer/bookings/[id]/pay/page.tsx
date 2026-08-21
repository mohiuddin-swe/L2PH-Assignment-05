"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CreditCard, Loader2, ShieldCheck, ArrowLeft, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { fetchApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.id;

  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function loadBookingDetails() {
      try {
        const response = await fetchApi(`/bookings/${bookingId}`);
        setBooking(response.data || response);
      } catch (error) {
        setBooking({
          id: bookingId,
          serviceName: "Professional Service",
          price: 50,
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (bookingId) {
      loadBookingDetails();
    }
  }, [bookingId]);

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    try {
      console.log("Sending payment creation for bookingId:", bookingId);
      
      const response = await fetchApi("/payments/create", {
        method: "POST",
        body: JSON.stringify({ bookingId }),
      });

      console.log("Payment response received:", response);

      const gatewayUrl = response.gatewayUrl || response.data?.gatewayUrl;

      if (gatewayUrl) {
        toast.success("Redirecting to payment gateway...");
        window.location.href = gatewayUrl;
      } else {
        throw new Error("Gateway URL not found in payment response.");
      }
    } catch (error: any) {
      console.error("Payment Creation Error:", error);
      toast.error(error.message || "Failed to create payment session.");
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <main className="max-w-xl mx-auto py-12 px-4">
      <Button 
        variant="ghost" 
        className="mb-6 text-slate-600 hover:text-slate-900"
        onClick={() => router.push("/dashboard/customer")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </Button>

      <Card className="shadow-xl border-slate-200">
        <CardHeader className="bg-slate-50 border-b pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-slate-900">Secure Checkout</CardTitle>
            <ShieldCheck className="w-6 h-6 text-blue-600" />
          </div>
          <CardDescription>Complete payment via SSLCommerz gateway session.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Booking ID:</span>
              <span className="font-mono text-slate-900">{String(bookingId).slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Service Name:</span>
              <span className="font-semibold text-slate-900">{booking?.serviceName || booking?.title || "Professional Service"}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-slate-900 border-t pt-2 mt-2">
              <span>Total Amount:</span>
              <span className="text-blue-600">${booking?.price || 50}</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-900">Payment Provider</label>
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-blue-50/50 border-blue-200">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <div className="text-sm">
                <p className="font-semibold text-slate-900">SSLCommerz Sandbox</p>
                <p className="text-slate-500 text-xs">Secure online transaction session</p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pb-6 px-6">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2" 
            size="lg"
            onClick={handleProcessPayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Creating Payment Session...
              </>
            ) : (
              <>
                Proceed to Payment <ExternalLink className="w-4 h-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}