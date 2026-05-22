"use client";

import { ActionButton, MaterialIcon } from "./ActionButton";

type Props = {
  count: number;
  liked: boolean;
  onClick: (e: React.MouseEvent) => void;
  label?: string;
};

export function LikeButton({ count, liked, onClick, label = "Like" }: Props) {
  const hoverLabel =
    count === 0
      ? label
      : `${count} ${label}${count === 1 ? "" : "s"}`;

  return (
    <ActionButton
      hoverLabel={hoverLabel}
      ariaLabel={hoverLabel}
      count={count}
      active={liked}
      onClick={onClick}
      icon={
        <MaterialIcon
          name="favorite"
          filled={liked}
          className={`text-xl leading-none ${liked ? "text-danger" : ""}`}
        />
      }
    />
  );
}
