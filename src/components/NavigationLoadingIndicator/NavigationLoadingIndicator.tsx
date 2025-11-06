'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';
import GlobalLoadingOverlay from '@/components/GlobalLoadingOverlay/GlobalLoadingOverlay';

const NavigationLoadingIndicator: React.FC = () => {
  const { isNavigating, setIsNavigating } = useNavigation();
  const pathname = usePathname();

  // Hide loading indicator when pathname changes (navigation complete)
  useEffect(() => {
    if (isNavigating) {
      setIsNavigating(false);
    }
  }, [pathname, isNavigating, setIsNavigating]);

  if (!isNavigating) {
    return null;
  }

  return <GlobalLoadingOverlay isVisible={true} />;
};

export default NavigationLoadingIndicator;