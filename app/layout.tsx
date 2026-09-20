import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '2027 카운트다운',
  description: '2027년까지 남은 시간을 확인하세요.',
  icons: {
    icon: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}