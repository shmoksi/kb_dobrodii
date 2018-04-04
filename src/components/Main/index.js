import React from 'react';
import { Grid } from 'react-bootstrap';
import Notification from 'react-notify-toast';

import './index.less';

const Main = ({ children }) => (
  <div id="wrapper">
    <Grid>{children}</Grid>
    <Notification options={{ zIndex: 5000 }} />
  </div>
);

export default Main;
