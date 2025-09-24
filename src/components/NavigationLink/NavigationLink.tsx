'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';

interface NavigationLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const NavigationLink: React.FC<NavigationLinkProps> = ({
  href,
  children,
  className,
  id,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsNavigating } = useNavigation();

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    console.log('NavigationLink clicked - href:', href, 'pathname:', pathname);

    // Don't show loading if we're already on this page
    if (pathname === href) {
      console.log('NavigationLink - already on this page, not showing loading');
      return;
    }

    // Don't show loading for external links
    if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) {
      console.log('NavigationLink - external link, not showing loading');
      return;
    }

    // Show loading state - let Next.js Link handle the actual navigation
    console.log('NavigationLink - setting isNavigating to true');
    setIsNavigating(true);

    // Fallback timeout only in case navigation fails completely
    setTimeout(() => {
      console.log('NavigationLink - fallback timeout reached, hiding loading');
      setIsNavigating(false);
    }, 10000);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={className}
      id={id}
    >
      {children}
    </Link>
  );
};

export default NavigationLink;