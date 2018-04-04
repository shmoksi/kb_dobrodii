import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
} from 'react-bootstrap';

export default class Input extends PureComponent {
  render() {
    const {
      input: { onBlur, onFocus, onChange, value, name },
      type = 'text',
      label,
      placeholder,
      helpText,
      autoComplete,
      meta: { touched, error },
    } = this.props;
    return (
      <FormGroup
        controlId={name}
        validationState={touched && error ? 'error' : null}
      >
        <ControlLabel>{label}</ControlLabel>
        {helpText && <HelpBlock>{helpText}</HelpBlock>}
        <FormControl
          type={type}
          value={value}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={e => onChange(e.target.value)}
        />
        {touched && error && <HelpBlock>{error}</HelpBlock>}
      </FormGroup>
    );
  }
}
