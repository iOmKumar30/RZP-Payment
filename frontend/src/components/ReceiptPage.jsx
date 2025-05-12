// ReceiptPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Receipt from "./Receipt";

const ReceiptPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    navigate("/"); // redirect if accessed directly
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">
        🧾 Payment Receipt
      </h2>
      <Receipt paymentDetails={state} />
    </div>
  );
};

export default ReceiptPage;
