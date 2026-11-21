import { useEffect, useRef, useState } from "react";

/** "Ask before switching" for controls on a card (a cover's buttons and position): the first tap only
 * arms that control for 3 seconds, a second tap on it does the action. Off, every tap acts at once. */
export function useConfirmGate(enabled: boolean) {
  const [pending, setPending] = useState<string | null>(null);
  const timer = useRef<number | null>(null);
  useEffect(() => () => { if (timer.current != null) window.clearTimeout(timer.current); }, []);
  const clear = () => { if (timer.current != null) window.clearTimeout(timer.current); timer.current = null; setPending(null); };
  const gate = (key: string, action: () => void) => {
    if (!enabled || pending === key) { clear(); action(); return; }
    if (timer.current != null) window.clearTimeout(timer.current);
    setPending(key);
    timer.current = window.setTimeout(() => { timer.current = null; setPending(null); }, 3000);
  };
  return { pending, gate, clear };
}
