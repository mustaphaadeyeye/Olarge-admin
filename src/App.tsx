import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./pages/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import AddProduct from "./pages/AddProduct";
import Categories from "./pages/Categories";
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
    <AuthProvider>
      <Routes>
        {/* Public / Auth routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/register/business" element={<RegisterFlow />} />

        {/* Protected Dashboard routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/product" element={<ProductList />} />
            <Route path="/product/add" element={<AddProduct />} />
            <Route path="/product/edit/:id" element={<AddProduct />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/earnings" element={<Sales />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/subscriptions/current" element={<CurrentSubscription />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/orders" element={<OrderHistory />} />
          </Route>
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;