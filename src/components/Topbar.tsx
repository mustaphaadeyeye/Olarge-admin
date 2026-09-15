import {
  Search,
  Bell,
  Mail,
  PhoneCall,
} from "lucide-react";

interface TopbarProps {
  userName?: string;
  email?: string;
  avatarUrl?: string;
}

const Topbar = ({
  userName = "Ope John",
  email = "opejohn@gmail.com",
  avatarUrl,
}: TopbarProps) => {
  return (
    <header className="fixed top-0 right-0 left-60 z-50 w-auto h-[72px] bg-white border-b border-[#E6EEE8] flex items-center justify-between px-5 sm:px-6 lg:px-8">

      {/* Search */}
      <div className="relative w-full max-w-[580px]">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]"
        />

        <input
          type="text"
          placeholder="product search"
          className="
            w-full
            h-10
            pl-10 pr-4
            rounded-md
            border border-[#AFAFAF]
            bg-white
            text-sm text-[#333]
            placeholder:text-[#777]
            outline-none
            focus:border-[#2F7A3D]
            transition-colors
          "
        />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-5 ml-6">

        {/* Notification */}
        <button
          type="button"
          className="text-[#2F7A3D] hover:text-[#256331] transition-colors cursor-pointer"
        >
          <Bell size={19} strokeWidth={1.7} />
        </button>

        {/* Message */}
        <button
          type="button"
          className="text-[#2F7A3D] hover:text-[#256331] transition-colors cursor-pointer"
        >
          <Mail size={20} strokeWidth={1.8} />
        </button>

        {/* Phone */}
        <button
          type="button"
          className="text-[#2F7A3D] hover:text-[#256331] transition-colors cursor-pointer"
        >
          <PhoneCall size={20} strokeWidth={1.8} />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-[#E5EDE7] shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#2F7A3D] font-semibold text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-medium text-[#222]">
              {userName}
            </p>

            <p className="text-[11px] text-[#777] mt-0.5">
              {email}
            </p>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Topbar;