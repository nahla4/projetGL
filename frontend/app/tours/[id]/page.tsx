"use client";
import { useParams, useRouter } from "next/navigation";
import { toursData, Tour, useBookings } from "../../booking/reserve/page"; // تأكدي من المسار
import "../../booking/confirmed/[id]/confirmed.css";

export default function TourDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const { addBooking } = useBookings(); // ✅ يجب استدعاؤه داخل الكومبوننت

  const tour: Tour | undefined = toursData.find((t: Tour) => t.id.toString() === id);

  if (!tour) return <p>Tour not found.</p>;

  // ✅ handleBooking داخل الكومبوننت
  const handleBooking = () => {
    addBooking({
      ...tour,
      status: "Pending",
      date: new Date().toLocaleDateString(),
      guests: 1,
    });
    alert(`Booking request sent: ${tour.title}`);
  };

  return (
    <div className="confirmed-container">
      <header className="confirmed-header">
        <h2>Tour Details</h2>
      </header>

      <section className="confirmation-box">
        <h1>{tour.title}</h1>
        <span className="ref">Tour ID: #{tour.id}</span>
      </section>

      <div className="details">
        <div className="card">
          <h3>Tour Information</h3>
          <p>📍 Location: {tour.location}</p>
          <p>⏰ Duration: {tour.duration}</p>
          <p>👤 Guide: {tour.guide}</p>
          <p>Email Guide: {tour.emailguide}</p>
          <p>💰 Price: {tour.price} DZD</p>
          <p>⭐ Rating: {tour.rating}</p>
          <p>Description: {tour.desc}</p>

          <button className="btn-primary" onClick={handleBooking}>
            Book Now
          </button>

          <button
            className="btn-primary"
            onClick={() => router.push("/booking")}
          >
            My Bookings
          </button>
        </div>

        <div className="location">
          <h3>Location</h3>
          <img className="gps" src={tour.locationgps} alt={tour.title} />
        </div>
      </div>

      <footer className="confirmed-footer">
        © 2024 Algeria Tours. All rights reserved.
      </footer>
    </div>
  );
}
