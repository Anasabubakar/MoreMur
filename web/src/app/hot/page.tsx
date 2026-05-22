"use client";

import { FeedShell } from "@/components/feed/FeedShell";

export default function HotPage() {
  return <FeedShell sort="hot" title="Hot murmurs" forceHotBadge />;
}
