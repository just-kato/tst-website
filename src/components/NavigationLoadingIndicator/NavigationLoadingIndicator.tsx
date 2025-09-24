'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';
import GlobalLoadingOverlay from '@/components/GlobalLoadingOverlay/GlobalLoadingOverlay';

const NavigationLoadingIndicator: React.FC = () => {
  const { isNavigating, setIsNavigating } = useNavigation();
  const pathname = usePathname();

  console.log('NavigationLoadingIndicator mounted - pathname:', pathname);

  // Debug logging
  useEffect(() => {
    console.log('NavigationLoadingIndicator - isNavigating changed to:', isNavigating);
  }, [isNavigating]);

  // Hide loading indicator when pathname changes (navigation complete)
  useEffect(() => {
    console.log('NavigationLoadingIndicator - pathname changed:', pathname, 'isNavigating:', isNavigating);
    if (isNavigating) {
      console.log('NavigationLoadingIndicator - hiding loading because navigation completed');
      setIsNavigating(false);
    }
  }, [pathname, isNavigating, setIsNavigating]);

  console.log('NavigationLoadingIndicator render - isNavigating:', isNavigating);

  if (!isNavigating) {
    return null;
  }

  console.log('NavigationLoadingIndicator - rendering overlay');
  return <GlobalLoadingOverlay isVisible={true} />;
};

export default NavigationLoadingIndicator;