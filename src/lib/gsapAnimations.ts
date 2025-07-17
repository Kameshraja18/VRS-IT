import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins with error handling
try {
  gsap.registerPlugin(ScrollTrigger);
} catch (error) {
  console.warn('GSAP plugin registration failed:', error);
}

export const initGSAP = () => {
  try {
    // Page load animation
    const pageElements = document.querySelectorAll('.page-enter');
    if (pageElements.length > 0) {
      gsap.fromTo('.page-enter', 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }
      );
    }
  } catch (error) {
    console.warn('GSAP initialization failed:', error);
  }
};

export const animateCards = (selector: string) => {
  try {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
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
    }
  } catch (error) {
    console.warn('Card animation failed:', error);
  }
};

export const animateNavigation = () => {
  try {
    const navItems = document.querySelectorAll('.nav-item');
    if (navItems.length > 0) {
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
    }
  } catch (error) {
    console.warn('Navigation animation failed:', error);
  }
};

export const animateStats = (selector: string) => {
  try {
    const statElements = document.querySelectorAll(`${selector} .stat-number`);
    if (statElements.length > 0) {
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
    }
  } catch (error) {
    console.warn('Stats animation failed:', error);
  }
};

export const animateHover = (element: HTMLElement) => {
  try {
    if (element) {
      gsap.to(element, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  } catch (error) {
    console.warn('Hover animation failed:', error);
  }
};

export const animateHoverOut = (element: HTMLElement) => {
  try {
    if (element) {
      gsap.to(element, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  } catch (error) {
    console.warn('Hover out animation failed:', error);
  }
};

export const animateModal = (selector: string, show: boolean) => {
  try {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
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
    }
  } catch (error) {
    console.warn('Modal animation failed:', error);
  }
};

export const animateNotification = (selector: string) => {
  try {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
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
    }
  } catch (error) {
    console.warn('Notification animation failed:', error);
  }
};

export const animateProgress = (selector: string, progress: number) => {
  try {
    const progressBars = document.querySelectorAll(`${selector} .progress-bar`);
    if (progressBars.length > 0) {
      gsap.to(`${selector} .progress-bar`, {
        width: `${progress}%`,
        duration: 1.5,
        ease: "power2.out"
      });
    }
  } catch (error) {
    console.warn('Progress animation failed:', error);
  }
};

export const animateChartEntry = (selector: string) => {
  try {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      gsap.fromTo(selector,
        { opacity: 0, scale: 0.9 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.8,
          ease: "power2.out"
        }
      );
    }
  } catch (error) {
    console.warn('Chart animation failed:', error);
  }
};