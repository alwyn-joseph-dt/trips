import { Box, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';

const Container = ({ children }: React.PropsWithChildren) => {
  const muiTheme = useTheme();
  const isMobileView = useMediaQuery(muiTheme.breakpoints.down('md'));

  return (
    <Box sx={{ p: isMobileView ? 0 : 4, maxWidth: 1280, m: 'auto' }}>
      {children}
    </Box>
  );
};

export default Container;
