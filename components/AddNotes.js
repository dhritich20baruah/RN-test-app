import React, { useState } from "react";
import { TextInput, StyleSheet, View, TouchableOpacity, Text, Button } from "react-native";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";

const initializeDb = async (db) => {
  try {
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, note TEXT);
        `);
    console.log("DB connected");
  } catch (error) {
    console.log("DB initialization error:", error);
  }
};

export default function AddNote() {
  return (
    <SQLiteProvider databaseName="testapp.db" onInit={initializeDb}>
      <Notes />
    </SQLiteProvider>
  );
}

export function Notes() {
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const [note, setNote] = useState("");
  const [prevNotes, setPrevNotes] = useState([]);
  const [noteID, setNoteID] = useState("");
  const [visible, setVisible] = useState(false);

  const addNote = async () => {
    let dateString = new Date().toISOString();
    let date = dateString
      .slice(0, dateString.indexOf("T"))
      .split("-")
      .reverse()
      .join("-");

    let res = await db.runAsync(
      "INSERT INTO notes (date, note) values (?, ?)",
      [date, note]
    );
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        multiline={true}
        value={note}
        onChangeText={(inputText) => setNote(inputText)}
        placeholder="Type your notes here..."
        textAlignVertical="top" // Ensures text starts from the top
      />
      <Button title="ADD NOTE" onPress={addNote}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  textInput: {
    flex: 1,
    padding: 20,
    fontSize: 16,
    textAlignVertical: "top", // Ensures text starts from the top of the input
  },
});
