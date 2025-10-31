import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blockchain Network",
  description: "Blockchain Network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}