import React, { useState } from 'react';

const StarRating = ({ value = 0, onChange, readOnly = false, size = 'md' }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'fs-6';
      case 'lg': return 'fs-4';
      case 'xl': return 'fs-2';
      default: return 'fs-5';
    }
  };

  const handleClick = (rating) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating) => {
    if (!readOnly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(0);
    }
  };

  const getStarClass = (index) => {
    const currentValue = hoverValue || value;
    const filled = index <= currentValue;
    
    if (readOnly) {
      return filled ? 'text-warning' : 'text-muted';
    }
    
    return filled ? 'text-warning' : 'text-secondary';
  };

  return (
    <div className="star-rating d-inline-flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <i
          key={star}
          className={`bi bi-star-fill ${getSizeClass()} ${getStarClass(star)} ${
            !readOnly ? 'cursor-pointer' : ''
          }`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          style={{
            cursor: readOnly ? 'default' : 'pointer',
            marginRight: '2px',
            transition: 'color 0.2s ease'
          }}
          title={readOnly ? '' : `Rate ${star} star${star !== 1 ? 's' : ''}`}
        />
      ))}
    </div>
  );
};

export default StarRating;
