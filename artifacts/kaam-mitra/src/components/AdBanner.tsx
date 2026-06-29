import { useState } from "react";
import { useAdvertisements } from "@/hooks/useAdvertisements";

/**
 * Renders the first live advertisement for a given position. Returns nothing
 * when there are no active ads for that slot, or when the ad image fails to
 * load (e.g. admin pasted a page URL instead of a direct image link). Used
 * across Home, Category, and Worker Detail pages so admin-managed ads surface
 * in the user app.
 */
export default function AdBanner({
  position,
  className = "px-5 pt-5",
}: {
  position: string;
  className?: string;
}) {
  const { ads } = useAdvertisements(position);
  const [broken, setBroken] = useState(false);

  if (ads.length === 0) return null;
  const ad = ads[0];
  if (broken) return null;

  const image = (
    <img
      src={ad.imageUrl}
      alt={ad.title}
      className="w-full h-auto rounded-2xl object-cover"
      loading="lazy"
      onError={() => setBroken(true)}
    />
  );

  return (
    <div
      className={className}
      data-testid={`ad-${position.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {ad.linkUrl ? (
        <a
          href={ad.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block shadow-sm rounded-2xl"
        >
          {image}
        </a>
      ) : (
        <div className="block shadow-sm rounded-2xl">{image}</div>
      )}
    </div>
  );
}
