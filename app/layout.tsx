import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gridline Houston | Data center map',
  description: 'A transparent map of data centers and compute infrastructure across Greater Houston.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
