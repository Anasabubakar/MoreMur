"use client";

import { useState } from "react";
import { ActionButton, MaterialIcon } from "./ActionButton";

type Props = {
  count: number;
  liked: boolean;
  onClick: (e: React.MouseEvent) => void;
  label?: string;
};

export function LikeButton({ count, liked, onClick, label = "Like" }: Props) {
  const [bounceKey, setBounceKey] = useState(0);

  const hoverLabel =
    count === 0
      ? label
      : `${count} ${label}${count === 1 ? "" : "s"}`;

  function handleClick(e: React.MouseEvent) {
    setBounceKey((k) => k + 1);
    onClick(e);
  }

  return (
    <ActionButton
      hoverLabel={hoverLabel}
      ariaLabel={hoverLabel}
      count={count}
      active={liked}
      onClick={handleClick}
      icon={
        <span
          key={bounceKey}
          className={`inline-flex size-5 shrink-0 items-center justify-center will-change-transform ${
            bounceKey > 0 ? "animate-like-bounce" : ""
          }`}
          aria-hidden
        >
          <MaterialIcon
            name={liked ? "favorite" : "favorite_border"}
            filled={liked}
            className={liked ? "text-danger" : ""}
          />
        </span>
      }
    />
  );
}
