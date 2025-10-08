import './Logo.css';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

/**
 * Logo component with animated SVG icon and gradient text
 */
function Logo({ size = 'medium', showText = true }: LogoProps) {
  const sizeClass = size === 'small' ? 'logo-small' : size === 'large' ? 'logo-large' : '';

  return (
    <div className={`logo-container ${sizeClass}`}>
      <div className="logo-icon">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer circle with gradient */}
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            stroke="url(#gradient1)" 
            strokeWidth="3"
            fill="none"
            opacity="0.3"
          />
          
          {/* Inner star/burst shape */}
          <path
            d="M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z"
            fill="url(#gradient2)"
            opacity="0.9"
          />
          
          {/* Center circle */}
          <circle 
            cx="50" 
            cy="50" 
            r="20" 
            fill="url(#gradient3)"
          />
          
          {/* Shine effect */}
          <circle 
            cx="45" 
            cy="45" 
            r="8" 
            fill="rgba(255, 255, 255, 0.3)"
            opacity="0.6"
          />

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
            
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            
            <radialGradient id="gradient3" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#7c3aed" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      
      {showText && (
        <span className="logo-text">ReferralHub</span>
      )}
    </div>
  );
}

export default Logo;