"use client";

import { useParams, useRouter } from "next/navigation";
import { useBookings } from "../../reserve/page";
import "./confirmed.css";

export default function BookingConfirmedPage() {
  const { id } = useParams();
  const router = useRouter();
  const { bookings } = useBookings();

  // البحث عن الحجز الحالي حسب الـ ID
  const booking = bookings.find((b) => b.id.toString() === id);

  if (!booking) return <p>Booking not found.</p>;

  return (
    <div className="confirmed-container">
      {/* Header */}
      <header className="confirmed-header">
        <h2>AlgeriaTours</h2>
      </header>

      {/* Confirmation */}
      <section className="confirmation-box">
        <div className="check-circle">✓</div>
        <h1>Booking Confirmed!</h1>
        <p>Your booking has been successfully confirmed.</p>
        <span className="ref">Booking ID: #{booking.id}</span>
      </section>

      {/* Details */}
      <div className="details">
        <div className="card">
          <h3>Tour Details</h3>
          <p>📍 Location: {booking.location}</p>
          <p>📅 Date: {booking.date}</p>
          <p>⏰ Duration: {booking.duration}</p>
          <p>👤 Guide: {booking.guide}</p>
          <p> Emailguide : {booking.emailguide}</p>
          {booking.guests && <p>👥 Guests: {booking.guests}</p>}
          <p>💰 Price: ${booking.price}</p>
          <p>⭐ Rating: {booking.rating}</p>
          <p>Desc: {booking.desc}</p>
          <button className="btn-primary">Download Ticket</button>
          
        </div>

        <div className="location">
          <h3>Location</h3>
          <img className="gps" src={booking.locationgps} alt={booking.title} />
        </div>
      </div>

      {/* Footer */}
      <footer className="confirmed-footer">
        © 2024 Algeria Tours. All rights reserved.
      </footer>
    </div>
  );
}
