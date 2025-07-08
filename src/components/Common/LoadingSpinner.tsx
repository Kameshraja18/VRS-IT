import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'blue-600' 
}) => {
  const spinnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (spinnerRef.current) {
      gsap.to(spinnerRef.current, {
        rotation: 360,
        duration: 1,
        repeat: -1,
        ease: "none"
      });
    }
  }, []);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center">
      <div
        ref={spinnerRef}
        className={`${sizeClasses[size]} border-2 border-gray-200 border-t-${color} rounded-full`}
      />
    </div>
  );
};

export default LoadingSpinner;