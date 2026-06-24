import { ThemeProvider } from "@/utils/Theme-provider";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Josefin_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Provider";
import CustomProvider from "@/Components/CustomProvider";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});
const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning  className={`${poppins.variable} ${josefin.variable} bg-white bg-no-repeat dark:bg-linear-to-b dark:from-gray-900 dark:to-black duration-300 h-full`}>
          <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem={false} storageKey="lms-theme">
        <Providers>
            <CustomProvider>
              {children}
            </CustomProvider>
            <Toaster position="top-center" reverseOrder={false} />
        </Providers>
          </ThemeProvider>
      </body>
    </html>
  );
}