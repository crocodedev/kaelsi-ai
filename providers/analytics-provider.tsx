'use client';

import { useEffect, PropsWithChildren, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { analyticsService } from '@/lib/services/analytics';
import { debounce } from '@/lib/utils';

export function AnalyticsProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/loading' && pathname !== '/') {
      analyticsService.forceTrack('page_view', [pathname]);
    }
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element;
      if (target && target !== document.body) {
        analyticsService.trackClick(target);
      }
    };

    const handleScroll = debounce(() => {
      const x = window.scrollX;
      const y = window.scrollY;
      analyticsService.trackScroll(x, y);
    }, 300);

    const handleWheel = debounce((event: WheelEvent) => {
      if (event.ctrlKey) {
        analyticsService.trackZoom(1);
      }
    }, 500);

    const handleFormSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement;
      if (form.id) {
        analyticsService.trackFormSubmit(form.id);
      } else {
        analyticsService.trackFormSubmit('unknown');
      }
    };

    document.addEventListener('click', handleClick, true);
    document.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('wheel', handleWheel, { passive: true });
    document.addEventListener('submit', handleFormSubmit, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('submit', handleFormSubmit, true);
    };
  }, []);

  return <>{children}</>;
} 