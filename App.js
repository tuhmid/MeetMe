
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './src/components/HomePage';
import InstructionsCreateMeet from './src/components/InstructionsCreateMeet';
import JoinMeet from './src/components/JoinMeet';
import CreateMeetDetails from './src/components/CreateMeetDetails';
import CreateMeet from './src/components/CreateMeet';
import JoinMeetDetails from './src/components/JoinMeetDetails';
import Meet from './src/components/Meet';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
// import firebase from 'firebase/app';
// import 'firebase/database'; // Import the database module




const Stack = createNativeStackNavigator();

export default function App() {


  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="InstructionsCreateMeet" component={InstructionsCreateMeet} />
        <Stack.Screen name="JoinMeet" component={JoinMeet} />
        <Stack.Screen name="CreateMeetDetails" component={CreateMeetDetails} />
        <Stack.Screen name="CreateMeet" component={CreateMeet} />
        <Stack.Screen name="Meet" component={Meet} />
        <Stack.Screen name="JoinMeetDetails" component={JoinMeetDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}