import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import MapPage from "./map_page";
import MapScreen from "./map";
import { Place } from "./types";

export type RootStackParamList = {
  MapPage: undefined;
  Map: { places: Place[] };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MapPage" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MapPage" component={MapPage} />
        <Stack.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
