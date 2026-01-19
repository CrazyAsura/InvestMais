import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Icon, 
  IconButton, 
  Heading, 
  Avatar, 
  Badge, 
  Menu, 
  Pressable,
  Spinner,
  useToast,
  useColorModeValue,
  Center
} from 'native-base';
import { FlatList, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '@/services/api';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  sector?: string;
}

const UserItem = React.memo(({ item, themeColors, router, onDelete, onToggleStatus }: { 
  item: User, 
  themeColors: any, 
  router: any,
  onDelete: (id: string) => void,
  onToggleStatus: (id: string) => void
}) => {
  const cardBg = useColorModeValue('white', '#1f2937');
  const textColor = useColorModeValue('coolGray.800', 'white');
  const secondaryTextColor = useColorModeValue('coolGray.500', 'coolGray.400');
  const borderColor = useColorModeValue('coolGray.50', 'coolGray.700');

  return (
    <Pressable 
      onPress={() => router.push(`/admin/user-details/${item._id}` as any)}
      mb={4}
    >
      <Box 
        bg={cardBg} 
        p={4} 
        borderRadius="2xl" 
        shadow={1}
        borderWidth={1}
        borderColor={borderColor}
      >
        <HStack justifyContent="space-between" alignItems="center">
          <HStack space={3} alignItems="center" flex={1}>
            <Avatar 
              bg={item.role === 'admin' ? 'error.500' : themeColors.tint} 
              size="md"
              _text={{ fontWeight: 'bold' }}
            >
              {item.name.charAt(0).toUpperCase()}
            </Avatar>
            <VStack flex={1}>
              <Text fontWeight="800" fontSize="md" color={textColor} numberOfLines={1}>{item.name}</Text>
              <Text fontSize="xs" color={secondaryTextColor} numberOfLines={1}>{item.email}</Text>
              <HStack space={2} mt={1.5}>
                <Badge 
                  variant="subtle" 
                  colorScheme={item.role === 'admin' ? 'error' : 'blue'} 
                  rounded="lg"
                  px={2}
                  _text={{ fontSize: '10px', fontWeight: '800' }}
                >
                  {item.role.toUpperCase()}
                </Badge>
                <Badge 
                  variant="subtle" 
                  colorScheme={item.active ? 'success' : 'error'} 
                  rounded="lg"
                  px={2}
                  _text={{ fontSize: '10px', fontWeight: '800' }}
                >
                  {item.active ? 'ATIVO' : 'BANIDO'}
                </Badge>
                {item.sector && (
                  <Badge 
                    variant="subtle" 
                    colorScheme="indigo" 
                    rounded="lg"
                    px={2}
                    _text={{ fontSize: '10px', fontWeight: '800' }}
                  >
                    {item.sector.toUpperCase()}
                  </Badge>
                )}
              </HStack>
            </VStack>
          </HStack>
          
          <Menu w="190" trigger={triggerProps => {
            return (
              <Pressable {...triggerProps} p={2}>
                <Icon as={<MaterialIcons name="more-vert" />} size={5} color={secondaryTextColor} />
              </Pressable>
            );
          }}>
            <Menu.Item onPress={() => router.push(`/admin/user-details/${item._id}` as any)}>
              <HStack space={2} alignItems="center">
                <Icon as={<MaterialIcons name="edit" />} size={4} />
                <Text>Editar</Text>
              </HStack>
            </Menu.Item>
            <Menu.Item onPress={() => onToggleStatus(item._id)}>
              <HStack space={2} alignItems="center">
                <Icon as={<MaterialIcons name={item.active ? 'block' : 'check-circle'} />} size={4} color={item.active ? 'warning.600' : 'success.600'} />
                <Text color={item.active ? 'warning.600' : 'success.600'}>
                  {item.active ? 'Banir Usuário' : 'Reativar Usuário'}
                </Text>
              </HStack>
            </Menu.Item>
            <Menu.Item onPress={() => onDelete(item._id)}>
              <HStack space={2} alignItems="center">
                <Icon as={<MaterialIcons name="delete" />} size={4} color="error.600" />
                <Text color="error.600">Excluir</Text>
              </HStack>
            </Menu.Item>
          </Menu>
        </HStack>
      </Box>
    </Pressable>
  );
});

