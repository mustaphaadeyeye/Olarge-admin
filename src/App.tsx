import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import AddProduct from "./pages/AddProduct";
import Reviews from "./pages/Reviews";
import Sales from "./pages/Sales";
import NotificationsPage from "./pages/NotificationsPage";
import Subscriptions from "./pages/Subscriptions";
import CurrentSubscription from "./pages/CurrentSubscription";
import Settings from "./pages/Settings";


// import Orders from "./pages/Orders";

const App = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <Sidebar />

      <Topbar />

      <main className="">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/product" element={<ProductList />} />
           <Route path="/product/add" element={<AddProduct />} />
          <Route path="/product/edit/:id" element={<AddProduct />} />
          <Route path="/earnings" element={<Sales />} />
<Route path="/reviews" element={<Reviews />} />
<Route path="/notifications" element={<NotificationsPage />} />
<Route path="/subscriptions" element={<Subscriptions />} />
<Route path="/subscriptions/current" element={<CurrentSubscription />} />
<Route path="/settings" element={<Settings/>}/>
        </Routes>
      </main>
    </div>
  );
};

export default App;