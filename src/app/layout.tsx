import type { Metadata } from "next";
import localFont from "next/font/local";
import { headers } from 'next/headers'
import { ThemeProvider } from "@/components/theme-provider"
import { HydrateBranch } from "@/components/HydrateBranch";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Inkognito - Spy on your neighbors",
  description: "Browse and share anonymous confessions near you",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers()
  const nonce = headersList.get('x-nonce') || ''

  return (
    <html lang="en">
      <head>
        <meta name="csp-nonce" content={nonce} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HydrateBranch nonce={nonce} />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
