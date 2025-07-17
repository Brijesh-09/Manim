// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthModalProvider } from "@/lib/AuthModalContext";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Promanim | Create Manim Videos with AI",
  icons: {
    icon: '/icons8.png',
  },
  description: "Create Manim Videos with AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthModalProvider>
          {children}
        </AuthModalProvider>
      </body>
    </html>
  );
}