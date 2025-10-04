// src/app/book/nd/page.tsx
import { Metadata } from 'next';
import Section from '@/components/Section/Section';
import ContactForm from '@/components/Contact/ContactForm';
import BookingPageHeader from '@/components/TwoStepBooking/BookingPageHeader';
import AdditionalContent from '../AdditionalContent';

export const metadata: Metadata = {
  title: 'Fit-or-Free Sessions',
  description:
    'Free 15-minute consultation designed specifically for neurodivergent adults. If your first session isn\'t a good fit, it\'s completely free. Get practical, sensory-aware coping strategies that work with your brain. Licensed therapist in Georgia.',
  keywords: [
    'neurodivergent therapy',
    'ADHD coping strategies',
    'autism therapy',
    'sensory-friendly therapy',
    'neurodivergent-affirming',
    'executive functioning support',
    'stimming-friendly therapy',
    'Atlanta neurodivergent therapist',
    'Georgia ADHD therapy',
    'free consultation',
  ],
  openGraph: {
    title: 'Fit-or-Free Sessions',
    description:
      'Practical, sensory-aware coping strategies designed for neurodivergent brains. Free 15-minute consultation with Georgia-licensed therapist, plus fit-or-free therapy sessions.',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/book/nd',
  },
};

export default function NeurodivergentBookingPage() {
  return (
    <div>
      <Section className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          <BookingPageHeader variant="nd" />
          <ContactForm variant="nd" />
        </div>
      </Section>

      {/* Additional content below the fold */}
      <AdditionalContent variant="nd" pageUrl="/book/nd" />
    </div>
  );
}
