'use client';

import React, { useState, useEffect } from 'react';
import NavigationLink from '@/components/NavigationLink/NavigationLink';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '@/components/Button/Button';
import MobileMenu from '@/components/MobileMenu/MobileMenu';
import HoverLink from '@/components/HoverLink/HoverLink';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/supabase-js';

const MenuToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="relative z-50">
      <AnimatePresence initial={false} mode="wait">
        <motion.button
          key={isOpen ? 'close' : 'open'}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClick}
          className="relative w-12 h-12"
        >
          {isOpen ? (
            <>
              <div className="absolute inset-0 bg-black rounded-lg transform translate-x-1 translate-y-1"></div>
              <div className="relative w-full h-full bg-tst-purple border-2 border-black rounded-lg flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 6L18 18"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <div className="w-8 h-1 bg-black rounded-full"></div>
              <div className="w-8 h-1 bg-black rounded-full"></div>
            </div>
          )}
        </motion.button>
      </AnimatePresence>
    </div>
  );
};

const Nav: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleGetStartedClick = () => {

      router.push('/book/trauma');

  };

  const isDashboardPage = pathname.startsWith('/dashboard');

  return (
    <nav className="relative w-full max-w-7xl mx-auto min-h-100 p-1">
      <div className="flex items-center justify-between p-4">
        <div className="flex-shrink-0">
          <NavigationLink href="/" className="font-extrabold text-3xl">
            <Image
              src="https://pvbdrbaquwivhylsmagn.supabase.co/storage/v1/object/public/tst-assets/logo/TST-LOGO-WHITE.svg"
              alt="TST logo"
              width={100}
              height={10}
              className="mx-auto"
            />
          </NavigationLink>
        </div>

        <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
          <ul className="flex items-center space-x-2 xl:space-x-3 font-bold">
            {!isDashboardPage && (
              <>
                <li>
                  <HoverLink
                    href="/therapy-services"
                    id="therapy-service-nav-link"
                  >
                    Therapy Services
                  </HoverLink>
                </li>
                <li>
                  <HoverLink href="/about" id="about-nav-link">
                    About
                  </HoverLink>
                </li>
                <li>
                  <HoverLink
                    href="/mental-health-healing-blog"
                    id="blog-nav-link"
                  >
                    Toasted Insights Blog
                  </HoverLink>
                </li>
                <li>
                  <HoverLink href="/guides" id="guides-nav-link">
                    Free Guides
                  </HoverLink>
                </li>
              </>
            )}
            {user && (
              <li>
                <HoverLink href="/dashboard">Dashboard</HoverLink>
              </li>
            )}
          </ul>
          {!isDashboardPage && (
            <div>
              <Button
                onClick={handleGetStartedClick}
                className="bg-tst-purple"
                id="nav-get-started-btn"
              >
                Book Your Free 15-min Consultation
              </Button>
            </div>
          )}
        </div>

        <div className="lg:hidden">
          <MenuToggle
            isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && <MobileMenu onClose={() => setIsMenuOpen(false)} />}
      </AnimatePresence>
    </nav>
  );
};

export default Nav;
