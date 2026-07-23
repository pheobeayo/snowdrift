import type { Metadata } from "next";
import { headers } from "next/headers";
import { Syne, DM_Sans, DM_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ReownProvider } from "@/context/ReownProvider";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Snowdrift Protocol — Ecosystem Contribution & Agile Escrow Hub",
  description:
    "Dual-engine talent platform on Avalanche: milestone escrows for freelance work, and automated bounty payouts plus dependency streaming for open source.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookies = (await headers()).get("cookie");

  return (
    <html lang="en" className="dark">
      <body
        className={`${syne.variable} ${dmSans.variable} ${dmMono.variable} antialiased`}
      >
        <ReownProvider cookies={cookies}>{children}</ReownProvider>
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "var(--surface-3)",
              border: "1px solid var(--line-3)",
              color: "var(--text-1)",
            },
          }}
        />
      </body>
    </html>
  );
}
