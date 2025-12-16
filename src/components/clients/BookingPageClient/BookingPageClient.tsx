// src/app/book/BookingPageClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useMutation } from '@apollo/client/react';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import LeadCalendar from '@/components/LeadCalendar/LeadCalendar';
import { MapPinCheckInside, Brain, Heart, CheckCircle } from 'lucide-react';
import { CREATE_BOOKING_CONTACT, CREATE_LEAD_WITH_APPOINTMENT } from '@/lib/graphql/mutations';

interface BookingPageProps {
  variant: 'nd' | 'affirming' | 'trauma';
}

const useWindowSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
};

const getVariantContent = (variant: BookingPageProps['variant']) => {
  switch (variant) {
    case 'nd':
      return {
        headline: 'Neurodivergent‑Friendly Free Grounding Plan Session',
        description:
          'Designed specifically for neurodivergent adults who need practical, sensory-aware coping strategies that actually work with your brain.',
        icon: <Brain className="w-6 h-6" />,
        color: 'bg-purple-100 border-purple-300 text-purple-800',
      };
    case 'affirming':
      return {
        headline: 'LGBTQIA‑Affirming Free Grounding Plan Session',
        description:
          'A safe space where your identity is celebrated and your mental health strategies honor who you are.',
        icon: <Heart className="w-6 h-6" />,
        color: 'bg-pink-100 border-pink-300 text-pink-800',
      };
    case 'trauma':
      return {
        headline: 'Free Grounding Plan Session for Georgia Adults',
        description:
          'Trauma-informed approaches that help you feel safe and grounded, even when life feels overwhelming.',
        icon: <MapPinCheckInside className="w-6 h-6" />,
        color: 'bg-blue-100 border-blue-300 text-blue-800',
      };
  }
};

