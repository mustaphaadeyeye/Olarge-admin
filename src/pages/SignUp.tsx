import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Store,
  ArrowLeft,
  Mail,
} from "lucide-react";
import AuthLayout from "./AuthLayout";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [isWaitlistSubmitted, setIsWaitlistSubmitted] = useState(false);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (waitlistEmail.trim()) {
      setIsWaitlistSubmitted(true);
    }
  };

  return (
    <AuthLayout formTitle="Seller Registration">
      <div className="space-y-5">
        {/* Status Announcement Banner */}
        <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200/80 shadow-xs">
          <div className="flex items-start gap-3">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5">
              <Clock size={16} />
            </span>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                  Coming Soon
                </span>
                <span className="text-xs font-semibold text-amber-900">
                  Seller Self-Posting
                </span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Direct seller registration and independent product posting are currently in development. At this time, all agricultural produce listings are managed exclusively by authorized Olarge Administrators.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Preview Card */}
        <div className="p-4 rounded-xl bg-white border border-[#F2A65A]/40 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <Store size={14} className="text-[#2F7A3D]" />
            <span>What to expect for sellers</span>
          </h3>

          <ul className="space-y-2 text-xs text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-[#2F7A3D] shrink-0 mt-0.5" />
              <span>
                <strong>Dedicated Storefront:</strong> Verified agro-merchants & farmers will be able to create listings with custom pricing and harvest data.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-[#2F7A3D] shrink-0 mt-0.5" />
              <span>
                <strong>Admin Vetting & Escrow:</strong> Quality control and automated payouts to ensure secure transactions across Nigeria.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck size={14} className="text-[#2F7A3D] shrink-0 mt-0.5" />
              <span>
                <strong>Current System:</strong> Admin-only product catalog updates ensure continuous availability during our initial rollout.
              </span>
            </li>
          </ul>
        </div>

        {/* Early Access / Waitlist notification */}
        <div className="p-4 rounded-xl bg-[#F7F9F8] border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-[#F2762E]" />
            <h4 className="text-xs font-semibold text-gray-800">
              Get notified when seller accounts open
            </h4>
          </div>

          {isWaitlistSubmitted ? (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
              <span>
                Thank you! We've reserved your spot and will email <strong>{waitlistEmail}</strong> as soon as seller posting is live.
              </span>
            </div>
          ) : (
            <form onSubmit={handleWaitlistSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full h-10 pl-9 pr-3 rounded-md border border-gray-300 bg-white text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#F2762E] transition-colors"
                />
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <button
                type="submit"
                className="h-10 px-3.5 bg-[#2F7A3D] hover:bg-[#256331] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shrink-0"
              >
                Notify Me
              </button>
            </form>
          )}
        </div>

        {/* Primary Action Button: Admin Login */}
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="
              w-full h-11
              bg-[#F2762E] hover:bg-[#E0651E]
              text-white text-sm font-semibold
              rounded-md
              transition-all cursor-pointer
              flex items-center justify-center gap-2
              shadow-xs hover:shadow-sm
            "
          >
            <span>Proceed to Admin Sign In</span>
            <ArrowRight size={16} />
          </button>

          <p className="text-center text-xs text-gray-500">
            Are you an authorized Olarge admin?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-[#2F7A3D] font-semibold hover:underline cursor-pointer"
            >
              Log in to post products
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;