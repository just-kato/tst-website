import type { Metadata, Viewport } from 'next';
import { Work_Sans } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav/Nav';
import Footer from '@/components/Footer/Footer';
import { Analytics } from '@vercel/analytics/next';
import CookieConsent from '@/components/CookieConsent/CookieConsent';
import Script from 'next/script';
import ConditionalLayout from '@/components/ConditionalLayout/ConditionalLayout';
import ToasterClient from '@/components/clients/ToasterClient/ToasterClient';
import { SpeedInsights } from '@vercel/speed-insights/next';
import ApolloProviderWrapper from '@/lib/apollo/client';
import { NavigationProvider } from '@/contexts/NavigationContext';
import NavigationLoadingIndicator from '@/components/NavigationLoadingIndicator/NavigationLoadingIndicator';

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title:
    'Toasted Sesame Therapy | Compassionate, Personalized Therapy in Georgia',
  description:
    'A therapy space for the deep feelers, drained hearts, and healing seekers. Neuro-affirming and trauma-informed online therapy for adults in Georgia.',
  keywords: [
    // Location-based keywords
    'online therapy Georgia',
    'virtual therapy Atlanta',
    'teletherapy Georgia',
    'therapist Atlanta',
    'mental health counseling Georgia',

    // Service-based keywords
    'anxiety therapy',
    'trauma therapy',
    'ADHD support',
    'depression counseling',
    'LGBTQIA therapy',
    'neurodivergent therapy',

    // Approach-based keywords
    'neuro-affirming therapist',
    'trauma-informed counseling',
    'identity-affirming therapy',
    'highly sensitive person therapy',
    'emotional regulation therapy',

    // Specialty keywords
    'queer therapy',
    'trans-affirming therapy',
    'complex trauma therapy',
    'fit-or-free sessions'
  ].join(', '),
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};
export const viewport: Viewport = {
  themeColor: '#F9F5F2',
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Define your schema objects here
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Toasted Sesame Therapy',
    url: 'https://toastedsesametherapy.com', // Remember to replace this with your actual domain
  };

  const medicalBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    '@id': 'https://toastedsesametherapy.com/#medicalbusiness',
    name: 'Toasted Sesame Therapy',
    alternateName: 'TST',
    description: 'Neuro-affirming and trauma-informed online therapy for adults in Georgia. Specializing in anxiety, trauma, ADHD support, and highly sensitive person therapy.',
    url: 'https://toastedsesametherapy.com',
    logo: 'https://pvbdrbaquwivhylsmagn.supabase.co/storage/v1/object/public/tst-assets/logo/TST-LOGO-WHITE.svg',
    image: 'https://toastedsesametherapy.com/assets/hero-image.png',
    telephone: '+1-XXX-XXX-XXXX', // Add actual phone number
    email: 'care@toastedsesametherapy.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Atlanta',
      addressRegion: 'GA',
      addressCountry: 'US',
      postalCode: '30309', // Add actual postal code
    },
    areaServed: {
      '@type': 'State',
      name: 'Georgia',
    },
    priceRange: '$$',
    paymentAccepted: ['Cash', 'Credit Card', 'Insurance'],
    currenciesAccepted: 'USD',
    openingHours: 'Mo-Fr 09:00-17:00',
    serviceType: [
      'Individual Therapy',
      'Anxiety Treatment',
      'Trauma Therapy',
      'ADHD Support',
      'Neurodivergent Therapy'
    ],
    medicalSpecialty: 'Psychiatry',
    availableService: [
      {
        '@type': 'MedicalTherapy',
        name: 'Individual Therapy',
        description: 'One-on-one therapy sessions for adults'
      },
      {
        '@type': 'MedicalTherapy',
        name: 'Trauma Therapy',
        description: 'Trauma-informed therapy approaches'
      },
      {
        '@type': 'MedicalTherapy',
        name: 'Anxiety Treatment',
        description: 'Evidence-based anxiety treatment'
      }
    ]
  };

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://toastedsesametherapy.com/#therapist',
    name: 'Kay',
    jobTitle: 'Licensed Professional Counselor',
    worksFor: {
      '@id': 'https://toastedsesametherapy.com/#medicalbusiness'
    },
    url: 'https://toastedsesametherapy.com/about',
    image: 'https://pvbdrbaquwivhylsmagn.supabase.co/storage/v1/object/public/tst-assets/website%20assets/MYT-v3.png', // Add actual photo
    email: 'care@toastedsesametherapy.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Atlanta',
      addressRegion: 'GA',
      addressCountry: 'US',
    },
    alumniOf: 'University Name', // Add actual education
    knowsAbout: [
      'Trauma Therapy',
      'Anxiety Treatment',
      'ADHD Support',
      'Neurodivergent-Affirming Therapy',
      'LGBTQIA-Affirming Therapy',
      'Highly Sensitive Person Support'
    ],
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Professional License',
      name: 'Licensed Professional Counselor',
      recognizedBy: {
        '@type': 'Organization',
        name: 'Georgia Board of Professional Counselors'
      }
    }
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://toastedsesametherapy.com/#organization',
    name: 'Toasted Sesame Therapy',
    url: 'https://toastedsesametherapy.com',
    logo: 'https://pvbdrbaquwivhylsmagn.supabase.co/storage/v1/object/public/tst-assets/logo/TST-LOGO-WHITE.svg',
    sameAs: [
      // Add social media profiles when available
      // 'https://www.facebook.com/toastedsesametherapy',
      // 'https://www.instagram.com/toastedsesametherapy',
      // 'https://www.linkedin.com/company/toasted-sesame-therapy'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-XXX-XXX-XXXX', // Add actual phone
      contactType: 'Customer Service',
      email: 'care@toastedsesametherapy.com',
      availableLanguage: 'English'
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#F9F5F2" />

        {/* connection hints first */}
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://www.google-analytics.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://www.clarity.ms"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(medicalBusinessSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        <Script
          id="gtm-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id=GTM-N6VXX6CK'+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-N6VXX6CK');
      `,
          }}
        />
      </head>
      <body
        className={`${workSans.className} bg-tst-cream text-black antialiased`}
      >
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-black text-white p-4 z-50 focus:z-[9999]"
          style={{ clipPath: 'none' }}
        >
          Skip to main content
        </a>

        <NavigationProvider>
          <ApolloProviderWrapper>
            <ToasterClient />
            <NavigationLoadingIndicator />

            <ConditionalLayout>
              <Nav />
              <main id="main-content" tabIndex={-1}>
                {children}
                <Analytics />
                <SpeedInsights />
              </main>
              <Footer />
            </ConditionalLayout>
          </ApolloProviderWrapper>
        </NavigationProvider>

        <CookieConsent />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N6VXX6CK"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
          <Script id="microsoft-clarity-init" strategy="afterInteractive">
            {`
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
  `}
          </Script>
        )}
      </body>
    </html>
  );
}
