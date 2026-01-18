import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, RefreshControl } from 'react-native';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Input, 
  Icon, 
  Select, 
  CheckIcon, 
  IconButton, 
  Spinner,
  Heading,
  Badge,
  Divider,
  Pressable,
  useToast
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import api from '@/services/api';

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

  const renderLogItem = ({ item }: { item: ActivityLog }) => (
    <Box 
      bg={colorScheme === 'dark' ? 'coolGray.900' : 'white'} 
      p="4" 
      mx="4" 
      my="2" 
      borderRadius="xl" 
      shadow={1}
    >
      <VStack space={2}>
        <HStack justifyContent="space-between" alignItems="center">
          <VStack>
            <Text fontWeight="bold" fontSize="md" color={themeColors.text}>
              {item.userName}
            </Text>
            <Text fontSize="xs" color={themeColors.icon}>
              {item.userEmail}
            </Text>
          </VStack>
          <Badge 
            colorScheme={item.userRole === 'admin' ? 'error' : 'info'} 
            variant="subtle" 
            rounded="full"
          >
            {item.userRole.toUpperCase()}
          </Badge>
        </HStack>

        <Divider />

        <HStack space={2} alignItems="center">
          <Icon as={<MaterialIcons name="bolt" />} size="sm" color={themeColors.tint} />
          <Text fontWeight="medium" flex={1} color={themeColors.text}>
            {item.action}
          </Text>
        </HStack>

        <HStack space={4}>
          <VStack flex={1}>
            <HStack space={1} alignItems="center">
              <Icon as={<MaterialIcons name="lan" />} size="xs" color="coolGray.400" />
              <Text fontSize="xs" color="coolGray.400">IP: {item.ip}</Text>
            </HStack>
            <HStack space={1} alignItems="center">
              <Icon as={<MaterialIcons name="schedule" />} size="xs" color="coolGray.400" />
              <Text fontSize="xs" color="coolGray.400">
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </HStack>
          </VStack>
          <VStack alignItems="flex-end">
             <Badge variant="outline" colorScheme="coolGray">
               {item.method}
             </Badge>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );

  return (
    <Box flex={1} bg={themeColors.background} safeAreaTop>
      <VStack space={4} pb={4}>
        <HStack px="4" pt="2" alignItems="center" space={2}>
          <IconButton 
            icon={<Icon as={<MaterialIcons name="arrow-back" />} size="md" color={themeColors.text} />}
            onPress={() => router.back()}
          />
          <Heading size="md" color={themeColors.text}>Monitoramento</Heading>
        </HStack>

        <VStack px="4" space={3}>
          <Input 
            placeholder="Pesquisar por nome, email ou ação..." 
            width="100%" 
            borderRadius="xl" 
            py="3" 
            px="4" 
            fontSize="md"
            InputLeftElement={<Icon as={<MaterialIcons name="search" />} size="5" ml="3" color="coolGray.400" />}
            value={search}
            onChangeText={setSearch}
            bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'}
            borderWidth={0}
          />

          <HStack space={2}>
            <Select 
              flex={1}
              selectedValue={role} 
              placeholder="Cargo" 
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />
              }} 
              mt={1} 
              onValueChange={itemValue => setRole(itemValue)}
              bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'}
              borderWidth={0}
              borderRadius="xl"
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
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />
              }} 
              mt={1} 
              onValueChange={itemValue => setAction(itemValue)}
              bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'}
              borderWidth={0}
              borderRadius="xl"
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

      <FlatList 
        data={logs}
        keyExtractor={item => item._id}
        renderItem={renderLogItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
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
              <Icon as={<MaterialIcons name="search-off" />} size={12} color="coolGray.400" mb="2" />
              <Text color="coolGray.400">Nenhum registro encontrado</Text>
            </Center>
          ) : null
        }
      />
    </Box>
  );
}
