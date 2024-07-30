import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Button, Alert } from "react-native";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";

const initializeDb = async (db) => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS testTable2 (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, figure INTEGER);
      `);
    console.log("DB connected");
  } catch (error) {
    console.log(error);
  }
};

export default function App() {
  return (
    <SQLiteProvider databaseName="testapp.db" onInit={initializeDb}>
      <Todos />
    </SQLiteProvider>
  );
}

export function Todos() {
  const db = useSQLiteContext();

  const [figures, setFigures] = useState("");
  const [prevReadings, setPrevReadings] = useState([]);

  useEffect(() => {
    async function fetchFigures() {
      const result = await db.getAllAsync("SELECT * FROM testTable2");
      setPrevReadings(result);
      console.log(result);
    }
    fetchFigures();
  }, []);

  const handleSubmit = async () => {
    const figureValue = parseFloat(figures);
    if (isNaN(figureValue)) {
      alert("Please enter a valid number");
      return;
    }

    let dateString = new Date().toISOString();
    let date = dateString
      .slice(0, dateString.indexOf("T"))
      .split("-")
      .reverse()
      .join("-");
    try {
      await db.runAsync("INSERT INTO testTable2 (date, figure) values (?, ?)", [
        date,
        figureValue,
      ]);
      Alert.alert("Data added")
      let lastReading = [...prevReadings];
      lastReading.push({
        date: date,
        figure: figureValue,
      });
      setPrevReadings(lastReading);
      setFigures("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>TEST APP</Text>
      <TextInput
        style={{ margin: 10, borderColor: "black", borderWidth: 1, padding: 5 }}
        keyboardType="numeric"
        value={figures}
        onChangeText={setFigures}
        placeholder="0"
      />
      <Button title="submit" onPress={handleSubmit} color="lightgreen" />
      <View>
        {prevReadings.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "80%",
              }}
            >
              <Text>{item.date}</Text>
              <Text>{item.figure}</Text>
            </View>
          );
        })}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    marginVertical: 30,
  },
});
