"use client";

import { useEffect, useRef, useState } from "react";

export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [pulling, setPulling] = useState(false);
  const startY = useRef(0);
  const pullingRef = useRef(false);

  useEffect(() => {
    function onTouchStart(e: TouchEvent) {
      if (window.scrollY > 8) return;
      startY.current = e.touches[0]?.clientY ?? 0;
      pullingRef.current = true;
    }

    async function onTouchEnd(e: TouchEvent) {
      if (!pullingRef.current) return;
      pullingRef.current = false;
      const endY = e.changedTouches[0]?.clientY ?? 0;
      const delta = endY - startY.current;
      if (delta > 72 && window.scrollY <= 8) {
        setPulling(true);
        try {
          await onRefresh();
        } finally {
          setPulling(false);
        }
      }
    }

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onRefresh]);

  return { pulling };
}
