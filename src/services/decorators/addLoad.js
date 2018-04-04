import React, { PureComponent } from 'react';
import { reduce } from 'lodash';

import stateSend from '../stateSend';

export default function addLoad({
  name = 'load',
  loadingName = `${name}ing`,
  defaultState = false,
  mapMethods,
} = {}) {
  return function(Child) {
    class StateLoading extends PureComponent {
      state = { loading: defaultState };

      componentWillMount() {
        this.methods = {
          [`${name}Enable`]: this.enable,
          [`${name}Disable`]: this.disable,
          [`${name}Toggle`]: this.toggle,
          [`${name}Set`]: this.set,
          [`state${loadingName}`]: this.stateLoading,
          ...this.mappedMethods,
        };
      }

      enable = () => this.setState({ [name]: true });

      disable = () => this.setState({ [name]: false });

      toggle = () => this.setState({ [name]: !this.state[name] });

      set = el => this.setState({ [name]: el });

      stateLoading = (promise, opts) => stateSend(this.set, promise, opts);

      // TODO: check auth logout

      mapfunc = func => (...args) => this.stateLoading(func(...args));

      get mappedMethods() {
        return reduce(
          mapMethods,
          (result, method, key) => ({ ...result, [key]: this.mapfunc(method) }),
          {},
        );
      }

      render() {
        const opt = { [loadingName]: this.state.loading };
        return <Child {...this.props} {...opt} {...this.methods} />;
      }
    }
    return StateLoading;
  };
}
