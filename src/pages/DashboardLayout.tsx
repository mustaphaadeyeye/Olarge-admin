import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <Sidebar />
      <Topbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;