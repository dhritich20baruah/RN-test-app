import React from 'react';
import { BarChart } from 'react-native-gifted-charts';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';

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

const data = [
  { value: 50, label: 'Jan' },
  { value: 80, label: 'Feb' },
  { value: 40, label: 'Mar' },
];

const Chart = () => {
  return (
    <BarChart
      data={data}
      frontColor={'#800000'}
      barWidth={30}
      barBorderRadius={5}
      initialSpacing={10}
      xAxisThickness={1}
    />
  );
};

export function salesFigure(){
  const db = useSQLiteContext();
  
}

export default Chart;
