import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";

/** Mouse drag for a strip that scrolls sideways (touch and trackpads already scroll it): press, drag
 * left or right, release. A drag of a few pixels stops the click that would follow. Spread the result
 * on the strip: <div {...dragScroll()} />. */
export function dragScroll() {
  let startX = 0;
  let startLeft = 0;
  let moved = false;
  let active: HTMLElement | null = null;
  return {
    onPointerDown(event: ReactPointerEvent<HTMLElement>) {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      active = event.currentTarget;
      startX = event.clientX;
      startLeft = active.scrollLeft;
      moved = false;
    },
    onPointerMove(event: ReactPointerEvent<HTMLElement>) {
      if (!active || event.pointerType !== "mouse") return;
      const dx = event.clientX - startX;
      if (!moved && Math.abs(dx) < 4) return;
      if (!moved) { moved = true; active.setPointerCapture(event.pointerId); active.style.cursor = "grabbing"; }
      active.scrollLeft = startLeft - dx;
    },
    onPointerUp(event: ReactPointerEvent<HTMLElement>) {
      if (!active) return;
      if (moved && active.hasPointerCapture(event.pointerId)) active.releasePointerCapture(event.pointerId);
      active.style.cursor = "";
      active = null;
    },
    onClickCapture(event: ReactMouseEvent<HTMLElement>) {
      if (moved) { event.stopPropagation(); event.preventDefault(); moved = false; }
    },
  };
}
