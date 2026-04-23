import './globals.css'

export const metadata = {
  title: 'Mr Mallorca Golf Shot Tracker',
  description:
    'Mallorca-first golf tracker with custom hole maps, GPS shot tracking, round stats, handicap history, and strokes-gained-style feedback.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
