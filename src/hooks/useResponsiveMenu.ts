import { useEffect, useState } from 'react';

export function useResponsiveMenu(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < breakpoint;
      setIsMobile(mobile);
      if (!mobile) {
        setOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  useEffect(() => {
    if (!isMobile) {
      setOpen(true);
    }
  }, [isMobile]);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  return {
    isMobile,
    open,
    toggle,
    close
  };
}
