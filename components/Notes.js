import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

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

export default function Notes() {
  return (
    <SQLiteProvider databaseName="testapp.db" onInit={initializeDb}>
      <Todos />
    </SQLiteProvider>
  );
}

export function Todos() {
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const [notes, setNotes] = useState([]);

  async function fetchNotes() {
    const result = await db.getAllAsync("SELECT * FROM notes");
    setNotes(result);
  }

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await fetchNotes();
      })();
    }, [])
  );

  const deleteNote = async (id) => {
    try {
      await db.runAsync("DELETE FROM notes WHERE id = ?", [id]);
      Alert.alert("Note deleted");
      let lastNote = [...prevNotes].filter((note) => note.id != id);
      setPrevNotes(lastNote);
    } catch (error) {
      console.log(error);
    }
  };

  const viewNote = async (id) => {
    try {
      navigation.navigate("ViewNote", { id });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {notes.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                width: "100%",
                padding: 10,
                backgroundColor: "#caf1de",
                marginVertical: 10,
                elevation: 5,
              }}
            >
              <View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{ fontSize: 15, fontStyle: "italic", color: "red" }}
                  >
                    {item.date}
                  </Text>
                  <TouchableOpacity style={{ margin: 5 }}>
                    <Text onPress={() => deleteNote(item.id)}>
                      <Ionicons name="trash-outline" size={25} color="red" />
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text
                  style={{ fontSize: 15 }}
                  onPress={() => viewNote(item.id)}
                >
                  {item.note.slice(0, 50)}....
                </Text>
              </View>
            </View>
          );
        })}
      </View>
      <StatusBar style="auto" />
      <TouchableOpacity
        style={styles.floatBtn}
        onPress={() => navigation.navigate("AddNote")}
      >
        <Text style={styles.btnText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    position: "relative",
    height: "100%",
  },
  floatBtn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "orange",
    position: "absolute",
    borderRadius: 50,
    top: "80%",
    right: 30,
    width: 50,
    height: 50,
    elevation: 5,
  },
  btnText: {
    color: "white",
    fontSize: 35,
  },
});
