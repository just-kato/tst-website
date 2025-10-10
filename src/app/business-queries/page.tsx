'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Confetti from 'react-confetti';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import { formatPhoneNumber } from '@/lib/validation';

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

const BusinessQueriesPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    queryType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { width, height } = useWindowSize();

  const queryOptions = [
    { value: '', label: 'Select query type' },
    { value: 'referrals', label: 'Referrals' },
    { value: 'collaboration', label: 'Collaboration Opportunities' },
    { value: 'consultation', label: 'Professional Consultation' },
    { value: 'training', label: 'Training/Workshop Inquiries' },
    { value: 'media', label: 'Media/Press Inquiries' },
    { value: 'other', label: 'Other Business Inquiry' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.queryType) {
      setError('Please select a query type');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Send business query email via API route
      const response = await fetch('/api/business-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email.toLowerCase(),
          phone: formData.phone,
          queryType: formData.queryType,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit business query');
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error('Business query submission error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPostSubmitContent = () => {
    return (
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-6">Thank You!</h2>
        <p className="text-lg mb-6">
          Your business inquiry has been submitted successfully. The TST Care Team will respond to your {formData.queryType} inquiry within 1-2 business days.
        </p>
        <p className="text-base text-gray-600">
          We appreciate your interest in working with Toasted Sesame Therapy.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-tst-cream py-16 px-4">
      <div className="relative bg-white p-12 rounded-xl border-2 border-black shadow-brutalistLg max-w-5xl mx-auto">
        {isSubmitted && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={500}
            tweenDuration={8000}
            style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
          />
        )}

        {isSubmitted ? (
          renderPostSubmitContent()
        ) : (
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              For Business Queries Only
            </h1>

            <div className="mb-8 p-4  rounded-lg">
              <p className="text-lg font-medium">
                For therapy, please{' '}
                <Link
                  href="/book/trauma"
                  className="underline text-tst-purple hover:text-tst-purple font-bold transition-colors"
                >
                  book a consultation here
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit}>
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

                <div className="text-left">
                  <label htmlFor="queryType" className="block text-lg font-bold mb-3">
                    Type of Business Query
                  </label>
                  <select
                    id="queryType"
                    name="queryType"
                    value={formData.queryType}
                    onChange={handleChange}
                    required
                    className="w-full p-4 text-lg border-2 border-black bg-white rounded-lg shadow-brutalistSm hover:bg-tst-purple hover:shadow-brutalist transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-tst-purple focus:border-tst-purple"
                  >
                    {queryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4">
                  <Button
                    type="submit"
                    className="bg-tst-yellow py-3"
                    wrapperClassName="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Business Query'}
                  </Button>
                </div>

                {error && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mt-4">
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessQueriesPage;
