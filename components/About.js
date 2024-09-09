import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    Alert,
    TouchableOpacity,
  } from "react-native";
  import Chart from "./Chart";
  
  export default function About() {
    return (
      <View style={styles.container}>
        <Text>About Screen</Text>
        <Chart/>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
      padding: 10
    },
  });
  