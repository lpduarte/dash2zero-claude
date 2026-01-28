import { useState, useEffect } from "react";

// Text Reveal Animation
const TextReveal = ({ children, className = "" }: { children: string; className?: string }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsActive(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const characters = children.split('');
  let charIndex = 0;

  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {characters.map((char, index) => {
        if (char === ' ') {
          return <span key={index} className="inline-block">&nbsp;</span>;
        }
        const delay = 0.05 + charIndex * 0.04;
        charIndex++;
        return (
          <span
            key={index}
            className={`inline-block transition-all duration-500 ${
              isActive
                ? 'opacity-100 blur-0 scale-100'
                : 'opacity-0 blur-sm scale-110'
            }`}
            style={{
              transitionDelay: `${delay}s`,
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};

export default TextReveal;
