'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';

export const useNavigationLoading = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsNavigating } = useNavigation();

  const navigateWithLoading = (href: string) => {
    // Don't show loading if we're already on this page
    if (pathname === href) {
      return;
    }

    setIsNavigating(true);

    try {
      router.push(href);

      // Set a timeout to hide loading after a reasonable time
      // in case the navigation doesn't trigger the layout effect
      setTimeout(() => {
        setIsNavigating(false);
      }, 500);
    } catch (error) {
      setIsNavigating(false);
      console.error('Navigation error:', error);
    }
  };

  const triggerLoading = () => {
    setIsNavigating(true);
  };

  const stopLoading = () => {
    setIsNavigating(false);
  };

  return {
    navigateWithLoading,
    triggerLoading,
    stopLoading,
  };
};
