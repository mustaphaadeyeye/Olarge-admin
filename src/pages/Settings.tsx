import { useState } from "react";
import Wrapper from "../components/Wrapper";
import SettingsTabs from "./SettingsTabs";
import ProfileView from "./ProfileView";
import ProfileEdit from "./ProfileEdit";
import BankDetails from "./BankDetails";
import LoginSecurity from "./LoginSecurity";
import SubscriptionBillingTab from "./SubscriptionBillingTab";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  const [profileEditing, setProfileEditing] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setProfileEditing(false);
  };

  return (
    <Wrapper>
      <section className="w-full">
        <SettingsTabs active={activeTab} onChange={handleTabChange} />

        {activeTab === "Profile" &&
          (profileEditing ? (
            <ProfileEdit
              onCancel={() => setProfileEditing(false)}
              onSave={() => setProfileEditing(false)}
            />
          ) : (
            <ProfileView onEdit={() => setProfileEditing(true)} />
          ))}

        {activeTab === "Store Information" && (
          <ProfileEdit onCancel={() => {}} onSave={() => {}} />
        )}

        {activeTab === "Bank Details" && <BankDetails />}

        {activeTab === "Login & Security" && <LoginSecurity />}

        {activeTab === "Subscription and Billing" && <SubscriptionBillingTab />}
      </section>
    </Wrapper>
  );
};

export default Settings;