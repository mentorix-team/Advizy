import { useEffect, useRef, useState } from 'react';

export const useAutoScroll = (speed = 0.5, pauseOnHover = true) => {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const animationRef = useRef(null);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const animate = () => {
      if (!pauseOnHover || !isHovered) {
        const maxScroll = scrollContainer.scrollWidth / 3;
        const currentScroll = scrollContainer.scrollLeft;
        
        if (currentScroll >= maxScroll) {
          scrollContainer.scrollLeft = 0;
          lastScrollRef.current = 0;
          setScrollPosition(0);
        } else {
          lastScrollRef.current += speed;
          scrollContainer.scrollLeft = lastScrollRef.current;
          setScrollPosition(lastScrollRef.current);
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered, speed, pauseOnHover]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      const scrollContainer = scrollRef.current;
      if (scrollContainer) {
        lastScrollRef.current = scrollContainer.scrollLeft;
      }
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      const scrollContainer = scrollRef.current;
      if (scrollContainer) {
        lastScrollRef.current = scrollContainer.scrollLeft;
      }
      setIsHovered(false);
    }
  };

  return {
    scrollRef,
    handleMouseEnter,
    handleMouseLeave,
    isHovered,
    scrollPosition
  };
};