import { useEffect, useState } from "react";

export function useKeyboardAdjust() {
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    const initialHeight = window.innerHeight;

    const handleResize = () => {
      const heightDiff = initialHeight - window.innerHeight;

      if (heightDiff > 100) {
        setKeyboardOffset(heightDiff);
      } else {
        setKeyboardOffset(0);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return keyboardOffset;
}
