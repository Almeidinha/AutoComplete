import { useEffect } from "react";

const useClickAway = <T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  onClickAway: () => void,
) => {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        onClickAway();
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, onClickAway]);
};

export default useClickAway;
