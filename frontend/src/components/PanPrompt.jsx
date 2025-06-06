import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { saveDonation } from "../services/donationAPI";
const PanPrompt = () => {
  const { state: paymentDetails } = useLocation();
  const navigate = useNavigate();
  const [pan, setPan] = useState("");

  if (!paymentDetails) {
    // if someone lands here directly
    navigate("/");
    return null;
  }

  const handleSubmit = async () => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

    if (!panRegex.test(pan)) {
      toast.error("Invalid PAN number. Please enter a valid one.");
      return;
    }

    // if PAN is valid, proceed to receipt generation
    const detailsWithPan = { ...paymentDetails, pan };
    try {
      await saveDonation(detailsWithPan);
      console.log("Donation saved successfully to DB");
    } catch (err) {
      console.error("Error saving donation:", err);
      toast.error("Error saving donation to database!");
    }
    navigate("/receipt", { state: detailsWithPan });
  };

  const handleSkip = async () => {
    try {
      await saveDonation(paymentDetails);
      console.log("Donation saved successfully to DB");
    } catch (err) {
      console.error("Error saving donation:", err);
      toast.error("Error saving donation to database!");
    }
    toast.info("You skipped downloading the receipt.");
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Enter PAN to Generate Receipt
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          PAN is required for tax acknowledgment. You may skip if not
          applicable.
        </p>

        <input
          type="text"
          maxLength="10"
          value={pan}
          onChange={(e) => setPan(e.target.value.toUpperCase())}
          placeholder="ABCDE1234F"
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleSubmit}
          className="w-full mb-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Generate Receipt
        </button>

        <button
          onClick={handleSkip}
          className="w-full py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
        >
          Skip & Exit
        </button>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default PanPrompt;
