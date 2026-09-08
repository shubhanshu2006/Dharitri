/**
 * Screen Reader Announcer Component
 * 
 * Hidden element used for dynamic announcements to screen readers.
 * Should be included once in the root layout.
 */
export function ScreenReaderAnnouncer() {
  return (
    <div
      id="screen-reader-announcer"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );
}
