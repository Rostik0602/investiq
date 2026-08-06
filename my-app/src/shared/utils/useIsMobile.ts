import { useEffect, useState } from 'react';

// 768 відповідає $tablet у shared/styles/mixins.scss — mobile це все, що менше
const MOBILE_BREAKPOINT = 768;

export const useIsMobile = (): boolean => {
  const query = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setIsMobile(event.matches);

    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return isMobile;
};
