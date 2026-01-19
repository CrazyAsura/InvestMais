import React, { useState } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Icon, 
  Heading, 
  useColorModeValue,
  Center,
  SimpleGrid,
  Select,
  CheckIcon,
  Badge,
  Divider,
  Avatar
} from 'native-base';
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LineChart, BarChart, PieChart } from 'react-native-gifted-charts';

const { width } = Dimensions.get('window');

const TOP_PERFORMERS = [
  { name: 'Ana Silva', score: 98, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop' },
  { name: 'Gisele Lima', score: 96, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop' },
  { name: 'Elena Martins', score: 94, image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop' },
];

const ANALYTICS_DATA = {
  marketTrends: [
    { value: 15, label: 'Jan' },
    { value: 25, label: 'Fev' },
    { value: 20, label: 'Mar' },
    { value: 35, label: 'Abr' },
    { value: 30, label: 'Mai' },
    { value: 45, label: 'Jun' },
  ],
  performanceBySector: [
    { value: 85, label: 'TI', frontColor: '#3b82f6' },
    { value: 70, label: 'Fin', frontColor: '#10b981' },
    { value: 92, label: 'RH', frontColor: '#f59e0b' },
    { value: 65, label: 'Sup', frontColor: '#8b5cf6' },
  ],
  riskDistribution: [
    { value: 40, color: '#10b981', text: 'Baixo' },
    { value: 35, color: '#f59e0b', text: 'Médio' },
    { value: 25, color: '#ef4444', text: 'Alto' },
  ]
};

const ANALYST_KPIS = [
  { label: 'Acurácia', value: '98.5%', icon: 'verified', color: 'emerald.500' },
  { label: 'Insights', value: '124', icon: 'lightbulb', color: 'amber.500' },
  { label: 'Análises', value: '42', icon: 'analytics', color: 'blue.500' },
  { label: 'Previsão', value: '+12%', icon: 'trending-up', color: 'purple.500' },
];

export default function AnalystScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [period, setPeriod] = useState('mensal');

  const cardBg = useColorModeValue('white', 'coolGray.900');
  const appBg = useColorModeValue('coolGray.50', '#050505');
  const borderColor = useColorModeValue('coolGray.100', 'coolGray.800');
  const secondaryTextColor = useColorModeValue('coolGray.500', 'coolGray.400');

  return (
    <Box flex={1} bg={appBg}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space={6} p={4} pb={10}>
          {/* Header */}
          <HStack justifyContent="space-between" alignItems="center">
            <VStack>
              <Heading size="xl" color={themeColors.text} fontWeight="900">Análise de Dados</Heading>
              <Text color={secondaryTextColor} fontSize="md">Inteligência e performance</Text>
            </VStack>
            <Select 
              selectedValue={period} 
              minWidth="120" 
              accessibilityLabel="Escolha o período" 
              placeholder="Período" 
              _selectedItem={{
                bg: "blue.600",
                endIcon: <CheckIcon size="5" color="white" />
              }} 
              mt={1} 
              onValueChange={itemValue => setPeriod(itemValue)}
              borderRadius="xl"
              bg={cardBg}
              borderColor={borderColor}
            >
              <Select.Item label="Semanal" value="semanal" />
              <Select.Item label="Mensal" value="mensal" />
              <Select.Item label="Trimestral" value="trimestral" />
            </Select>
          </HStack>

          {/* KPI Section */}
          <SimpleGrid columns={2} space={4}>
            {ANALYST_KPIS.map((kpi, index) => (
              <Box 
                key={index} 
                bg={cardBg} 
                p={4} 
                borderRadius="2xl" 
                borderWidth={1} 
                borderColor={borderColor}
                shadow={1}
              >
                <HStack space={3} alignItems="center">
                  <Center bg={`${kpi.color}15`} p={2} borderRadius="lg">
                    <Icon as={MaterialIcons} name={kpi.icon as any} size={5} color={kpi.color} />
                  </Center>
                  <VStack>
                    <Text fontSize="xs" color={secondaryTextColor} fontWeight="medium">{kpi.label}</Text>
                    <Text fontSize="lg" fontWeight="bold" color={themeColors.text}>{kpi.value}</Text>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </SimpleGrid>

          {/* Market Trends Chart */}
          <Box bg={cardBg} p={5} borderRadius="3xl" borderWidth={1} borderColor={borderColor} shadow={2}>
            <VStack space={4}>
              <HStack justifyContent="space-between" alignItems="center">
                <VStack>
                  <Text fontWeight="bold" fontSize="md" color={themeColors.text}>Tendências de Mercado</Text>
                  <Text fontSize="xs" color={secondaryTextColor}>Projeção vs Realizado</Text>
                </VStack>
                <Center bg="emerald.50" _dark={{ bg: 'emerald.900' }} p={2} borderRadius="xl">
                  <Icon as={Ionicons} name="stats-chart" size={5} color="emerald.500" />
                </Center>
              </HStack>
              
              <Box height={200} alignItems="center" justifyContent="center">
                <LineChart
                  data={ANALYTICS_DATA.marketTrends}
                  height={160}
                  width={width - 80}
                  initialSpacing={20}
                  color="#10b981"
                  thickness={3}
                  dataPointsColor="#10b981"
                  yAxisTextStyle={{ color: secondaryTextColor, fontSize: 10 }}
                  xAxisLabelTextStyle={{ color: secondaryTextColor, fontSize: 10 }}
                  rulesColor={borderColor}
                  curved
                />
              </Box>
            </VStack>
          </Box>

          <SimpleGrid columns={1} space={4}>
            {/* Sector Performance Bar Chart */}
            <Box bg={cardBg} p={5} borderRadius="3xl" borderWidth={1} borderColor={borderColor} shadow={2}>
              <VStack space={4}>
                <HStack justifyContent="space-between" alignItems="center">
                  <VStack>
                    <Text fontWeight="bold" fontSize="md" color={themeColors.text}>Performance por Setor</Text>
                    <Text fontSize="xs" color={secondaryTextColor}>Eficiência operacional</Text>
                  </VStack>
                  <Icon as={MaterialCommunityIcons} name="chart-bar" size={6} color="blue.500" />
                </HStack>
                
                <Box height={200} alignItems="center" justifyContent="center">
                  <BarChart
                    data={ANALYTICS_DATA.performanceBySector}
                    height={160}
                    width={width - 80}
                    barWidth={30}
                    barBorderRadius={8}
                    yAxisTextStyle={{ color: secondaryTextColor, fontSize: 10 }}
                    xAxisLabelTextStyle={{ color: secondaryTextColor, fontSize: 10 }}
                    rulesColor={borderColor}
                  />
                </Box>
              </VStack>
            </Box>

            {/* Risk Distribution Pie Chart */}
            <Box bg={cardBg} p={5} borderRadius="3xl" borderWidth={1} borderColor={borderColor} shadow={2}>
              <VStack space={4}>
                <HStack justifyContent="space-between" alignItems="center">
                  <VStack>
                    <Text fontWeight="bold" fontSize="md" color={themeColors.text}>Distribuição de Risco</Text>
                    <Text fontSize="xs" color={secondaryTextColor}>Composição do portfólio</Text>
                  </VStack>
                  <Icon as={MaterialIcons} name="pie-chart" size={6} color="amber.500" />
                </HStack>
                
                <HStack space={4} alignItems="center" justifyContent="center">
                  <PieChart
                    data={ANALYTICS_DATA.riskDistribution}
                    radius={70}
                    innerRadius={45}
                    showText
                    textColor="black"
                    textSize={10}
                    focusOnPress
                  />
                  <VStack space={2}>
                    {ANALYTICS_DATA.riskDistribution.map((item, i) => (
                      <HStack key={i} space={2} alignItems="center">
                        <Box w={3} h={3} rounded="full" bg={item.color} />
                        <Text fontSize="xs" color={themeColors.text}>{item.text}</Text>
                        <Text fontSize="xs" fontWeight="bold" color={secondaryTextColor}>{item.value}%</Text>
                      </HStack>
                    ))}
                  </VStack>
                </HStack>
              </VStack>
            </Box>
          </SimpleGrid>

          {/* Standard Deviation Note */}
          <Box bg="blue.50" _dark={{ bg: 'blue.900' }} p={4} borderRadius="2xl" borderWidth={1} borderColor="blue.100">
            <HStack space={3}>
              <Icon as={MaterialIcons} name="info" size={6} color="blue.600" />
              <VStack flex={1}>
                <Text fontWeight="bold" color="blue.700" _dark={{ color: 'blue.200' }}>Análise de Desvio Padrão</Text>
                <Text fontSize="xs" color="blue.600" _dark={{ color: 'blue.300' }}>
                  O desvio padrão atual das operações é de 2.4, indicando uma alta consistência nos processos analisados durante este período.
                </Text>
              </VStack>
            </HStack>
          </Box>
        </VStack>
      </ScrollView>
    </Box>
  );
}
