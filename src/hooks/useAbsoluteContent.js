import { useEffect, useCallback } from 'react';

const useAbsoluteContent = (contentId, screenId) => {
  const setSvgContentWidth = useCallback(() => {
    const svgContent = document.getElementById(contentId);
    const svgContainer = document.getElementById(screenId);
    if (svgContent && svgContainer) {
      const containerRect = svgContainer.getBoundingClientRect();
      svgContent.style.left = `${containerRect.left}px`;
      svgContent.style.top = `${containerRect.top}px`;
      svgContent.style.width = `${containerRect.width}px`;
      svgContent.style.height = `${containerRect.height}px`;
    }
  }, [contentId, screenId]);

  useEffect(() => {
    window.addEventListener('resize', setSvgContentWidth);
    setSvgContentWidth();
  }, [setSvgContentWidth]);
};

export default useAbsoluteContent;
