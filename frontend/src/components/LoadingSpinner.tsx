import type { CSSProperties } from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
}

/**
 * Componente de spinner de loading reutilizável
 */
export function LoadingSpinner({ 
  size = 'medium', 
  message,
  fullScreen = false 
}: LoadingSpinnerProps) {
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 56,
  };

  const spinnerSize = sizeMap[size];

  const spinnerStyle: CSSProperties = {
    width: `${spinnerSize}px`,
    height: `${spinnerSize}px`,
    border: `${Math.max(3, spinnerSize / 10)}px solid rgba(139, 92, 246, 0.2)`,
    borderTopColor: 'var(--primary-color)',
  };

  const content = (
    <div className={`loading-spinner-wrapper ${size}`}>
      <div className="loading-spinner" style={spinnerStyle}></div>
      {message && <p className="loading-spinner-message">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loading-spinner-fullscreen">
        {content}
      </div>
    );
  }

  return content;
}
