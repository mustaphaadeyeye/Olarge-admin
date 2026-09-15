interface ProfileViewProps {
  onEdit: () => void;
}

const ProfileView = ({ onEdit }: ProfileViewProps) => {
  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <div className="bg-[#F7F9F8] rounded-lg px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#E2E2E2] shrink-0" />
            <div>
              <h2 className="text-base font-semibold text-[#2B2B2B]">Basic Information</h2>
              <p className="text-xs text-[#9A9A9A]">Update profile information</p>
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

        <h3 className="text-sm font-semibold text-[#2B2B2B] mb-4">All Personal Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <p className="text-xs text-[#9A9A9A] mb-1">Name</p>
            <p className="text-sm text-[#2B2B2B] font-medium">Ope John</p>
          </div>
          <div>
            <p className="text-xs text-[#9A9A9A] mb-1">Email Address</p>
            <p className="text-sm text-[#2B2B2B] font-medium">opejohn@gmail.com</p>
          </div>
          <div>
            <p className="text-xs text-[#9A9A9A] mb-1">Phone Number</p>
            <p className="text-sm text-[#2B2B2B] font-medium">+234 903 233 7674</p>
          </div>
          <div>
            <p className="text-xs text-[#9A9A9A] mb-1">Date Joined</p>
            <p className="text-sm text-[#2B2B2B] font-medium">21 May, 2026</p>
          </div>
          <div>
            <p className="text-xs text-[#9A9A9A] mb-1">Location</p>
            <p className="text-sm text-[#2B2B2B] font-medium">Lagos, Nigeria</p>
          </div>
          <div>
            <p className="text-xs text-[#9A9A9A] mb-1">Gender</p>
            <p className="text-sm text-[#2B2B2B] font-medium">Male</p>
          </div>
        </div>
      </div>

      {/* Store Information */}
      <div className="bg-[#F7F9F8] rounded-lg px-6 py-6">
        <h3 className="text-sm font-semibold text-[#2B2B2B] mb-4">Store Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <p className="text-xs text-[#9A9A9A] mb-1">Store Name</p>
            <p className="text-sm text-[#2B2B2B] font-medium">More Blessing Store</p>
          </div>
          <div>
            <p className="text-xs text-[#9A9A9A] mb-1">Store Address</p>
            <p className="text-sm text-[#2B2B2B] font-medium">Along Ajara road, Lagos state, Nigeria.</p>
          </div>
          <div>
            <p className="text-xs text-[#9A9A9A] mb-1">Business Email</p>
            <p className="text-sm text-[#2B2B2B] font-medium">moreblessing@gmail.com</p>
          </div>
          <div>
            <p className="text-xs text-[#9A9A9A] mb-1">Business Phone number</p>
            <p className="text-sm text-[#2B2B2B] font-medium">+234 704 445 2126</p>
          </div>
          <div>
            <p className="text-xs text-[#9A9A9A] mb-1">Store Category</p>
            <p className="text-sm text-[#2B2B2B] font-medium">Grains</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;