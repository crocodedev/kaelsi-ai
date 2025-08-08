import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/providers"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
          <Navigation />
        </Providers>
      </body>
    </html>
  )
}
