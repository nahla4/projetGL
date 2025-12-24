"use client";

import { useRouter } from "next/navigation";
import { useBookings } from "./reserve/page";

import "./bookings.css";


export default function MyBookings() {
  const router = useRouter();
  const { bookings } = useBookings();

   const renderActions = (status: string, id: number) => {
  const bookingId = id.toString();

  switch (status) {
    case "Pending":
      return (
        <button
          className="btn-danger"
          onClick={() => router.push(`/booking/cancel/${bookingId}`)}
        >
          Cancel
        </button>
      );

    case "Accepted":
    case "Confirmed":
      return (
        <>
          <button
            className="btn-success"
            onClick={() =>
              router.push(`/booking/confirmed/${bookingId}`)
            }
          >
            View Booking
          </button>

          <button
            className="btn-danger"
            onClick={() =>
              router.push(`/booking/cancel/${bookingId}`)
            }
          >
            Cancel
          </button>
        </>
      );

    default:
      return null;
  }
};


  return (
    <div className="container">
      <div className="cont-book">
      <h1 className="titleb">My Booking Requests</h1>

      <div className="booking-list">
        {bookings.length === 0 && <p>No bookings yet</p>}

        {bookings.map((b) => (
          <div className="booking-card" key={b.id}>
            <img src={b.image} alt={b.title} />

            <div className="booking-content">
              <span className={`badge ${b.status.toLowerCase()}`}>
                {b.status.toUpperCase()}
              </span>

              <h3>{b.title}</h3>
              <p>📅 {b.date}</p>
              <p>👤 Guide: {b.guide}</p>
              {b.guests && <p>👥 {b.guests} Guests</p>}

              <div className="actions">
                {renderActions(b.status, b.id)}
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
