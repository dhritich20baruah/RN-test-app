import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite/next";
import { useEffect, useState } from "react";

export default function About() {
  return (
    <View style={styles.container}>
      <SQLiteProvider databaseName="test2.db" onInit={migrateDbIfNeeded}>
        <Content />
      </SQLiteProvider>
    </View>
  );
}


export function Content() {
  const db = useSQLiteContext();
  const [todos, setTodos] = useState([]);
  const [value, setValue] = useState("")
  const [intValue, setIntValue] = useState(0)

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync("SELECT * FROM todos");
      setTodos(result);
    }
    setup();
  }, []);

  // const addNote = async () => {
  //   let res = await db.runAsync(
  //     "INSERT INTO todos (value, intValue) VALUES (?, ?)",
  //     [value, intValue]
  //   );
  // };

  return (
    <ScrollView>
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={(inputText) => setValue(inputText)}
          placeholder="Type your notes here..."
        />
        <TextInput
          style={styles.textInput}
          value={intValue}
          onChangeText={(inputText) => setIntValue(inputText)}
          placeholder="Type your notes here..."
        />
        {/* <Button title="ADD NOTE" onPress={addNote} /> */}
      </View>
      <View style={{ backgroundColor: "red", display: "flex" }}>
        {todos.map((todo, index) => (
          <View style={{ margin: 10 }} key={index}>
            <Text>{`${todo.intValue} - ${todo.value}`}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

async function migrateDbIfNeeded(db) {
  const DATABASE_VERSION = 1;
  let { user_version: currentDbVersion } = await db.getFirstAsync(
    "PRAGMA user_version"
  );
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    await db.execAsync(`
PRAGMA journal_mode = 'wal';
CREATE TABLE todos (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
`);
await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'hello', 1);
await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'world', 2);
    currentDbVersion = 1;
  }
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "yellow",
    padding: 10,
  },
  headerContainer: {
    flex: 1,
  },
  headerText: {
    fontSize: 35,
    fontFamily: "monospace",
  },
  textInput: {
    flex: 1,
    padding: 5,
    fontSize: 16,
    textAlignVertical: "top", // Ensures text starts from the top of the input
  },
});
