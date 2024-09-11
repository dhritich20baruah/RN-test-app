import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./components/Home";
import About from "./components/About";
import Notes from "./components/Notes";
import "expo-dev-client"

const Stack = createNativeStackNavigator()

export default function App() {
  return (
   <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home}/>
      <Stack.Screen name="About" component={About}/>
      <Stack.Screen name="Notes" component={Notes}/>
    </Stack.Navigator>
   </NavigationContainer>
  );
}

