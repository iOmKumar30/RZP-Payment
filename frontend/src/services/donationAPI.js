import axios from "axios";

// const API_BASE = "https://rzp-payment-backend.onrender.com/api/donations";
const API_BASE = "http://localhost:5000/api/donations";

export const fetchRecentDonations = () => axios.get(`${API_BASE}/recent`);

export const fetchFilteredDonations = (from, to) =>
  axios.get(`${API_BASE}`, {
    params: { from, to },
  });

export const downloadExcel = (from, to) => {
  const params = new URLSearchParams();
  if (from) params.append("from", from);
  if (to) params.append("to", to);
  const url = `${API_BASE}/download?${params.toString()}`;

  window.open(url, "_blank");
};

export const downloadAllExcel = () => {
  window.open(`${API_BASE}/download`, "_blank");
};

export const saveDonation = async (donationData) =>
  axios.post(API_BASE, donationData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
