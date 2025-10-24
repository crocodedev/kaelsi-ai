"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/providers"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Subscription } from "@/components/subcription"
import { usePathname } from "next/navigation"
import { AuthModal } from "@/components/modals/auth"
import { useAuth } from "@/hooks/useAuth"
import { useEffect } from "react"
import { prefetchEssentialData } from "@/lib/utils/data-prefetch"
import { useScreenOrientation } from "@/hooks/useScreenOrientation"


const inter = Inter({ subsets: ["latin"] })

type RootLayoutProps = {
  children: React.ReactNode
}

export const AuthLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthWrapper>{children}</AuthWrapper>
        </Providers>
      </body>
    </html>
  )
}

const AuthWrapper = ({children}: {children: React.ReactNode}) => {
  useScreenOrientation();
  
  return <>{children}</>
}

let isPrefetched = false;

const Wrapper = ({children}: {children: React.ReactNode}) => {
  const { isAuthenticated } = useAuth();
  
  useScreenOrientation();
  
  useEffect(() => {
    if (!isPrefetched && isAuthenticated) {
      prefetchEssentialData();
      isPrefetched = true;
    }
  }, [isAuthenticated]);

  return <>
    {children}
  </>
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
          <Wrapper>
            <Header />
            {children}
            <Navigation />
            <Subscription />
            <AuthModal />
          </Wrapper>
        </Providers>
      </body>
    </html>
  )
}
