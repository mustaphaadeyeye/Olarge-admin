import Wrapper from "../components/Wrapper";
import {
  Zap,
  FileText,
  Truck,
  CreditCard,
  AlertTriangle,
  RefreshCw,
  Sprout,
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const notifications: NotificationItem[] = [
  { id: "1", title: "New Order Received", description: "You have received a new order for 10kg of Rice. Please process it within 24 hours.", icon: Zap },
  { id: "2", title: "Subscription expires in 7 days", description: "Renew your subscription payment now.", icon: FileText },
  { id: "3", title: "Order Shipped", description: "Order #ORD-1025 has been successfully shipped and is on its way to the customer.", icon: Truck },
  { id: "4", title: "Payment Received", description: "Payment of ₦25,000 has been successfully received for Order #ORD-1025.", icon: CreditCard },
  { id: "5", title: "Order Delivered", description: "Order #ORD-1025 has been delivered successfully.", icon: Zap },
  { id: "6", title: "Low Stock Alert", description: "Your Rice stock is running low. Only 5 units remaining.", icon: AlertTriangle },
  { id: "7", title: "Order Delivered", description: "Order #ORD-1025 has been delivered successfully.", icon: Zap },
  { id: "8", title: "Subscription Renewed", description: "Your seller subscription has been successfully renewed.", icon: RefreshCw },
  { id: "9", title: "Order Delivered", description: "Order #ORD-1025 has been delivered successfully.", icon: Zap },
  { id: "10", title: "Welcome to Olage Nigeria Limited", description: "Thank you for joining our agricultural marketplace.", icon: Sprout },
];

const NotificationsPage = () => {
  return (
    <Wrapper>
      <section className="w-full">
        <h1 className="text-xl font-semibold text-[#2B2B2B] mb-5">Notifications</h1>

        <div className="space-y-2">
          {notifications.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex items-start gap-3.5 bg-[#F4FAF5] rounded-lg px-4 py-3.5"
              >
                <span className="w-7 h-7 rounded-full bg-[#2F7A3D] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={13} className="text-white" />
                </span>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#2B2B2B]">{item.title}</p>
                  <p className="text-xs text-[#8A8A8A] mt-0.5">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </Wrapper>
  );
};

export default NotificationsPage;