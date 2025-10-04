// src/components/CookieConsent/CookieConsent.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/Button/Button';

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check if user has already made a choice
    const consent = Cookies.get('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    } else if (consent === 'accepted') {
      // User has already accepted, enable analytics
      enableAnalytics();
    }
  }, []);

  const enableAnalytics = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
      });
    }
  };

  const disableAnalytics = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
      });
    }
  };

  const handleAcceptAll = () => {
    Cookies.set('cookieConsent', 'accepted', { expires: 365 });
    enableAnalytics();
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    Cookies.set('cookieConsent', 'rejected', { expires: 365 });
    disableAnalytics();
    setShowBanner(false);
  };

  const handleCustomize = () => {
    setShowDetails(!showDetails);
  };

  // Don't render anything on the server to prevent hydration mismatch
  if (!isMounted || !showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="max-h-100 md:max-w-500 fixed bottom-0 right-0 z-50 p-3 md:p-4"
      >
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Shadow - smaller on desktop */}
            <div className="absolute inset-0 bg-black rounded-lg transform translate-x-1 translate-y-1 md:translate-x-1.5 md:translate-y-1.5"></div>

            {/* Main banner */}
            <div className="relative bg-white border-2 border-black rounded-lg shadow-brutalistLg">
              <div className="p-3 md:p-4">
                <div className="flex flex-col gap-3 md:gap-3">
                  {/* Header - more compact layout */}
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="flex-shrink-0 text-sm">🍪</div>
                    <div className="flex-1 min-w-0 text-center md:text-left">
                      <h3 className="text-sm md:text-base font-bold mb-1">
                        We value your privacy
                      </h3>
                      <p className="text-xs md:text-sm text-gray-700 mb-2 leading-tight">
                        We use cookies to enhance your experience. By clicking
                        &quot;Accept All&quot;, you consent to our use of
                        cookies.
                        <span className="hidden md:inline">
                          {' '}
                          We use them to serve personalized content and analyze
                          our traffic.
                        </span>
                      </p>

                      {showDetails && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-gray-200 pt-2 md:pt-3 mt-2 md:mt-3"
                        >
                          <div className="space-y-1.5 md:space-y-2">
                            <div>
                              <h4 className="font-semibold text-xs md:text-sm">
                                Essential Cookies
                              </h4>
                              <p className="text-xs text-gray-600 leading-tight">
                                Required for basic site functionality. Always
                                enabled.
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-xs md:text-sm">
                                Analytics Cookies
                              </h4>
                              <p className="text-xs text-gray-600 leading-tight">
                                Help us understand how visitors interact with
                                our website.
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-xs md:text-sm">
                                Marketing Cookies
                              </h4>
                              <p className="text-xs text-gray-600 leading-tight">
                                Used to track visitors across websites to
                                display relevant ads.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Buttons - more compact spacing */}
                  <div className="flex flex-col gap-2 md:flex-row md:gap-2 md:justify-start items-center px-8">
                    <div className="flex gap-2 justify-center md:justify-end">
                      <Button
                        onClick={handleRejectAll}
                        className="bg-gray-200 text-black text-xs md:text-sm py-1.5 px-2 md:py-1.5 md:px-3 flex-1 md:flex-none"
                      >
                        Reject All
                      </Button>
                      <Button
                        onClick={handleAcceptAll}
                        className="bg-tst-purple text-black text-xs md:text-sm py-1.5 px-2 md:py-1.5 md:px-3 flex-1 md:flex-none"
                      >
                        Accept All
                      </Button>
                    </div>
                    <button
                      onClick={handleCustomize}
                      className="text-xs md:text-sm font-medium text-gray-600 hover:text-gray-800 underline"
                    >
                      {showDetails ? 'Hide Details' : 'Customize'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsent;
