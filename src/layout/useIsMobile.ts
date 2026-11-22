import { useEffect, useState } from 'react';

// Same breakpoint as Tailwind's `md` (48rem = 768px).
const MOBILE_QUERY = '(max-width: 767.98px)';

// True on small screens. Updates when the window crosses the breakpoint (rotation, resize).
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);

    function handleChange() {
      setIsMobile(media.matches);
    }

    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  return isMobile;
}
