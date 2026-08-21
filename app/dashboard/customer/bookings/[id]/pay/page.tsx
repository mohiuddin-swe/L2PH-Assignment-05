"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentInitiationPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock data representing the specific booking fetched from the backend
  const bookingSummary = {
    id: resolvedParams.id,
    service: "Pipe Leak Repair",
    technician: "Alex Johnson",
    price: 65,
    date: "2026-08-26",
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    toast.loading("Initiating secure checkout...");

    try {
      // TODO: Connect to POST /api/payments/create
      // The backend should return a JSON response containing { url: "https://checkout.stripe.com/..." }
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay
      
      toast.dismiss();
      
      // For demonstration purposes, we will simulate the redirect by pushing directly to our success page.
      // In production, you MUST do: window.location.href = data.url; (The Stripe/SSLCommerz URL)
      router.push("/payment/success?session_id=mock_session_123");
      
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to initiate payment gateway. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center pb-8 border-b">
          <CardTitle className="text-2xl font-bold">Secure Checkout</CardTitle>
          <CardDescription>Complete your payment to confirm the booking.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          <div className="bg-slate-50 p-4 rounded-lg border space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Booking ID</span>
              <span className="font-medium text-slate-900">{bookingSummary.id}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Service</span>
              <span className="font-medium text-slate-900">{bookingSummary.service}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Technician</span>
              <span className="font-medium text-slate-900">{bookingSummary.technician}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2">
              <span className="text-slate-900">Total Amount</span>
              <span className="text-blue-600">${bookingSummary.price.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 p-3 rounded-md">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <p>Payments are 100% secure and encrypted. We do not store your card details.</p>
          </div>

        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg" 
            onClick={handleCheckout}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <CreditCard className="w-5 h-5 mr-2" />
            )}
            {isProcessing ? "Processing..." : `Pay $${bookingSummary.price.toFixed(2)}`}
          </Button>
          <Button 
            variant="ghost" 
            className="w-full text-slate-500"
            onClick={() => router.back()}
            disabled={isProcessing}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Cancel & Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}