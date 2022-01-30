import { useLayoutEffect, useState } from 'react';

const useLazyImage = (src) => {
  const [loaded, setLoaded] = useState(false);

  useLayoutEffect(() => {
    const imageLoader = new Image();
    imageLoader.src = src;
    imageLoader.onload = () => {
      setLoaded(true);
    };
  }, []);

  return [loaded];
};

export default useLazyImage;
