import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Providers } from "./providers/theme-provider";
import "./globals.css";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TechHire",
  description: "Your tech hiring platform",
  metadataBase: new URL("https://techhire.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-black dark:bg-[#070B14] dark:text-white transition-colors duration-300">
        <Providers>
          {children}

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "transparent",
                boxShadow: "none",
                pointerEvents: "auto",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
