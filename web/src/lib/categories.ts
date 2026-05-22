export const POST_CATEGORIES = [
  "GOSSIP",
  "OPINION",
  "QUESTION",
  "RANT",
  "ANNOUNCEMENT",
  "POLL",
] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];
