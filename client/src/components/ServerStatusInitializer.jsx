import React, { useEffect } from 'react';
import { useServerStatus } from '../context/ServerStatusContext';
import { checkServerStatus } from '../utils/healthCheck';

const ServerStatusInitializer = () => {
  const { setIsLoadingServer } = useServerStatus();

  useEffect(() => {
    checkServerStatus(setIsLoadingServer);
  }, [setIsLoadingServer]);

  return null; // This component doesn't render anything visible
};

export default ServerStatusInitializer;
