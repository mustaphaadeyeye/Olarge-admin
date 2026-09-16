import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./pages/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import AddProduct from "./pages/AddProduct";
import Reviews from "./pages/Reviews";
import Sales from "./pages/Sales";
import NotificationsPage from "./pages/NotificationsPage";
import Subscriptions from "./pages/Subscriptions";
import CurrentSubscription from "./pages/CurrentSubscription";
import Settings from "./pages/Settings";
import OrderHistory from "./pages/OrderHistory";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import RegisterFlow from "./pages/RegisterFlow";

const App = () => {
  return (
    <Routes>
      {/* Auth routes — no sidebar/topbar, shown first */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/register/business" element={<RegisterFlow />} />

      {/* Dashboard routes — wrapped in Sidebar + Topbar */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/product" element={<ProductList />} />
        <Route path="/product/add" element={<AddProduct />} />
        <Route path="/product/edit/:id" element={<AddProduct />} />
        <Route path="/earnings" element={<Sales />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/subscriptions/current" element={<CurrentSubscription />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/orders" element={<OrderHistory />} />
      </Route>
    </Routes>
  );
};

export default App;