import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WeatherApp from './Screens/Weather_App';
import LocationsScreen from './Screens/Location_List'

const Stack = createStackNavigator();


const App = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="WeatherApp">
      <Stack.Screen name="WeatherApp" component={WeatherApp}  initialParams={{location: 'Chennai'}} 
      options={{ headerShown: false }}/> 
      <Stack.Screen name="LocationsScreen" component={LocationsScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

