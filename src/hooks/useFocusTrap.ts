import { RefObject, useEffect } from 'react';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[role="button"]',
  '[role="link"]',
  'summary'
].join(', ');

function isElementVisible(element: HTMLElement) {
  return !(
    element.hasAttribute('disabled') ||
    element.getAttribute('aria-hidden') === 'true' ||
    element.tabIndex === -1
  ) && (element.offsetWidth > 0 || element.offsetHeight > 0 || element.getClientRects().length > 0);
}

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)).filter(isElementVisible);
}

interface UseFocusTrapOptions {
  onClose?: () => void;
}

export function useFocusTrap(
  isOpen: boolean,
  containerRef: RefObject<HTMLElement>,
  { onClose }: UseFocusTrapOptions = {}
) {
  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const previouslyFocusedElement = document.activeElement as HTMLElement | null;

    if (!container.hasAttribute('tabindex')) {
      container.setAttribute('tabindex', '-1');
    }

    const focusableElements = getFocusableElements(container);
    (focusableElements[0] ?? container).focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!containerRef.current) {
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusable = getFocusableElements(containerRef.current);

      if (focusable.length === 0) {
        event.preventDefault();
        containerRef.current.focus();
        return;
      }

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (activeElement === firstElement || !containerRef.current.contains(activeElement)) {
          event.preventDefault();
          lastElement.focus();
        }
        return;
      }

      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      if (!containerRef.current || !target) {
        return;
      }

      if (!containerRef.current.contains(target)) {
        const focusable = getFocusableElements(containerRef.current);
        (focusable[0] ?? containerRef.current).focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocusIn);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusIn);

      if (previouslyFocusedElement && previouslyFocusedElement.focus) {
        previouslyFocusedElement.focus();
      }
    };
  }, [isOpen, containerRef, onClose]);
}
