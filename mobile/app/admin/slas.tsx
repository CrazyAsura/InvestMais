import React from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Icon, 
  Heading, 
  useColorModeValue,
  Center,
  Divider,
  Badge,
  Progress,
  ScrollView
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function SLAScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const cardBg = useColorModeValue('white', 'coolGray.900');
  const appBg = useColorModeValue('coolGray.50', 'black');
  const borderColor = useColorModeValue('coolGray.100', 'coolGray.800');

  const slas = [
    { id: '1', title: 'Suporte Técnico', goal: '95%', current: 92, status: 'warning', icon: 'headset-mic' },
    { id: '2', title: 'Aprovação Contábil', goal: '24h', current: 85, status: 'success', icon: 'account-balance' },
    { id: '3', title: 'Admissão RH', goal: '5 dias', current: 70, status: 'info', icon: 'people' },
    { id: '4', title: 'Uptime Sistemas', goal: '99.9%', current: 99.8, status: 'success', icon: 'computer' },
  ];

  return (
    <Box flex={1} bg={appBg}>
      <AdminHeader title="SLAs e Metas" showBackButton />
      
      <ScrollView showsVerticalScrollIndicator={false} p={4}>
        <VStack space={6} pb={10}>
          <VStack space={1}>
            <Heading size="md" color={themeColors.text}>Desempenho por Setor</Heading>
            <Text color="coolGray.500">Monitoramento de acordos de nível de serviço</Text>
          </VStack>

          <VStack space={4}>
            {slas.map((sla) => (
              <Box key={sla.id} bg={cardBg} p={5} borderRadius="2xl" shadow={2} borderWidth={1} borderColor={borderColor}>
                <HStack justifyContent="space-between" alignItems="center" mb={4}>
                  <HStack space={3} alignItems="center">
                    <Center bg={`${themeColors.tint}15`} p={2} borderRadius="lg">
                      <Icon as={MaterialIcons} name={sla.icon as any} size={5} color={themeColors.tint} />
                    </Center>
                    <Text fontWeight="bold" color={themeColors.text}>{sla.title}</Text>
                  </HStack>
                  <Badge colorScheme={sla.status} variant="subtle" rounded="full">Meta: {sla.goal}</Badge>
                </HStack>
                
                <VStack space={2}>
                  <HStack justifyContent="space-between">
                    <Text fontSize="xs" color="coolGray.500">Progresso Atual</Text>
                    <Text fontSize="xs" fontWeight="bold" color={themeColors.text}>{sla.current}%</Text>
                  </HStack>
                  <Progress value={sla.current} colorScheme={sla.status} size="xs" rounded="full" />
                </VStack>
              </Box>
            ))}
          </VStack>

          <Box bg={cardBg} p={5} borderRadius="2xl" shadow={2} borderWidth={1} borderColor={borderColor}>
            <Heading size="xs" mb={4} color={themeColors.text}>DEFINIR NOVA META</Heading>
            <HStack space={4}>
              <Center bg="coolGray.100" _dark={{ bg: 'coolGray.800' }} flex={1} p={4} borderRadius="xl">
                <Icon as={MaterialIcons} name="add-task" size={6} color="coolGray.400" />
                <Text mt={1} fontSize="xs" color="coolGray.400">Criar SLA</Text>
              </Center>
              <Center bg="coolGray.100" _dark={{ bg: 'coolGray.800' }} flex={1} p={4} borderRadius="xl">
                <Icon as={MaterialIcons} name="edit" size={6} color="coolGray.400" />
                <Text mt={1} fontSize="xs" color="coolGray.400">Ajustar Metas</Text>
              </Center>
            </HStack>
          </Box>
        </VStack>
      </ScrollView>
    </Box>
  );
}
