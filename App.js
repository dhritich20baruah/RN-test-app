import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./components/Home";
import About from "./components/About";
import Notes from "./components/Notes";
import Maps from "./components/Maps";
import "expo-dev-client"
import AddNote from "./components/AddNotes";
import ViewNote from "./components/ViewNote";

const Stack = createNativeStackNavigator()

export default function App() {
  return (
   <NavigationContainer>
    <StatusBar style="auto" />
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home}/>
      <Stack.Screen name="About" component={About}/>
      <Stack.Screen name="Notes" component={Notes}/>
      <Stack.Screen name="AddNote" component={AddNote}/>
      <Stack.Screen name="ViewNote" component={ViewNote}/>
      <Stack.Screen name="Maps" component={Maps}/>
    </Stack.Navigator>
   </NavigationContainer>
  );
}

