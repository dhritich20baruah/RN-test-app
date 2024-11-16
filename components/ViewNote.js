import React, { useState, useEffect } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Button,
} from "react-native";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";

export default function ViewNote({route}) {
    const {id} = route.params
  return (
    <SQLiteProvider databaseName="testapp.db">
      <Editor id={id}/>
    </SQLiteProvider>
  );
}

export function Editor(id) {
  const noteID = id.id
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const [note, setNote] = useState("");

 useEffect(()=>{
    fetchNote()
  }, [])

  async function fetchNote() {
    try {
        // Fetch the note first
        const result = await db.getFirstAsync(
          "SELECT note FROM notes WHERE id = ?",
          [noteID]
        );
        console.log("Fetched note:", result.note); // Log fetched note
  
        // Then set the note
        setNote(result.note);
      } catch (error) {
        console.log(error);
      }
  }

  const updateNote = async () => {
    let text = note;
    const result = await db.runAsync("UPDATE notes set note = ? WHERE id = ?", [
      text,
      noteID,
    ]);
    navigation.goBack()
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
      <Button title="UPDATE" onPress={updateNote} />
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
