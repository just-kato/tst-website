'use client';

import React, { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import Section from '@/components/Section/Section';
import Button from '@/components/Button/Button';
import { CheckCircle, Calendar, Clock, Mail } from 'lucide-react';
import Link from 'next/link';
import Confetti from 'react-confetti';

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

export default function ThankYouPage() {
  const { width, height } = useWindowSize();
  return (
    <Section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={500}
        tweenDuration={8000}
        style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
      />
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-xl border-2 border-black shadow-brutalistLg overflow-hidden text-center">
          {/* Header */}
          <div className="p-8 border-b-2 border-black bg-tst-purple">
            <CheckCircle className="w-10 h-10 mx-auto mb-4 text-white" />
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Form Submitted Successfully!
            </h1>
            <p className="text-white/90 text-sm md:text-lg">
              Thanks for reaching out. We'll be in touch with next steps soon.
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="space-y-6">
              <div className="bg-gray-50 border-2 border-black rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5 text-tst-purple" />
                  What Happens Next
                </h2>
                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-2">
                    <div className="w-20 h-6 md:w-8 md:h-6 bg-tst-purple text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="font-semibold">Watch for My Email</p>
                      <p className="text-gray-600">You'll receive a confirmation with your secure video link and appointment details.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-20 h-6 md:w-8 md:h-6 bg-tst-purple text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="font-semibold">Quick Check-In</p>
                      <p className="text-gray-600">I’ll personally reply to the information you shared. You’ll hear from me soon with next steps for your free 15 minute consult.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-24 h-6 md:w-10 md:h-6 bg-tst-purple text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="font-semibold">Meet Your Therapist</p>
                      <p className="text-gray-600">Join your 15-minute consultation to share what's on your mind and see how therapy could support you.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-tst-cream border-2 border-black rounded-lg p-6">
                <h3 className="font-bold mb-2 flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5 text-tst-purple" />
                  Important Reminders
                </h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Your consultation is completely free with no obligations</li>
                  <li>• We'll meet via secure video link (no need to download anything)</li>
                  <li>• If you need to cancel or reschedule, use the link in your confirmation email</li>
                  <li>
  • Questions? Email us at{" "}
  <a
    href="mailto:care@toastedsesametherapy.com"
    className="text-tst-purple font-medium hover:underline"
  >
    care@toastedsesametherapy.com
  </a>
</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">

                <Link href="/therapy-services" className="flex-1">
                  <Button className="w-full bg-tst-purple text-white border-2 border-black">
                    Learn More About Our Services
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
