import React from "react";
import PaymentForm from "./components/PaymentForm";
import ReceiptPage from "./pages/ReceiptPage";
import PanPrompt from "./components/PanPrompt";
import DonationDashboard from "./pages/DonationDashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Routes>
          <Route path="/" element={<PaymentForm />} />
          <Route path="/receipt" element={<ReceiptPage />} />
          <Route path="/pancard" element={<PanPrompt />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/donations"
            element={
              <ProtectedRoute>
                <DonationDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
