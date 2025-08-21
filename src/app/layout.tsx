import type { Metadata } from "next";
import Fonts from "@/assets/font";
import Providers from "@/providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Amara",
  description:
    "Amara streamlines the hiring process for HR teams, making it easy to find, evaluate, and recruit top talent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${Fonts} bg-background font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
