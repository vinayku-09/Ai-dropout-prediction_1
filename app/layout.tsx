import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { Providers } from '@/components/ui/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EduEWS - AI-Powered Early Warning System',
  description: 'AI-based dropout prediction and counseling system for educational institutions',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
