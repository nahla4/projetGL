'use client';

import { ThemeProvider } from "next-themes";
import Navigation from "./Navigation";
import { ReactNode } from "react";

export default function RootLayoutClient({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Navigation />
      <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
        {children}
      </div>
    </ThemeProvider>
  );
}
