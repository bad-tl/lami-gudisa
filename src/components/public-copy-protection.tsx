
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PublicCopyProtection() {
  const pathname = usePathname();

  useEffect(() => {
    const isPrivatePage =
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/setup-owner") ||
      pathname.startsWith("/api");

    if (isPrivatePage) {
      document.body.classList.remove("public-copy-protection-active");
      return;
    }

    document.body.classList.add("public-copy-protection-active");

    const preventContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    const preventImageDrag = (event: DragEvent) => {
      const target = event.target;

      if (target instanceof Element && target.closest("img")) {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("dragstart", preventImageDrag);

    return () => {
      document.body.classList.remove("public-copy-protection-active");
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("dragstart", preventImageDrag);
    };
  }, [pathname]);

  return null;
}
