import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Irrigation Builder",
  description: "Design and installation planning for irrigation systems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100">
        {children}
      </body>
    </html>
  );
}
