import { useState } from "react";
import { Camera } from "lucide-react";

const GENDERS = ["Male", "Female", "Prefer not to say"];
const CATEGORIES = ["Grains", "Vegetables", "Livestock", "Machinery"];

interface ProfileEditProps {
  onCancel: () => void;
  onSave: () => void;
}

const ProfileEdit = ({ onCancel, onSave }: ProfileEditProps) => {
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleAvatarChange = (file: File | null) => {
    if (!file) return;
    setAvatar(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile picture */}
      <div>
        <p className="text-sm text-[#444] mb-3">Your Profile Picture</p>
        <label className="relative inline-block cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleAvatarChange(e.target.files?.[0] ?? null)}
          />
          <div className="w-16 h-16 rounded-full bg-[#F0F0F0] border border-[#E0E0E0] flex items-center justify-center overflow-hidden">
            {avatar ? (
              <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Camera size={18} className="text-[#9A9A9A]" />
            )}
          </div>
        </label>
      </div>

      {/* Personal info */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm text-[#444] mb-2">Full Name</label>
          <input
            type="text"
            defaultValue="Ope John"
            className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-[#444] mb-2">Email Address</label>
          <input
            type="email"
            defaultValue="opejohn@gmail.com"
            className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-[#444] mb-2">Phone Number</label>
            <input
              type="tel"
              defaultValue="+234 903 233 7674"
              className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-[#444] mb-2">Date Joined</label>
            <input
              type="text"
              defaultValue="21 May, 2026"
              disabled
              className="w-full h-11 px-4 rounded-md border border-[#E5E5E5] bg-[#F7F7F7] text-sm text-[#9A9A9A] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-[#444] mb-2">Location</label>
            <input
              type="text"
              defaultValue="Lagos, Nigeria"
              className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-[#444] mb-2">Gender</label>
            <select
              defaultValue="Male"
              className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors bg-white cursor-pointer"
            >
              {GENDERS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          className="
            text-sm font-medium text-white
            bg-[#2F7A3D] hover:bg-[#256331]
            rounded-md px-5 py-2.5
            transition-colors cursor-pointer
          "
        >
          Update Profile
        </button>
      </div>

      {/* Store info */}
      <div className="pt-2 space-y-5">
        <h3 className="text-sm font-semibold text-[#2B2B2B]">Store Information</h3>

        <div>
          <label className="block text-sm text-[#444] mb-2">Store Name</label>
          <input
            type="text"
            defaultValue="More Blessing Store"
            className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-[#444] mb-2">Business Email</label>
            <input
              type="email"
              defaultValue="moreblessing@gmail.com"
              className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-[#444] mb-2">Store Address</label>
            <input
              type="text"
              defaultValue="Along Ajara road, Lagos state, Nigeria."
              className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-[#444] mb-2">Store Category</label>
            <select
              defaultValue="Grains"
              className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors bg-white cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#444] mb-2">Business Phone Number</label>
            <input
              type="tel"
              defaultValue="+234 704 445 2126"
              className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="
            text-sm font-medium text-[#555]
            bg-[#EAEAEA] hover:bg-[#DEDEDE]
            rounded-md px-5 py-2.5
            transition-colors cursor-pointer
          "
        >
          Cancel
        </button>
        <button
          type="submit"
          className="
            text-sm font-medium text-white
            bg-[#2F7A3D] hover:bg-[#256331]
            rounded-md px-5 py-2.5
            transition-colors cursor-pointer
          "
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default ProfileEdit;