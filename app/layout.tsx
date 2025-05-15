import type React from "react"
import "./globals.css"
import { Manrope } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const manrope = Manrope({ subsets: ["latin"] })

export const metadata = {
  title: "SnovaTech - Solutions d'énergie solaire",
  description:
    "Découvrez votre potentiel solaire avec SnovaTech. Simulation gratuite et solutions sur mesure pour votre transition énergétique.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.png", sizes: "192x192" },
    ],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={manrope.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
