"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/providers"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Subscription } from "@/components/subcription"
import { usePathname } from "next/navigation"
import { PAGE_URL } from "./auth/page"


const inter = Inter({ subsets: ["latin"] })

interface RootLayoutProps {
  children: React.ReactNode
}



export const AuthLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  const pathname = usePathname()
  const isAuthPage = pathname === PAGE_URL

  if (isAuthPage) {
    return (
      <AuthLayout>{children}</AuthLayout>
    )
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
          <Navigation />
          <Subscription />
        </Providers>
      </body>
    </html>
  )
}
