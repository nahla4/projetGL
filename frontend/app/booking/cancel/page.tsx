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
      alert("يرجى اختيار سبب الإلغاء.");
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
        <h2>Cancel Booking Request</h2>
        <p>This action cannot be undone.</p>

        <div className="reason-list">
          <label>
            <input type="radio" name="reason" value="Change of plans" checked={selectedReason === "Change of plans"} onChange={e => setSelectedReason(e.target.value)} />
            Change of plans
          </label>
          <label>
            <input type="radio" name="reason" value="Found another tour" checked={selectedReason === "Found another tour"} onChange={e => setSelectedReason(e.target.value)} />
            Found another tour
          </label>
          <label>
            <input type="radio" name="reason" value="Personal reasons" checked={selectedReason === "Personal reasons"} onChange={e => setSelectedReason(e.target.value)} />
            Personal reasons
          </label>
          <label>
            <input type="radio" name="reason" value="Other" checked={selectedReason === "Other"} onChange={e => setSelectedReason(e.target.value)} />
            Other
          </label>
        </div>

        <div className="modal-actions">
          <button className="btn-danger" onClick={handleConfirm}>
            Confirm Cancellation
          </button>
          <button className="btn-primary" onClick={handleKeep}>
            Keep Booking
          </button>
        </div>
      </div>
    </div>
  );
}

