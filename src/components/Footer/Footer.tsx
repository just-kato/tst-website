'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import HoverLink from '@/components/HoverLink/HoverLink';
import CookieSettings from '@/components/CookieSettings/CookieSettings';

const Footer = () => {
  const pathname = usePathname();
  const isBookingPage = pathname?.startsWith('/book');

  return (
    <footer className="bg-tst-purple border-t-2 border-black">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Main Footer Content */}
        <div className={`grid grid-cols-1 ${isBookingPage ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-8 items-start mb-8`}>
          {/* Logo Section - Takes up 2 columns on larger screens */}
          <div className="flex flex-col items-center md:items-start md:col-span-2">
            <Link href="/" className="mb-4">
              <Image
                src="https://pvbdrbaquwivhylsmagn.supabase.co/storage/v1/object/public/tst-assets/logo/TST-LOGO-WHITE.svg"
                alt="TST logo"
                width={180}
                height={90}
                className="hover:scale-105 transition-transform duration-200"
              />
            </Link>
            <p className="text-white/80 text-sm text-center md:text-left max-w-xs">
              Supporting your healing journey with compassionate, personalized
              therapy.
            </p>
          </div>

          {/* Quick Links - Hidden on booking pages */}
          {!isBookingPage && (
            <div className="text-center md:text-left">
              <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <HoverLink
                    href="/therapy-services"
                    className="text-white/90 hover:text-white transition-colors font-medium"
                  >
                    Therapy Services
                  </HoverLink>
                </li>
                <li>
                  <HoverLink
                    href="/about"
                    className="text-white/90 hover:text-white transition-colors font-medium"
                  >
                    About Kay
                  </HoverLink>
                </li>
                <li>
                  <HoverLink
                    href="/guides"
                    className="text-white/90 hover:text-white transition-colors font-medium"
                  >
                    Grab Your Free Resources
                  </HoverLink>
                </li>

                <li>
                  <HoverLink
                    href="/mental-health-healing-blog"
                    className="text-white/90 hover:text-white transition-colors font-medium"
                  >
                    Toasted Insights Blog
                  </HoverLink>
                </li>
                <li>
                  <HoverLink
                    href="/contact"
                    className="text-white/90 hover:text-white transition-colors font-medium"
                  >
                    Contact
                  </HoverLink>
                </li>
                
                <li>
                  <HoverLink
                    href="mailto:care@toastedsesametherapy.com?subject=Business Inquiry"
                    className="text-white/90 hover:text-white transition-colors font-medium"
                  >
                    Business Queries
                  </HoverLink>
                </li>
              </ul>
            </div>
          )}

          <div className="text-center md:text-right">
            <h3 className="text-white font-bold text-lg mb-4">
              Legal
            </h3>
            <ul className="space-y-3 mb-6">
              <li>
                <HoverLink
                  href="/policy"
                  className="text-white/90 hover:text-white transition-colors font-medium"
                >
                  Privacy Policy
                </HoverLink>
              </li>
              <li>
                <HoverLink
                  href="/policy"
                  className="text-white/90 hover:text-white transition-colors font-medium"
                >
                  Practice Policy
                </HoverLink>
              </li>

            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-8 mt-8 space-y-6">
          {/* Business Info */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 text-white/80 text-sm text-center md:text-left">
            {/* Business Info - Left Side */}
            <div>
              <p className="font-bold">
                Toasted Sesame Therapy, LLC, Atlanta, GA
              </p>
              <p>
                A Telehealth-Only Practice <br />
                Serving Clients Across Georgia
              </p>
            </div>

            {/* Crisis Info and Copyright - Right Side */}
            <div className="text-center md:text-right">
              <p className="mb-2">
                This site is not for crisis support.{' '}
                <br className="hidden md:inline" />
                <span className="md:ml-1">
                  Crisis resources are available on the{' '}
                  <Link href="/policy" className="underline font-bold">
                    Policy Page
                  </Link>
                </span>
              </p>
              <p className="font-bold">
                &copy; {new Date().getFullYear()} Toasted Sesame Therapy. All
                rights reserved.
              </p>
              <CookieSettings />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
