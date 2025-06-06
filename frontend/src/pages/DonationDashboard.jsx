import React, { useEffect, useState } from "react";
import DonationTable from "../components/DonationTable";
import {
  fetchRecentDonations,
  fetchFilteredDonations,
  downloadExcel,
  downloadAllExcel,
} from "../services/donationAPI";

const DonationDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const getRecent = async () => {
    const res = await fetchRecentDonations();
    setDonations(res.data);
  };

  const applyFilter = async () => {
    if (!from && !to) return getRecent();
    const res = await fetchFilteredDonations(from, to);
    setDonations(res.data);
  };

  useEffect(() => {
    getRecent();
  }, []);

  return (
    <div className="min-h-screen pt-6 px-4 w-full mx-auto bg-gray-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center flex-grow text-gray-800">
          🧾 Donation Records
        </h1>
        <button
          onClick={() => {
            localStorage.removeItem("relf_admin");
            window.location.href = "/admin/login";
          }}
          className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-center mb-6">
        <div>
          <label className="block text-sm font-medium">From:</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">To:</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div className="pt-4.5">
          <button
            onClick={applyFilter}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Apply Filter
          </button>
        </div>
        <div className="pt-4.5">
          <button
            onClick={() => downloadExcel(from, to)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Download Filtered
          </button>
        </div>
        <div className="pt-4.5">
          <button
            onClick={downloadAllExcel}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Download All
          </button>
        </div>
      </div>
      <div className="overflow-x-auto animate-slideUp">
        <DonationTable donations={donations} />
      </div>
    </div>
  );
};

export default DonationDashboard;
