import React from "react";
import PaymentForm from "./components/PaymentForm";
import ReceiptPage from "./components/ReceiptPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Routes>
          <Route path="/" element={<PaymentForm />} />
          <Route
            path="/receipt"
            element={
              sessionStorage.getItem("transaction_id") != null ? (
                <ReceiptPage />
              ) : (
                <PaymentForm />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
