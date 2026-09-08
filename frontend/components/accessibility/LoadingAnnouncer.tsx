"use client";

import { useEffect } from "react";
import { useAnnouncer } from "@/hooks/useAccessibility";

interface LoadingAnnouncerProps {
  isLoading: boolean;
  loadingMessage?: string;
  successMessage?: string;
}

/**
 * Loading Announcer Component
 * 
 * Announces loading and completion states to screen readers.
 * Use in components with async operations.
 */
export function LoadingAnnouncer({
  isLoading,
  loadingMessage = "Loading...",
  successMessage = "Content loaded",
}: LoadingAnnouncerProps) {
  const { announce } = useAnnouncer();

  useEffect(() => {
    if (isLoading) {
      announce(loadingMessage, "polite");
    } else {
      announce(successMessage, "polite");
    }
  }, [isLoading, loadingMessage, successMessage, announce]);

  return null;
}
