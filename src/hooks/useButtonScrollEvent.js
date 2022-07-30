import { useEffect, useState } from 'react';
import { useGameEditionContext } from '../contexts';

const useButtonScrollEvent = (elementId) => {
  const { setButtons } = useGameEditionContext();
  const [scrollTo, setScrollTo] = useState(0);
  const [wheelScrolling, setWheelScrolling] = useState(false);

  const onWheelEvent = () => {
    const elementContainer = document.getElementById(elementId);

    elementContainer.addEventListener('wheel', () => {
      setWheelScrolling(true);
      setTimeout(() => {
        setScrollTo(Math.ceil(elementContainer.scrollTop / 20) * 20);
      }, 200);
    });
  };

  useEffect(() => {
    const elementContainer = document.getElementById(elementId);
    if (elementContainer) {
      onWheelEvent();

      if (!wheelScrolling) {
        elementContainer.scrollTo(0, scrollTo);
      }
      setButtons((prev) => ({
        ...prev,
        Down: () => {
          if (scrollTo + elementContainer.clientHeight < elementContainer.scrollHeight || scrollTo === 0) {
            setWheelScrolling(false);
            setScrollTo((prev) => prev + 20);
          }
        },
        Up: () => {
          if (scrollTo >= 0) {
            setWheelScrolling(false);
            setScrollTo((prev) => prev - 20);
          }
        },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollTo, elementId]);
};
export default useButtonScrollEvent;
