"use client";

import { FeedShell } from "@/components/feed/FeedShell";

export default function TrendingPage() {
  return (
    <FeedShell sort="trending" title="Trending intel" showWindowToggle />
  );
}
