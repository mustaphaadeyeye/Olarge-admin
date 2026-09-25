import { useState, useEffect } from "react";
import { Camera, Loader2, AlertCircle } from "lucide-react";
import { useUserProfile } from "../hooks/useUserProfile";
import type { BuyerType } from "../types/user";

interface ProfileEditProps {
  onCancel: () => void;
  onSave: () => void;
}

const BUYER_TYPES: { label: string; value: BuyerType }[] = [
  { label: "Individual", value: "individual" },
  { label: "Retailer", value: "retailer" },
  { label: "Agro Processor", value: "agro_processor" },
  { label: "Institution", value: "institution" },
];

const ProfileEdit = ({ onCancel, onSave }: ProfileEditProps) => {
  const { profile, updateProfile, isUpdating, error } = useUserProfile();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [buyerType, setBuyerType] = useState<BuyerType>("individual");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhoneNumber(profile.phoneNumber || "");
      setBio(profile.bio || "");
      setBuyerType(profile.buyerType || "individual");
      setAvatar(profile.avatar || "");
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: name.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        bio: bio.trim() || undefined,
        buyerType,
        avatar: avatar.trim() || undefined,
      });
      onSave();
    } catch {
      // Error is tracked and displayed by the hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-[#FDF2F2] border border-[#F8B4B4] rounded-lg px-4 py-3 flex items-center gap-2 text-sm text-[#9B1C1C]">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Profile picture */}
      <div>
        <p className="text-sm text-[#444] mb-3">Your Profile Picture</p>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#F0F0F0] border border-[#E0E0E0] flex items-center justify-center overflow-hidden shrink-0">
            {avatar ? (
              <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Camera size={20} className="text-[#9A9A9A]" />
            )}
          </div>
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Avatar image URL (e.g. https://...)"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-[#D9D9D9] text-xs text-[#333] outline-none focus:border-[#2F7A3D]"
            />
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm text-[#444] mb-2 font-medium">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-[#444] mb-2 font-medium">Email Address</label>
          <input
            type="email"
            disabled
            value={profile?.email || ""}
            className="w-full h-11 px-4 rounded-md border border-[#E5E5E5] bg-[#F7F7F7] text-sm text-[#9A9A9A] outline-none cursor-not-allowed"
          />
          <p className="text-[11px] text-[#999] mt-1">Email address cannot be changed.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-[#444] mb-2 font-medium">Phone Number</label>
            <input
              type="tel"
              placeholder="+234..."
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-[#444] mb-2 font-medium">Account / Buyer Type</label>
            <select
              value={buyerType}
              onChange={(e) => setBuyerType(e.target.value as BuyerType)}
              className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors bg-white cursor-pointer"
            >
              {BUYER_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-[#444] mb-2 font-medium">Bio</label>
          <textarea
            rows={3}
            maxLength={500}
            placeholder="Tell us about yourself or your agribusiness..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAEAEA]">
        <button
          type="button"
          onClick={onCancel}
          disabled={isUpdating}
          className="
            text-sm font-medium text-[#555]
            bg-[#EAEAEA] hover:bg-[#DEDEDE]
            rounded-md px-5 py-2.5
            transition-colors cursor-pointer disabled:opacity-50
          "
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isUpdating}
          className="
            flex items-center gap-2
            text-sm font-medium text-white
            bg-[#2F7A3D] hover:bg-[#256331]
            rounded-md px-5 py-2.5
            transition-colors cursor-pointer disabled:opacity-50
          "
        >
          {isUpdating && <Loader2 size={16} className="animate-spin" />}
          {isUpdating ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default ProfileEdit;
