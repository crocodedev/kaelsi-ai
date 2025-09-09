"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/providers"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Subscription } from "@/components/subcription"
import { usePathname } from "next/navigation"
import { AuthModal } from "@/components/modals/auth"


const inter = Inter({ subsets: ["latin"] })

type RootLayoutProps = {
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
  const AUTH_PAGE_URL = '/auth'
  const isAuthPage = pathname === AUTH_PAGE_URL

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
          <AuthModal />
        </Providers>
      </body>
    </html>
  )
}
