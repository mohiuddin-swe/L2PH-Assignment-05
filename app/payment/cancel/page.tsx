import Link from "next/link";
import { XCircle, RefreshCw } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-lg border-red-100">
        <CardHeader className="pt-8">
          <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-bold text-slate-900">Payment Cancelled</CardTitle>
          <CardDescription className="text-base mt-2">
            The transaction was aborted or your payment method was declined.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">
            No charges were made to your account. Your booking will remain in the "Accepted" state until payment is completed.
          </p>
        </CardContent>
        <CardFooter className="pb-8 flex-col gap-3">
          <Link 
            href="/dashboard/customer" 
            className={cn(buttonVariants({ size: "lg" }), "w-full bg-slate-900 hover:bg-slate-800 text-white")}
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Try Again from Dashboard
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}