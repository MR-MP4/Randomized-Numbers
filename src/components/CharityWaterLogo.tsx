import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'responsive';
  className?: string;
}

export const CharityWaterLogo: React.FC<LogoProps> = ({
  size = 'md',
  className = '',
}) => {
  return (
    <div
      className={`charity-logo-box charity-logo-${size} ${className}`}
      title="Charity: Water"
      aria-label="Charity: Water logo"
    >
      <svg
        className="charity-logo-svg"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Handle */}
        <rect x="28" y="10" width="44" height="12" rx="4" fill="#f3cf42" />
        <rect x="40" y="15" width="20" height="7" rx="3" fill="#050505" />
        {/* Spout */}
        <rect x="70" y="12" width="7" height="10" rx="2" fill="#f3cf42" />
        {/* Can body */}
        <rect
          x="22"
          y="22"
          width="56"
          height="68"
          rx="5"
          fill="#f3cf42"
          stroke="#d5b22b"
          strokeWidth="1.5"
        />
        {/* Embossed X ribbing */}
        <line
          x1="33"
          y1="34"
          x2="67"
          y2="78"
          stroke="#050505"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <line
          x1="67"
          y1="34"
          x2="33"
          y2="78"
          stroke="#050505"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Center plate */}
        <rect x="44" y="50" width="12" height="6" fill="#f3cf42" rx="2" />
      </svg>
      <span className="charity-logo-text">charity: water</span>
    </div>
  );
};
