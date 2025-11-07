import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Bespoke Ethos CRM',
  description: 'Customer Relationship Management Platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          {/* Navigation */}
          <nav className="bg-primary-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <Link href="/" className="text-xl font-bold">
                      Bespoke Ethos CRM
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-primary-100"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/customers"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-primary-100"
                    >
                      Customers
                    </Link>
                    <Link
                      href="/contacts"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-primary-100"
                    >
                      Contacts
                    </Link>
                    <Link
                      href="/deals"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-primary-100"
                    >
                      Deals
                    </Link>
                    <Link
                      href="/analytics"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-primary-100"
                    >
                      Analytics
                    </Link>
                    <Link
                      href="/sales-max"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded px-3 hover:from-yellow-300 hover:to-orange-300"
                    >
                      🚀 Sales Max
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-gray-800 text-white py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-sm">© 2024 Bespoke Ethos CRM. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
