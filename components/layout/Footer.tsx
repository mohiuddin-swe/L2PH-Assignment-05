"use client";

import Link from "next/link";
import { Wrench, ShieldCheck, Clock, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export function Footer() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(Cookies.get("userRole") ?? null);
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Fix<span className="text-blue-500">It</span>Now
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Your reliable on-demand platform connecting verified technicians with quality homeowners and businesses.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services" className="hover:text-white transition-colors">Browse Services</Link></li>
              {role && (
                <li>
                  <Link href={`/dashboard/${role.toLowerCase()}`} className="hover:text-white transition-colors">
                    My Dashboard
                  </Link>
                </li>
              )}
              {!role && (
                <li><Link href="/auth/login" className="hover:text-white transition-colors">Login</Link></li>
              )}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Why Choose Us</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-blue-500" /> Verified Professionals</li>
              <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500" /> Instant Dispatch & Tracking</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-blue-500" /> 24/7 Customer Support</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Service Coverage</h4>
            <p className="text-sm text-slate-400">
              Available across major metropolitan areas with secure online gateway payment tracking.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FixItNow Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}