// Update src/components/Contact/ContactForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import { formatPhoneNumber } from '@/lib/validation';

interface ContactFormProps {
  isContactPage?: boolean;
  id?: string;
  variant?: 'trauma' | 'contact' | 'nd' | 'affirming';
  maxHeight?: string;
  header?: string;
  subheader?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ isContactPage = false, variant = 'contact', maxHeight, header, subheader }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contactExists, setContactExists] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const formattedValue = formatPhoneNumber(value);
      if (formattedValue === 'INVALID_COUNTRY_CODE') {
        setError('Only US phone numbers are supported. Please remove international country codes except +1.');
        return;
      }
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error when user starts typing
    if (error) setError(null);
    if (contactExists) setContactExists(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError(null);
    setContactExists(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          phone: formData.phone.trim(),
          variant: variant,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409 && data.contactExists) {
          setContactExists(true);
          setError(data.error);
          return;
        }
        throw new Error(data.error || 'Failed to submit contact form');
      }

      // Track the lead generation
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'generate_lead_form_start',
          page_source: variant === 'trauma' ? 'trauma_booking' : variant === 'nd' ? 'nd_booking' : variant === 'affirming' ? 'affirming_booking' : (isContactPage ? 'contact' : 'homepage'),
          form_location: window.location.pathname,
          form_type: variant === 'trauma' ? 'trauma_booking' : variant === 'nd' ? 'nd_booking' : variant === 'affirming' ? 'affirming_booking' : (isContactPage ? 'contact' : 'homepage'),
          variant: variant,
        });
      }

      // Redirect to thank you page
      router.push('/success-thank-you');
    } catch (err: any) {
      console.error('Contact form submission error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailClick = () => {
    if (typeof window !== 'undefined') {
      window.location.href = `mailto:hello@example.com?subject=${encodeURIComponent(
        'Follow-up on My Therapy Inquiry'
      )}&body=${encodeURIComponent(
        `Hi Kay,\n\nI've connected with you before and would like to follow up regarding scheduling or questions I have about starting therapy.\n\nMy details are:\n• Name:\n• Best contact number:\n• Preferred availability:\n• What I am interested in working on in therapy:\n• My budget:\n• My location (city/state):\n\nThank you, and I look forward to hearing from you.\n\nBest,\n[Your Name]`
      )}`;
    }
  };
  const getVariantContent = () => {
    switch (variant) {
      case 'trauma':
        return {
          header: `Let's connect`,
          subheader: 'I’ll reach out personally to schedule your consult, and support you through the first step.'
        };
      case 'nd':
        return {
          header: `Let's connect`,
          subheader: 'I’ll reach out to help you get started, and keep the process simple and clear.'
        };
      case 'affirming':
        return {
          header: 'Ready for affirming therapy?',
          subheader: 'Connect with LGBTQIA+ affirming therapy that celebrates you'
        };
      case 'contact':
      default:
        return {
          header: `Let's connect`,
          subheader: 'Connect with compassionate, personalized care'
        };
    }
  };
  const renderContactExistsMessage = () => {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 text-center">
        <div className="text-4xl mb-4">👋</div>
        <h3 className="text-2xl font-bold mb-4 text-yellow-800">
          We&apos;ve connected before!
        </h3>
        <p className="text-lg text-yellow-700 mb-6">
          It looks like we already have your information in our system. For
          personalized assistance with scheduling or any questions, please reach
          out directly.
        </p>
        <div className="space-y-4">
          <Button
            onClick={handleEmailClick}
            className=" bg-tst-purple text-black"
          >
            Contact Us
          </Button>

          <p className="text-sm text-yellow-600">
            We&apos;ll get back to you within 1 business day
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className={`relative max-w-5xl mx-auto bg-white p-12 rounded-xl border-2 border-black shadow-brutalistLg ${maxHeight ? `max-h-${maxHeight}` : ''}`}>
      {contactExists ? (
        renderContactExistsMessage()
      ) : (
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold ">
              {header !== undefined ? header : getVariantContent().header}
            </h2>
            <p className="mb-10">{subheader !== undefined ? subheader : getVariantContent().subheader}</p>

          <form id="contact-form" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-8">
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mt-4">
                <Button
                  type="submit"
                  className="bg-tst-yellow py-3"
                  wrapperClassName="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Submit'}
                </Button>
              </div>
              {error && !contactExists && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mt-4">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ContactForm;
