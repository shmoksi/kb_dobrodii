import React, { PureComponent } from 'react';

export default function stateToggle(name, modificatorPrefix = name) {
  return function(Child) {
    return class StateToggle extends PureComponent {
      state = { [name]: false };

      componentWillMount() {
        this.methods = {
          [`${modificatorPrefix}Enable`]: this.enable,
          [`${modificatorPrefix}Disable`]: this.disable,
          [`${modificatorPrefix}Toggle`]: this.toggle,
          [`${modificatorPrefix}Set`]: this.set,
        };
      }

      enable = () => this.setState({ [name]: true });

      disable = () => this.setState({ [name]: false });

      toggle = () => this.setState({ [name]: !this.state[name] });

      set = el => this.setState({ [name]: el });

      render() {
        return <Child {...this.props} {...this.methods} {...this.state} />;
      }
    };
  };
}
