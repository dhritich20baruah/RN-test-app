import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";

export default function Home({navigation}) {
  return (
    <View style={styles.container}>
      <Text>Home Screen: This is the home screen</Text>
      <Button onPress={()=>navigation.navigate("About")} title="About"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 30,
  },
});
