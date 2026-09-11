import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/providers/query-provider";
import {
  ScreenReaderAnnouncer,
  SkipToContent,
} from "@/components/accessibility";
import { Toaster } from "sonner";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DHARITRI - Digital Hub for Land Acquisition Intelligence",
  description:
    "DHARITRI brings land records, GIS intelligence, and verified government data together to support infrastructure, housing, industry and public services — for a better, more inclusive tomorrow.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${inter.variable} ${instrumentSans.variable} ${instrumentSerif.variable} h-full antialiased font-sans`}
      >
        <body className="min-h-full flex flex-col bg-paper text-text font-sans selection:bg-emerald-200 selection:text-ink">
          <SkipToContent />
          <ScreenReaderAnnouncer />
          <QueryProvider>{children}</QueryProvider>
          <Toaster
            richColors
            position="top-right"
            closeButton
            toastOptions={{
              className: "font-sans text-sm rounded-xl shadow-lg border border-paper-line",
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
