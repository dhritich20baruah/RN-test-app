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
} from "react-native";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";

const initializeDb = async (db) => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, note TEXT);
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

  const [note, setNote] = useState("");
  const [prevNotes, setPrevNotes] = useState([]);
  const [noteID, setNoteID] = useState('');
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    async function fetchnote() {
      if (db) {
        try {
          const result = await db.getAllAsync("SELECT * FROM notes");
          setPrevNotes(result);
        } catch (error) {
          console.error("Database operation failed:", error);
        }
      } else {
        console.error("Database is not open");
      }
    }
    fetchnote();
  }, []);

  const handleSubmit = async () => {
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
    Alert.alert("Data added");
    let lastNote = [...prevNotes];
    lastNote.push({
      id: res.lastInsertRowId,
      date: date,
      note: note,
    });
    setPrevNotes(lastNote);
    setNote("");
  };

  const deleteFigure = async (id) => {
    try {
      let res = await db.runAsync("DELETE FROM notes WHERE id = ?", [id]);
      Alert.alert("Note deleted");
      let lastNote = [...prevNotes].filter(
        (notes) => notes.id != id
      );
      setPrevNotes(lastNote);
    } catch (error) {
      console.log(error);
    }
  };

  const editFigure = async(id)=>{
    setNoteID(id);
    setVisible(true);
    console.log(id)
    try {
      const result = await db.getFirstAsync('SELECT note FROM notes WHERE id = ?', [noteID])
      await setNote(result.note)
    } catch (error) {
      console.log(error)
    }
  }

  const updateNote = async () =>{
    let text = note
    const result = await db.runAsync("UPDATE notes set note = ? WHERE id = ?", [text, noteID])
    setPrevNotes((lastNotes) => {
      return lastNotes.map((note) => { 
        if (note.id === noteID){
          return {...note, note: text}
        }
        return note
      })
    })
    setNote("");
    setVisible(false);
  }

  return (
    <View style={styles.container}>
      <Text style={{paddingVertical: 10, textAlign: 'center', fontWeight: '500'}}>TEST APP</Text>
      <TextInput
        style={{ borderColor: "black", borderWidth: 1, padding: 5, width: '100%' }}
        value={note}
        onChangeText={setNote}
        placeholder="Note"
      />
      {visible ?
      <Button title="update" onPress={updateNote} color="blue" />
      :
      <Button title="submit" onPress={handleSubmit} color="red" />
      }
      <View>
        {prevNotes.map((item, index) => {
          return (
            <View
              key={index}
              style={{                
                width: "100%",
                padding: 10,
                backgroundColor: '#ffe',
                marginVertical: 10
              }}
            >
              <View>
              <Text style={{fontSize: 15, fontStyle: 'italic'}}>{item.date}</Text>
              <Text style={{fontSize: 18, fontWeight: '600'}}>{item.note}</Text>
              </View>
              <View style={{ display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",}}>
                <TouchableOpacity style={{ margin: 5 }}>
                  <Text style={{backgroundColor: 'red', padding: 10, color: 'white'}} onPress={() => deleteFigure(item.id)}>Del</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ margin: 5 }}>
                  <Text style={{backgroundColor: 'blue', padding: 10, color: 'white'}} onPress={() => editFigure(item.id)}>Edit</Text>
                </TouchableOpacity>
              </View>
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
    margin: 30,
  },
});
