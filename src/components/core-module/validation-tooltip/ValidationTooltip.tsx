import React from 'react';
import { Box, styled, Tooltip, tooltipClasses, TooltipProps, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function ValidationTooltip({ error, zindex }) {
  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#ffd3d4',
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }));

  return (
    <LightTooltip
      sx={{
        '& .MuiTooltip-arrow': {
          color: '#ffd3d4', // Change the arrow color to red
        },
      }}
      title={
        <Box display="flex" alignItems="center">
          <WarningAmberIcon color="error" fontSize="small" />
          <Typography variant="body2" color="error" sx={{ marginLeft: '4px' }}>
            {error}
          </Typography>
        </Box>
      }
      arrow
      placement="bottom"
      open
      PopperProps={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, -20], // Adjust the offset to slightly overlap the TextField
            },
          },
          {
            name: 'zIndex',
            enabled: true,
            phase: 'write',
            fn: ({ state }) => {
              state.styles.popper.zIndex = zindex;
            },
          },
        ],
      }}
    >
      <Box display="flex" alignItems="center" />
    </LightTooltip>
  );
}
