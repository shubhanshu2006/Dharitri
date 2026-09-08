import { useEffect, useRef, useState } from "react";
import {
  trapFocus,
  announceToScreenReader,
  prefersReducedMotion,
  isHighContrastMode,
  generateId,
} from "@/lib/utils/accessibility";

/**
 * Hook to trap focus within a component
 */
export function useFocusTrap(isActive: boolean = true) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !ref.current) return;

    const cleanup = trapFocus(ref.current);
    return cleanup;
  }, [isActive]);

  return ref;
}

/**
 * Hook to focus element on mount
 */
export function useAutoFocus<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return ref;
}

/**
 * Hook to restore focus on unmount
 */
export function useRestoreFocus<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousActiveElement.current = document.activeElement as HTMLElement;

    return () => {
      previousActiveElement.current?.focus();
    };
  }, []);

  return ref;
}

/**
 * Hook for screen reader announcements
 */
export function useAnnouncer() {
  const announce = (
    message: string,
    priority: "polite" | "assertive" = "polite"
  ) => {
    announceToScreenReader(message, priority);
  };

  return { announce };
}

/**
 * Hook to generate stable unique IDs
 */
export function useId(prefix?: string): string {
  const [id] = useState(() => generateId(prefix));
  return id;
}

/**
 * Hook to detect reduced motion preference
 */
export function useReducedMotion(): boolean {
  const [isReduced, setIsReduced] = useState(prefersReducedMotion);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = () => {
      setIsReduced(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isReduced;
}

/**
 * Hook to detect high contrast mode
 */
export function useHighContrast(): boolean {
  const [isHighContrast, setIsHighContrast] = useState(isHighContrastMode);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-contrast: high)");

    const handleChange = () => {
      setIsHighContrast(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isHighContrast;
}

/**
 * Hook for keyboard navigation in lists
 */
export function useKeyboardListNavigation<T extends HTMLElement>(
  itemCount: number,
  onSelect?: (index: number) => void
) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const listRef = useRef<T>(null);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % itemCount);
        break;
      case "ArrowUp":
        event.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + itemCount) % itemCount);
        break;
      case "Home":
        event.preventDefault();
        setFocusedIndex(0);
        break;
      case "End":
        event.preventDefault();
        setFocusedIndex(itemCount - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        onSelect?.(focusedIndex);
        break;
    }
  };

  return {
    listRef,
    focusedIndex,
    setFocusedIndex,
    handleKeyDown,
  };
}

/**
 * Hook to manage disclosure (expand/collapse) state with keyboard support
 */
export function useDisclosure(defaultOpen: boolean = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const buttonId = useId("disclosure-button");
  const panelId = useId("disclosure-panel");

  const toggle = () => setIsOpen((prev) => !prev);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const buttonProps = {
    id: buttonId,
    "aria-expanded": isOpen,
    "aria-controls": panelId,
    onClick: toggle,
  };

  const panelProps = {
    id: panelId,
    role: "region",
    "aria-labelledby": buttonId,
    hidden: !isOpen,
  };

  return {
    isOpen,
    toggle,
    open,
    close,
    buttonProps,
    panelProps,
  };
}

/**
 * Hook for managing live region announcements
 */
export function useLiveRegion() {
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<"polite" | "assertive">("polite");

  const announce = (
    newMessage: string,
    newPriority: "polite" | "assertive" = "polite"
  ) => {
    setMessage("");
    setTimeout(() => {
      setPriority(newPriority);
      setMessage(newMessage);
    }, 100);
  };

  const regionProps = {
    "aria-live": priority,
    "aria-atomic": "true",
    role: "status",
    className: "sr-only",
  };

  return {
    announce,
    message,
    regionProps,
  };
}
