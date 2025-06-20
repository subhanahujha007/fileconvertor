
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./_Components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "File Convertor",
  description: "Its a File convertor application",
  creator: "Subhanshu Jha",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <Toaster position="bottom-right" />
          <div className="mx-auto pt-32 min-h-screen lg:pt-36 2xl:pt-44 container max-w-4xl lg:max-w-6xl 2xl:max-w-7xl">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
