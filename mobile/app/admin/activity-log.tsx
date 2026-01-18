import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, RefreshControl, TextInput } from 'react-native';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Icon, 
  Select, 
  CheckIcon, 
  IconButton, 
  Spinner,
  Heading,
  Badge,
  Divider,
  Pressable,
  useToast,
  Center,
  useColorModeValue
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import api from '@/services/api';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface ActivityLog {
  _id: string;
  userName: string;
  userEmail: string;
  userRole: string;
  action: string;
  method: string;
  path: string;
  ip: string;
  createdAt: string;
  details: any;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function ActivityLogScreen() {
  const router = useRouter();
  const toast = useToast();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Filters
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [action, setAction] = useState('');
  const [page, setPage] = useState(1);

  const fetchLogs = useCallback(async (pageNum = 1, shouldAppend = false) => {
    try {
      setIsLoading(true);
      const response = await api.get('/monitoring/activity-log', {
        params: {
          page: pageNum,
          limit: 15,
          search: search || undefined,
          role: role || undefined,
          action: action || undefined,
        }
      });

      const { data, meta: paginationMeta } = response.data;
      
      if (shouldAppend) {
        setLogs(prev => [...prev, ...data]);
      } else {
        setLogs(data);
      }
      setMeta(paginationMeta);
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
      toast.show({
        description: "Erro ao carregar logs de atividade",
        bg: "danger.500"
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [search, role, action, toast]);

  useEffect(() => {
    fetchLogs(1, false);
    setPage(1);
  }, [search, role, action, fetchLogs]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setPage(1);
    fetchLogs(1, false);
  };

  const handleLoadMore = () => {
    if (meta && page < meta.totalPages && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchLogs(nextPage, true);
    }
  };

  const cardBg = useColorModeValue('white', 'coolGray.900');
  const inputBg = useColorModeValue('coolGray.100', 'coolGray.800');
  const textColor = useColorModeValue('coolGray.800', 'white');
  const subTextColor = useColorModeValue('coolGray.500', 'coolGray.400');

  const renderLogItem = ({ item }: { item: ActivityLog }) => (
    <Box 
      bg={cardBg} 
      p="4" 
      mx="4" 
      my="2" 
      borderRadius="2xl" 
      shadow={1}
      borderWidth={1}
      borderColor={useColorModeValue('coolGray.50', 'coolGray.800')}
    >
      <VStack space={3}>
        <HStack justifyContent="space-between" alignItems="center">
          <HStack space={3} alignItems="center">
            <Box p={2} borderRadius="full" bg="coolGray.100" _dark={{ bg: 'coolGray.800' }}>
              <Icon as={<MaterialIcons name="person" />} size={5} color={themeColors.tint} />
            </Box>
            <VStack>
              <Text fontWeight="bold" fontSize="md" color={textColor}>
                {item.userName}
              </Text>
              <Text fontSize="xs" color={subTextColor}>
                {item.userEmail}
              </Text>
            </VStack>
          </HStack>
          <Badge 
            colorScheme={item.userRole === 'admin' ? 'danger' : 'info'} 
            variant="subtle" 
            rounded="lg"
            px={2}
          >
            {item.userRole.toUpperCase()}
          </Badge>
        </HStack>

        <Divider opacity={0.5} />

        <HStack justifyContent="space-between" alignItems="center">
          <HStack space={2} alignItems="center" flex={1}>
            <Box p={1.5} borderRadius="md" bg="primary.50" _dark={{ bg: 'primary.900' }}>
              <Icon as={<MaterialIcons name="bolt" />} size={4} color={themeColors.tint} />
            </Box>
            <Text fontWeight="semibold" fontSize="sm" color={textColor} numberOfLines={1}>
              {item.action}
            </Text>
          </HStack>
          <Badge variant="outline" colorScheme="coolGray" rounded="md">
            {item.method}
          </Badge>
        </HStack>

        <HStack justifyContent="space-between" alignItems="center">
          <HStack space={1} alignItems="center">
            <Icon as={<MaterialIcons name="lan" />} size="xs" color={subTextColor} />
            <Text fontSize="xs" color={subTextColor}>{item.ip}</Text>
          </HStack>
          <HStack space={1} alignItems="center">
            <Icon as={<MaterialIcons name="schedule" />} size="xs" color={subTextColor} />
            <Text fontSize="xs" color={subTextColor}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );

  return (
    <Box flex={1} bg={useColorModeValue('coolGray.50', 'black')}>
      <AdminHeader title="Histórico" onMenuPress={() => setIsSidebarOpen(true)} />
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <FlatList 
        data={logs}
        keyExtractor={item => item._id}
        renderItem={renderLogItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <VStack space={4} pt={4} pb={2}>
            <VStack px="4" space={3}>
              <HStack 
                bg={inputBg}
                borderRadius="2xl"
                alignItems="center"
                px={4}
                height={12}
                borderWidth={1}
                borderColor={useColorModeValue('coolGray.200', 'coolGray.700')}
              >
                <Icon as={<MaterialIcons name="search" />} size="5" color={subTextColor} />
                <TextInput 
                  placeholder="Pesquisar..." 
                  placeholderTextColor={subTextColor === 'coolGray.500' ? '#9ca3af' : '#6b7280'}
                  style={{ 
                    flex: 1,
                    marginLeft: 8,
                    color: textColor,
                    fontSize: 15
                  }}
                  value={search}
                  onChangeText={setSearch}
                />
              </HStack>

              <HStack space={2}>
                <Select 
                  flex={1}
                  selectedValue={role} 
                  placeholder="Cargo" 
                  _selectedItem={{
                    bg: themeColors.tint,
                    endIcon: <CheckIcon size="5" color="white" />
                  }} 
                  onValueChange={itemValue => setRole(itemValue)}
                  bg={inputBg}
                  borderWidth={1}
                  borderColor={useColorModeValue('coolGray.200', 'coolGray.700')}
                  borderRadius="xl"
                  h={10}
                >
                  <Select.Item label="Todos Cargos" value="" />
                  <Select.Item label="Admin" value="admin" />
                  <Select.Item label="Usuário" value="user" />
                </Select>

                <Select 
                  flex={1}
                  selectedValue={action} 
                  placeholder="Ação" 
                  _selectedItem={{
                    bg: themeColors.tint,
                    endIcon: <CheckIcon size="5" color="white" />
                  }} 
                  onValueChange={itemValue => setAction(itemValue)}
                  bg={inputBg}
                  borderWidth={1}
                  borderColor={useColorModeValue('coolGray.200', 'coolGray.700')}
                  borderRadius="xl"
                  h={10}
                >
                  <Select.Item label="Todas Ações" value="" />
                  <Select.Item label="Login" value="Login" />
                  <Select.Item label="Criar" value="Criar" />
                  <Select.Item label="Atualizar" value="Atualizar" />
                  <Select.Item label="Deletar" value="Deletar" />
                </Select>
              </HStack>
            </VStack>
          </VStack>
        }
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={themeColors.tint} />
        }
        ListFooterComponent={
          isLoading && !isRefreshing ? (
            <Center py="4">
              <Spinner color={themeColors.tint} />
            </Center>
          ) : meta && meta.total === 0 ? (
            <Center py="20">
              <Icon as={<MaterialIcons name="search-off" />} size={12} color={subTextColor} mb="2" />
              <Text color={subTextColor}>Nenhum registro encontrado</Text>
            </Center>
          ) : null
        }
      />
    </Box>
  );
}
