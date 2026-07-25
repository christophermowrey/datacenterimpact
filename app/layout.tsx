import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://datacenterimpact.app'),
  title: 'Data Center Impact | Houston data center map',
  description: 'A transparent map of data centers and neighborhood impacts across Greater Houston.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
