import React, { useState, useEffect } from 'react';
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
import { FlatList, TextInput } from 'react-native';
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
  status?: string;
}

export default function UsersManagement() {
  const router = useRouter();
  const toast = useToast();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const cardBg = useColorModeValue('white', 'coolGray.800');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user');
      setUsers(response.data);
    } catch (error) {
      toast.show({
        description: "Erro ao carregar usuários",
        bg: "error.500"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: string) => {
    try {
      await api.delete(`/user/${id}`);
      setUsers(users.filter(u => u._id !== id));
      toast.show({
        description: "Usuário removido com sucesso",
        bg: "success.500"
      });
    } catch (error) {
      toast.show({
        description: "Erro ao remover usuário",
        bg: "error.500"
      });
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const renderUserItem = ({ item }: { item: User }) => (
    <Box 
      bg={cardBg} 
      p={4} 
      mb={3} 
      borderRadius="xl" 
      shadow={1}
    >
      <HStack justifyContent="space-between" alignItems="center">
        <HStack space={3} alignItems="center">
          <Avatar bg={themeColors.tint} size="md">
            {item.name.charAt(0).toUpperCase()}
          </Avatar>
          <VStack>
            <Text fontWeight="bold" color={themeColors.text}>{item.name}</Text>
            <Text fontSize="xs" color="coolGray.500">{item.email}</Text>
            <HStack space={2} mt={1}>
              <Badge colorScheme={item.role === 'admin' ? 'error' : 'info'} variant="subtle" rounded="md">
                {item.role.toUpperCase()}
              </Badge>
            </HStack>
          </VStack>
        </HStack>
        
        <Menu w="160" trigger={triggerProps => {
          return (
            <Pressable {...triggerProps}>
              <Icon as={<MaterialIcons name="more-vert" />} size={6} color="coolGray.400" />
            </Pressable>
          );
        }}>
          <Menu.Item onPress={() => router.push(`/admin/user-details/${item._id}` as any)}>
            Editar
          </Menu.Item>
          <Menu.Item onPress={() => handleDeleteUser(item._id)}>
            <Text color="error.600">Excluir</Text>
          </Menu.Item>
        </Menu>
      </HStack>
    </Box>
  );

  return (
    <Box flex={1} bg={themeColors.background}>
      <AdminHeader title="Gerenciar Usuários" onMenuPress={() => setIsSidebarOpen(true)} />
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <VStack p={4} space={4} flex={1}>
        <HStack 
          bg={cardBg} 
          alignItems="center" 
          px={4} 
          borderRadius="xl" 
          borderWidth={1} 
          borderColor="coolGray.200"
        >
          <Icon as={<MaterialIcons name="search" />} size={5} color="coolGray.400" />
          <TextInput 
            placeholder="Buscar usuários..." 
            placeholderTextColor="#9ca3af"
            style={{ 
              flex: 1,
              height: 48,
              color: themeColors.text,
              marginLeft: 8
            }}
            value={search}
            onChangeText={setSearch}
          />
        </HStack>

        {loading ? (
          <Center flex={1} mt={10}>
            <Spinner size="lg" color={themeColors.tint} />
          </Center>
        ) : (
          <FlatList 
            data={filteredUsers}
            renderItem={renderUserItem}
            keyExtractor={item => item._id}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Center mt={10}>
                <Text color="coolGray.500">Nenhum usuário encontrado</Text>
              </Center>
            }
          />
        )}
      </VStack>
    </Box>
  );
}
