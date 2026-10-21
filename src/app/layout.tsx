import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marathi-mhani-sangrah.org';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF6EF' },
    { media: '(prefers-color-scheme: dark)', color: '#0E121E' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'मराठी म्हणी संग्रह — १,००० अस्सल म्हणींचा डिजिटल खजिना | Marathi Mhani Sangrah',
    template: '%s | मराठी म्हणी संग्रह',
  },
  description:
    'मराठी संस्कृतीचा अनमोल ठेवा, १,००० प्रमाणित मराठी म्हणी, त्यांचे सोपे अर्थ, दैनंदिन व्यवहारातील उदाहरणे आणि सविस्तर संदर्भ — जगासाठी खुला डिजिटल संग्रह.',
  keywords: [
    'मराठी म्हणी',
    'Marathi Mhani',
    'मराठी म्हणी व अर्थ',
    'Marathi Proverbs with meaning',
    '१००० मराठी म्हणी संग्रह',
    'मराठी संस्कृती',
    'Devanagari Proverbs',
    'Marathi Wisdom',
    'आजची म्हण',
  ],
  authors: [{ name: 'मराठी म्हणी संपादन मंडळ' }],
  creator: 'मराठी म्हणी संग्रह',
  publisher: 'मराठी म्हणी संग्रह',
  openGraph: {
    type: 'website',
    locale: 'mr_IN',
    url: siteUrl,
    siteName: 'मराठी म्हणी संग्रह (Marathi Mhani Sangrah)',
    title: 'मराठी म्हणी संग्रह — १,००० अस्सल मराठी म्हणी, अर्थ व उदाहरणे',
    description:
      'मराठी संस्कृतीचा अनमोल ठेवा, जगासाठी खुला. १,००० प्रमाणित म्हणींचा समृद्ध व मोफत डिजिटल संग्रह.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'मराठी म्हणी संग्रह — Marathi Mhani Sangrah',
    description:
      'A living digital library of Marathi wisdom, language, culture, and everyday knowledge.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mr" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('marathi_theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-ivory-50 text-ink-900 antialiased selection:bg-saffron-200 selection:text-saffron-900">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
