import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initGSAP = () => {
  // Page load animation
  gsap.fromTo('.page-enter', 
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }
  );
};

export const animateCards = (selector: string) => {
  gsap.fromTo(selector,
    { opacity: 0, scale: 0.8, y: 30 },
    { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      duration: 0.6,
      stagger: 0.1,
      ease: "back.out(1.7)"
    }
  );
};

export const animateNavigation = () => {
  gsap.fromTo('.nav-item',
    { opacity: 0, x: -20 },
    { 
      opacity: 1, 
      x: 0, 
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.out"
    }
  );
};

export const animateStats = (selector: string) => {
  gsap.fromTo(`${selector} .stat-number`,
    { textContent: 0 },
    {
      textContent: (i, target) => target.getAttribute('data-value'),
      duration: 2,
      ease: "power2.out",
      snap: { textContent: 1 },
      stagger: 0.2
    }
  );
};

export const animateHover = (element: HTMLElement) => {
  gsap.to(element, {
    scale: 1.05,
    duration: 0.3,
    ease: "power2.out"
  });
};

export const animateHoverOut = (element: HTMLElement) => {
  gsap.to(element, {
    scale: 1,
    duration: 0.3,
    ease: "power2.out"
  });
};

export const animateModal = (selector: string, show: boolean) => {
  if (show) {
    gsap.fromTo(selector,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
    );
  } else {
    gsap.to(selector, {
      opacity: 0,
      scale: 0.8,
      duration: 0.2,
      ease: "power2.in"
    });
  }
};

export const animateNotification = (selector: string) => {
  gsap.fromTo(selector,
    { x: 300, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
  );
  
  gsap.to(selector, {
    x: 300,
    opacity: 0,
    duration: 0.3,
    delay: 3,
    ease: "power2.in"
  });
};

export const animateProgress = (selector: string, progress: number) => {
  gsap.to(`${selector} .progress-bar`, {
    width: `${progress}%`,
    duration: 1.5,
    ease: "power2.out"
  });
};

export const animateChartEntry = (selector: string) => {
  gsap.fromTo(selector,
    { opacity: 0, scale: 0.9 },
    { 
      opacity: 1, 
      scale: 1, 
      duration: 0.8,
      ease: "power2.out"
    }
  );
};