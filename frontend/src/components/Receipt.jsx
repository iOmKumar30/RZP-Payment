import React from "react";
import success from "../assets/success.png";
import thanks from "../assets/thanks.png";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

const Receipt = React.forwardRef(({ paymentDetails }, ref) => {
  const downloadImage = () => {
    const receiptElement = document.getElementById("capture-wrapper");

    setTimeout(() => {
      html2canvas(receiptElement, {
        scale: 4, 
        useCORS: true,
        backgroundColor: "#ffffff",
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: [canvas.width, canvas.height],
        });

        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save("receipt.pdf");
      });
    }, 500);
  };

  return (
    <>
      <div
        id="capture-wrapper"
        className="p-6 bg-gray-100 flex justify-center items-center min-h-screen"
      >
        <div
          ref={ref}
          id="receipt"
          className="p-6 bg-white rounded-3xl shadow-2xl ring-4 ring-blue-200 w-full max-w-md text-gray-800 relative overflow-hidden font-sans tracking-wide leading-relaxed"
        >
          <div className="flex justify-center mb-4">
            <img src={success} alt="Payment Success" className="w-20 h-20" />
          </div>

          <h2 className="text-2xl font-extrabold text-center mb-6 text-green-600 tracking-wide">
            Payment Successful
          </h2>

          <div className="space-y-3 text-[15px]">
            <p>
              <span className="font-semibold">Payer Name:</span>{" "}
              {paymentDetails.name}
            </p>
            <p>
              <span className="font-semibold">Contact:</span>{" "}
              {paymentDetails.contact}
            </p>
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {paymentDetails.email}
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
              <span className="font-semibold">Reason:</span>{" "}
              {paymentDetails.reason}
            </p>
            <p>
              <span className="font-semibold">Payment Method:</span>{" "}
              {paymentDetails.method.toUpperCase()}
            </p>
            <p>
              <span className="font-semibold">Transaction ID:</span>{" "}
              {paymentDetails.transactionId}
            </p>
            <p>
              <span className="font-semibold">Date:</span> {paymentDetails.date}
            </p>
          </div>

          <div className="flex justify-center items-center mt-6 text-xs italic text-gray-500">
            <span className="mr-1">Thank you for your payment</span>
            <img src={thanks} alt="Thanks Icon" className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="text-center -mt-12">
        <button
          onClick={downloadImage}
          className="px-6 mb-3 py-3 cursor-pointer text-white font-semibold rounded-lg shadow bg-blue-600 hover:bg-blue-700 transition duration-200"
        >
          Download
        </button>
      </div>
    </>
  );
});

export default Receipt;
