interface SettingsTabsProps {
  active: string;
  onChange: (tab: string) => void;
}

const TABS = [
  "Profile",
  "Store Information",
  "Bank Details",
  "Login & Security",
  "Subscription and Billing",
];

const SettingsTabs = ({ active, onChange }: SettingsTabsProps) => {
  return (
    <div className="flex items-center gap-8 border-b border-[#EEEEEE] mb-6 overflow-x-auto">
      {TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`
            relative whitespace-nowrap
            text-sm pb-3 pt-1
            transition-colors cursor-pointer
            ${active === tab ? "text-[#2B2B2B] font-medium" : "text-[#9A9A9A] hover:text-[#555]"}
          `}
        >
          {tab}
          {active === tab && (
            <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#2F7A3D] rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
};

export default SettingsTabs;