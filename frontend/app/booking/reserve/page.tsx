"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Tour = {
  id: number;
  title: string;
  location: string;
  duration: string;
  price: number;
  rating: number;
  guide: string;
  emailguide: string;
  locationgps: string;
  image: string;
  desc: string;
};
export const toursData: Tour[] = [
  { id: 1, title: "Casbah Historical Walk", location: "Algiers", duration: "half-day", price: 3500, rating: 4.9, image: "/images/casbah.jpg", guide: "rayane", emailguide:"rayane@gmail.com", desc:"cccccccccccccccccccc", locationgps:"/image/gps.jpg" },
  { id: 2, title: "Sahara Adventure Trek", location: "Djanet", duration: "multi-day", price: 45000, rating: 4.5, image: "/images/sahara.jpg", guide: "mohamad", emailguide:"mohamed@gmail.com", desc:"bbbbbbbbbbbbbbbbbbb", locationgps:"/image/gps.jpg" },
  { id: 3, title: "Msila Tour", location: "M'Sila", duration: "one-day", price: 10000, rating: 4.2, image: "/images/msila.jpg", guide: "ahmad", emailguide:"ahmed@gmail.com", desc:"aaaaaaaaaaaaaaaaaaaa", locationgps:"/image/gps.jpg" },
];

export type Booking = Tour & {
  status: "Pending" | "Accepted" | "Rejected";
  date: string;
  guests?: number;
};

type BookingContextType = {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: number, reason?: string) => void;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const addBooking = (booking: Booking) => setBookings(prev => [...prev, booking]);
  const cancelBooking = (id: number, reason?: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "Rejected" } : b));
    if (reason) console.log(`Booking ${id} canceled due to: ${reason}`);
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, cancelBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBookings must be used within BookingProvider");
  return context;
};
