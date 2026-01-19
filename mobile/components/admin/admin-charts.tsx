import React from 'react';
// Gráficos administrativos usando react-native-gifted-charts
import { Box, VStack, Heading, useColorModeValue } from 'native-base';
import { Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-gifted-charts';

export const AdminCharts = ({ data }: { data?: any[] }) => {
  const cardBg = useColorModeValue('white', 'coolGray.800');
  const textColor = useColorModeValue('#1f2937', '#f3f4f6');
  const screenWidth = Dimensions.get('window').width;

  if (!data || data.length === 0) {
    return (
      <Box bg={cardBg} p={10} borderRadius="xl" shadow={2} alignItems="center">
        <Heading size="xs" color="gray.400">Nenhum dado disponível para exibir gráficos</Heading>
      </Box>
    );
  }

  const usersLineData = data.map(item => ({
    value: item.users,
    label: item.label,
    dataPointText: item.users.toString(),
  }));

  const actionsLineData = data.map(item => ({
    value: item.actions,
    label: item.label,
    dataPointText: item.actions.toString(),
  }));

  const barData = data.map(item => ({
    value: item.users,
    label: item.label,
    frontColor: '#8884d8',
  }));

  return (
    <VStack space={6} mb={10}>
      <Box bg={cardBg} p={4} borderRadius="xl" shadow={2}>
        <Heading size="sm" mb={4} color={textColor}>Crescimento de Usuários</Heading>
        <LineChart
          data={usersLineData}
          data2={actionsLineData}
          height={200}
          width={screenWidth - 80}
          initialSpacing={10}
          color1="#8884d8"
          color2="#82ca9d"
          dataPointsColor1="#8884d8"
          dataPointsColor2="#82ca9d"
          textColor={textColor}
          noOfSections={5}
          yAxisTextStyle={{ color: 'gray' }}
          xAxisLabelTextStyle={{ color: 'gray' }}
        />
      </Box>

      <Box bg={cardBg} p={4} borderRadius="xl" shadow={2}>
        <Heading size="sm" mb={4} color={textColor}>Atividades por Período</Heading>
        <BarChart
          data={barData}
          height={200}
          width={screenWidth - 80}
          initialSpacing={10}
          barWidth={22}
          barBorderRadius={4}
          frontColor="#8884d8"
          yAxisTextStyle={{ color: 'gray' }}
          xAxisLabelTextStyle={{ color: 'gray' }}
          noOfSections={5}
        />
      </Box>
    </VStack>
  );
};