const BookingPageClient: React.FC<BookingPageProps> = ({ variant }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contactExists, setContactExists] = useState(false);
  const [contactId, setContactId] = useState<string>('');
  const [hasConsented, setHasConsented] = useState(false);
  const { width, height } = useWindowSize();

  // GraphQL mutations
  const [createBookingContact] = useMutation(CREATE_BOOKING_CONTACT);
  const [createLeadWithAppointment] = useMutation(CREATE_LEAD_WITH_APPOINTMENT);

  const variantContent = getVariantContent(variant);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
    if (contactExists) setContactExists(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasConsented) {
      setError('Please consent to being contacted to continue.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setContactExists(false);

    try {
      // Use GraphQL mutation to create booking contact
      const { data } = await createBookingContact({
        variables: {
          name: formData.name,
          email: formData.email.toLowerCase(),
          phone: formData.phone,
          source: variant,
          pageUrl: window.location.pathname,
        },
      });

      if (!(data as any)?.createContact) {
        throw new Error('Failed to create contact');
      }

      const newContact = (data as any).createContact;

      // Track the lead generation
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'generate_lead_booking_page',
        page_source: variant,
        form_location: window.location.pathname,
        form_type: 'booking',
      });

      setContactId(newContact.id);
      setShowCalendar(true);
    } catch (err: any) {
      console.error('Booking contact submission error:', err);

      // Handle duplicate contact GraphQL error
      if (err.message && err.message.includes('already exists')) {
        setContactExists(true);
        setContactId(err.contactId || ''); // This may need adjustment based on GraphQL error structure
        setShowCalendar(true);
        return;
      }

      // Handle other GraphQL errors
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        const firstError = err.graphQLErrors[0];
        if (firstError.message.includes('already exists')) {
          setContactExists(true);
          setShowCalendar(true);
          return;
        }
        setError(firstError.message);
      } else if (err.networkError) {
        setError('Network error. Please check your connection and try again.');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppointmentScheduled = async (dateTime: Date) => {
    try {
      // Use GraphQL mutation to schedule appointment
      const { data } = await createLeadWithAppointment({
        variables: {
          name: formData.name,
          email: formData.email.toLowerCase(),
          phone: formData.phone,
          appointmentDateTime: dateTime.toISOString(),
          timeZone: 'America/New_York', // EST/EDT
          segments: [`${variant} Booking Lead`],
          notes: `Grounding plan session booked from ${variant} page`,
          triggerSMSWorkflow: true,
        },
      });

      if (!(data as any)?.createLeadWithAppointment) {
        throw new Error('Failed to schedule appointment');
      }

      setIsBooked(true);

      // Track successful booking
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'booking_completed',
        event_id: crypto.randomUUID(),
        form_name: 'Grounding Plan Session',
        lead_source: `booking_${variant}`,
        contact_id: contactId,
        appointment_iso: dateTime.toISOString(),
        session_type: 'grounding_plan',
      });
    } catch (error: any) {
      console.error('Failed to schedule appointment:', error);

      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const firstError = error.graphQLErrors[0];
        setError(firstError.message || 'Failed to schedule appointment. Please try again.');
      } else if (error.networkError) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Failed to schedule appointment. Please try again.');
      }
      throw error;
    }
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:hello@example.com?subject=${encodeURIComponent(
      'Follow-up on My Grounding Plan Session'
    )}&body=${encodeURIComponent(
      "Hi Kay,\n\nI've connected with you before and would like to follow up regarding my grounding plan session.\n\nMy details are:\n• Name: " +
        formData.name +
        '\n• Phone: ' +
        formData.phone +
        '\n• Email: ' +
        formData.email +
        '\n• Preferred availability:\n\nThank you, and I look forward to hearing from you.\n\nBest,\n' +
        formData.name
    )}`;
  };

  const renderContactExistsMessage = () => {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 text-center max-w-2xl mx-auto">
        <div className="text-4xl mb-4">👋</div>
        <h3 className="text-2xl font-bold mb-4 text-yellow-800">
          Welcome back!
        </h3>
        <p className="text-lg text-yellow-700 mb-6">
          Great to see you again! Let&apos;s get your grounding plan session
          scheduled.
        </p>
        <div className="space-y-4">
          <Button
            onClick={handleEmailClick}
            className="bg-tst-purple text-black"
          >
            Contact Us Directly
          </Button>
          <p className="text-sm text-yellow-600">
            Or continue below to schedule your session
          </p>
        </div>
      </div>
    );
  };

  const renderSuccessMessage = () => {
    return (
      <div className="text-center max-w-2xl mx-auto space-y-8">
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          tweenDuration={8000}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
        />

        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-8">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-4 text-green-800">
            Session Confirmed!
          </h2>
          <p className="text-lg text-green-700 mb-6">
            Your free grounding plan session is scheduled. You&apos;ll receive a
            confirmation email with all the details shortly.
          </p>

          <div className="bg-white rounded-lg p-6 border border-green-200">
            <h3 className="text-xl font-semibold mb-4">What to expect:</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>
                  We&apos;ll identify your specific triggers and stress patterns
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>
                  You&apos;ll learn 3 personalized grounding techniques
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Leave with a custom plan you can use immediately</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isBooked) {
    return (
      <div className="relative bg-white p-12 rounded-xl border-2 border-black shadow-brutalistLg max-w-5xl mx-auto">
        {renderSuccessMessage()}
      </div>
    );
  }

  if (showCalendar) {
    return (
      <div className="relative bg-white p-8 rounded-xl border-2 border-black shadow-brutalistLg max-w-5xl mx-auto">
        {contactExists && (
          <div className="mb-8">{renderContactExistsMessage()}</div>
        )}

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Choose Your Session Time</h2>
          <p className="text-lg text-gray-600">
            Select a time that works best for your free grounding plan session
          </p>
        </div>

        <LeadCalendar
          contactId={contactId}
          contactName={formData.name}
          contactEmail={formData.email}
          onSchedule={handleAppointmentScheduled}
        />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 ${variantContent.color}`}
        >
          {variantContent.icon}
          <span className="font-medium">Free Session</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          {variantContent.headline}
        </h1>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Leave with a 3‑step routine tailored to your triggers. Openings in 48
          hours.
        </p>

        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          {variantContent.description}
        </p>
      </div>

      {/* Trust Strip */}
      {/* <div className="bg-gray-50  p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <MapPinCheckInside className="w-5 h-5 text-tst-purple" />
            <span className="font-medium">Licensed in Georgia</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Video className="w-5 h-5 text-tst-purple" />
            <span className="font-medium">Secure Telehealth</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 text-tst-purple" />
            <span className="font-medium">15-Minute Sessions</span>
          </div>
        </div>
      </div> */}

      {/* Booking Form */}
      <div className="relative bg-white p-12 rounded-xl border-2 border-black shadow-brutalistLg max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Book Your Free Session</h2>
          <p className="text-lg text-gray-600">
            Just a few details to get started
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* Consent Checkbox */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <input
                type="checkbox"
                id="consent"
                checked={hasConsented}
                onChange={e => setHasConsented(e.target.checked)}
                className="mt-1 w-4 h-4 text-tst-purple border-gray-300 rounded focus:ring-tst-purple"
                required
              />
              <label htmlFor="consent" className="text-sm text-gray-700">
                I consent to SMS/email for scheduling and care coordination.
                Reply STOP to opt out. I understand this is not a commitment to
                ongoing therapy services.
              </label>
            </div>

            <Button
              type="submit"
              className="bg-tst-yellow py-4 text-lg font-bold"
              wrapperClassName="w-full"
              disabled={isSubmitting || !hasConsented}
            >
              {isSubmitting ? 'Processing...' : 'Schedule My Free Session →'}
            </Button>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Questions? Email us at{' '}
            <a
              href="mailto:care@toastedsesametherapy.com"
              className="font-medium text-tst-purple hover:underline"
            >
              care@toastedsesametherapy.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingPageClient;
