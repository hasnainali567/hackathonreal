import { Figtree, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});


export const metadata = {
  title: "Hackathon",
  description: "Hackathon project",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${figtree.variable} ${figtree.className} h-full antialiased `}
    >
      <body
        suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
