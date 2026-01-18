import React, { useState } from 'react';
// Dashboard administrativo
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Icon, 
  IconButton, 
  Pressable,
  Heading,
  ScrollView,
  SimpleGrid,
  useColorModeValue,
  Badge
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppSelector } from '@/store/hooks';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { AdminCharts } from '@/components/admin/admin-charts';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminDashboard() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { user } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  const cardBg = useColorModeValue('white', 'coolGray.800');

  const toggleDrawer = () => setIsOpen(!isOpen);

  return (
    <Box flex={1} bg={themeColors.background}>
      <AdminHeader title="Admin Dashboard" onMenuPress={toggleDrawer} />
      
      <AdminSidebar isOpen={isOpen} onClose={toggleDrawer} />

      <ScrollView p={4} contentContainerStyle={{ paddingBottom: 40 }}>
        <VStack space={6}>
          {/* Stats Cards */}
          <SimpleGrid columns={2} space={4}>
            <Box bg={cardBg} p={4} borderRadius="xl" shadow={2}>
              <Text color="coolGray.500" fontSize="xs">Total Usuários</Text>
              <Heading size="lg">1,240</Heading>
              <HStack alignItems="center" space={1}>
                <Icon as={<MaterialIcons name="trending-up" />} size={4} color="success.500" />
                <Text color="success.500" fontSize="xs">+12%</Text>
              </HStack>
            </Box>
            <Box bg={cardBg} p={4} borderRadius="xl" shadow={2}>
              <Text color="coolGray.500" fontSize="xs">Atividades Hoje</Text>
              <Heading size="lg">452</Heading>
              <HStack alignItems="center" space={1}>
                <Icon as={<MaterialIcons name="trending-up" />} size={4} color="success.500" />
                <Text color="success.500" fontSize="xs">+5%</Text>
              </HStack>
            </Box>
          </SimpleGrid>

          <Heading size="md" color={themeColors.text}>Visão Geral</Heading>
          <AdminCharts />
        </VStack>
      </ScrollView>
    </Box>
  );
}
