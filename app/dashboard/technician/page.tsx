"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, Clock, Wrench, PlayCircle, XCircle } from "lucide-react";
import { Booking } from "@/app/types";

const statusColor: Record<string, string> = {
  REQUESTED: "bg-amber-100 text-amber-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  DECLINED: "bg-red-100 text-red-800",
  PAID: "bg-purple-100 text-purple-800",
  IN_PROGRESS: "bg-green-100 text-green-800",
  COMPLETED: "bg-gray-200 text-gray-800",
  CANCELLED: "bg-red-200 text-red-900",
};

export default function TechnicianDashboard() {
  const [jobs, setJobs] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchApi("/technician/bookings")
      .then((res) => setJobs(res.data))
      .catch((err) => {
        console.error("Failed to load technician jobs:", err);
        toast.error(err.message || "Could not load jobs.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleUpdateStatus = async (jobId: string, newStatus: string) => {
    setUpdatingId(jobId);
    try {
      await fetchApi(`/technician/bookings/${jobId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success(`Job status updated to ${newStatus}`);
      setJobs((prev) =>
        prev.map((job) => (job.id === jobId ? { ...job, status: newStatus as Booking["status"] } : job))
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to update job status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Technician Workspace</h1>
        <p className="text-slate-500">Manage your assigned service requests and update job progress.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Jobs</CardTitle>
          <CardDescription>Review and process your pending service appointments</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Wrench className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-lg font-medium">No assigned jobs found.</p>
              <p className="text-sm">Check back later when customers book your services.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-3 px-4 font-medium">Service</th>
                    <th className="py-3 px-4 font-medium">Customer</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/50">
                      <td className="py-4 px-4 font-medium text-slate-900">
                        {job.service?.title ?? "Service Request"}
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        {job.customer?.name ?? "N/A"}
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={statusColor[job.status] ?? ""} variant="secondary">
                          <Clock className="w-3 h-3 mr-1" />
                          {job.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        {job.status === "REQUESTED" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(job.id, "ACCEPTED")}
                              disabled={updatingId === job.id}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                              onClick={() => handleUpdateStatus(job.id, "DECLINED")}
                              disabled={updatingId === job.id}
                            >
                              <XCircle className="w-4 h-4 mr-1" /> Decline
                            </Button>
                          </>
                        )}

                        {job.status === "ACCEPTED" && (
                          <span className="text-xs text-muted-foreground italic">
                            Waiting for customer payment
                          </span>
                        )}

                        {job.status === "PAID" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(job.id, "IN_PROGRESS")}
                            disabled={updatingId === job.id}
                            className="border-blue-300 text-blue-600 hover:bg-blue-50"
                          >
                            <PlayCircle className="w-4 h-4 mr-1" /> Start Job
                          </Button>
                        )}

                        {job.status === "IN_PROGRESS" && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(job.id, "COMPLETED")}
                            disabled={updatingId === job.id}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" /> Complete
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