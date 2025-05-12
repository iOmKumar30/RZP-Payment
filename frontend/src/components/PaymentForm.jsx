import React, { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./PaymentForm.css"; // Custom CSS for animations
import { loadRazorpay } from "../utils/loadRazorpay";
import axios from "axios";
import Receipt from "./Receipt";
import { useNavigate } from "react-router-dom";

const PaymentForm = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const receiptRef = useRef();
  const [tId, settId] = useState("");
  const [paymentDone, setPaymentDone] = useState(false);
  const navigate = useNavigate();
  const handlePayment = async () => {
    const res = await loadRazorpay(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // Create order from backend
    const result = await axios.post(
      "https://rzp-payment-backend.onrender.com/api/payment/create-order",
      {
        amount: parseFloat(amount), // assuming amount is a float string
      }
    );

    const { amount: orderAmount, id: order_id, currency } = result.data;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // use VITE_ prefix in .env
      amount: orderAmount.toString(),
      currency,
      name: name,
      description: reason,
      order_id,
      handler: function (response) {
        console.log("Payment successful:", response);

        const details = {
          name,
          contact,
          email,
          address,
          amount,
          reason,
          method: selectedMethod,
          transactionId: response.razorpay_payment_id,
          date: new Date().toLocaleString(),
        };
        settId(response.razorpay_payment_id);
        setPaymentDone(true);
        // clear form data after successful payment
        setName("");
        setAddress("");
        setAmount("");
        setReason("");
        setSelectedMethod("");
        setContact("");
        setEmail("");
        navigate("/receipt", { state: details });
        // store the transaction id in the session storage
        sessionStorage.setItem("transaction_id", response.razorpay_payment_id);
        toast.success("Payment successful! Receipt Generated...");
      },

      prefill: {
        name,
        email,
        contact,
      },
      notes: {
        address,
      },
      theme: {
        color: "#3399cc",
      },
      method: {
        netbanking: selectedMethod === "netbanking",
        card: selectedMethod === "card",
        upi: selectedMethod === "upi",
        wallet: selectedMethod === "wallet",
        paylater: selectedMethod === "paylater",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNaN(parseFloat(amount))) {
      toast.error("Amount must be a valid number");
      return;
    }

    setIsLoading(true);

    try {
      await handlePayment();
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-slideUp bg-gradient-to-br from-white via-gray-100 to-white shadow-xl rounded-2xl max-w-2xl mx-auto p-8 mt-16 border border-blue-100">
      <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
        ✨ Send a Payment
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payer's Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              placeholder="9876543210"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              placeholder="john@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              placeholder="123 Street, City"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount (₹)
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              placeholder="1000.00"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              PAY VIA
            </label>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md"
            >
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="netbanking">Netbanking</option>
              <option value="wallet">Wallet</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Reason
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            placeholder="e.g., Rent, Gift, etc."
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`transition-all w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center
      ${
        isLoading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 shadow-md"
      }`}
        >
          {isLoading ? (
            <FaSpinner className="animate-spin h-5 w-5" />
          ) : (
            "Send Payment"
          )}
        </button>
      </form>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default PaymentForm;
