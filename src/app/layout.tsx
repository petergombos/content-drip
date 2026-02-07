import type { Metadata } from "next";
import "./globals.css";
import { Inter, Lora } from "next/font/google";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "ContentDrip",
    template: "%s — ContentDrip",
  },
  description: "Thoughtful content, delivered at your pace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontSerif.variable}`}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
