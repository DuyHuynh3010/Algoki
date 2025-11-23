'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const [isPointer, setIsPointer] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [isHoveringInput, setIsHoveringInput] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Hide default cursor on all elements except inputs
    const hideCursor = () => {
      document.body.style.cursor = 'none';
      document.documentElement.style.cursor = 'none';
      
      // Also apply to all elements to ensure cursor is hidden, except inputs
      const allElements = document.querySelectorAll('*');
      allElements.forEach((el) => {
        const element = el as HTMLElement;
        // Don't hide cursor on input/textarea elements
        if (
          element.tagName !== 'INPUT' &&
          element.tagName !== 'TEXTAREA' &&
          !element.closest('input') &&
          !element.closest('textarea')
        ) {
          element.style.cursor = 'none';
        }
      });
    };

    hideCursor();

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      
      // Check if hovering over input/textarea
      const isInput = 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('input') ||
        target.closest('textarea');
      
      setIsHoveringInput(Boolean(isInput));
      
      // If hovering input, show system cursor and hide custom cursor
      if (isInput) {
        setIsVisible(false);
        // Restore system text cursor for inputs
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          target.style.cursor = 'text';
        }
        return;
      }

      // Check if hovering over button
      const isButton = 
        target.tagName === 'BUTTON' ||
        target.getAttribute('role') === 'button' ||
        target.closest('button') ||
        target.closest('[role="button"]');
      
      setIsHoveringButton(Boolean(isButton));
      
      // Check if hovering over other clickable elements (links, etc.)
      const isClickable = 
        target.tagName === 'A' ||
        isButton ||
        window.getComputedStyle(target).cursor === 'pointer' ||
        window.getComputedStyle(target).cursor === 'grab';
      
      setIsPointer(Boolean(isClickable));
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Re-hide cursor when DOM changes (for dynamically added elements)
    const observer = new MutationObserver(() => {
      hideCursor();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      observer.disconnect();
      document.body.style.cursor = '';
      document.documentElement.style.cursor = '';
    };
  }, []);

  if (typeof window === 'undefined') return null;

  // Don't show custom cursor when hovering input
  if (isHoveringInput) return null;

  // Determine which icon to show
  const cursorIcon = isHoveringButton 
    ? '/icons/mouse_hover.png' 
    : '/icons/mouse_pointer_32.png';

  return (
    <div
      className="fixed pointer-events-none z-[9999] transition-opacity duration-150"
      style={{
        left: `${mousePosition.x}px`,
        top: `${mousePosition.y}px`,
        transform: 'translate(-10px, -10px)',
        opacity: isVisible ? 1 : 0,
        width: '32px',
        height: '32px',
      }}
    >
      <img
        src={cursorIcon}
        alt="cursor"
        className="w-full h-full object-contain"
        style={{
          filter: isPointer && !isHoveringButton ? 'brightness(1.2)' : 'none',
        }}
        onError={(e) => {
          // Fallback to default cursor if hover icon doesn't exist
          if (isHoveringButton) {
            (e.target as HTMLImageElement).src = '/icons/mouse_pointer_32.png';
          } else {
            (e.target as HTMLImageElement).src = '/icons/mouse_pointer.png';
          }
        }}
      />
    </div>
  );
}

