import "./globals.css";
import { BookingProvider } from "./booking/reserve/page";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BookingProvider>
          {children}
        </BookingProvider>
      </body>
    </html>
  );
}
