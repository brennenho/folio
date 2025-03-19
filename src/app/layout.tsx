import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import "@/styles/globals.css";

import { type Metadata } from "next";
import { Instrument_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Folio",
  description: "Retail Investing, Reimagined",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={instrumentSans.className}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
