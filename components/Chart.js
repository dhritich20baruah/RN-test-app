import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const Chart = ({data}) => {
  return (
    <LineChart
    data={{
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          data: [20, 45, 28, 80, 99, 43],
        },
      ],
    }}
      width={screenWidth}
      height={300}
      verticalLabelRotation={30}
      yAxisLabel=""
      chartConfig={{
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#fffeee',
        backgroundGradientTo: 'orange',
        decimalPlaces: 0, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: '6',
          strokeWidth: '2',
          stroke: '#800000'
        }
      }}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 16
      }}
    />
  );
};

export default Chart;
