import { useState, useEffect } from 'react';

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // The browser can leave fullscreen on its own (e.g. Esc), so keep state in sync
  useEffect(() => {
    function handleChange() {
      if (!document.fullscreenElement) setIsFullscreen(false);
    }

    document.addEventListener('fullscreenchange', handleChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleChange);
    };
  }, []);

  function toggleFullscreen() {
    if (!isFullscreen) {
      // Update layout first, so it works even if the browser refuses fullscreen
      setIsFullscreen(true);
      // Optional call. Safari doesnt support it
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      setIsFullscreen(false);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    }
  }

  return { isFullscreen, toggleFullscreen };
}
