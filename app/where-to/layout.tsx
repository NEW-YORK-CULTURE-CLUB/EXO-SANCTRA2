import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Where To Go - Exhibit IQ',
  description: 'Choose your destination in the Exhibit IQ platform',
}

export default function WhereToLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
