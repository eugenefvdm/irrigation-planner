import type { Metadata } from "next";
import "./globals.css";
import "driver.js/dist/driver.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Irrigation Builder",
  description: "Design and installation planning for irrigation systems",
};

const themeScript = `
(function() {
  try {
    var s = JSON.parse(localStorage.getItem('irrigation-theme') || '{}');
    var t = s.state && s.state.theme ? s.state.theme : 'system';
    var dark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
  } catch (_) {
    document.documentElement.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
