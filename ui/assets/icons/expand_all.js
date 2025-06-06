import { useTheme } from '@sistent/sistent';
import React from 'react';

const ExpandAllIcon = (props) => {
  const theme = useTheme();
  return (
    <svg
      width="24"
      height="24"
      fill={props.fill || theme.palette.icon.default}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 18.3334L5 13.3334L6.1875 12.1459L10 15.9584L13.8125 12.1459L15 13.3334L10 18.3334ZM6.20833 7.83335L5 6.66669L10 1.66669L15 6.66669L13.7917 7.83335L10 4.04169L6.20833 7.83335Z" />
    </svg>
  );
};

export default ExpandAllIcon;
