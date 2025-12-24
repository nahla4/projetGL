"use client";

import { useRouter, useParams } from "next/navigation";
import { useBookings } from "../../reserve/page";
import { useState } from "react";
import "./cancel.css";


export default function CancelBooking() {
  const router = useRouter();
  const params = useParams();
  const { cancelBooking } = useBookings();

  const bookingId = Number(params.id);
  const [selectedReason, setSelectedReason] = useState<string>("");

  const handleConfirm = () => {
    if (!selectedReason) {
      alert("Please select a reason for cancellation.");
      return;
    }
    cancelBooking(bookingId, selectedReason);
    router.push("/booking"); // العودة لصفحة MyBookings
  };

  const handleKeep = () => {
    router.back();
  };

  return (
    <div className="modal-container">
      <div className="modal">
        <h2 className="titlec">Cancel Booking Request</h2>
        <p className="descriptionc">This action cannot be undone.</p>

        <div className="reason-list">
          <label className="sectionLabel">
            <input type="radio" name="reason" value="Change of plans" checked={selectedReason === "Change of plans"} onChange={e => setSelectedReason(e.target.value)} />
            Change of plans
          </label>
          <label className="sectionLabel">
            <input type="radio" name="reason" value="Found another tour" checked={selectedReason === "Found another tour"} onChange={e => setSelectedReason(e.target.value)} />
            Found another tour
          </label>
          <label className="sectionLabel">
            <input type="radio" name="reason" value="Personal reasons" checked={selectedReason === "Personal reasons"} onChange={e => setSelectedReason(e.target.value)} />
            Personal reasons
          </label>
          <label className="sectionLabel">
            <input type="radio" name="reason" value="Other" checked={selectedReason === "Other"} onChange={e => setSelectedReason(e.target.value)} />
            Other
          </label>
        </div>

        <div className="modal-actions">
          <button className="cancelBtn" onClick={handleConfirm}>
            Confirm Cancellation
          </button>
          <button className="keepBtn" onClick={handleKeep}>
            Keep Booking
          </button>
        </div>
      </div>
    </div>
  );
}
