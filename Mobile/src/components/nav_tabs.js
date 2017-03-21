// Import Libaries
import React, { Component } from 'react';
import { View } from 'react-native';

// Import components, functions, and styles
import NavTab from './nav_tab';
import styles from '../styles/styles_main';

class NavTabs extends Component {
  renderTab(route, index) {
    return (
      <NavTab
        key={route.key}
        route={route}
        selected={this.props.navigationState.index === index}
        navigate={this.props.navigate}
      />
    );
  }

  render() {
    return (
      <View style={styles.tabs}>
        {this.props.navigationState.routes.filter(item => item.inTabs).map(this.renderTab, this)}
      </View>
    );
  }
}

NavTabs.propTypes = {
  navigationState: React.PropTypes.object,
  navigate: React.PropTypes.func,
};

export default NavTabs;
