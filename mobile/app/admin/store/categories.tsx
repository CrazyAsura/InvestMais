import React, { useState } from 'react';
import { FlatList, Alert } from 'react-native';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Icon, 
  Heading, 
  IconButton, 
  Button, 
  Spinner, 
  Center,
  useColorModeValue,
  Avatar
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StoreService } from '@/services/storeService';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AdminCategories() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const cardBg = useColorModeValue('white', '#1f2937');
  const textColor = useColorModeValue('coolGray.800', 'white');
  const secondaryTextColor = useColorModeValue('coolGray.500', 'coolGray.400');
  const borderColor = useColorModeValue('coolGray.100', 'coolGray.800');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: StoreService.getCategories,
  });

  const deleteMutation = useMutation({
    mutationFn: StoreService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      Alert.alert('Sucesso', 'Categoria excluída com sucesso');
    },
    onError: (error: any) => {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao excluir categoria');
    },
  });

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir a categoria "${name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => deleteMutation.mutate(id)
        },
      ]
    );
  };

  const renderItem = ({ item }: any) => (
    <Box 
      bg={cardBg} 
      p={4} 
      borderRadius="2xl" 
      mb={3} 
      borderWidth={1} 
      borderColor={borderColor}
      shadow={1}
    >
      <HStack space={3} alignItems="center">
        <Avatar 
          source={{ uri: item.imageUrl }} 
          size="md" 
          borderRadius="lg"
          bg="gray.200"
        >
          {item.name.charAt(0)}
        </Avatar>
        <VStack space={1} flex={1}>
          <Heading size="xs" color={textColor} fontWeight="700">{item.name}</Heading>
          <Text color={secondaryTextColor} fontSize="xs" noOfLines={1}>
            {item.description || 'Sem descrição'}
          </Text>
          <HStack space={2} alignItems="center">
             <Box 
               px={2} 
               py={0.5} 
               borderRadius="md" 
               bg={item.active ? 'success.100' : 'gray.100'}
               _dark={{ bg: item.active ? 'success.900:alpha.20' : 'gray.800' }}
             >
               <Text color={item.active ? 'success.600' : 'gray.500'} fontSize={10} fontWeight="bold">
                 {item.active ? 'ATIVO' : 'INATIVO'}
               </Text>
             </Box>
          </HStack>
        </VStack>
        <HStack space={1}>
          <IconButton 
            icon={<Icon as={MaterialIcons} name="edit" size="sm" color="blue.500" />}
            onPress={() => router.push({ pathname: '/admin/store/category-form', params: { id: item._id } } as any)}
            variant="ghost"
            borderRadius="full"
          />
          <IconButton 
            icon={<Icon as={MaterialIcons} name="delete" size="sm" color="error.500" />}
            onPress={() => handleDelete(item._id, item.name)}
            variant="ghost"
            borderRadius="full"
          />
        </HStack>
      </HStack>
    </Box>
  );

  return (
    <Box flex={1} bg={themeColors.background}>
      <AdminHeader title="Categorias" onMenuPress={toggleSidebar} />
      
      <AdminSidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      
      <VStack flex={1} p={4} space={4}>
        <HStack justifyContent="space-between" alignItems="center">
          <VStack>
            <Heading size="md" color={textColor} fontWeight="800">Gerenciar</Heading>
            <Text color={secondaryTextColor} fontSize="xs">Listagem de categorias da loja</Text>
          </VStack>
          <Button 
            leftIcon={<Icon as={MaterialIcons} name="add" size="xs" />}
            onPress={() => router.push('/admin/store/category-form')}
            borderRadius="xl"
            colorScheme="primary"
          >
            Nova
          </Button>
        </HStack>

        {isLoading ? (
          <Center flex={1}>
            <Spinner size="lg" />
          </Center>
        ) : (
          <FlatList
            data={categories}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Center mt={10}>
                <Icon as={MaterialIcons} name="category" size="4xl" color="coolGray.300" />
                <Text color="coolGray.400" mt={2}>Nenhuma categoria encontrada</Text>
              </Center>
            }
          />
        )}
      </VStack>
    </Box>
  );
}
