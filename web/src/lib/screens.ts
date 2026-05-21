/** Maps Stitch-exported HTML filenames (desktop + mobile) — used under /dev only. */
export type ScreenPair = {
  desktop: string;
  mobile: string;
  title: string;
};

export const SCREENS = {
  landing: {
    desktop: "05-landing-page.html",
    mobile: "10-landing-page-mobile.html",
    title: "Murmur — Landing",
  },
  signup: {
    desktop: "08-signup-verification.html",
    mobile: "03-signup-verification-mobile.html",
    title: "Murmur — Signup & Verification",
  },
  feed: {
    desktop: "07-anonymous-feed.html",
    mobile: "01-anonymous-feed-mobile.html",
    title: "Murmur — Anonymous Feed",
  },
  trending: {
    desktop: "09-trending-feed.html",
    mobile: "02-trending-feed-mobile.html",
    title: "Murmur — Trending Feed",
  },
  intel: {
    desktop: "06-culture-intelligence-report.html",
    mobile: "04-culture-intel-mobile.html",
    title: "Murmur — Culture Intel",
  },
  admin: {
    desktop: "13-org-admin-dashboard.html",
    mobile: "12-org-admin-mobile.html",
    title: "Murmur — Org Admin",
  },
} as const satisfies Record<string, ScreenPair>;

export type ScreenKey = keyof typeof SCREENS;

/** Dev-only screen picker (see /dev). */
export const DEV_NAV_ROUTES: { href: string; label: string }[] = [
  { href: "/dev/dark", label: "Dark" },
  { href: "/dev", label: "Index" },
  { href: "/dev/landing", label: "Landing" },
  { href: "/dev/signup", label: "Signup" },
  { href: "/dev/feed", label: "Feed" },
  { href: "/dev/trending", label: "Trending" },
  { href: "/dev/intel", label: "Intel" },
  { href: "/dev/admin", label: "Admin" },
  { href: "/dev/design-system", label: "Design" },
];
