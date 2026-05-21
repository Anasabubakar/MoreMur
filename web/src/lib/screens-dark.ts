/** Stitch dark theme exports — preview under /dev/dark/[screen] */
export type DarkScreenPair = {
  desktop: string;
  mobile?: string;
  title: string;
};

export const DARK_SCREENS = {
  "culture-intel-mobile": {
    desktop: "01-culture-intel-mobile-dark.html",
    title: "Murmur — Culture Intel (Mobile Dark)",
  },
  landing: {
    desktop: "02-landing-page-dark.html",
    mobile: "07-landing-page-mobile-dark.html",
    title: "Murmur — Landing Page (Dark)",
  },
  feed: {
    desktop: "03-anonymous-feed-dark.html",
    mobile: "08-anonymous-feed-mobile-dark.html",
    title: "Murmur — Anonymous Feed (Dark)",
  },
  signup: {
    desktop: "04-signup-verification-dark.html",
    mobile: "09-signup-verification-mobile-dark.html",
    title: "Murmur — Signup & Verification (Dark)",
  },
  trending: {
    desktop: "05-trending-feed-dark.html",
    mobile: "10-trending-feed-mobile-dark.html",
    title: "Murmur — Trending Feed (Dark)",
  },
  intel: {
    desktop: "06-culture-intel-dark.html",
    title: "Murmur — Culture Intel (Dark)",
  },
  admin: {
    desktop: "11-org-admin-mobile-dark.html",
    title: "Murmur — Org Admin (Mobile Dark)",
  },
} as const satisfies Record<string, DarkScreenPair>;

export type DarkScreenKey = keyof typeof DARK_SCREENS;

export const DEV_DARK_NAV: { href: string; label: string }[] = [
  { href: "/dev/dark", label: "Dark index" },
  { href: "/dev/dark/landing", label: "Landing" },
  { href: "/dev/dark/feed", label: "Feed" },
  { href: "/dev/dark/signup", label: "Signup" },
  { href: "/dev/dark/trending", label: "Trending" },
  { href: "/dev/dark/intel", label: "Intel" },
  { href: "/dev/dark/admin", label: "Admin" },
];
