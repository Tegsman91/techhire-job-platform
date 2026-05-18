import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast"; 
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
      className={`${inter.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
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
      </body>
    </html>
  );
}
