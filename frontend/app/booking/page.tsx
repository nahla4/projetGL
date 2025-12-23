// hna la page d'un seule to"use client";

import { useRouter } from "next/navigation";
import { useBookings } from "./reserve/page";;
import "./bookings.css";

export default function MyBookings() {
  const router = useRouter();
  const { bookings } = useBookings();

  return (
    <div className="container">
      <h1>My Booking Requests</h1>

      <div className="booking-list">
        {bookings.length === 0 && <p>No bookings yet</p>}
        {bookings.map((b) => (
          <div className="booking-card" key={b.id}>
            <img src={b.image} alt={b.title} />
            <div className="booking-content">
              <span className={`badge ${b.status.toLowerCase()}`}>{b.status.toUpperCase()}</span>
              <h3>{b.title}</h3>
              <p>📅 {b.date}</p>
              <p>👤 Guide: {b.guide}</p>
              {b.guests && <p>👥 {b.guests} Guests</p>}

              <div className="actions">
                {/* زر الإلغاء ينقل فقط إلى صفحة CancelBooking */}
                {(b.status === "Pending" || b.status === "Accepted") && (
                  <button
                    className="btn-danger"
                    onClick={() => router.push(`/booking/cancel/${b.id}`)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
ur brk
