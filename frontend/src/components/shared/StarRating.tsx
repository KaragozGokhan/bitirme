import React, { useState, MouseEvent } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Star, StarBorder, StarHalf } from '@mui/icons-material';

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

  const handleStarHover = (e: React.MouseEvent<HTMLButtonElement>, starIndex: number) => {
    if (readonly) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    if (x < width / 2) {
      setHoverRating(starIndex * 2 - 1);
    } else {
      setHoverRating(starIndex * 2);
    }
  };

  const handleStarClick = (e: React.MouseEvent<HTMLButtonElement>, starIndex: number) => {
    if (readonly) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    if (x < width / 2) {
      onRatingChange(starIndex * 2 - 1);
    } else {
      onRatingChange(starIndex * 2);
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
        let icon;
        const current = hoverRating || rating;
        if (current >= starIndex * 2) {
          icon = <Star sx={{ fontSize: getStarSize() }} />;
        } else if (current === starIndex * 2 - 1) {
          icon = <StarHalf sx={{ fontSize: getStarSize() }} />;
        } else {
          icon = <StarBorder sx={{ fontSize: getStarSize() }} />;
        }
        return (
          <Tooltip
            key={starIndex}
            title={readonly ? `${starIndex} yıldız` : `${starIndex} yıldız ver`}
          >
            <IconButton
              size="small"
              onMouseMove={e => handleStarHover(e, starIndex)}
              onMouseLeave={handleMouseLeave}
              onClick={e => handleStarClick(e, starIndex)}
              disabled={readonly}
              sx={{
                p: 0.25,
                color: current >= starIndex * 2 - 1 ? 'warning.main' : 'action.disabled',
                '&:hover': {
                  color: readonly ? 'warning.main' : 'warning.light',
                },
              }}
            >
              {icon}
            </IconButton>
          </Tooltip>
        );
      })}
    </Box>
  );
}; 