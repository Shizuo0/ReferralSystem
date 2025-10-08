import './SkeletonLoader.css';

interface SkeletonLoaderProps {
  variant?: 'text' | 'circle' | 'rectangle';
  width?: string | number;
  height?: string | number;
  count?: number;
}

/**
 * Componente de skeleton loader para placeholder de conteúdo
 */
export function SkeletonLoader({ 
  variant = 'text',
  width,
  height,
  count = 1,
}: SkeletonLoaderProps) {
  const getStyles = () => {
    const baseStyles: React.CSSProperties = {
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
    };

    if (variant === 'text') {
      return {
        ...baseStyles,
        height: height || '16px',
        width: width || '100%',
      };
    }

    if (variant === 'circle') {
      const size = width || height || '40px';
      return {
        width: size,
        height: size,
        borderRadius: '50%',
      };
    }

    if (variant === 'rectangle') {
      return {
        ...baseStyles,
        width: width || '100%',
        height: height || '100px',
      };
    }

    return baseStyles;
  };

  const skeletons = Array.from({ length: count }, (_, i) => (
    <div 
      key={i} 
      className={`skeleton skeleton-${variant}`}
      style={getStyles()}
    />
  ));

  return <>{skeletons}</>;
}

/**
 * Skeleton pré-configurado para card de perfil
 */
export function ProfileSkeleton() {
  return (
    <div className="skeleton-profile">
      <div className="skeleton-profile-header">
        <SkeletonLoader variant="text" width="120px" height="32px" />
        <SkeletonLoader variant="rectangle" width="80px" height="36px" />
      </div>
      
      <div className="skeleton-profile-info">
        <SkeletonLoader variant="text" width="60%" height="20px" />
        <SkeletonLoader variant="text" width="80%" height="20px" />
      </div>

      <div className="skeleton-profile-score">
        <SkeletonLoader variant="rectangle" width="100%" height="120px" />
      </div>

      <div className="skeleton-profile-referral">
        <SkeletonLoader variant="text" width="150px" height="24px" />
        <SkeletonLoader variant="text" width="100%" height="16px" />
        <SkeletonLoader variant="rectangle" width="100%" height="48px" />
      </div>
    </div>
  );
}

/**
 * Skeleton pré-configurado para formulário
 */
export function FormSkeleton({ fields = 3 }: { fields?: number }) {
  return (
    <div className="skeleton-form">
      {Array.from({ length: fields }, (_, i) => (
        <div key={i} className="skeleton-form-field">
          <SkeletonLoader variant="text" width="100px" height="16px" />
          <SkeletonLoader variant="rectangle" width="100%" height="44px" />
        </div>
      ))}
      <SkeletonLoader variant="rectangle" width="100%" height="44px" />
    </div>
  );
}
