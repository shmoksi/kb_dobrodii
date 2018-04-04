import React from 'react';

export const classToFunc = forRender => (props, i) =>
  React.createElement(forRender, props);
