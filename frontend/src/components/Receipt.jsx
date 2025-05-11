import React from "react";
import success from "../assets/success.png";
import thanks from "../assets/thanks.png";
const Receipt = React.forwardRef(({ paymentDetails }, ref) => {
  return (
    <div
      ref={ref}
      className="p-6 bg-white rounded-2xl shadow-xl w-full max-w-md text-gray-800 relative overflow-hidden"
    >
      <div className="flex justify-center mb-4">
        <img src={success} alt="Payment Success" className="w-20 h-20" />
      </div>

      <h2 className="text-2xl font-extrabold text-center mb-6 text-green-600">
        Payment Successful
      </h2>

      <div className="space-y-3 text-sm">
        <p>
          <span className="font-semibold">Recipient Name:</span>{" "}
          {paymentDetails.name}
        </p>
        <p>
          <span className="font-semibold">Contact:</span>{" "}
          {paymentDetails.contact}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {paymentDetails.email}
        </p>
        <p>
          <span className="font-semibold">Address:</span>{" "}
          {paymentDetails.address}
        </p>
        <p>
          <span className="font-semibold">Amount:</span> ₹
          {paymentDetails.amount}
        </p>
        <p>
          <span className="font-semibold">Reason:</span> {paymentDetails.reason}
        </p>
        <p>
          <span className="font-semibold">Payment Method:</span>{" "}
          {paymentDetails.method}
        </p>
        <p>
          <span className="font-semibold">Transaction ID:</span>{" "}
          {paymentDetails.transactionId}
        </p>
        <p>
          <span className="font-semibold">Date:</span> {paymentDetails.date}
        </p>
      </div>

      <p className="text-center mt-6 text-xs italic text-gray-500">
        Thank you for your payment
        <img src={thanks} alt="Thanks Icon" className="w-4 h-4 inline-block" />
      </p>
    </div>
  );
});

export default Receipt;
