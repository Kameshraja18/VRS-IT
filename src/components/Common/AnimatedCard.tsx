import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale';
  onClick?: () => void;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  delay = 0,
  animation = 'fadeUp',
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current && gsap) {
      const element = cardRef.current;
      
      let fromProps: any = {};
      let toProps: any = {};

      switch (animation) {
        case 'fadeUp':
          fromProps = { opacity: 0, y: 50 };
          toProps = { opacity: 1, y: 0 };
          break;
        case 'fadeIn':
          fromProps = { opacity: 0 };
          toProps = { opacity: 1 };
          break;
        case 'slideLeft':
          fromProps = { opacity: 0, x: -50 };
          toProps = { opacity: 1, x: 0 };
          break;
        case 'slideRight':
          fromProps = { opacity: 0, x: 50 };
          toProps = { opacity: 1, x: 0 };
          break;
        case 'scale':
          fromProps = { opacity: 0, scale: 0.8 };
          toProps = { opacity: 1, scale: 1 };
          break;
      }

      try {
        gsap.fromTo(element, fromProps, {
          ...toProps,
          duration: 0.8,
          delay,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        });
      } catch (error) {
        console.warn('GSAP animation failed:', error);
        // Fallback to CSS animation
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }

      // Simple hover animations
      const handleMouseEnter = () => {
        try {
          gsap.to(element, {
            scale: 1.02,
            y: -5,
            duration: 0.3,
            ease: "power2.out"
          });
        } catch (error) {
          console.warn('Hover animation failed:', error);
        }
      };

      const handleMouseLeave = () => {
        try {
          gsap.to(element, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        } catch (error) {
          console.warn('Hover animation failed:', error);
        }
      };

      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [delay, animation]);

  return (
    <div ref={cardRef} className={className} onClick={onClick}>
      {children}
    </div>
  );
};

export default AnimatedCard;