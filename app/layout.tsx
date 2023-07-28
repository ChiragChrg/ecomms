import './globals.css'
import type { Metadata } from 'next'
import { Noto_Sans } from "next/font/google"
import Provider from '@Providers/Provider'

export const NotoSans = Noto_Sans({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NextMart | Your Ultimate Shopping Destination!',
  description: 'Discover an unparalleled shopping experience with Next Mart, an exceptional web app developed by ChiragChrg. Unleash the power of online shopping with a vast array of products at your fingertips',
  creator: "ChiragChrg",
  authors: [{ name: 'ChiragChrg', url: 'https://chiragchrg.netlify.app/' }],
  verification: { google: "TSsuy8j81zZ0Ge0aestKiwZUPydASWd9aANj-ITDack" },
  applicationName: "Next Mart",
  manifest: "/manifest.json",
  keywords: ['Next Mart', 'next-mart', 'nextmart', 'chiragchrg', 'ChiragChrg', 'chiruchirag2001', 'ecommerce', 'shopping', 'next.js'],
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#050505' },
  ],
  icons: {
    icon: '/icons/192.png',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-baseClr text-textClr min-h-screen">
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  )
}
