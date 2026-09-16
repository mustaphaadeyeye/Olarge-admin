import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Wallet,
  Star,
  Bell,
  CreditCard,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Product", icon: ShoppingBag, path: "/product" },
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
}

const Sidebar = ({
  userName = "Ope",
  avatarUrl,
  onLogout,
}: SidebarProps) => {
  return (
    <aside
      className="
        fixed left-0 top-0 z-40
        h-screen w-60
        flex flex-col
        px-4 py-6
        overflow-hidden
      "
      style={{ backgroundColor: "#2F7A3D" }}
    >
      {/* Logo */}
      <div className="flex items-center justify-center mb-10">
        <div className="flex items-start">
          <h1 className="text-white text-2xl font-bold tracking-tight">
            Olage
          </h1>
          <span className="text-white text-xs -mt-1">°</span>
        </div>
      </div>

      {/* Profile */}
      <div className="flex flex-col items-center mb-9">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 bg-white/10 shadow-sm">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-xl font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <p className="mt-3 text-white text-sm font-medium">
          Hello {userName}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="space-y-1">
          {navItems.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
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
          onClick={onLogout}
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
  );
};

export default Sidebar;