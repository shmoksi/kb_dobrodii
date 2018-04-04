import React, { PureComponent } from 'react';
import { browserHistory, withRouter } from 'react-router';
import UrlPattern from 'url-pattern';

export default patternStr => Child => {
  const pattern = new UrlPattern(patternStr);

  @withRouter
  class tabPattern extends PureComponent {
    get match() {
      return pattern.match(window.location.pathname);
    }

    onTabClick = tab =>
      browserHistory.push(pattern.stringify({ ...this.match, tab }));

    render() {
      return (
        <Child
          pattern={pattern}
          onTabClick={this.onTabClick}
          {...this.match}
          {...this.props}
        />
      );
    }
  }
  return tabPattern;
};
