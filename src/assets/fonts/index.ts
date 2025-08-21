import { Inter, Playfair_Display, Roboto_Mono } from "next/font/google";

const fontSans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const fontSerif = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

const fontMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

const Fonts = `${fontSans.variable} ${fontSerif.variable} ${fontMono.variable}`;

export default Fonts;
