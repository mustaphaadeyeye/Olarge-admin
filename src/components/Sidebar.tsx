import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Package,
  Wallet,
  Star,
  Bell,
  CreditCard,
  Settings,
  LogOut,
  X,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Product", icon: ShoppingBag, path: "/product" },
  { label: "Categories", icon: Layers, path: "/categories" },
  { label: "Orders", icon: Package, path: "/orders" },
  { label: "Earnings", icon: Wallet, path: "/earnings" },
  { label: "Reviews", icon: Star, path: "/reviews" },
  { label: "Notifications", icon: Bell, path: "/notifications" },
  { label: "Subscriptions", icon: CreditCard, path: "/subscriptions" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

interface SidebarProps {
  userName?: string;
  avatarUrl?: string;
  onLogout?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({
  userName,
  avatarUrl,
  onLogout,
  isOpen = false,
  onClose,
}: SidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = userName || user?.name || "Admin";
  const displayAvatar = avatarUrl || user?.avatar;

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
      navigate("/login");
    }
    if (onClose) onClose();
  };

  const handleNavClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 lg:z-40
          h-screen w-64 lg:w-60
          flex flex-col
          px-4 py-6
          overflow-hidden
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{ backgroundColor: "#2F7A3D" }}
      >
        {/* Logo & Mobile Close Button */}
        <div className="flex items-center justify-between mb-8 lg:justify-center">
          <div className="flex items-start">
            <h1 className="text-white text-2xl font-bold tracking-tight">
              Olage
            </h1>
            <span className="text-white text-xs -mt-1">°</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="lg:hidden text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

      {/* Profile */}
      <div className="flex flex-col items-center mb-9">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 bg-white/10 shadow-sm">
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-xl font-semibold">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <p className="mt-3 text-white text-sm font-medium">
          Hello {displayName}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="space-y-1">
          {navItems.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                [
                  "relative flex items-center gap-3",
                  "px-4 py-3 rounded-lg",
                  "text-sm font-medium text-white",
                  "transition-all duration-200",
                  isActive
                    ? "bg-white/15 shadow-sm"
                    : "hover:bg-white/10",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-r-full bg-orange-400" />
                  )}

                  <Icon
                    className={`w-[18px] h-[18px] shrink-0 ${
                      isActive ? "text-white" : "text-white/80"
                    }`}
                  />

                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="pt-4 mt-4 border-t border-white/10">
        <button
          type="button"
          onClick={handleLogout}
          className="
            w-full flex items-center gap-3
            px-4 py-3
            rounded-lg
            text-sm font-medium text-white/90
            hover:bg-white/10 hover:text-white
            transition-all duration-200
            cursor-pointer
          "
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;