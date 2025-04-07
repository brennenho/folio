import { PostHogProvider } from "@/components/posthog";
import { ReactQueryClientProvider } from "@/components/react-query";
import { ClientToaster } from "@/components/ui/client-toaster";

import "@/styles/globals.css";

import { type Metadata } from "next";
import { Instrument_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "folio",
  description: "From Idea to Investment - Instantly",
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
    <ReactQueryClientProvider>
      <html lang="en" className={instrumentSans.className}>
        <body>
          <PostHogProvider>
            {children}
            <ClientToaster /> {/* Use the client-only wrapper */}
          </PostHogProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
