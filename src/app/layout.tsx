import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Made in Canada - Find Canadian Product Alternatives",
  description: "Discover high-quality Canadian-made alternatives to your everyday products. Support local businesses, reduce your carbon footprint, and create Canadian jobs.",
  openGraph: {
    title: "Made in Canada - Find Canadian Product Alternatives",
    description: "Discover high-quality Canadian-made alternatives to your everyday products. Support local businesses, reduce your carbon footprint, and create Canadian jobs.",
    url: "https://made-in-canada.vercel.app", // Replace with your actual domain
    siteName: "Made in Canada",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "/og-image.png", // You'll need to add this image to your public folder
        width: 1200,
        height: 630,
        alt: "Made in Canada Product Alternatives",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Made in Canada - Find Canadian Product Alternatives",
    description: "Discover high-quality Canadian-made alternatives to your everyday products.",
    images: ["/og-image.png"], // Same image as OpenGraph
  },
  // Additional metadata
  keywords: "Canadian products, made in Canada, local businesses, Canadian alternatives, sustainable shopping",
  authors: [{ name: "Your Name" }],
  creator: "Your Name or Company",
  themeColor: "#ef4444", // Matches your red theme
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
