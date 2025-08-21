import { useCallback } from 'react';
import { analyticsService } from '@/lib/services/analytics';

export const useAnalytics = () => {
  const track = useCallback((type: string, data: string[] | null = null) => {
    analyticsService.track(type, data);
  }, []);

  const trackCustomEvent = useCallback((eventName: string, eventData: Record<string, any>) => {
    analyticsService.track(eventName, [JSON.stringify(eventData)]);
  }, []);

  const trackButtonClick = useCallback((buttonText: string, buttonId?: string) => {
    analyticsService.trackButtonClick(buttonText, buttonId);
  }, []);

  const trackFormSubmit = useCallback((formId: string) => {
    analyticsService.trackFormSubmit(formId);
  }, []);

  const trackPageView = useCallback((path: string) => {
    analyticsService.trackPageView(path);
  }, []);

  return {
    track,
    trackCustomEvent,
    trackButtonClick,
    trackFormSubmit,
    trackPageView,
  };
}; 