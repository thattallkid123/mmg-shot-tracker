import './globals.css'

export const metadata = {
  title: 'Strokes Gained — Mr Mallorca Golf',
  description:
    'Mallorca-first golf tracker with custom hole maps, GPS shot tracking, round stats, handicap history, and strokes-gained-style feedback.',
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
