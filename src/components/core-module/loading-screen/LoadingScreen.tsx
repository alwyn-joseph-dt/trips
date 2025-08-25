import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { LoadingScreenProps } from '../../../utility/types/loading-screen/LoadingScreen';



const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  return (
    <Backdrop
      sx={{zIndex: (theme) => theme.zIndex.drawer + 100000 }}
      open={isLoading}
    >
      <CircularProgress color="primary" />
    </Backdrop>
  );
};

export default LoadingScreen;