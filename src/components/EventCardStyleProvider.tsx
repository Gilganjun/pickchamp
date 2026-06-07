"use client";

import { useEffect } from "react";
import {
  cycleEventCardStyle,
  getStoredEventCardStyle,
  applyEventCardStyleToDocument,
} from "@/lib/ui/eventCardStyle";

/** Applies saved event card style and binds Ctrl+Alt+T to cycle themes. No debug UI. */
export function EventCardStyleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    applyEventCardStyleToDocument(getStoredEventCardStyle());
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === "t") {
        event.preventDefault();
        cycleEventCardStyle();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return children;
}
