// Accessibility Utilities

/**
 * Trap focus within a container element
 */
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleTabKey(e: KeyboardEvent) {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        lastElement?.focus();
        e.preventDefault();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        firstElement?.focus();
        e.preventDefault();
      }
    }
  }

  element.addEventListener("keydown", handleTabKey);

  // Return cleanup function
  return () => {
    element.removeEventListener("keydown", handleTabKey);
  };
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(element: HTMLElement): HTMLElement[] {
  const elements = element.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  return Array.from(elements);
}

/**
 * Move focus to first focusable element
 */
export function focusFirst(element: HTMLElement) {
  const focusable = getFocusableElements(element);
  focusable[0]?.focus();
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite"
) {
  const announcer = document.getElementById("screen-reader-announcer");
  if (announcer) {
    announcer.setAttribute("aria-live", priority);
    announcer.textContent = message;
    // Clear after announcement
    setTimeout(() => {
      announcer.textContent = "";
    }, 1000);
  }
}

/**
 * Check if element is visible
 */
export function isVisible(element: HTMLElement): boolean {
  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  );
}

/**
 * Get next/previous focusable sibling
 */
export function getFocusableSibling(
  element: HTMLElement,
  direction: "next" | "prev"
): HTMLElement | null {
  const parent = element.parentElement;
  if (!parent) return null;

  const focusable = getFocusableElements(parent);
  const currentIndex = focusable.indexOf(element);

  if (direction === "next") {
    return focusable[currentIndex + 1] || focusable[0];
  } else {
    return focusable[currentIndex - 1] || focusable[focusable.length - 1];
  }
}

/**
 * Generate unique ID for ARIA associations
 */
let idCounter = 0;
export function generateId(prefix: string = "a11y"): string {
  idCounter++;
  return `${prefix}-${idCounter}-${Date.now()}`;
}

/**
 * Keyboard event helpers
 */
export const Keys = {
  ENTER: "Enter",
  SPACE: " ",
  ESCAPE: "Escape",
  TAB: "Tab",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  HOME: "Home",
  END: "End",
  PAGE_UP: "PageUp",
  PAGE_DOWN: "PageDown",
} as const;

/**
 * Check if key matches
 */
export function isKey(event: KeyboardEvent, key: string): boolean {
  return event.key === key;
}

/**
 * Check if Enter or Space (activation keys)
 */
export function isActivationKey(event: KeyboardEvent): boolean {
  return event.key === Keys.ENTER || event.key === Keys.SPACE;
}

/**
 * Check if arrow key
 */
export function isArrowKey(event: KeyboardEvent): boolean {
  return [
    Keys.ARROW_UP,
    Keys.ARROW_DOWN,
    Keys.ARROW_LEFT,
    Keys.ARROW_RIGHT,
  ].includes(event.key as any);
}

/**
 * Prevent scroll on space key
 */
export function preventDefaultForSpace(event: KeyboardEvent) {
  if (event.key === Keys.SPACE) {
    event.preventDefault();
  }
}

/**
 * Create ARIA description element
 */
export function createAriaDescription(text: string): string {
  const id = generateId("desc");
  const element = document.createElement("span");
  element.id = id;
  element.className = "sr-only";
  element.textContent = text;
  document.body.appendChild(element);
  return id;
}

/**
 * Remove ARIA description element
 */
export function removeAriaDescription(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
  }
}

/**
 * Check if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Check if high contrast mode is active (Windows)
 */
export function isHighContrastMode(): boolean {
  return window.matchMedia("(prefers-contrast: high)").matches;
}

/**
 * Get color contrast ratio (WCAG)
 */
export function getContrastRatio(
  foreground: string,
  background: string
): number {
  const getLuminance = (color: string): number => {
    // Simple RGB extraction (works for hex colors)
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const [rs, gs, bs] = [r, g, b].map((c) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG AA standard
 */
export function meetsWCAGAA(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Check if contrast meets WCAG AAA standard
 */
export function meetsWCAGAAA(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}
