import React, { useState, useEffect, useCallback } from "react";
import { BarChart } from "react-native-gifted-charts";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const initializeDb = async (db) => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS sales (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, volume INTEGER, revenue INTEGER);
      `);
    console.log("DB connected");
  } catch (error) {
    console.log("DB initialization error:", error);
  }
};

const Chart = () => {
  return (
    <SQLiteProvider databaseName="testapp.db" onInit={initializeDb}>
      <SalesFigure /> 
    </SQLiteProvider>
  );
};

export function SalesFigure() {
  const db = useSQLiteContext();
  const [volume, setVolume] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [prevSales, setPrevSales] = useState([]);
  const [data, setData] = useState([])

  async function fetchData() {
    const result = await db.getAllAsync("SELECT * FROM sales");
    setPrevSales(result);
    const chartData = result.map((row) => ({
      value: row.revenue,
      label: row.date,
    }));
    setData(chartData)
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const addData = async () => {
    let dateString = new Date().toISOString();
    let date = dateString
      .slice(0, dateString.indexOf("T"))
      .split("-")
      .reverse()
      .join("-");

    let res = await db.runAsync(
      "INSERT INTO sales (date, volume, revenue) values (?, ?, ?)",
      [date, volume, revenue]
    );
    Alert.alert("Data added");
    let lastSales = [...prevSales];
    lastSales.push({
      id: res.lastInsertRowId,
      date: date,
      volume: volume,
      revenue: revenue,
    });
    setPrevSales(lastSales);
    setVolume(0);
    setRevenue(0);
  };

  return (
    <ScrollView>
      <View>
        <Text>Sale Volume in Kgs</Text>
        <TextInput
          style={{
            borderColor: "black",
            borderWidth: 1,
            padding: 5,
            width: "100%",
          }}
          value={volume}
          onChangeText={setVolume}
        />
        <Text>Revenue Collected in INR</Text>
        <TextInput
          style={{
            borderColor: "black",
            borderWidth: 1,
            padding: 5,
            width: "100%",
          }}
          value={revenue}
          onChangeText={setRevenue}
        />
        <Button title="ADD DATA" onPress={addData} color="blue" />
      </View>

      <BarChart
        data={data}
        frontColor={"#800000"}
        barWidth={30}
        barBorderRadius={5}
        initialSpacing={10}
        xAxisThickness={1}
      />
    </ScrollView>
  );
}

export default Chart;
