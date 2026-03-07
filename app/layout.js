import Header from "@/components/header";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark, shadesOfPurple } from "@clerk/themes";
import { Toaster } from "@/components/ui/sonner";

import { Poppins } from "next/font/google";

export const metadata = {
  title: "Synkronia",
  description: "Where Events and Communities Connect",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={` ${poppins.className} bg-linear-to-br from-gray-950 via-zinc-900 to-stone-900 text-white `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider
            appearance={{
              theme: dark,
            }}
          >
            <ConvexClientProvider>
              {/* header */}
              <Header />

              <main className="relative min-h-screen pt-20 md:pt-20">
                {/* glow */}

                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                  <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 min-h-[70vh]"> {children}</div>
                {/* footer  */}
               
                <Toaster richColors />
              </main>
            </ConvexClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
