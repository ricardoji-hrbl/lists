import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/AntDesign';
import CustomerList from './CustomerList';
import LaSectionList from './LaSectionList';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Customers') {
              iconName = focused ? 'user' : 'user';
            } else if (route.name === 'Items') {
              iconName = focused ? 'tags' : 'tagso';
            }

            // You can return any component that you like here!
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}>
        <Tab.Screen name="Customers" component={CustomerList} />
        <Tab.Screen name="Items" component={LaSectionList} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
