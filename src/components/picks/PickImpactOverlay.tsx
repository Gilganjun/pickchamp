"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { PickImpactConfig } from "./pickImpact";

interface PickImpactOverlayProps {
  config: PickImpactConfig;
}

export function PickImpactOverlay({ config }: PickImpactOverlayProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [assetVisible, setAssetVisible] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    setAssetVisible(true);
  }, [config.triggerKey]);

  if (reducedMotion) {
    return (
      <span
        key={config.triggerKey}
        className="pick-impact-flash-reduced pointer-events-none absolute inset-0 z-20 rounded-xl"
        aria-hidden
      />
    );
  }

  return (
    <div
      key={config.triggerKey}
      className="pointer-events-none absolute inset-0 z-20 overflow-visible"
      aria-hidden
    >
      <span className="pick-impact-burst" />
      {assetVisible && (
        <img
          src={config.assetSrc}
          alt=""
          className={cn(
            "pick-impact-glove",
            config.side === "right" && "pick-impact-glove--right"
          )}
          style={
            {
              "--pick-impact-angle": `${config.angle}deg`,
              "--pick-impact-y": `${config.yOffset}px`,
              "--pick-impact-scale": config.scale,
              "--pick-impact-distance": `${config.entryDistance}px`,
            } as CSSProperties
          }
          onError={() => setAssetVisible(false)}
        />
      )}
    </div>
  );
}
