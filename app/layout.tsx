import "./globals.css"
import "../styles/anti-save.css"
import "../styles/i18n.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SettingsProvider } from "@/contexts/settings-context"
import { AuthProvider } from "@/contexts/auth-context"
import { GalleryProvider } from "@/contexts/gallery-context"
import { AppLayout } from "@/components/app-layout"
import DemoPopup from "@/components/demo-popup"
import type React from "react"
import { Metadata } from "next"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { Toaster } from "@/components/ui/toaster"
import { ConditionalAppLayout } from "@/components/conditional-app-layout"
import { AntiSaveProvider } from "@/components/anti-save-provider"
import { I18nProvider } from "@/lib/i18n"
import HtmlLang from "@/components/html-lang"
import WhatsAppFloat from "@/components/whatsapp-float"
import { Web3ProviderWrapper } from "@/components/web3-provider-wrapper"

const inter = Inter({ subsets: ["latin"] })

// export const metadata = {
//   title: "ExhibitIQ Operating System",
//   description: "A DATA-DRIVEN, OPERATING SYSTEM FOR THE MODERN GALLERY.",
//     generator: 'v0.dev'
// }

export const metadata: Metadata = {
  title: "EXSA - Exo Sanctra | Interdimensional Art Sanctuary",
  description: "EXSA is a living interdimensional sanctuary where art, technology, and soul-expression merge into a unified phygital universe. A space for self-discovery, mysticism, and interaction for souls who feel alien to society.",
  icons: {
    icon: "/favicon.ico", // or .png/.svg
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "EXSA - Exo Sanctra | Interdimensional Art Sanctuary",
    description: "EXSA is a living interdimensional sanctuary where art, technology, and soul-expression merge into a unified phygital universe. A space for self-discovery, mysticism, and interaction for souls who feel alien to society.",
    url: "https://exsa.com",
    siteName: "EXSA - Exo Sanctra",
    images: [
      {
        url: "/og-image.png", // relative or full URL
        width: 1200,
        height: 630,
        alt: "EXSA - Exo Sanctra | Interdimensional Art Sanctuary",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EXSA - Exo Sanctra | Interdimensional Art Sanctuary",
    description: "EXSA is a living interdimensional sanctuary where art, technology, and soul-expression merge into a unified phygital universe. A space for self-discovery, mysticism, and interaction for souls who feel alien to society.",
    images: ["/twitter-image.png"], // same image can be reused
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning className="dark">
      <body className={inter.className}>
        <I18nProvider>
          <HtmlLang />
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
            <Web3ProviderWrapper>
              <AntiSaveProvider>
                <AuthProvider>
                  <GalleryProvider>
                    <SettingsProvider>
                      <TooltipProvider delayDuration={0}>
                        <ConditionalAppLayout>
                          {children}
                        </ConditionalAppLayout>
                        {/* <DemoPopup /> */}
                        {/* <WhatsAppFloat phoneNumber="08141225457" /> */}
                        <SonnerToaster />
                        <Toaster />
                      </TooltipProvider>
                    </SettingsProvider>
                  </GalleryProvider>
                </AuthProvider>
              </AntiSaveProvider>
            </Web3ProviderWrapper>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
