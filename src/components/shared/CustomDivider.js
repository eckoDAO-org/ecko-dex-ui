import React from 'react';
import { useApplicationContext } from '../../contexts';
import { theme } from '../../styles/theme';

const CustomDivider = ({ className, color, style }) => {
  const { themeMode } = useApplicationContext();
  return <div className={className} style={{ width: '100%', height: 1, backgroundColor: color || `${theme(themeMode).colors.white}66`, ...style }} />;
};

export default CustomDivider;
