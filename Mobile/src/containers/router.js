// Import Libraries
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

// Import Scenes
import Feedback from '../scenes/Feedback';
import NewProjects from '../scenes/NewProjects';
import Projects from '../scenes/Projects';
import ProjectDetails from '../scenes/ProjectDetails';
import Settings from '../scenes/Settings';

// Import icons
// import FeedbackSelected from '../../images/icons/feedback2-selected_100px.png';
// import FeedbackNotSelected from '../../images/icons/feedback2-notselected_100px.png';
import NewProjectsSelected from '../../images/icons/newprojects2-selected_100px.png';
// import NewProjectsNotSelected from '../../images/icons/newprojects2-notselected_100px.png';
// import AllProjectsSelected from '../../images/icons/allprojects4-selected_100px.png';
// import AllProjectsNotSelected from '../../images/icons/allprojects4-notselected_100px.png';

function settingsButton(navigate) {
  const right = (
    <TouchableOpacity
      style={{ width: 50 }}
      onPress={() => navigate('Settings')}
    >
      <Icon name="settings" size={25} />
    </TouchableOpacity>
  );

  return right;
}

export const FeedbackStack = StackNavigator({
  Feedback: {
    screen: Feedback,
    navigationOptions: {
      title: 'Send Feedback',
      header: ({ navigate }) => ({
        right: settingsButton(navigate),
        style: { height: 45 },
      }),
    },
  },
  Settings: {
    screen: Settings,
    navigationOptions: {
      title: 'Settings',
      header: {
        style: { height: 45 },
      },
    },
  },
});

export const NewProjectsStack = StackNavigator({
  NewProjects: {
    screen: NewProjects,
    navigationOptions: {
      title: 'New Projects',
      header: {
        style: { height: 45 },
      },
    },
  },
});

export const ProjectsStack = StackNavigator({
  Projects: {
    screen: Projects,
    navigationOptions: {
      title: 'Projects',
      header: {
        style: { height: 45 },
      },
    },
  },
  Details: {
    screen: ProjectDetails,
    navigationOptions: {
      title: 'Project Details',
      header: {
        style: { height: 45 },
      },
    },
  },
});

export const Tabs = TabNavigator(
  {
    Feedback: {
      screen: FeedbackStack,
      navigationOptions: {
        tabBar: {
          label: 'Feedback',
          icon: ({ tintColor }) => <Icon name="create" size={22} color={tintColor} />,
          // icon: <Image source={FeedbackSelected} style={{ width: 22, height: 22 }} />,
        },
      },
    },
    NewProjects: {
      screen: NewProjectsStack,
      navigationOptions: {
        tabBar: {
          label: 'New Projects',
          // icon: ({ tintColor }) => <Icon name="mode-edit" size={22} color={tintColor} />,
          icon: <Image source={NewProjectsSelected} style={{ width: 22, height: 22 }} />,
        },
      },
    },
    ProjectsStack: {
      screen: ProjectsStack,
      navigationOptions: {
        tabBar: {
          label: 'Projects',
          icon: ({ tintColor }) => <Icon name="view-list" size={22} color={tintColor} />,
          // icon: <Image source={AllProjectsSelected} style={{ width: 22, height: 22 }} />,
        },
      },
    },
  },
  {
    swipeEnabled: false,
    tabBarOptions: {
      showIcon: true,
      tabStyle: { margin: 0, padding: 8, height: 55 },
      labelStyle: { margin: 0, padding: 0, fontSize: 11 },
    },
  });

export const Root = StackNavigator({
  Tabs: {
    screen: Tabs,
  },
  Settings: {
    screen: Settings,
  },
}, {
  mode: 'modal',
  headerMode: 'none',
});
