import { useEffect, useState } from "react";

export const useSwiper = () => {
  const [isSwiperActive, setIsSwiperActive] = useState(
    window.innerWidth <= 768,
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSwiperActive(true);
      } else {
        setIsSwiperActive(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isSwiperActive;
};
