"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, CheckCircle2, Clock, Wrench, PlayCircle } from "lucide-react";

export default function TechnicianDashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Load technician jobs on mount
  useEffect(() => {
    async function loadJobs() {
      try {
        let response;
        try {
          response = await fetchApi("/technician/jobs");
        } catch {
          try {
            response = await fetchApi("/technician/bookings");
          } catch {
            response = await fetchApi("/bookings");
          }
        }
        setJobs(response.data || response || []);
      } catch (error: any) {
        console.error("Failed to load technician jobs:", error);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadJobs();
  }, []);

  // Handle status update targeting the verified Postman endpoint
  const handleUpdateStatus = async (jobId: string, newStatus: string) => {
    setUpdatingId(jobId);
    try {
      await fetchApi(`/technician/bookings/${jobId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      toast.success(`Job status updated to ${newStatus}`);
      
      // Update local state instantly so it persists on refresh
      setJobs((prev) =>
        prev.map((job) => (job.id === jobId ? { ...job, status: newStatus } : job))
      );
    } catch (error: any) {
      console.error("Status Update Error:", error);
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
                    <th className="py-3 px-4 font-medium">Service / Task</th>
                    <th className="py-3 px-4 font-medium">Description</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map((job: any) => {
                    const jobTitle = job.serviceName || job.title || (typeof job.service === "object" ? job.service?.title : "Service Request");
                    const jobDesc = job.description || (typeof job.service === "object" ? job.service?.description : "No description provided.");
                    const jobStatus = job.status || "PENDING";

                    return (
                      <tr key={job.id || Math.random()} className="hover:bg-slate-50/50">
                        <td className="py-4 px-4 font-medium text-slate-900">
                          {jobTitle}
                        </td>
                        <td className="py-4 px-4 text-slate-600 max-w-xs truncate">
                          {jobDesc}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            jobStatus === "COMPLETED" 
                              ? "bg-green-100 text-green-800" 
                              : jobStatus === "IN_PROGRESS" || jobStatus === "ACCEPTED" || jobStatus === "PAID"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            <Clock className="w-3 h-3" />
                            {jobStatus}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          {jobStatus === "REQUESTED" && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleUpdateStatus(job.id, "ACCEPTED")}
                              disabled={updatingId === job.id}
                            >
                              Accept
                            </Button>
                          )}

                          {(jobStatus === "ACCEPTED" || jobStatus === "PAID") && (
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

                          {jobStatus === "IN_PROGRESS" && (
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}