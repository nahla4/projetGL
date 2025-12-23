"use client";

import { useState } from "react";
import "./tours.css";

type Tour = {
  id: number;
  title: string;
  location: string;
  duration: string;
  price: number;
  rating: number;
  guide: string;
  image: string;
  desc: string
};

const toursData: Tour[] = [
  { id: 1, title: "Casbah Historical Walk", location: "Algiers", duration: "half-day", price: 3500, rating: 4.9, image: "/images/casbah.jpg", guide: "rayane",desc:"cccccccccccccccccccc" },
  { id: 2, title: "Sahara Adventure Trek", location: "Djanet", duration: "multi-day", price: 45000, rating: 4.5, image: "/images/sahara.jpg", guide: "mohamad", desc:"bbbbbbbbbbbbbbbbbbb" },
  { id: 3, title: "Msila Tour", location: "M'Sila", duration: "one-day", price: 10000, rating: 4.2, image: "/images/msila.jpg", guide: "ahmad",desc:"aaaaaaaaaaaaaaaaaaaa" },
];

const algerianStates = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar",
  "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers",
  "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma",
  "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh",
  "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued",
  "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa",
  "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès", "In Salah",
  "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa"
];

export default function ExploreTours() {
  const [selectedState, setSelectedState] = useState<string>(""); // ولاية مختارة
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string[]>([]);
  const [selectedTourId, setSelectedTourId] = useState<number | null>(null); // الرحلة المختارة للتفاصيل

  const [filteredTours, setFilteredTours] = useState<Tour[]>(toursData);
  const handleDetails = (id: number) => {
    setSelectedTourId(selectedTourId === id ? null : id); // toggle التفاصيل
  };

  const handleBooking = (tour: Tour) => {
    alert(`the booking request is sent: ${tour.title} with guide ${tour.guide}`);
  };
  const handleDurationChange = (value: string) => {
    setSelectedDuration((prev) =>
      prev.includes(value)
        ? prev.filter((d) => d !== value)
        : [...prev, value]
    );
  };

  const applyFilters = () => {
    let result = toursData;

    if (selectedState) {
      result = result.filter((tour) => tour.location === selectedState);
    }

    if (maxPrice !== null) {
      result = result.filter((tour) => tour.price <= maxPrice);
    }

    if (selectedDuration.length > 0) {
      result = result.filter((tour) =>
        selectedDuration.includes(tour.duration)
      );
    }

    setFilteredTours(result);
  };

  return (
    <div className="explore-container">
      <aside className="filters">
        <h1>Filters</h1>

        <h2>Location</h2>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
        >
          <option value="">All Wilayas</option>
          {algerianStates.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>

        <h2>Max Price</h2>
        <input
          type="number"
          placeholder="Enter max price"
          value={maxPrice ?? ""}
          onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
        />

        <h2>Duration</h2>
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              checked={selectedDuration.includes("multi-day")}
              onChange={() => handleDurationChange("multi-day")}
            />
            Multi-day
          </label>

          <label>
            <input
              type="checkbox"
              checked={selectedDuration.includes("one-day")}
              onChange={() => handleDurationChange("one-day")}
            />
            One day
          </label>

          <label>
            <input
              type="checkbox"
              checked={selectedDuration.includes("half-day")}
              onChange={() => handleDurationChange("half-day")}
            />
            Half day
          </label>
        </div>

        <button className="apply-btn" onClick={applyFilters}>
          Apply Filters
        </button>
      </aside>

      <main className="tours">
        <h1>Explore Tours in Algeria</h1>

        <div className="tour-grid">
          {filteredTours.length === 0 && <p>No tours found</p>}

          {filteredTours.map((tour) => (
            <div className="tour-card" key={tour.id}>
              <img src={tour.image} alt={tour.title} />
              <span className="badge">{tour.guide}</span>

              <h3>{tour.title}</h3>
              <p>{tour.location} • {tour.duration}</p>

              <div className="card-footer">
                <span className="price">{tour.price} DZD</span>
                <span className="rating">⭐ {tour.rating}</span>
              </div>

               <button className="details-btn" onClick={() => handleDetails(tour.id)}>
                {selectedTourId === tour.id ? "Hide Details" : "Details"}
              </button>

              {selectedTourId === tour.id && (
                <div className="tour-details">
                  <p><strong>Guide:</strong> {tour.guide}</p>
                  <p><strong>Location:</strong> {tour.location}</p>
                  <p><strong>Duration:</strong> {tour.duration}</p>
                  <p><strong>Price:</strong> {tour.price} DZD</p>
                  <p><strong>Rating:</strong> ⭐ {tour.rating}</p>
                  <p><strong>Descreption:</strong> {tour.desc}</p>
                  <button className="booking-btn" onClick={() => handleBooking(tour)}>
                    Book Now
                  </button>
                  </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
//annuaire des tours : liste + filtre par wilaya (API /api/tours, /api/cities)//
