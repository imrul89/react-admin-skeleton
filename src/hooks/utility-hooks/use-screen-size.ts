import { useState, useEffect } from 'react';

const useScreenSize = () => {
  const [windowSize, setWindowSize] = useState({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return windowSize;
};

export default useScreenSize;