export default function UsersManagement() {
  const router = useRouter();
  const toast = useToast();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const secondaryTextColor = useColorModeValue('coolGray.500', 'coolGray.400');
  const inputBg = useColorModeValue('coolGray.50', '#374151');
  const searchBorderColor = useColorModeValue('coolGray.200', 'coolGray.700');
  const searchPlaceholderColor = useColorModeValue('#9ca3af', '#6b7280');
  const textColor = useColorModeValue('coolGray.800', 'white');

  const handleDeleteUser = useCallback(async (id: string) => {
    try {
      await api.delete(`/user/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.show({
        description: "Usuário removido com sucesso",
        bg: "success.500",
        placement: "top"
      });
    } catch (error) {
      toast.show({
        description: "Erro ao remover usuário",
        bg: "error.500",
        placement: "top"
      });
    }
  }, []);

  const handleToggleStatus = useCallback(async (id: string) => {
    try {
      await api.patch(`/user/${id}/toggle-status`);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, active: !u.active } : u));
      toast.show({
        description: "Status do usuário atualizado",
        bg: "success.500",
        placement: "top"
      });
    } catch (error) {
      toast.show({
        description: "Erro ao atualizar status",
        bg: "error.500",
        placement: "top"
      });
    }
  }, []);

  const renderUserItem = useCallback(({ item }: { item: User }) => (
    <UserItem 
      item={item} 
      themeColors={themeColors} 
      router={router} 
      onDelete={handleDeleteUser} 
      onToggleStatus={handleToggleStatus}
    />
  ), [themeColors, router, handleDeleteUser, handleToggleStatus]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user');
      setUsers(response.data);
    } catch (error) {
      toast.show({
        description: "Erro ao carregar usuários",
        bg: "error.500",
        placement: "top"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box flex={1} bg={themeColors.background}>
      <AdminHeader title="Usuários" onMenuPress={() => setIsSidebarOpen(true)} />
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <VStack p={4} space={4} flex={1}>
        <HStack 
          bg={inputBg} 
          alignItems="center" 
          px={4} 
          borderRadius="2xl" 
          borderWidth={1} 
          borderColor={searchBorderColor}
        >
          <Icon as={<MaterialIcons name="search" />} size={5} color={secondaryTextColor} />
          <TextInput 
            placeholder="Buscar por nome ou e-mail..." 
            placeholderTextColor={searchPlaceholderColor}
            style={[styles.searchInput, { color: textColor }]}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Icon as={<MaterialIcons name="cancel" />} size={4} color={secondaryTextColor} />
            </Pressable>
          )}
        </HStack>

        <HStack justifyContent="space-between" alignItems="center" px={1}>
          <Text fontWeight="800" color={textColor} fontSize="sm">
            {filteredUsers.length} Usuários encontrados
          </Text>
          <Pressable onPress={fetchUsers}>
            <Icon as={<MaterialIcons name="refresh" />} size={5} color={themeColors.tint} />
          </Pressable>
        </HStack>

        {loading ? (
          <Center flex={1}>
            <Spinner size="lg" color={themeColors.tint} />
            <Text mt={4} color={secondaryTextColor} fontWeight="600">Carregando usuários...</Text>
          </Center>
        ) : (
          <FlatList 
            data={filteredUsers}
            renderItem={renderUserItem}
            keyExtractor={item => item._id}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Center mt={20}>
                <Box p={6} borderRadius="full" bg={inputBg} mb={4}>
                  <Icon as={<MaterialIcons name="person-off" />} size={10} color={secondaryTextColor} />
                </Box>
                <Text color={secondaryTextColor} fontWeight="700">Nenhum usuário encontrado</Text>
                <Text color={secondaryTextColor} fontSize="xs">Tente um termo de busca diferente</Text>
              </Center>
            }
          />
        )}
      </VStack>
    </Box>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    flex: 1,
    height: 54,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '600'
  }
});
