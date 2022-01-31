/* eslint-disable react-hooks/exhaustive-deps */
import { useLayoutEffect, useState } from 'react';

const useLazyImage = (srcs) => {
  const [loaded, setLoaded] = useState(false);

  const checkImage = (path) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(path);
      img.onerror = () => reject();

      img.src = path;
    });

  useLayoutEffect(() => {
    Promise.all(srcs.map((src) => checkImage(src))).then(
      () => setLoaded(true),
      () => console.error('could not load images')
    );
  }, []);

  return [loaded];
};

export default useLazyImage;
