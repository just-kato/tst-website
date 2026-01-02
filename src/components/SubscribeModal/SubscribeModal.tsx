/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { LottiePlayer } from '@/components/LottiePlayer/LottiePlayer';
import toast from 'react-hot-toast';
import { toastyTidbitsAnimation } from '@/data/animations';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState(''); // honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter a valid email.');
      return;
    }
    setIsSubmitting(true);
    try {
      // **MODIFIED: Point to the new newsletter subscribe endpoint**
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: 'Newsletter Subscriber',
          honeypot: company?.trim() || '',
        }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong. Please try again.');
      }
      toast.success('Thanks for subscribing!');
      setIsSubmitted(true);
      // Close the modal automatically after a short delay
      setTimeout(() => {
        onClose();
        // Reset state for next time
        setIsSubmitted(false);
        setEmail('');
        setCompany('');
      }, 2500);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... (rest of the component remains the same)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex justify-center items-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="relative bg-tst-cream border-2 border-black rounded-lg shadow-brutalistLg w-full max-w-md p-8 text-center"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute p-2 text-xl font-bold hover:text-red-500 transition-colors z-10 "
              style={{ top: '12px', right: '12px' }}
            >
              &times;
            </button>

            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center h-48 mt-12">
                <h2 className="text-3xl font-extrabold mb-4">You&#39;re In!</h2>
                <p>
                  Thanks for subscribing. Keep an eye on your inbox for our next
                  newsletter.
                </p>
              </div>
            ) : (
              <div className="mt-12">
                <div className="flex flex-col items-center justify-center mb-6">
                  <div className="w-24 h-24">
                    <LottiePlayer
                      file={toastyTidbitsAnimation}
                      width={100}
                      height={100}
                      alt=""
                    />
                  </div>
                  <div className="w-32 -mt-2">
                    <h1 className="text-black font-black text-4xl md:text-4xl lg:text-5xl text-center leading-none -mt-2">
                      toasty
                      <br />
                      tidbits
                    </h1>
                  </div>
                </div>
                <h2 className="text-3xl font-extrabold mb-4">
                  Wait, did you get your free tools?
                </h2>
                <p className="text-lg mb-6">
                  Grab our 3 free guides for instant support. You&apos;ll also
                  be subscribed to our weekly newsletter and receive a new,
                  bonus therapy resource in your inbox each month.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Honeypot field (should remain empty) */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: '-10000px',
                      top: 'auto',
                      width: '1px',
                      height: '1px',
                      overflow: 'hidden',
                    }}
                  >
                    <label htmlFor="company">Company</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      tabIndex={-1}
                      autoComplete="off"
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                    />
                  </div>
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                  <Button
                    type="submit"
                    className="bg-tst-purple"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </form>
                <p className="text-xs text-gray-600 mt-4">
                  By submitting this form, you&apos;ll be signed up to my free
                  newsletter. You can opt-out at any time. For more information,
                  see our{' '}
                  <a href="/policy" className="underline">
                    privacy policy
                  </a>
                  .
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubscribeModal;
