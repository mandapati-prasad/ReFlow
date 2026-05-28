import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

import { AuthProvider } from "./context/AuthContext";
import { Login } from "./pages/Login/Login";
import { Layout } from "./components/Layout/Layout";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Returns } from "./pages/Returns/Returns";
import { CreateReturn } from "./pages/Returns/CreateReturn";
import { ReturnDetails } from "./pages/Returns/ReturnDetails";
import { Orders } from "./pages/Orders/Orders";
import { Refunds } from "./pages/Refunds/Refunds";
import { InspectionQueue } from "./pages/Inspection/InspectionQueue";
import { InspectionReport } from "./pages/Inspection/InspectionReport";
import { UserManagement } from "./pages/Admin/UserManagement";
import { Settings } from "./pages/Admin/Settings";
import { RefundProcessing } from "./pages/Refunds/RefundProcessing";
import { Register } from "./pages/Login/Register";
import { Profile } from "./pages/Profile/Profile";
import { OrderDetails } from "./pages/Orders/OrderDetails";
import { Notifications } from "./pages/Notifications/Notifications";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/returns/new" element={<CreateReturn />} />
            <Route path="/returns/:id" element={<ReturnDetails />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/refunds" element={<Refunds />} />
            <Route path="/refunds/:id" element={<RefundProcessing />} />
            <Route path="/inspection/new" element={<InspectionReport />} />
            <Route path="/inspection" element={<InspectionQueue />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>
        </Routes>
      </AuthProvider>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;
