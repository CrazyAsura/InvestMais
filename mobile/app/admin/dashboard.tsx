import React, { useState } from 'react';
// Dashboard administrativo
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Icon, 
  Heading, 
  ScrollView, 
  useColorModeValue,
  Pressable
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '@/store/hooks';
import { DashboardService } from '@/services/dashboardService';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { AdminCharts } from '@/components/admin/admin-charts';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Spinner, Center } from 'native-base';

const StatCard = ({ title, value, icon, trend, color, cardBg, textColor, secondaryTextColor, borderColor }: any) => (
  <Box 
    bg={cardBg} 
    p={5} 
    borderRadius="3xl" 
    flex={1}
    shadow={1}
    borderWidth={1}
    borderColor={borderColor}
  >
    <HStack justifyContent="space-between" alignItems="flex-start" mb={4}>
      <Box p={2.5} borderRadius="2xl" bg={`${color}.100`} _dark={{ bg: `${color}.900:alpha.20` }}>
        <Icon as={<MaterialIcons name={icon} />} size={6} color={`${color}.500`} />
      </Box>
      {trend && (
        <HStack alignItems="center" bg="success.100" _dark={{ bg: 'success.900:alpha.20' }} px={2} py={1} borderRadius="lg">
          <Icon as={<MaterialIcons name="trending-up" />} size={3} color="success.600" mr={1} />
          <Text color="success.600" fontSize={10} fontWeight="bold">{trend}</Text>
        </HStack>
      )}
    </HStack>
    <VStack>
      <Text color={secondaryTextColor} fontSize="xs" fontWeight="600" mb={1}>{title}</Text>
      <Heading size="lg" color={textColor} fontWeight="800">{value}</Heading>
    </VStack>
  </Box>
);

const QuickAction = ({ title, icon, color, onPress, cardBg, textColor, borderColor }: any) => (
  <Pressable onPress={onPress} flex={1}>
    <VStack 
      bg={cardBg} 
      p={4} 
      borderRadius="2xl" 
      alignItems="center" 
      space={2}
      borderWidth={1}
      borderColor={borderColor}
    >
      <Box p={3} borderRadius="xl" bg={`${color}.100`} _dark={{ bg: `${color}.900:alpha.20` }}>
        <Icon as={<MaterialIcons name={icon} />} size={6} color={`${color}.500`} />
      </Box>
      <Text fontSize="xs" fontWeight="700" color={textColor}>{title}</Text>
    </VStack>
  </Pressable>
);

export default function AdminDashboard() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { user } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  const cardBg = useColorModeValue('white', '#1f2937');
  const textColor = useColorModeValue('coolGray.800', 'white');
  const secondaryTextColor = useColorModeValue('coolGray.500', 'coolGray.400');
  const borderColor = useColorModeValue('coolGray.50', 'coolGray.700');

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: DashboardService.getStats,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const toggleDrawer = () => setIsOpen(!isOpen);

  if (isLoading) {
    return (
      <Box flex={1} bg={themeColors.background}>
        <AdminHeader title="Dashboard" onMenuPress={toggleDrawer} />
        <Center flex={1}>
          <Spinner size="lg" color="primary.600" />
          <Text mt={2} color="gray.500">Carregando estatísticas...</Text>
        </Center>
      </Box>
    );
  }

  return (
    <Box flex={1} bg={themeColors.background}>
      <AdminHeader title="Dashboard" onMenuPress={toggleDrawer} />
      
      <AdminSidebar isOpen={isOpen} onClose={toggleDrawer} />

      <ScrollView p={4} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <VStack space={6}>
          {/* Welcome Section */}
          <VStack space={1}>
            <Heading size="md" color={textColor} fontWeight="800">
              Olá, {user?.name?.split(' ')[0] || 'Admin'} 👋
            </Heading>
            <Text color={secondaryTextColor} fontSize="sm">
              Aqui está o que está acontecendo hoje.
            </Text>
          </VStack>

          {/* Stats Grid */}
          <HStack space={4}>
            <StatCard 
              title="Total Usuários" 
              value={stats?.totalUsers?.toLocaleString() || '0'} 
              icon="people" 
              trend="+12%" 
              color="blue"
              cardBg={cardBg}
              textColor={textColor}
              secondaryTextColor={secondaryTextColor}
              borderColor={borderColor}
            />
            <StatCard 
              title="Ativos Agora" 
              value={stats?.activeUsers?.toLocaleString() || '0'} 
              icon="bolt" 
              trend="+5%" 
              color="warning"
              cardBg={cardBg}
              textColor={textColor}
              secondaryTextColor={secondaryTextColor}
              borderColor={borderColor}
            />
          </HStack>

          <HStack space={4}>
            <StatCard 
              title="Produtos" 
              value={stats?.totalProducts?.toLocaleString() || '0'} 
              icon="inventory" 
              color="success"
              cardBg={cardBg}
              textColor={textColor}
              secondaryTextColor={secondaryTextColor}
              borderColor={borderColor}
            />
            <StatCard 
              title="Novos Usuários" 
              value={stats?.newUsers?.toLocaleString() || '0'} 
              icon="person-add" 
              color="error"
              cardBg={cardBg}
              textColor={textColor}
              secondaryTextColor={secondaryTextColor}
              borderColor={borderColor}
            />
          </HStack>

          {/* Quick Actions */}
          <VStack space={3}>
            <Heading size="sm" color={textColor} fontWeight="700">Ações Rápidas</Heading>
            <HStack space={3}>
              <QuickAction 
                title="Produtos" 
                icon="inventory" 
                color="orange" 
                onPress={() => router.push('/admin/store/products')}
                cardBg={cardBg}
                textColor={textColor}
                borderColor={borderColor}
              />
              <QuickAction 
                title="Categorias" 
                icon="category" 
                color="teal" 
                onPress={() => router.push('/admin/store/categories')}
                cardBg={cardBg}
                textColor={textColor}
                borderColor={borderColor}
              />
              <QuickAction 
                title="Usuários" 
                icon="person" 
                color="blue" 
                onPress={() => router.push('/admin/users')}
                cardBg={cardBg}
                textColor={textColor}
                borderColor={borderColor}
              />
            </HStack>

            <HStack space={3}>
              <QuickAction 
                title="Notícias" 
                icon="article" 
                color="amber" 
                onPress={() => router.push('/admin/news')}
                cardBg={cardBg}
                textColor={textColor}
                borderColor={borderColor}
              />
              <QuickAction 
                title="Cursos" 
                icon="school" 
                color="indigo" 
                onPress={() => router.push('/admin/courses' as Href)}
                cardBg={cardBg}
                textColor={textColor}
                borderColor={borderColor}
              />
              <QuickAction 
                title="Logs" 
                icon="history" 
                color="gray" 
                onPress={() => router.push('/admin/activity-log')}
                cardBg={cardBg}
                textColor={textColor}
                borderColor={borderColor}
              />
            </HStack>
          </VStack>

          {/* Charts */}
          <AdminCharts data={stats?.chartData} />
        </VStack>
      </ScrollView>
    </Box>
  );
}
