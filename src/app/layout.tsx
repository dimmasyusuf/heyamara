import Fonts from "@/assets/font";
import { getSEOTags } from "@/lib/seo";
import Providers from "@/providers";
import "@/styles/globals.css";
import "@/styles/globals.scss";

export const metadata = getSEOTags();

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
