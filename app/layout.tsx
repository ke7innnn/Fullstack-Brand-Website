import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import SessionWrapper from '../components/SessionWrapper'
import { CartProvider } from '../context/CartContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-orbitron" });

export const metadata: Metadata = {
  title: 'LXRY | Clothing Brand',
  description: 'Premium fashion for the modern era',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${orbitron.variable} font-sans bg-[#0A0A0A] text-white selection:bg-white selection:text-black antialiased`}>
        <SessionWrapper>
          <CartProvider>
            {children}
          </CartProvider>
        </SessionWrapper>
      </body>
    </html>
  )
}
