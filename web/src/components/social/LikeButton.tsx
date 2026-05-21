"use client";

type Props = {
  count: number;
  liked: boolean;
  onClick: (e: React.MouseEvent) => void;
  label?: string;
};

export function LikeButton({ count, liked, onClick, label = "Like" }: Props) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      aria-pressed={liked}
      className={`inline-flex items-center gap-1 font-mono text-xs font-bold uppercase transition-colors ${
        liked ? "text-danger" : "text-ink hover:text-danger"
      }`}
    >
      <span aria-hidden>{liked ? "♥" : "♡"}</span>
      <span>
        {count} {label}
        {count === 1 ? "" : "s"}
      </span>
    </button>
  );
}
