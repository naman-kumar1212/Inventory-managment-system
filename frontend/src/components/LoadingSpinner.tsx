import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  minHeight?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 40,
  minHeight = '200px'
}) => (
  <Box 
    display="flex" 
    flexDirection="column"
    justifyContent="center" 
    alignItems="center" 
    minHeight={minHeight}
    gap={2}
  >
    <CircularProgress size={size} />
    <Typography variant="body2" color="textSecondary">
      {message}
    </Typography>
  </Box>
);

export default LoadingSpinner;