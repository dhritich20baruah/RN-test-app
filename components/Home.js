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
      <TouchableOpacity onPress={()=>navigation.navigate("About")} style={styles.btn}>
      <Text style={styles.btnText}>ABOUT</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>navigation.navigate("Notes")} style={styles.btn}>
      <Text style={styles.btnText}>NOTES</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 20
  },
  btn: {
    width: 80,
    backgroundColor: "indigo",
    margin: 5,
    padding: 5
  },
  btnText:{
    textAlign: 'center',
    color: 'white'
  }
});
