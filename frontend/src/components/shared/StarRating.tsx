import React, { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  readonly?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  onRatingChange, 
  readonly = false,
  size = 'medium' 
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (starIndex: number) => {
    if (!readonly) {
      setHoverRating(starIndex);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const handleClick = (starIndex: number) => {
    if (!readonly) {
      onRatingChange(starIndex);
    }
  };

  const getStarSize = () => {
    switch (size) {
      case 'small': return 20;
      case 'large': return 32;
      default: return 24;
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const isFilled = readonly 
          ? starIndex <= rating 
          : starIndex <= (hoverRating || rating);
        
        return (
          <Tooltip 
            key={starIndex} 
            title={readonly ? `${starIndex} yıldız` : `${starIndex} yıldız ver`}
          >
            <IconButton
              size="small"
              onMouseEnter={() => handleMouseEnter(starIndex)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(starIndex)}
              disabled={readonly}
              sx={{ 
                p: 0.5,
                color: isFilled ? 'warning.main' : 'action.disabled',
                '&:hover': {
                  color: readonly ? 'warning.main' : 'warning.light',
                }
              }}
            >
              {isFilled ? (
                <Star sx={{ fontSize: getStarSize() }} />
              ) : (
                <StarBorder sx={{ fontSize: getStarSize() }} />
              )}
            </IconButton>
          </Tooltip>
        );
      })}
    </Box>
  );
}; 