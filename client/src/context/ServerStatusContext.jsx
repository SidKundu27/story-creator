import React, { createContext, useContext, useState, useEffect } from 'react';

const ServerStatusContext = createContext();

export const useServerStatus = () => useContext(ServerStatusContext);

export const ServerStatusProvider = ({ children }) => {
  const [isLoadingServer, setIsLoadingServer] = useState(true);

  return (
    <ServerStatusContext.Provider value={{ isLoadingServer, setIsLoadingServer }}>
      {children}
    </ServerStatusContext.Provider>
  );
};
