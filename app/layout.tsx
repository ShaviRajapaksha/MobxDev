import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "App Builder — visual mobile app design",
  description: "Drag-and-drop no-code mobile app builder with Flutter export",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
