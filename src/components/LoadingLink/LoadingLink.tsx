'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';

interface LoadingLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  [key: string]: any;
}

const LoadingLink: React.FC<LoadingLinkProps> = ({
  href,
  children,
  className,
  target,
  rel,
  onClick,
  ...props
}) => {
  const pathname = usePathname();
  const { setIsNavigating } = useNavigation();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Don't show loading for external links
    if (target === '_blank' || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) {
      if (onClick) onClick();
      return;
    }

    // Don't show loading if we're already on this page
    if (pathname === href) {
      if (onClick) onClick();
      return;
    }

    // Don't prevent default for Next.js Link - let it handle navigation
    setIsNavigating(true);

    // Set a timeout to hide loading after a reasonable time
    setTimeout(() => {
      setIsNavigating(false);
    }, 3000);

    if (onClick) onClick();
  };

  return (
    <Link
      href={href}
      className={className}
      target={target}
      rel={rel}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
};

export default LoadingLink;