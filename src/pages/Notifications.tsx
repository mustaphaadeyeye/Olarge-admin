import { Zap, FileText } from "lucide-react";

interface NotificationItem {
  id: string;
  type: "order" | "subscription";
  title: string;
  time: string;
  actionLabel: string;
}

const notifications: NotificationItem[] = [
  { id: "1", type: "order", title: "New order received", time: "15 minutes ago", actionLabel: "New Order" },
  { id: "2", type: "subscription", title: "Subscription expires in 7 days", time: "3 minutes ago", actionLabel: "Message" },
  { id: "3", type: "order", title: "New order received", time: "15 minutes ago", actionLabel: "New Order" },
  { id: "4", type: "order", title: "New order received", time: "15 minutes ago", actionLabel: "New Order" },
];

const Notifications = () => {
  return (
    <div className="bg-white rounded-lg border border-[#EEEEEE] shadow-[0_2px_8px_rgba(0,0,0,0.08)] px-5 py-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-[#2B2B2B]">Notifications</h2>
          <p className="text-xs text-[#9A9A9A] mt-0.5">Keep up to date with your activity</p>
        </div>

        <button
          type="button"
          className="text-xs font-medium text-[#2F7A3D] border border-[#2F7A3D]/30 rounded-full px-3 py-1 hover:bg-[#2F7A3D]/5 transition-colors cursor-pointer shrink-0"
        >
          See more
        </button>
      </div>

      {/* List */}
      <div className="space-y-2.5">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 bg-[#F4FAF5] rounded-lg px-3.5 py-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-7 h-7 rounded-full bg-[#2F7A3D] flex items-center justify-center shrink-0">
                {item.type === "order" ? (
                  <Zap size={13} className="text-white" fill="white" />
                ) : (
                  <FileText size={13} className="text-white" />
                )}
              </span>

              <div className="min-w-0">
                <p className="text-sm text-[#2B2B2B] font-medium truncate">
                  {item.title}
                </p>
                <p className="text-[11px] text-[#9A9A9A]">{item.time}</p>
              </div>
            </div>

            <button
              type="button"
              className={`text-xs font-medium rounded-full px-3 py-1.5 shrink-0 transition-colors cursor-pointer ${
                item.actionLabel === "Message"
                  ? "border border-[#D5D5D5] text-[#555] hover:bg-[#F5F5F5]"
                  : "bg-[#DCEFFF] text-[#1E6FBF] hover:bg-[#CCE6FF]"
              }`}
            >
              {item.actionLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;