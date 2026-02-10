"use client";

import { useState } from "react";

interface UserAvatarProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  className?: string;
}

export function UserAvatar({ name, email, image, className = "" }: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : email?.[0]?.toUpperCase() ?? "?";

  if (image && !imgError) {
    return (
      <img
        src={image}
        alt="Avatar"
        className={`h-9 w-9 rounded-full object-cover ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-stone-600 text-sm font-medium text-foreground ${className}`}
    >
      {initials}
    </div>
  );
}
