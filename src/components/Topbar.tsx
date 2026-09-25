import {
  Search,
  Bell,
  Mail,
  PhoneCall,
  Menu,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface TopbarProps {
  userName?: string;
  email?: string;
  avatarUrl?: string;
  onToggleSidebar?: () => void;
}

const Topbar = ({
  userName,
  email,
  avatarUrl,
  onToggleSidebar,
}: TopbarProps) => {
  const { user } = useAuth();

  const displayName = userName || user?.name || "Admin";
  const displayEmail = email || user?.email || "admin@olage.ng";
  const displayAvatar = avatarUrl || user?.avatar;

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-60 z-30 h-[72px] bg-white border-b border-[#E6EEE8] flex items-center justify-between px-3 sm:px-6 lg:px-8 transition-[left] duration-300">
      {/* Left: Mobile Hamburger & Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xl mr-2 sm:mr-4">
        {/* Hamburger Menu Toggle (Visible on mobile/tablet, hidden on desktop lg+) */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Open navigation menu"
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-[#2F7A3D] hover:bg-[#F2F7F3] active:bg-[#E5EFE7] transition-colors cursor-pointer shrink-0"
        >
          <Menu size={24} />
        </button>

        {/* Search Input */}
        <div className="relative w-full">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777] pointer-events-none"
          />
          <input
            type="text"
            placeholder="product search..."
            className="
              w-full
              h-9 sm:h-10
              pl-9 sm:pl-10 pr-3 sm:pr-4
              rounded-md
              border border-[#D1D5DB]
              bg-white
              text-xs sm:text-sm text-[#333]
              placeholder:text-[#888]
              outline-none
              focus:border-[#2F7A3D]
              transition-colors
            "
          />
        </div>
      </div>

      {/* Right Section: Quick Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="w-9 h-9 flex items-center justify-center rounded-full text-[#2F7A3D] hover:bg-[#F2F7F3] transition-colors cursor-pointer"
        >
          <Bell size={19} strokeWidth={1.8} />
        </button>

        {/* Message (Hidden on small mobile) */}
        <button
          type="button"
          aria-label="Messages"
          className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-[#2F7A3D] hover:bg-[#F2F7F3] transition-colors cursor-pointer"
        >
          <Mail size={19} strokeWidth={1.8} />
        </button>

        {/* Phone (Hidden on tablet/mobile, visible on md+) */}
        <button
          type="button"
          aria-label="Support phone"
          className="hidden md:flex w-9 h-9 items-center justify-center rounded-full text-[#2F7A3D] hover:bg-[#F2F7F3] transition-colors cursor-pointer"
        >
          <PhoneCall size={19} strokeWidth={1.8} />
        </button>

        {/* Profile Card */}
        <div className="flex items-center gap-2.5 pl-1 sm:pl-2">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-[#E5EDE7] shrink-0 border border-[#D5E5D8]">
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#2F7A3D] font-semibold text-sm">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-medium text-[#222]">
              {displayName}
            </p>
            <p className="text-[11px] text-[#777] mt-0.5 max-w-[130px] truncate">
              {displayEmail}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;