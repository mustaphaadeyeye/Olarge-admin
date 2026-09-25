import { useUserProfile } from "../hooks/useUserProfile";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";

interface ProfileViewProps {
  onEdit: () => void;
}

const ProfileView = ({ onEdit }: ProfileViewProps) => {
  const { profile, isLoading, error } = useUserProfile();

  if (isLoading) {
    return (
      <div className="bg-[#F7F9F8] rounded-lg px-6 py-12 flex flex-col items-center justify-center text-[#777]">
        <Loader2 className="animate-spin text-[#2F7A3D] mb-3" size={28} />
        <p className="text-sm">Loading profile details...</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="bg-[#FDF2F2] border border-[#F8B4B4] rounded-lg px-6 py-5 flex items-start gap-3 text-[#9B1C1C]">
        <AlertCircle size={20} className="shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold">Failed to load profile</h4>
          <p className="text-xs mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const formattedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not available";

  const kyc = profile?.kyc;

  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <div className="bg-[#F7F9F8] rounded-lg px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#E2E2E2] shrink-0 overflow-hidden flex items-center justify-center border border-[#D5E5D8]">
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-[#2F7A3D]">
                  {profile?.name?.charAt(0).toUpperCase() || "A"}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#2B2B2B]">
                {profile?.name || "Admin User"}
              </h2>
              <p className="text-xs text-[#9A9A9A]">
                {profile?.email || "admin@olage.ng"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onEdit}
            className="
              text-sm font-medium text-[#2F7A3D]
              border border-[#2F7A3D]/40
              rounded-md px-4 py-1.5
              hover:bg-[#2F7A3D]/5
              transition-colors cursor-pointer
            "
          >
            Edit
          </button>
        </div>

        <h3 className="text-sm font-semibold text-[#2B2B2B] mb-4">
          All Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <p className="text-xs text-[#9A9A9A] mb-1">Full Name</p>
            <p className="text-sm text-[#2B2B2B] font-medium">
              {profile?.name || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#9A9A9A] mb-1">Email Address</p>
            <p className="text-sm text-[#2B2B2B] font-medium">
              {profile?.email || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#9A9A9A] mb-1">Phone Number</p>
            <p className="text-sm text-[#2B2B2B] font-medium">
              {profile?.phoneNumber || "Not set"}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#9A9A9A] mb-1">Date Joined</p>
            <p className="text-sm text-[#2B2B2B] font-medium">{formattedDate}</p>
          </div>
          <div>
            <p className="text-xs text-[#9A9A9A] mb-1">Role</p>
            <p className="text-sm text-[#2B2B2B] font-medium capitalize">
              {profile?.role || "Admin"}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#9A9A9A] mb-1">Buyer / Account Type</p>
            <p className="text-sm text-[#2B2B2B] font-medium capitalize">
              {profile?.buyerType || "Individual"}
            </p>
          </div>
          {profile?.bio && (
            <div className="sm:col-span-2">
              <p className="text-xs text-[#9A9A9A] mb-1">Bio</p>
              <p className="text-sm text-[#2B2B2B]">{profile.bio}</p>
            </div>
          )}
        </div>
      </div>

      {/* KYC / Farm Information */}
      <div className="bg-[#F7F9F8] rounded-lg px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#2B2B2B] flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#2F7A3D]" />
            KYC & Farm Details
          </h3>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${
              profile?.isKycVerified || kyc?.status === "verified"
                ? "bg-green-100 text-green-800"
                : kyc?.status === "pending"
                ? "bg-amber-100 text-amber-800"
                : kyc?.status === "rejected"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {kyc?.status ? kyc.status.replace("_", " ") : "Not Submitted"}
          </span>
        </div>

        {kyc?.farmName ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <p className="text-xs text-[#9A9A9A] mb-1">Farm / Business Name</p>
              <p className="text-sm text-[#2B2B2B] font-medium">{kyc.farmName}</p>
            </div>
            <div>
              <p className="text-xs text-[#9A9A9A] mb-1">Farm Location</p>
              <p className="text-sm text-[#2B2B2B] font-medium">
                {[kyc.lga, kyc.state].filter(Boolean).join(", ") || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#9A9A9A] mb-1">Farm Address</p>
              <p className="text-sm text-[#2B2B2B] font-medium">
                {kyc.farmAddress || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#9A9A9A] mb-1">Farm Size</p>
              <p className="text-sm text-[#2B2B2B] font-medium">
                {kyc.farmSizeAcres ? `${kyc.farmSizeAcres} Acres` : "—"}
              </p>
            </div>
            {kyc.produceSpecialization && kyc.produceSpecialization.length > 0 && (
              <div className="sm:col-span-2">
                <p className="text-xs text-[#9A9A9A] mb-1">Produce Specialization</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {kyc.produceSpecialization.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-[#EAF6EC] text-[#2F7A3D] px-2.5 py-1 rounded-md"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {kyc.rejectionReason && (
              <div className="sm:col-span-2 bg-red-50 p-3 rounded-md border border-red-200 text-xs text-red-700">
                <span className="font-semibold">Rejection Note: </span>
                {kyc.rejectionReason}
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-[#777]">
            No KYC or farm verification details submitted yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
