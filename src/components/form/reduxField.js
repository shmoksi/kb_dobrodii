import React from 'react';
import { Field } from 'redux-form';

export default props => <Field component={props.component} {...props} />;
